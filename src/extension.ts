'use strict';

import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

let copyPaste = require("copy-paste");

export function activate(context: vscode.ExtensionContext) {
    let window = vscode.window;
    let workspace = vscode.workspace;

    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', () => {
        let parser = new GitConfigParse();
        let index = window.activeTextEditor.selection.active.line + 1;
        let onlineLink;
        try {
            onlineLink = parser.getOnlineLink(window.activeTextEditor.document.fileName, index);
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(onlineLink));
    });

    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', () => {
        let parser = new GitConfigParse();
        let index = window.activeTextEditor.selection.active.line + 1;
        let onlineLink;
        try {
            onlineLink = parser.getOnlineLink(window.activeTextEditor.document.fileName, index);
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
        copyPaste.copy(onlineLink);
        vscode.window.showInformationMessage("the Link is copyed");
    });

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

export function deactivate() {
}

class GitConfigParse {
    private readonly ConfigName = ".git/config";
    private readonly HeadName = ".git/HEAD";

    private _configPath : string;
    private _headPath : string;

    private _configRegex = /^\[remote \"origin\"\]\n\s+url\s=\s(https:\/\/|git@)([^/:]+)(\/|:)([^/:]+)(\/|:)([^/:.]+)(\.git)?$/m;
    private _headRegex = /ref:\s+refs\/heads\/(\S+)/m;

    public getOnlineLink(filePath: string, index = -1): string {
        let gitHomeDir = this.findGitRootDir(filePath);
        if (!gitHomeDir) {
            throw new Error("Can't find git root folder of current file");
        }

        this._configPath = path.join(gitHomeDir, this.ConfigName);
        this._headPath = path.join(gitHomeDir, this.HeadName);

        let configContent = fs.readFileSync(this._configPath, "utf8");
        let linkInfo = this.getLinkInfo(configContent);
        if (!linkInfo) {
            throw new Error("Failed to parse git config file: " + this._configPath);
        }

        linkInfo.index = index;
        linkInfo.filePath = path.relative(gitHomeDir, filePath);

        let headContent = fs.readFileSync(this._headPath, "utf8");
        var branchName = this.getBranchName(headContent);
        if (!branchName) {
            throw new Error("Failed to parse git HEAD file: " + this._headPath);
        }

        linkInfo.branchName = branchName;
        return linkInfo.toLink();
    }

    private findGitRootDir(filePath: string):string {
        let currentFolder = path.dirname(filePath).replace(/\\/g, '/');
        while (true) {
            if (fs.existsSync(path.join(currentFolder, this.ConfigName))) {
                return currentFolder;
            }
            let index = currentFolder.lastIndexOf('/');
            if (index < 0) {
                break;
            }
            currentFolder = currentFolder.substring(0, index);
        }
        return null;
    }

    private getLinkInfo(configContent: string): LinkInfo {
        let info = new LinkInfo();
        let matches = this._configRegex.exec(configContent);
        if (matches.length > 6) {
            info.siteName = matches[2];
            info.userName = matches[4];
            info.repoName = matches[6];
            return info;
        }
        return null;
    }

    private getBranchName(headContent: string) {
        let matches = this._headRegex.exec(headContent);
        if (matches.length > 1) {
            return matches[1];
        } else {
            return null;
        }
    }
}

class LinkInfo {
    public siteName: string;
    public userName: string;
    public repoName: string;
    public branchName: string;
    public filePath: string;
    public index: number;

    public toLink(): string {
        return "https://" + this.siteName + "/" +
            this.userName + "/" + this.repoName + "/blob/" +
            this.branchName + "/" + this.filePath + "#L" + this.index;
    }
}