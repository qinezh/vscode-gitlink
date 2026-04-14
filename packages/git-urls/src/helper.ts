import * as fs from "fs-extra";
import * as path from "path";
import { GitUrlError } from "./error";

export interface GitDirInfo {
    gitDir: string; // worktree-specific (has HEAD)
    commonDir: string; // shared (has config)
}

export default class Helper {
    public static async resolveGitDir(repoRoot: string): Promise<GitDirInfo> {
        const dotGit = path.join(repoRoot, ".git");
        const stat = await fs.stat(dotGit);

        if (stat.isDirectory()) {
            return { gitDir: dotGit, commonDir: dotGit };
        }

        // Worktree: .git is a file with "gitdir: <path>"
        const content = await fs.readFile(dotGit, "utf8");
        const match = /^gitdir:\s*(.+)$/m.exec(content);
        if (!match) {
            throw new GitUrlError(`Invalid .git file in ${repoRoot}`);
        }

        const gitDir = path.resolve(repoRoot, match[1].trim());

        // commondir file points to the shared git dir
        const commonDirPath = path.join(gitDir, "commondir");
        if (await fs.pathExists(commonDirPath)) {
            const commonDirContent = await fs.readFile(commonDirPath, "utf8");
            const commonDir = path.resolve(gitDir, commonDirContent.trim());
            return { gitDir, commonDir };
        }

        return { gitDir, commonDir: gitDir };
    }

    public static async getRepoRoot(filePath: string): Promise<string | null> {
        let currentFolder = this.normalize(path.dirname(filePath));
        while (true) {
            const configFolder = path.join(currentFolder, ".git");
            if (await fs.pathExists(configFolder)) {
                return currentFolder;
            }

            const index = currentFolder.lastIndexOf("/");
            if (index < 0) {
                break;
            }

            currentFolder = currentFolder.substring(0, index);
        }
        return null;
    }

    public static normalize(filePath: string): string {
        return filePath.replace(/\\/g, "/");
    }
}
