export interface GitReference {
    type: "branch" | "commit";
    value: string;
}

export interface Section {
    startLine: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;
}

export interface SelectedFileInfo {
    relativeFilePath?: string;
    section?: Section;
    ref: GitReference;
}

export interface GitConfigInfo extends SelectedFileInfo {
    remoteName: string;
    remoteUrl: string;
}

export interface GitUrlInfo extends SelectedFileInfo {
    repoName: string;
    userName: string;
    hostName?: string;
    metadata?: Record<string, unknown>;
}
