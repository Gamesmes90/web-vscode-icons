# web-vscode-icons
Vscode icons for github, gitlab, sourceforge and gitea

Inspired by [github-vscode-icons](github-vscode-icons), this extensions adds some bug fixes and new features.

## Features

- [x] GitHub
- [x] GitHub Directory
- [x] GitLab
- [x] GitLab Directory
- [x] SourceForge
- [x] Gitea
- [x] Gitea Directory
- [ ] Options menu
- [ ] Custom entries

## Bug fixes
- Fixed Gitlab [thanks to this fork](https://github.com/jefersonla/github-vscode-icons)
- Fixed some icons

### Building
The [package.json](package.json) has the following building options

- build:all
    - builds both firefox and chrome extensions
- build:all:clean
    - builds and cleans the dist folder
- build:chrome
    - builds chrome extension
- build:firefox
    - builds firefox extension

It is possible to build a minimal version of this extension (Without custom entries and settings)

- build:minimal:all
- build:minimal:all:clean
- build:minimal:chrome
- build:minimal:firefox
