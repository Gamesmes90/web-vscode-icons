import { getIconForFile, getIconForFolder, getIconForOpenFolder, DEFAULT_ROOT_OPENED } from 'vscode-icons-js';

try{
    const elements = document.querySelectorAll("tr.ready.entry");

    for (let i = 0; i < elements.length; i++){
        /**
         * <tr .. 
         *  <td class="name four wide">
         *      <span class="truncate">,
         *          <svg icon>
         *          <a href="...">
         *      </span>
         *  <td class="message nine wide"></td>
         *  ...
         *  </td>
         * </tr>
         */
        const newIconEl = document.createElement('img');
        
        var name = elements[i].getAttribute("data-entryname").toLowerCase();//<tr .. data-entryname="...">

        const span =  elements[i].firstElementChild.firstElementChild;//<span class="truncate">
    
        if (span.firstElementChild.getAttribute("class").includes("svg octicon-file-directory"))//<svg ... class="svg octicon-file-directory">
            newIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForFolder(name)));
        else
            newIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForFile(name)));
        newIconEl.setAttribute('class', 'web-vscode-icon');
        newIconEl.setAttribute('width', '16');
        newIconEl.setAttribute('height', '16');
        
        span.replaceChild(newIconEl, span.firstElementChild);//<svg icon> --> <img icon>
    }

    /**
     * <span class="ui breadcrumb repo-path">
     *  <a class="section" href="..." title="firtEl">firstEl</a>
     *  <span class="divider">/</span>
     *  <span class="section">
     *      <a href="..." title="middleEl">middleEl</a>
     *  </span>
     *  ...
     *  <span class="active section" title="lastEl">lastEl</span>
     * </span>
     */
    const dir = document.querySelectorAll("span.ui.breadcrumb.repo-path")[0].getElementsByClassName("section")

    //First element is root
    const rootIconEl = document.createElement('img');
    rootIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ DEFAULT_ROOT_OPENED)); //root folder
    rootIconEl.setAttribute('class', 'web-vscode-icon');
    rootIconEl.setAttribute('width', '16');
    rootIconEl.setAttribute('height', '16');
    rootIconEl.setAttribute('style', 'margin-right: 5px');

    dir[0].parentNode.insertBefore(rootIconEl, dir[0]); //<img ... > <a ... > ...

    //Elements in between
    for(let i = 1; i < dir.length - 1; i++){
        const newIconEl = document.createElement('img');
        newIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForOpenFolder(dir[i].firstElementChild.innerHTML.toLowerCase()))); //<span ... > < a ... >
        newIconEl.setAttribute('class', 'web-vscode-icon');
        newIconEl.setAttribute('width', '16');
        newIconEl.setAttribute('height', '16');
        newIconEl.setAttribute('style', 'margin-right: 5px');
        dir[i].parentNode.insertBefore(newIconEl, dir[i]); //<img .. > <a ... > ...
    }
    
    //Last element
    const lastIconEl = document.createElement('img');
    //If this node exists and it has only one child there's a file (if it has more than one child it's a folder with a readme)
    if (document.contains(document.querySelectorAll("div.file-header-left.df.ac")[0]) && document.querySelectorAll("div.file-header-left.df.ac")[0].children.length == 1 )
        lastIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForFile(dir[dir.length - 1].innerHTML.toLowerCase()))); //file
    else
        lastIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForOpenFolder(dir[dir.length - 1].innerHTML.toLowerCase()))); //folder
    lastIconEl.setAttribute('class', 'web-vscode-icon');
    lastIconEl.setAttribute('width', '16');
    lastIconEl.setAttribute('height', '16');
    lastIconEl.setAttribute('style', 'margin-right: 5px');
    dir[dir.length - 1].parentNode.insertBefore(lastIconEl, dir[dir.length - 1]); //<img .. > <span ... > ...

}
catch(e){
    console.info(chrome.runtime.getManifest().name + ": " + e);
}