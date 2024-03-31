import { getIconForFile, getIconForFolder, getIconForOpenFolder, DEFAULT_FILE, DEFAULT_ROOT_OPENED } from 'vscode-icons-js';
import { isRepoRoot, isSingleFile, isRepoTree, isRepo, utils } from 'github-url-detection';
import { observe } from 'selector-observer';

export const ROOT_TABLE = ".Box-sc-g0xbh4-0";
export const ROOT_SIDE_TREE = "ul.TreeView__UlBox-sc-4ex6b6-0";
export const BACK_FOLDER = 'tr.Box-sc-g0xbh4-0';
export const TREE_ITEM = 'tr.react-directory-row';
export const SIDE_TREE_FILE = 'svg.octicon-file';
export const SIDE_TREE_OPEN_FOLDER = 'svg.octicon-file-directory-open-fill';
export const SIDE_TREE_FOLDER = 'svg.octicon-file-directory-fill';

const isHistoryForFile = () => isRepo() && /^\/commits\/[0-9a-f]{5,40}\/.+/.test(utils.getCleanPathname());
const getIconUrl = (iconFileName: string) => chrome.runtime.getURL('icons/' + iconFileName);

/**
 * Show icon for folder tree
 * @param svg SVGElement
 * @returns 
 */
function showFolderIconTree(svg : SVGElement){
  if(svg.previousElementSibling){
    svg.remove();
    return;
  }

  const name = svg.parentElement.parentElement.parentElement.querySelector('span > span')?.textContent?.toLowerCase();
  if (!name) return;

  const newIconEl = document.createElement('img');
  newIconEl.setAttribute('src', getIconUrl(getIconForFolder(name)));
  newIconEl.setAttribute('class', 'web-vscode-icon');
  newIconEl.setAttribute('width', '16');
  newIconEl.setAttribute('height', '16');

  svg.parentNode.replaceChild(newIconEl, svg);
}

/**
 * Show icon for file tree
 * @param svg SVGElement
 * @returns 
 */
function showIconForFileTree(svg : SVGElement){
  const name = svg.parentNode.parentNode.querySelector('span > span')?.textContent?.toLowerCase();
  if (!name) return;

  const newIconEl = document.createElement('img');
  newIconEl.setAttribute('src', getIconUrl(getIconForFile(name)));
  newIconEl.setAttribute('class', 'web-vscode-icon');
  newIconEl.setAttribute('width', '16');
  newIconEl.setAttribute('height', '16');

  svg.parentNode.replaceChild(newIconEl, svg);
}

/**
 * Show icon for side tree
 * @param tree HTMLUListElement
 */
function showIconsForSideTree (tree : HTMLUListElement) {
  if(isRepoRoot()) return;

  /* Structure of a tree item: Folder
    <li>
      <div>
        <div>
          <div>
            <div>
              <svg></svg>
            </div>
          </div>
          <span>
            <span></span>
          </span>
        </div>
      </div>
      <ul>
        ... recursive
      </ul>
    </li>
  */
  /* Structure of a tree item: File (One less div)
    <li>
      <div>
        <div>
            <div>
              <svg></svg>
            </div>
          <span>
            <span></span>
          </span>
        </div>
      </div>
      <ul>
        ... recursive
      </ul>
    </li>
  */

  observe(SIDE_TREE_FILE, {
    add(svg) {
      showIconForFileTree(svg as SVGElement);
    }
  });

  observe(SIDE_TREE_OPEN_FOLDER, {
    add(svg){
      showFolderIconTree(svg as SVGElement);
    }
  });

  observe(SIDE_TREE_FOLDER, {
    add(svg){
      showFolderIconTree(svg as SVGElement);
    }
  });
}
  
/**
 * Shows icon for single element
 * @param tr table row element
 */
function showIconForSingleElement(tr : HTMLTableRowElement) {
  const svg = tr.querySelector('td > div > svg');
  if (!svg) return;

  const a = tr.querySelector('td > div > div > h3 > div > a');
  if (!a) return;

  const name = a.getAttribute('title')?.toLowerCase();
  if (!name) return;

  const newIconEl = document.createElement('img');
  if(a.getAttribute('aria-label').includes('File'))
    newIconEl.setAttribute('src', getIconUrl(getIconForFile(name)));
  else
    newIconEl.setAttribute('src', getIconUrl(getIconForFolder(name)));
  newIconEl.setAttribute('class', 'web-vscode-icon');
  newIconEl.setAttribute('width', '16');
  newIconEl.setAttribute('height', '16');

  svg.parentNode.replaceChild(newIconEl, svg);
}

/**
 * Shows Icon for the back button in the tree
 * @param tr table row element
 * @see showIconForSingleElement
 */
function showIconForBackButton(tr : HTMLTableRowElement) {
  const svg = tr.querySelector('td > a > div > svg');
  if (!svg) return;
  const newIconEl = document.createElement('img');
  newIconEl.setAttribute('src', getIconUrl(getIconForFolder('..')));
  newIconEl.setAttribute('class', 'web-vscode-icon');
  newIconEl.setAttribute('width', '16');
  newIconEl.setAttribute('height', '16');

  svg.parentNode.replaceChild(newIconEl, svg);
}

/**
 * Show icons for repository files
 * @param table table element
 */
function showRepoTreeIcons(table: HTMLTableElement) {
  /* Each row in the table has the following structure:
    <table>
      <tbody>
        <tr>
          <td class="...small...">
            <div>
              <svg></svg>
              <div>
                <h3>
                  <div>
                    <a></a>
                  </div>
                </h3>
              </div>
            </div>
          </td>
          <td class="...large...">
            <div>
              <svg></svg>
              <div>
                <h3>
                  <div>
                    <a></a>
                  </div>
                </h3>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  */

  //Show icon for each row
  observe(TREE_ITEM, {
    add(tr) {
      showIconForSingleElement(tr as HTMLTableRowElement);
    }
  });

  if(!isRepoRoot()) //Show back button icon
    observe(BACK_FOLDER, {
      add(tr) {
        showIconForBackButton(tr as HTMLTableRowElement);
      }
    });
}

observe(ROOT_TABLE, {
  add(table) {
    showRepoTreeIcons(table as HTMLTableElement);
  }
});
observe(ROOT_SIDE_TREE, {
  add(tree) {
    showIconsForSideTree(tree as HTMLUListElement);
  }
});