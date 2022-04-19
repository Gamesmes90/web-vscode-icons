import { getIconForFile, getIconForFolder } from 'vscode-icons-js';

export const QUERY_SOURCEFORGE_ITEMS = '#files_list>tbody>tr';

const getIconUrl = (iconFileName: string) => chrome.runtime.getURL('icons/' + iconFileName);

function showIconsForFiles() {
  const items = document.querySelectorAll(QUERY_SOURCEFORGE_ITEMS);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const newIconEl = document.createElement('img');
    newIconEl.setAttribute('class', 'web-vscode-icon sf-icon');
    const iconAndNameEl = item.firstElementChild.firstElementChild as HTMLTableHeaderCellElement;

    const isFolder = item.className.includes('folder');
    if (isFolder) {
      /**
       * [TR:
       *  [TH: [A: [SVG: icon], [SPAN: folderName]]],
       *  [TD: [ABBR: date]],
       *  [TD: size],
       *  [TD: [DIV: Populated by JS], [DIV: [A: chart]]],
       * ]
       */

      const iconEl = iconAndNameEl.firstElementChild as SVGAElement;
      const nameEl = iconAndNameEl.lastElementChild as HTMLAnchorElement;
      const name = nameEl.innerText.toLowerCase();
      const iconPath = getIconForFolder(name);

      newIconEl.setAttribute('src', getIconUrl(iconPath));
      newIconEl.setAttribute('width', '20');
      newIconEl.setAttribute('height', '20');
      iconAndNameEl.replaceChild(newIconEl, iconEl);
    } else {
      /**
       * [TR:
       *  [TH: [A: [SVG: icon]]],
       *  [TD: [ABBR: date]],
       *  [TD: size],
       *  [TD: [DIV: Populated by JS], [DIV: [A: chart]]],
       * ]
       */

      const nameEl = iconAndNameEl.firstElementChild as HTMLAnchorElement;
      const name = nameEl.innerText.toLowerCase();
      const iconPath = getIconForFile(name);

      newIconEl.setAttribute('src', getIconUrl(iconPath));
      newIconEl.setAttribute('width', '20');
      newIconEl.setAttribute('height', '20');
      iconAndNameEl.insertBefore(newIconEl, nameEl);
    }
  }
}

showIconsForFiles();