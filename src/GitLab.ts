//import { mutate } from 'fastdom';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';

export const TREE_ITEM_CLASS = 'tree-item';
export const QUERY_TREE_ITEMS = `tr.${TREE_ITEM_CLASS}`;
export const QUERY_TREE_HOLDER = '.tree-holder';
export const TABLE_ROW_ELEMENT_LITERAL = 'TR';

const getIconUrl = (iconFileName: string) => chrome.runtime.getURL('icons/' + iconFileName);

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