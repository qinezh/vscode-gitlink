import Host from "./host";
import { GitConfigInfo, GitUrlInfo } from "../info";
import { GitUrlError } from "../error";

export default abstract class BasicHost implements Host {
    private readonly httpRegex = /(https?:\/\/)(?:[^:@]+:[^:@]+@)?([^\/:]+)(?:\/)([^\/:]+)(?:\/)([^\/:\n]+)/;
    private readonly gitRegex = /(git@)([^\/:]+)(?::)([^\/:]+)(?:\/)([^\/:\n]+)/;
    protected abstract get separateFolder(): string | undefined;

    public abstract match(url: string): boolean;

    public parse(configInfo: GitConfigInfo): GitUrlInfo {
        const matches = this.httpRegex.exec(configInfo.remoteUrl) ?? this.gitRegex.exec(configInfo.remoteUrl);
        if (!matches) {
            throw new GitUrlError(`Can't parse ${configInfo.remoteUrl} with the rule of ${this.constructor.name}.`);
        }

        const schema = matches[1];
        let isHttp = false;
        if (schema.startsWith("http://")) {
            isHttp = true;
        }

        let repoName = matches[4];
        if (repoName.endsWith(".git")) {
            repoName = repoName.substring(0, repoName.lastIndexOf(".git"));
        }

        let hostName = matches[2];
        const index = hostName.indexOf("@");
        if (index !== -1) {
            hostName = hostName.substring(index + 1);
        }

        const gitInfo: GitUrlInfo = {
            hostName: hostName,
            repoName: repoName,
            ref: { ...configInfo.ref, value: encodeURIComponent(configInfo.ref.value) },
            userName: matches[3],
            section: configInfo.section,
            metadata: { isHttp: isHttp },
        };

        if (configInfo.relativeFilePath) {
            let parts = configInfo.relativeFilePath.split("/");
            parts = parts.map(p => encodeURIComponent(p));
            gitInfo.relativeFilePath = parts.join("/");
        }

        return gitInfo;
    }

    public assemble(info: GitUrlInfo): string {
        return this.assembleLink(info);
    }

    protected assembleLink(info: GitUrlInfo): string {
        let prefix = "https://";
        if (info.metadata && info.metadata["isHttp"]) {
            prefix = "http://";
        }

        return `${prefix}${info.hostName}/${info.userName}/${info.repoName}/${this.separateFolder}/${info.ref.value}/${info.relativeFilePath}`;
    }
}
