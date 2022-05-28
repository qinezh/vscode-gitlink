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
