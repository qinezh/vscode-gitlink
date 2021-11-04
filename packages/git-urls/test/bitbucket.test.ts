import ConfigInfo from "../src/configInfo";
import GitUrls from "../src/index";

test("Get HTTPS url in BitBucket", async () => {
    const configInfo: ConfigInfo = {
        remoteUrl: "https://bitbucket.org/qinezh/git-urls.git",
        ref: { type: "branch", value: "master" },
        relativePath: "test/a.md"
    }
    const link = await GitUrls["getUrlAsync"](configInfo);

    expect(link).toBe("https://bitbucket.org/qinezh/git-urls/src/master/test/a.md");
});

test("Get SSH URL in BitBucket", async () => {
    const configInfo: ConfigInfo = {
        remoteUrl: "git@bitbucket.org:qinezh/git-urls.git",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 2,
            endLine: 3,
            startColumn: 4,
            endColumn: 5
        },
        relativePath: "test/a.md"
    }
    const link = await GitUrls["getUrlAsync"](configInfo);

    expect(link).toBe("https://bitbucket.org/qinezh/git-urls/src/master/test/a.md#a.md-2:3");
});

test("Get URL with commit SHA in BitBucket", async () => {
    const configInfo: ConfigInfo = {
        remoteUrl: "https://bitbucket.org/qinezh/git-urls.git",
        ref: { type: "commit", value: "59f76230dd5829a10aab717265b66c6b5849365e"},
        relativePath: "test/a.md"
    }
    const link = await GitUrls["getUrlAsync"](configInfo);

    expect(link).toBe("https://bitbucket.org/qinezh/git-urls/src/59f76230dd5829a10aab717265b66c6b5849365e/test/a.md");
});
