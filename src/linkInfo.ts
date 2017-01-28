'use strict';

import { Selection } from 'vscode';

export class LinkInfo {
    public siteName: string;
    public userName: string;
    public repoName: string;
    public branchName: string;
    public filePath: string;
    public position: Selection;

    public toLink(): string {
        var startIndex = this.position.start.line + 1;
        var endIndex = this.position.end.line + 1;
        var siteUrlSource = (${this.siteName} == "bitbucket.org") ? 'src' : 'blob';
        var prefix = `https://${this.siteName}/${this.userName}/${this.repoName}/${siteUrlSource}/${this.branchName}/${this.filePath}`;
        if (startIndex === endIndex) {
            return `${prefix}#L${startIndex}`;
        }

        return `${prefix}#L${startIndex}-L${endIndex}`;
    }
}
