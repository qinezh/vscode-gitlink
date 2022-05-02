import { GitConfigInfo, GitUrlInfo } from "../info";
import BasicHost from "./basicHost";

export default class Vsts extends BasicHost {
    /**
     * The regular expression to match the VSTS Git URL.
     * @example https://my-tenant.visualstudio.com/DefaultCollection/MyCollection/_git/my-repo
     * @example ssh://my-tenant@my-tenant.visualstudio.com:22/DefaultCollection/MyCollection/_ssh/my-repo
     */
    private static urlRegex =
        /(?:https:\/\/|ssh:\/\/)([\w-]+)@?.*\.visualstudio\.com(?:\:\d+)?\/(.+)\/(?:_git|_ssh)\/([^/]+)/i;
    protected override get separateFolder(): string | undefined {
        return undefined;
    }

    public override get name(): string {
        return "VSTS";
    }

    public override match(url: string): boolean {
        return Vsts.urlRegex.test(url);
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
        const baseUrl = info.repoName.replace(Vsts.urlRegex, "https://$1.visualstudio.com/$2/_git/$3");
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
