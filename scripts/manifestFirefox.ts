const manifest = {
  manifest_version:2,
  version:'1.0',
  description: 'This extension shows VS Code icons in Gitea Repositories',
  name: process.argv.slice(2)[0] === 'minimal'? 'web-vscode-icons-minimal' : 'web-vscode-icons',
  author: 'Gamesmes90 <gamesmes90@gmail.com>',

  icons: {
    '128': 'favicon128.png',
    '48': 'favicon48.png',
    '16': 'favicon16.png'
  },
  browser_specific_settings: {
    gecko: {
        id: 'gamesmes90@gmail.com'
    }
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
  web_accessible_resources: [
    "icons/*.svg"
  ]
}

export const createFirefoxManifest = () => {
  return manifest;
};