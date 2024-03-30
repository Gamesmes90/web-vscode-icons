const manifest = {
  manifest_version:3,
  version:'1.0',
  description: 'This extension shows VS Code icons in Gitea Repositories',
  name:'web-vscode-icons-minimal',
  author: 'Gamesmes90 <gamesmes90@gmail.com>',
  offline_enabled: true,

  icons: {
    '128': 'favicon128.png',
    '48': 'favicon48.png',
    '16': 'favicon16.png'
  },
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

  permissions: ['storage'],
  web_accessible_resources: [{
    "resources": ["icons/*.svg"],
    "matches": ["<all_urls>"]
  }]
}

export const createChromeManifest = () => {
  return manifest;
};