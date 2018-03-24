# GitLink (Support GitHub/GitLab/BitBucket/VSTS)

[![Current Version](https://vsmarketplacebadge.apphb.com/version/qezhu.gitlink.svg)](https://marketplace.visualstudio.com/items?itemName=qezhu.gitlink)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/qezhu.gitlink.svg)](https://marketplace.visualstudio.com/items?itemName=qezhu.gitlink)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/qezhu.gitlink.svg)](https://marketplace.visualstudio.com/items?itemName=qezhu.gitlink)
[![AppVeyor](https://img.shields.io/appveyor/ci/qinezh/vscode-gitlink.svg)](https://ci.appveyor.com/project/qinezh/vscode-gitlink)

Inspired by GitHub extension for Visual Studio, this extension provide the feature that **Go To** current file's online link in browser and **Copy** the link in clipboard.

## Features

1. Go to the online link of current file.
2. Copy the online link of current file.

## Install
Press `F1`, type `ext install gitlink`

## Usage

<img src="images/how_to_use_it.gif" width="600"/>

### Set default remote source

Workspace Level: add `gitlink.defaultRemote: "<your_default_remote_source>"` in `.vscode/settings.json` under the root of your workspace.

Global Level: toggle the preference of vscode, and add `gitlink.defaultRemote: "<your_default_remote_source>"` in User Settings.

## Release Notes

### 0.3.3

* Support to set default remtoe source in workspace level and global level. (https://github.com/qinezh/vscode-gitlink/issues/11)

### 0.3.2

* Fix bugs that highlighting on BitBucket links doesn't work.

### 0.3.0

* Support multiple remote sources (thanks [Junle Li](https://github.com/lijunle))

### 0.2.3

* Support GitLab url with company name

### 0.2.2

* Support VSTS with [git-urls](https://github.com/qinezh/git-urls/)

### 0.2.1

* Support HTTP in remote URL

### 0.2.0

* Support Bitbucket

### 0.1.1

* Support multiple lines section

### 0.0.1

* Initial release of GitLink

**Enjoy!**
