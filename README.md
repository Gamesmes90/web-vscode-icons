# web-vscode-icons
Vscode icons for github, gitlab, sourceforge and gitea

Inspired by [github-vscode-icons](github-vscode-icons), this extensions adds some bug fixes and new features.

## Features

Shows icons on repositories and files on the following websites:
- Github
- Gitlab
- Sourceforge
- Gitea

You can also add custom entries to show icons on other websites.

## Usage
Just install the extension and it will work out of the box.
You can add custom entries by clicking on the extension icon or going to the extension settings.

## Troubleshooting
If icons are not showing up
- Try to reload the page
- Check if the extension has permissions to access the page


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
