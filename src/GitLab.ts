import { observe } from 'selector-observer';
import { getIconForFile, getIconForFolder, getIconForOpenFolder, DEFAULT_ROOT_OPENED} from 'vscode-icons-js';

export const TREE_ITEM_CLASS = 'tree-item';
export const QUERY_TREE_ITEMS = `tr.${TREE_ITEM_CLASS}`;
export const QUERY_TREE_HOLDER = '.tree-holder';
export const TABLE_ROW_ELEMENT_LITERAL = 'TR';

const getIconUrl = (iconFileName: string) => chrome.runtime.getURL('icons/' + iconFileName);

function showIconsForSegments(dir: HTMLElement){
  /**
   * <ol class="breadcrumb repo-breadcrumb">
   *  <li class="li.breadcrumb-item">
   *    <a ... >
   *  </li>
   *  ...
   * </ol>
   */

  switch (dir) {//Check the element
    case dir.parentNode.querySelectorAll("li.breadcrumb-item")[0]: //First element
      const rootIconEl = document.createElement('img');
      rootIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ DEFAULT_ROOT_OPENED)); //root folder
      rootIconEl.setAttribute('class', 'web-vscode-icon');
      rootIconEl.setAttribute('width', '16');
      rootIconEl.setAttribute('height', '16');
      rootIconEl.setAttribute('style', 'margin-right: 5px; margin-top: 8px');
    
      dir.insertBefore(rootIconEl, dir.firstElementChild); //<img ... > <a ... > ...
      break;
    case dir.parentNode.querySelectorAll("li.breadcrumb-item")[dir.parentNode.children.length - 1]: //Last element
      const lastIconEl = document.createElement('img');
      //If the URL contains "blob" this is a file page
      if (document.URL.includes("blob"))
          lastIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForFile((dir.firstElementChild as HTMLElement).innerText.toLowerCase()))); //file
      else
          lastIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForOpenFolder((dir.firstElementChild as HTMLElement).innerText.toLowerCase()))); //folder
      lastIconEl.setAttribute('class', 'web-vscode-icon');
      lastIconEl.setAttribute('width', '16');
      lastIconEl.setAttribute('height', '16');
      lastIconEl.setAttribute('style', 'margin-right: 5px; margin-top: 8px');
      dir.insertBefore(lastIconEl, dir.firstElementChild); //<img .. > <a ... > ...
      break;
    default: //Elements in between
      const newIconEl = document.createElement('img');
      newIconEl.setAttribute('src', chrome.runtime.getURL('./icons/'+ getIconForOpenFolder((dir.firstElementChild as HTMLElement).innerText.toLowerCase()))); //<span ... > < a ... >
      newIconEl.setAttribute('class', 'web-vscode-icon');
      newIconEl.setAttribute('width', '16');
      newIconEl.setAttribute('height', '16');
      newIconEl.setAttribute('style', 'margin-right: 5px; margin-top: 8px');
      dir.insertBefore(newIconEl, dir.firstElementChild); //<img .. > <a ... > ...
      break;
  }
}


function applyRepoTreeIcons(treeItems: HTMLTableRowElement[]) {
  for (const itemEl of treeItems) {
    /**
     * [TR:
     *  [TD: 
     *    [A: 
     *      [SPAN: [SVG: icon]],
     *      [SPAN: name]
     *    ]
     *  ],
     *  [TD: [SPAN: [A: message]]],
     *  [TD: [TIME: ago]]
     * ]
     */

    const iconAndNameEls = itemEl.firstElementChild.firstElementChild! as HTMLAnchorElement;
    const name = iconAndNameEls.innerText.toLowerCase();
    if (name === '..') {
      continue;
    }

    const newIconEl = document.createElement('img');
    const iconEl = iconAndNameEls.firstElementChild.firstElementChild!;
    const iconPath = iconAndNameEls.href.indexOf('/tree/') > 0 ? getIconForFolder(name) : getIconForFile(name);


    newIconEl.setAttribute('src', getIconUrl(iconPath));
    newIconEl.setAttribute('class', 'web-vscode-icon');
    newIconEl.setAttribute('width', '16');
    newIconEl.setAttribute('height', '16');
    iconEl.parentNode.replaceChild(newIconEl, iconEl);

  }
}

function showRepoTreeIcons() {
  const treeItems = Array.from(document.querySelectorAll<HTMLTableRowElement>(QUERY_TREE_ITEMS));
  applyRepoTreeIcons(treeItems);

  const treeHolder = document.querySelector(QUERY_TREE_HOLDER);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {      
      if (!mutation.addedNodes){
        return;
      }

      const treeItemsObserved = Array.from(mutation.addedNodes)
        .filter(el => {
          return (
            el.nodeName == TABLE_ROW_ELEMENT_LITERAL &&
            (el as HTMLTableRowElement).classList.contains(TREE_ITEM_CLASS)
          );
        })
        .map(el => el as HTMLTableRowElement);

      if (treeItemsObserved.length > 0) {
        applyRepoTreeIcons(treeItemsObserved);
      }
    })
  }).observe(treeHolder, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

showRepoTreeIcons();

observe("li.breadcrumb-item", {
  add(dir) {
    showIconsForSegments((dir as HTMLElement));
  },
})
