import Host from "./host";
import GitHub from "./github";
import GitLab from "./gitlab";
import BitBucket from "./bitbucket";
import Vsts from "./vsts";
import DevOps from "./devops";
import { GitConfigInfo } from "../info";

class HostBuilder {
    constructor(readonly hosts: Host[]) {
        this.hosts = hosts.length > 0 ? hosts : [new GitHub(), new GitLab(), new DevOps(), new Vsts(), new BitBucket()];
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

        // if no host matched, use GitHub as default
        return new GitHub();
    }
}

export const hostBuilder = new HostBuilder([]);
