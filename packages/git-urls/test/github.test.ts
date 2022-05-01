import { GitConfigInfo } from "../src/info";
import GitUrls from "../src/index";

// test("Get current project's git online link", async () => {
//     const link = await GitUrl.getOnlineLinkAsync(path.resolve("package.json"));
//     expect(link).toMatch(/https:\/\/github.com\/.+\/git-urls\/blob\/.+\/package.json/);
// });

const remoteName = "origin";

test("Get HTTPS URL in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://github.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("https://github.com/build/git-urls/blob/master/test/a.md");
});

test("Get SSH URL in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@github.com:qinezh/git-urls",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("https://github.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get HTTP URL in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "http://github.com/qinezh/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("http://github.com/qinezh/git-urls/blob/master/test/a.md");
});

test("Get HTTPS URL with username in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://qinezh@github.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("https://github.com/build/git-urls/blob/master/test/a.md");
});

test("Get URL with space in file path in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://qinezh@github.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test space in path/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe(
        "https://github.com/build/git-urls/blob/master/test%20space%20in%20path/a.md"
    );
});

test("Get URL with section in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://qinezh@github.com/build/git-urls.git",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 2,
            endLine: 3,
            startColumn: 4,
            endColumn: 5,
        },
        relativeFilePath: "test space in path/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe(
        "https://github.com/build/git-urls/blob/master/test%20space%20in%20path/a.md#L2-L3"
    );
});

test("Get URL with special branch in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://qinezh@github.com/build/git-urls.git",
        ref: { type: "branch", value: "#test" },
        relativeFilePath: "a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("https://github.com/build/git-urls/blob/%23test/a.md");
});

test("Get URL with commit SHA in GitHub", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://github.com/build/git-urls.git",
        ref: { type: "commit", value: "59f76230dd5829a10aab717265b66c6b5849365e" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://github.com/build/git-urls/blob/59f76230dd5829a10aab717265b66c6b5849365e/test/a.md"
    );
});

test("Get URL with basic auth", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://username:ghp_REDACTED@github.com/build/git-urls.git",
        ref: { type: "branch", value: "main" },
        relativeFilePath: "a.md",
    };
    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe("https://github.com/build/git-urls/blob/main/a.md");
});
