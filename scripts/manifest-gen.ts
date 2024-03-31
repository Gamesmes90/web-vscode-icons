import { script } from "./out"
import { writeFileSync } from 'fs';

// --------------- Manifest Generation ---------------

const options_ui = {
    "options_ui": {
      "page": "settings.html"
    },
}
  
const action = {
    "action": {
      "default_popup": "settings.html"
    }
}
  
  const offline_enabled = {
    "offline_enabled": true
  }
  
const browserSpecificSettings = {
    browser_specific_settings: {
        gecko: {
            id: 'gamesmes90@gmail.com'
        }
    },
}
  
const manifest = {
    manifest_version:3,
    version:'1.1.0',
    description: 'This extension shows VS Code icons in Gitea Repositories',
    name: process.argv.slice(2)[0] === 'minimal'? 'web-vscode-icons-minimal' : 'web-vscode-icons',
    author: 'Gamesmes90 <gamesmes90@gmail.com>',
    // If browser is Firefox, don't include offline_enabled property
    ...(process.env.BROWSER === 'FIREFOX'? {} : offline_enabled),
  
    icons: {
      '128': 'favicon128.png',
      '48': 'favicon48.png',
      '16': 'favicon16.png'
    },
  
    // If browser is Firefox, include browser_specific_settings property
    ...(process.env.BROWSER === 'FIREFOX'? browserSpecificSettings : {}),
  
    content_scripts:[
      {
        matches:[
        '*://github.com/*'
        ],
        js:['GitHub.js']
      },
      {
        matches:[
          '*://gitlab.com/*'
        ],
        js:['GitLab.js']
      },
      {
        matches:[
          '*://sourceforge.net/*'
        ],
        js:['SourceForge.js']
      },
      {
        matches:[
          '*://gitea.com/*'
        ],
        js:['Gitea.js']
      }
    ],
  
    // If minimal version, don't include options_ui property
    ...(process.argv.slice(2)[0] === 'minimal'? {} : options_ui),
  
    // If minimal version, don't include action property
    ...(process.argv.slice(2)[0] === 'minimal'? {} : action),
  
    permissions: process.argv.slice(2)[0] === 'minimal'? [] : ['storage'], // No storage permission for minimal version
    web_accessible_resources: [{
        "resources": ["icons/*.svg"],
        "matches": ["<all_urls>"]
    }]
}
  
function createManifest() {
    return manifest;
};



if (process.env.BROWSER){
    script(__filename, `Creating  manifest.json`, (_, exit) => {
        let manifest;
        switch (process.env.BROWSER) {
            case 'CHROME':
            case 'FIREFOX':
                manifest = createManifest();
                break;
            default:
                throw new Error(`unknown BROWSER env '${process.env.BROWSER}'. Please use 'FIREFOX' or 'CHROME'`);
        }
        const manifestJSON = JSON.stringify(manifest, null, 2);
        writeFileSync('./dist/manifest.json', manifestJSON);
        exit();
    });
    
} else {
    throw new Error('No browser selected, please add BROWSER env');
} 