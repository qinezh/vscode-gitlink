import { GitConfigInfo } from "../src/info";
import GitUrls from "../src/index";

const remoteName = "origin";
test("Get HTTPS url in BitBucket", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://bitbucket.org/qinezh/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://bitbucket.org/qinezh/git-urls/src/master/test/a.md");
});

test("Get SSH URL in BitBucket", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "git@bitbucket.org:qinezh/git-urls.git",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 2,
            endLine: 3,
            startColumn: 4,
            endColumn: 5,
        },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe("https://bitbucket.org/qinezh/git-urls/src/master/test/a.md#a.md-2:3");
});

test("Get URL with commit SHA in BitBucket", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://bitbucket.org/qinezh/git-urls.git",
        ref: { type: "commit", value: "59f76230dd5829a10aab717265b66c6b5849365e" },
        relativeFilePath: "test/a.md",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://bitbucket.org/qinezh/git-urls/src/59f76230dd5829a10aab717265b66c6b5849365e/test/a.md"
    );
});
