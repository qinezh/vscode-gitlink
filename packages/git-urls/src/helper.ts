import * as fs from "fs-extra";
import * as path from "path";

import ConfigInfo from "./configInfo";
import Ref from "./ref";

export default class Helper {
    public static async parseConfigAsync(repoRoot: string): Promise<Map<string, ConfigInfo>> {
        const configPath = path.join(repoRoot, ".git/config");
        const headPath = path.join(repoRoot, ".git/HEAD");

        const existConfig = await fs.pathExists(configPath);
        const existHead = await fs.pathExists(headPath);

        if (!existConfig || !existHead) {
            throw new Error(`No git config files found in ${repoRoot}.`);
        }

        const configContent = await fs.readFile(configPath, "utf8");
        const headContent = await fs.readFile(headPath, "utf8");

        const remoteMap = this.parseRemoteUrl(configContent);
        const ref = this.parseRef(headContent);

        if (!remoteMap) {
            throw new Error(`Can't get remote name/url from ${configPath}.`);
        }

        var configMap = new Map<string, ConfigInfo>();
        for (let [key, value] of remoteMap) {
            configMap.set(key, new ConfigInfo(value, ref))
        }

        return configMap;
    }

    public static getRepoRoot(filePath: string): string | null {
        let currentFolder = this.normalize(path.dirname(filePath));
        while (true) {
            const configFolder = path.join(currentFolder, ".git");
            if (fs.existsSync(configFolder)) {
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

    public static normalize(filePath: string): string {
        return filePath.replace(/\\/g, '/');
    }

    private static parseRemoteUrl(content: string): Map<string, string> | null {
        const regex = /\n\[remote \"(.+)\"\]\s+url\s*=\s*(.+)\n/gi;
        let result = new Map<string, string>();

        let matches = regex.exec(content);
        while (matches !== null) {
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            result.set(matches[1], matches[2]);
            matches = regex.exec(content);
        }

        if (result.size > 0) {
            return result;
        }

        return null;
    }

    private static parseRef(content: string): Ref {
        const branchRegex = /ref:\s+refs\/heads\/(\S+)/;
        const branchMatches = branchRegex.exec(content);
        if (branchMatches) {
            return { type: "branch", value: branchMatches[1] }
        }

        return { type: "commit", value: content.trim() };
    }
}
