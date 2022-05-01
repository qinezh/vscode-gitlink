import { GitConfigInfo } from "../src/info";
import * as fs from "fs-extra";
import * as path from "path";
import GitUrls from "../src";

const testDir = fs.mkdtempSync("test");
const configPath = path.resolve(testDir, ".git/config");
const headPath = path.resolve(testDir, ".git/HEAD");

describe("valid config", () => {
    const configContent = `
[remote "ssh"]
    url = git@github.com:qinezh/vscode-gitlink
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
    remote = origin
    merge = refs/heads/main
[remote "https"]
    url = https://github.com/qinezh/vscode-gitlink.git
    fetch = +refs/heads/*:refs/remotes/https/*`;

    const headContent = `ref: refs/heads/main`;
    beforeAll(async () => {
        await fs.ensureDir(path.resolve(testDir, ".git"));
        await fs.writeFile(configPath, configContent);
        await fs.writeFile(headPath, headContent);
    });

    afterAll(async () => {
        await fs.remove(testDir);
    });

    test("parse git config", async () => {
        const mapping = await GitUrls["parseConfigAsync"](testDir);
        const sshInfo = mapping.get("ssh");
        const sshExpected: GitConfigInfo = {
            remoteName: "ssh",
            remoteUrl: "git@github.com:qinezh/vscode-gitlink",
            ref: { type: "branch", value: "main" },
        };
        expect(sshInfo).toEqual(sshExpected);

        const httpsInfo = mapping.get("https");
        const httpsExpected: GitConfigInfo = {
            remoteName: "https",
            remoteUrl: "https://github.com/qinezh/vscode-gitlink.git",
            ref: { type: "branch", value: "main" },
        };
        expect(httpsInfo).toEqual(httpsExpected);
    });
});
