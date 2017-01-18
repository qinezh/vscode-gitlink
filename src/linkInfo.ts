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
        var prefix = `https://${this.siteName}/${this.userName}/${this.repoName}/blob/${this.branchName}/${this.filePath}`;
        if (startIndex === endIndex) {
            return `${prefix}#L${startIndex}`;
        }

        return `${prefix}#L${startIndex}-L${endIndex}`;
    }
}