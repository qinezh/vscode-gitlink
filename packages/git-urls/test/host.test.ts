import { GitConfigInfo } from "../src/info";
import { GitUrlError } from "../src/error";
import { hostBuilder } from "../src/host/hostBuilder";

test("parse valid config info", async () => {
    const configInfo: GitConfigInfo = {
        remoteName: "origin",
        remoteUrl: "https://github.com/qinezh/vscode-gitlink.git",
        ref: { type: "branch", value: "main" },
        relativeFilePath: "test/a.md",
    };
    const host = hostBuilder.create(configInfo);

    const gitInfo = host.parse(configInfo);
    expect(gitInfo.hostName).toEqual("github.com");
    expect(gitInfo.userName).toEqual("qinezh");

    const url = host.assemble(gitInfo);
    expect(url).toEqual("https://github.com/qinezh/vscode-gitlink/blob/main/test/a.md");
});

test("parse invalid config info", async () => {
    const configInfo: GitConfigInfo = {
        remoteName: "origin",
        remoteUrl: "https:/git.heroku.com/vscode-gitlink.git",
        ref: { type: "branch", value: "main" },
        relativeFilePath: "test/a.md",
    };

    const host = hostBuilder.create(configInfo);
    expect(() => host.parse(configInfo)).toThrow(GitUrlError);
});

test("parse multi-level path config info", async () => {
    const configInfo: GitConfigInfo = {
        remoteName: "origin",
        remoteUrl: "https://git.mcmc.io/ops/terraform-testing/global-gcp-fws.git",
        ref: { type: "branch", value: "main" },
        relativeFilePath: "helm/values/kafka.yaml",
    };
    const host = hostBuilder.create(configInfo);

    const gitInfo = host.parse(configInfo);
    expect(gitInfo.hostName).toEqual("git.mcmc.io");
    expect(gitInfo.repoName).toEqual("global-gcp-fws");

    const url = host.assemble(gitInfo);
    expect(url).toEqual("https://git.mcmc.io/ops/terraform-testing/global-gcp-fws/blob/main/helm/values/kafka.yaml");
});

test("parse multi-level path config info", async () => {
    const configInfo: GitConfigInfo = {
        remoteName: "origin",
        remoteUrl: "https://gitlab.com/mcmc-group/admin/v2/mlasrv.git",
        ref: { type: "branch", value: "main" },
        relativeFilePath: "helm/values/kafka.yaml",
    };
    const host = hostBuilder.create(configInfo);

    const gitInfo = host.parse(configInfo);
    expect(gitInfo.hostName).toEqual("gitlab.com");
    expect(gitInfo.repoName).toEqual("mlasrv");

    const url = host.assemble(gitInfo);
    expect(url).toEqual("https://gitlab.com/mcmc-group/admin/v2/mlasrv/blob/main/helm/values/kafka.yaml");
});