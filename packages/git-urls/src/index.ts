import * as path from "path";

import ConfigInfo from "./configInfo";
import Section from "./section";
import HostBuilder from "./host/hostBuilder";
import Helper from "./helper";

export default class GitUrls {
    public static async getUrlsAsync(filePath: string, section?: Section): Promise<Map<string, string>> {
        const repoRoot = Helper.getRepoRoot(filePath);
        if (!repoRoot) {
            throw new Error(`Can't find repo root for ${filePath}.`);
        }

        const configMap = await Helper.parseConfigAsync(repoRoot);
        let urlsMap = new Map<string, string>();

        for (let [key, configInfo] of configMap) {
            configInfo.relativePath = Helper.normalize(path.relative(repoRoot, filePath));

            if (section) {
                configInfo.section = section;
            }

            const url = await this.getUrlAsync(configInfo);
            urlsMap.set(key, url);
        }

        return urlsMap;
    }

    private static async getUrlAsync(configInfo: ConfigInfo): Promise<string> {
        const host = HostBuilder.create(configInfo);
        let gitInfo = host.parse(configInfo);

        if (configInfo.section) {
            gitInfo.section = configInfo.section;
        }

        if (configInfo.relativePath) {
            let parts = configInfo.relativePath.split('/');
            parts = parts.map(p => encodeURIComponent(p));
            gitInfo.relativeFilePath = parts.join('/');
        }

        gitInfo.ref = { ...configInfo.ref, value: encodeURIComponent(configInfo.ref.value) };

        return host.assemble(gitInfo);
    }
}
