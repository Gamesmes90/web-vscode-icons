import { getIconForFile, getIconForFolder, getIconForOpenFolder, DEFAULT_FILE, DEFAULT_ROOT_OPENED } from 'vscode-icons-js';
import { isRepoRoot, isSingleFile, isRepoTree, isRepo, utils } from 'github-url-detection';
import { observe } from 'selector-observer';

export const QUERY_FILE_TABLE_ITEMS = 'div.js-navigation-container>div.js-navigation-item';
export const QUERY_PATH_SEGMENTS = '.repository-content .js-path-segment a';
export const QUERY_PJAX_CONTAINER = 'main';
export const QUERY_LAST_PATH_SEGMENT = '.final-path';

const isHistoryForFile = () => isRepo() && /^\/commits\/[0-9a-f]{5,40}\/.+/.test(utils.getCleanPathname());
const getIconUrl = (iconFileName: string) => chrome.runtime.getURL('icons/' + iconFileName);
/**
 * Show icon for path segments
 */

function showIconsForSegments () {
  if (!((!isRepoRoot() && isRepoTree()) || isSingleFile() || isHistoryForFile())) return;
  const aSegments = document.querySelectorAll<HTMLAnchorElement>(QUERY_PATH_SEGMENTS);
  const firstSegment = aSegments[0];
  const finalSegment = document.querySelector(QUERY_LAST_PATH_SEGMENT) as HTMLSpanElement | undefined;
  
  // first segment has always root folder icon
  if (firstSegment) {
    const spanEl = firstSegment.children[0] as HTMLSpanElement;
    spanEl.innerHTML = `<img src="${getIconUrl(DEFAULT_ROOT_OPENED)}" alt="icon" width="16" height="16"><span> ${
      spanEl.innerText
    }</span>`;
  }
  
  // check if final segment is file or folder
  if (finalSegment) { //String must be trimmed as there might be whitespaces at the start causing the retrieval of the wrong icon
    const iconPath = window.location.href.includes('/blob/')
      ? getIconForFile(finalSegment.innerText.trim().toLowerCase()) 
      : getIconForOpenFolder(finalSegment.innerText.trim().toLowerCase());
    finalSegment.innerHTML = `<img src="${getIconUrl(iconPath)}" alt="icon" width="16" height="16"><span> ${
      finalSegment.innerText
    }</span>`;
  }
  
  // segments between first and last are always folders
  for (let i = 1; i < aSegments.length; i++) {
    const spanEl = aSegments[i];
    const aEl = spanEl.firstChild as HTMLAnchorElement;
    const iconPath = getIconForOpenFolder(aEl.innerText.trim().toLowerCase());
    aEl.innerHTML = `<img src="${getIconUrl(iconPath)}" alt="icon" width="16" height="16"><span> ${aEl.innerText}</span>`;
  }
  }
  
  /**
   * Show icons for repository files
   */
function showRepoTreeIcons(rowEl: Element) {
  const iconEl = rowEl.children[0] as HTMLTableCellElement;
  const iconSVGEl = iconEl.querySelector<SVGElement>('.octicon');
  if (!iconSVGEl) {
    // ... (up)
    return;
  }
  /**
   * <div role="row">
   *  <div><svg class={{icon}}/></div>,
   *  <div><span><a>{{name}}</a></span></div>,
   *  <div><span><a>{{message}}</a></span></div>,
   *  <div><span>{time}</span><s/div>,
   * </div>
   */
  const contentEl = rowEl.children[1] as Element;

  const linkToEl = contentEl.firstElementChild.firstElementChild as HTMLAnchorElement;

  let iconPath = '';
  if (iconSVGEl) {
    const iconSVGClassName = iconSVGEl.className.baseVal;
    if (iconSVGClassName.includes('octicon-file-text') || iconSVGClassName.includes('octicon-file ')) {
      iconPath = getIconForFile(linkToEl.innerText.toLowerCase()); // IconFile
    } else if (iconSVGClassName.includes('octicon-file-directory')) {
      const name = linkToEl.innerText.toLowerCase();
      iconPath = getIconForFolder(name.split('/').shift()); // IconFolder
    } else if (iconSVGClassName.includes('octicon-file-submodule')) {
      iconPath = getIconForFolder('submodules');
    } else if (iconSVGClassName.includes('octicon-file-symlink-file')) {
      iconPath = DEFAULT_FILE;
    } else if (iconSVGClassName.includes('octicon-file-symlink-directory')) {
      iconPath = DEFAULT_FILE;
    } else {
      console.error(chrome.runtime.getManifest().name + ": " + `Unknown filetype: "${iconSVGClassName}", please report`);
      return;
    }
    
    iconSVGEl.outerHTML = `<img src="${getIconUrl(iconPath)}" class="web-vscode-icon ${iconSVGClassName}" alt="icon" width="16" height="16">`;

  }
  // else {
  //   console.error(`Error during parsing: "td.icon > svg.octoicon" doesnt exists for ${i}. row`);
  // }
}

function init(){
  const elements = document.querySelectorAll("div.Box-row.Box-row--focus-gray.py-2.d-flex.position-relative.js-navigation-item");

  observe(QUERY_FILE_TABLE_ITEMS, {
    add(rowEl) {
      showRepoTreeIcons(rowEl);
    },
  });
  showIconsForSegments();
}

init();
document.addEventListener('pjax:end', init); // Update on page change