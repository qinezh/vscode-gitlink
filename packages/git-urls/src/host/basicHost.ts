import Host from "./host";
import GitInfo from "../gitInfo";
import ConfigInfo from "../configInfo";

export default abstract class BasicHost implements Host {
    private readonly httpRegex = /(https?:\/\/)(?:[^:@]+:[^:@]+@)?([^\/:]+)(?:\/)([^\/:]+)(?:\/)([^\/:\n]+)/;
    private readonly gitRegex = /(git@)([^\/:]+)(?::)([^\/:]+)(?:\/)([^\/:\n]+)/;
    protected abstract separateFolder;

    parse(info: ConfigInfo): GitInfo {
        const matches = this.httpRegex.exec(info.remoteUrl) ?? this.gitRegex.exec(info.remoteUrl);
        if (!matches) {
            throw new Error(`Can't parse ${info.remoteUrl} with Default rules`);
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
        let index = hostName.indexOf('@');
        if (index !== -1) {
            hostName = hostName.substring(index + 1);
        }

        return {
            hostName: hostName,
            repoName: repoName,
            ref: info.ref,
            userName: matches[3],
            metadata: { "isHttp": isHttp },
        }
    }

    assemble(info: GitInfo): string {
        return this.assembleLink(info);
    }

    assembleLink(info: GitInfo): string {
        let prefix = "https://";
        if (info.metadata && info.metadata["isHttp"]) {
            prefix = "http://";
        }

        return `${prefix}${info.hostName}/${info.userName}/${info.repoName}/${this.separateFolder}/${info.ref.value}/${info.relativefilePath}`;
    }
}
