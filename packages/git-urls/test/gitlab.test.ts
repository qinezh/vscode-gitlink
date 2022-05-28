import { GitConfigInfo } from "../src/info";
import GitUrls from "../src/index";

const remoteName = "origin";
test("Get HTTPS url in GitLab", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://gitlab.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.com/build/git-urls/blob/master/test/a.md");
});

test("Get SSH URL in GitLab", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@gitlab.com:qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get HTTPS url in GitLab with company name", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://gitlab.xyz.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.xyz.com/build/git-urls/blob/master/test/a.md");
});

test("Get SSH URL in GitLab with company name", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@gitlab.xyz.com:qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.xyz.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get URL with section in GitLab", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://qinezh@gitlab.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 2,
            endLine: 3,
            startColumn: 4,
            endColumn: 5,
        },
        relativeFilePath: "a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.com/build/git-urls/blob/master/a.md#L2-3");
});

test("Get URL with commit SHA in GitLab", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://gitlab.com/build/git-urls.git",
        ref: { type: "commit", value: "59f76230dd5829a10aab717265b66c6b5849365e" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://gitlab.com/build/git-urls/blob/59f76230dd5829a10aab717265b66c6b5849365e/test/a.md"
    );
});

test("Get SSH URL with port number in GitLab", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@gitlab.com:1024/qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://gitlab.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get unsupported SSH URL", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@contoso.com:1024/qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://contoso.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get unsupported SSH URL with customized host type", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@contoso.com:1024/qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo, "GitLab");

    expect(result._unsafeUnwrap().url).toBe("https://contoso.com/qinezh/git-urls/blob/master/test/a.md");
});
