import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

import { LinkInfo } from './linkInfo';

export class GitConfigParse {
    private readonly ConfigName = ".git/config";
    private readonly HeadName = ".git/HEAD";

    private _configPath: string;
    private _headPath: string;

    private _configRegex = /^\[remote \"origin\"\]\n\s+url\s=\s(https?:\/\/|git@)([^\/:]+)(\/|:)([^\/:]+)(\/|:)([^\/:]+?)(\.git)?$/m;
    private _headRegex = /ref:\s+refs\/heads\/(\S+)/m;

    public getOnlineLink(filePath: string, position: vscode.Selection): string {
        const gitHomeDir = this.findGitRootDir(filePath);
        if (!gitHomeDir) {
            throw new Error("Can't find git root folder of current file");
        }

        filePath = path.relative(gitHomeDir, filePath);

        this._configPath = path.join(gitHomeDir, this.ConfigName);
        this._headPath = path.join(gitHomeDir, this.HeadName);

        const configContent = fs.readFileSync(this._configPath, "utf8");
        const headContent = fs.readFileSync(this._headPath, "utf8");
        let info = this.getLinkInfo(configContent, headContent, filePath, position);
        return info.toLink();
    }

    public getLinkInfo(configContent: string, headContent: string, filePath: string, position?: vscode.Selection): LinkInfo {
        const branchName = this.getBranchName(headContent);
        if (!branchName) {
            throw new Error("Failed to parse git HEAD file: " + this._headPath);
        }

        const matches = this._configRegex.exec(configContent);
        if (!matches || matches.length < 8) {
            throw new Error("Failed to parse git config file: " + this._configPath);
        }

        if (matches[1] === "http://") {
            return new LinkInfo(matches[2], matches[4], matches[6], branchName, filePath, position, true);
        }

        return new LinkInfo(matches[2], matches[4], matches[6], branchName, filePath, position);
    }

    private findGitRootDir(filePath: string): string {
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

    private getBranchName(headContent: string) {
        let matches = this._headRegex.exec(headContent);
        if (matches.length > 1) {
            return matches[1];
        } else {
            return null;
        }
    }
}