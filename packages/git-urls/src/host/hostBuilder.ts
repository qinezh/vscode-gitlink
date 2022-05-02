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

    create(info: GitConfigInfo, hostType?: string): Host {
        const url = info.remoteUrl;
        for (const host of this.hosts) {
            if (hostType?.toLowerCase() === host.name.toLowerCase()) {
                return host;
            }
        }

        for (const host of this.hosts) {
            if (host.match(url)) {
                return host;
            }
        }

        throw new GitUrlError(
            `Can't find a matched host type for the url: ${url}. You may be able to specify the host type to match it.`
        );
    }
}

export const hostBuilder = new HostBuilder([]);
