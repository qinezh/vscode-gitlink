import Host from "./host";
import GitHub from "./github";
import GitLab from "./gitlab";
import BitBucket from "./bitbucket";
import Vsts from "./vsts";
import DevOps from "./devops";
import { GitConfigInfo } from "../info";
import { GitUrlError } from "../error";

class HostBuilder {
    constructor(readonly hosts: Host[]) {
        this.hosts = hosts.length > 0 ? hosts : [new GitHub(), new GitLab(), new BitBucket(), new Vsts(), new DevOps()];
    }

    create(info: GitConfigInfo): Host {
        const url = info.remoteUrl;
        for (const host of this.hosts) {
            if (host.match(url)) {
                return host;
            }
        }

        throw new GitUrlError(`Can't find a matched platform for the url: ${url}`);
    }
}

export const hostBuilder = new HostBuilder([]);
