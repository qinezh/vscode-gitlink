import Host from './host';
import GitInfo from '../gitInfo'
import ConfigInfo from "../configInfo";

export default class DevOps implements Host {
    /**
     * The regular expression to match the DevOps Git URL.
     * @example https://my-tenant@dev.azure.com/my-org/my-project/_git/my-repo
     * @example https://dev.azure.com/my-org/my-project/_git/my-repo
     * @example my-tenant@ssh.dev.azure.com:22/my-org/my-project/my-repo
     */
    private static urlRegex: RegExp = /(?:https:\/\/)?(?:[\w-]+@)?(?:ssh.)?dev\.azure\.com(?::[v\d]+)?\/([^\/]+\/[^\/]+)\/(?:_git\/)?([^/]+)/i;

    public static match(url: string): boolean {
        return DevOps.urlRegex.test(url);
    }

    public parse(info: ConfigInfo): GitInfo {
        return {
            repoName: info.remoteUrl,
            ref: info.ref,
            userName: ''
        }
    }

    public assemble(info: GitInfo): string {
        const baseUrl = info.repoName.replace(DevOps.urlRegex, "https://dev.azure.com/$1/_git/$2");
        const path: string = encodeURIComponent(`/${info.relativeFilePath}`);

        let version: string;
        switch (info.ref.type) {
            case "branch":
                version = `GB${info.ref.value}`
                break;
            case "commit":
                version = `GC${info.ref.value}`
                break;
        }

        let url = `${baseUrl}?path=${path}&version=${version}&_a=contents`;

        if (info.section && info.section.startLine && info.section.endLine) {
            url += `&lineStyle=plain&line=${info.section.startLine}&lineEnd=${info.section.endLine}`;

            if (info.section.startColumn && info.section.endColumn) {
                url += `&lineStartColumn=${info.section.startColumn}&lineEndColumn=${info.section.endColumn}`;
            } else {
                url += "&lineStartColumn=1&lineEndColumn=1";
            }
        }

        return url;
    }
}
