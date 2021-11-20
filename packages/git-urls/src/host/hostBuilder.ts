import Host from "./host";
import GitHub from "./github";
import GitLab from "./gitlab";
import BitBucket from "./bitbucket";
import Vsts from './vsts';
import DevOps from './devops';
import ConfigInfo from "../configInfo";

export default class HostBuilder {
    static create(info: ConfigInfo): Host {
        const url = info.remoteUrl;
        if (url.indexOf("gitlab") >= 0) {
            return new GitLab();
        } else if (url.indexOf("bitbucket") >= 0) {
            return new BitBucket();
        } else if (Vsts.match(url)) {
            return new Vsts();
        } else if (DevOps.match(url)) {
            return new DevOps();
        } else {
            return new GitHub();
        }
    }
}
