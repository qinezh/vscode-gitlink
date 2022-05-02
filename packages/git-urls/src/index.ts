import * as path from "path";
import * as fs from "fs-extra";

import { GitConfigInfo, Section, GitReference } from "./info";
import { hostBuilder } from "./host/hostBuilder";
import Helper from "./helper";
import { GitUrlError } from "./error";
import { err, GitRemote, GitUrlResult, ok } from "./result";

export { GitUrlResult } from "./result";

export default class GitUrls {
    public static async getUrls(
        filePath: string,
        section?: Section,
        hostType?: string
    ): Promise<Map<string, GitUrlResult>> {
        const repoRoot = await Helper.getRepoRoot(filePath);
        if (!repoRoot) {
            throw new GitUrlError(`Can't find repo root for ${filePath}.`);
        }

        const configMap = await this.parseConfigAsync(repoRoot);
        const results = new Map<string, GitUrlResult>();

        for (const [key, configInfo] of configMap) {
            configInfo.relativeFilePath = Helper.normalize(path.relative(repoRoot, filePath));

            if (section) {
                configInfo.section = section;
            }

            const result = await this.getUrl(configInfo, hostType);
            results.set(key, result);
        }

        return results;
    }

    public static async getUrl(configInfo: GitConfigInfo, hostType?: string): Promise<GitUrlResult> {
        try {
            const host = hostBuilder.create(configInfo, hostType);
            const gitInfo = host.parse(configInfo);
            const result: GitRemote = {
                name: configInfo.remoteName,
                url: host.assemble(gitInfo),
            };

            return ok(result);
        } catch (error) {
            if (error instanceof GitUrlError) {
                return err(error);
            }

            throw error;
        }
    }

    private static async parseConfigAsync(repoRoot: string): Promise<Map<string, GitConfigInfo>> {
        const configPath = path.join(repoRoot, ".git/config");
        const headPath = path.join(repoRoot, ".git/HEAD");

        const existConfig = await fs.pathExists(configPath);
        const existHead = await fs.pathExists(headPath);

        if (!existConfig || !existHead) {
            throw new GitUrlError(`No git config files found in ${repoRoot}.`);
        }

        const configContent = await fs.readFile(configPath, "utf8");
        const headContent = await fs.readFile(headPath, "utf8");

        const remoteMap = this.parseRemoteUrl(configContent);
        const ref = this.parseRef(headContent);

        if (!remoteMap) {
            throw new GitUrlError(`Can't get remote name & url from ${configPath}.`);
        }

        const configMap = new Map<string, GitConfigInfo>();
        for (const [remoteName, remoteUrl] of remoteMap) {
            const info: GitConfigInfo = {
                remoteName,
                remoteUrl,
                ref,
            };

            configMap.set(remoteName, info);
        }

        return configMap;
    }

    private static parseRemoteUrl(content: string): Map<string, string> | null {
        const regex = /\n\[remote \"(.+)\"\]\s+url\s*=\s*(.+)\n/gi;
        const result = new Map<string, string>();

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

    private static parseRef(content: string): GitReference {
        const branchRegex = /ref:\s+refs\/heads\/(\S+)/;
        const branchMatches = branchRegex.exec(content);
        if (branchMatches) {
            return { type: "branch", value: branchMatches[1] };
        }

        return { type: "commit", value: content.trim() };
    }
}
