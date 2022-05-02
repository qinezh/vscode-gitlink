import { GitConfigInfo, GitUrlInfo } from "../info";
import BasicHost from "./basicHost";

export default class DevOps extends BasicHost {
    /**
     * The regular expression to match the DevOps Git URL.
     * @example https://my-tenant@dev.azure.com/my-org/my-project/_git/my-repo
     * @example https://dev.azure.com/my-org/my-project/_git/my-repo
     * @example my-tenant@ssh.dev.azure.com:22/my-org/my-project/my-repo
     */
    private static urlRegex =
        /(?:https:\/\/)?(?:[\w-]+@)?(?:ssh.)?dev\.azure\.com(?::[v\d]+)?\/([^\/]+\/[^\/]+)\/(?:_git\/)?([^/]+)/i;

    protected override get separateFolder(): string | undefined {
        return undefined;
    }

    public override get name(): string {
        return "DevOps";
    }

    public override match(url: string): boolean {
        return DevOps.urlRegex.test(url);
    }

    public override parse(configInfo: GitConfigInfo): GitUrlInfo {
        const gitInfo: GitUrlInfo = {
            repoName: configInfo.remoteUrl,
            ref: configInfo.ref,
            userName: "",
            section: configInfo.section,
        };

        if (configInfo.relativeFilePath) {
            let parts = configInfo.relativeFilePath.split("/");
            parts = parts.map(p => encodeURIComponent(p));
            gitInfo.relativeFilePath = parts.join("/");
        }

        return gitInfo;
    }

    public override assemble(info: GitUrlInfo): string {
        const baseUrl = info.repoName.replace(DevOps.urlRegex, "https://dev.azure.com/$1/_git/$2");
        const path: string = encodeURIComponent(`/${info.relativeFilePath}`);

        let version: string;
        switch (info.ref.type) {
            case "branch":
                version = `GB${info.ref.value}`;
                break;
            case "commit":
                version = `GC${info.ref.value}`;
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
