'use strict';

import { Selection } from 'vscode';

export class LinkInfo {
    readonly siteName: string;
    readonly userName: string;
    readonly repoName: string;
    readonly branchName: string;
    readonly filePath: string;
    readonly position: Selection;
    readonly isHttp: boolean;

    constructor(siteName: string, userName: string, repoName: string, branchName: string, filePath: string, position: Selection, isHttp = false) {
        this.siteName = siteName;
        this.userName = userName;
        this.repoName = repoName;
        this.branchName = branchName;
        this.filePath = filePath;
        this.position = position;
        this.isHttp = isHttp;
    }

    public toLink(): string {
        if (!this.siteName) {
            throw new Error("site name in LinkInfo can't be null");
        }

        let siteName = this.siteName.substr(this.siteName.lastIndexOf("@") + 1) || this.siteName;
        let siteUrlSource = (siteName === "bitbucket.org") ? "src" : "blob";

        let prefix: string;
        if (this.isHttp) {
            prefix = `http://${siteName}/${this.userName}/${this.repoName}/${siteUrlSource}/${this.branchName}/${this.filePath}`;
        } else {
            prefix = `https://${siteName}/${this.userName}/${this.repoName}/${siteUrlSource}/${this.branchName}/${this.filePath}`;
        }

        if (this.position) {
            let startIndex = this.position.start.line + 1;
            let endIndex = this.position.end.line + 1;

            if (startIndex === endIndex) {
                return `${prefix}#L${startIndex}`;
            }
            return `${prefix}#L${startIndex}-L${endIndex}`;
        }
        return `${prefix}`;
    }
}
