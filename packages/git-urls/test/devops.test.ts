import { GitConfigInfo } from "../src/info";
import GitUrls from "../src/index";

const remoteName = "origin";
test("Get file URL in DevOps", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://dev.azure.com/my-org/my-project/_git/repo",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/file",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://dev.azure.com/my-org/my-project/_git/repo?path=%2Ftest%2Ffile&version=GBmaster&_a=contents"
    );
});

test("Get selection block URL in DevOps", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://dev.azure.com/my-org/my-project/_git/repo",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 12,
            endLine: 23,
        },
        relativeFilePath: "test/file",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://dev.azure.com/my-org/my-project/_git/repo?path=%2Ftest%2Ffile&version=GBmaster&_a=contents&lineStyle=plain&line=12&lineEnd=23&lineStartColumn=1&lineEndColumn=1"
    );
});

test("Get file URL in DevOps with SSH", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "my-tenant@ssh.dev.azure.com:22/my-org/my-project/repo",
        ref: { type: "branch", value: "master" },
        relativeFilePath: "test/file",
    };

    const result = await GitUrls.getUrl(configInfo);
    expect(result._unsafeUnwrap().url).toBe(
        "https://dev.azure.com/my-org/my-project/_git/repo?path=%2Ftest%2Ffile&version=GBmaster&_a=contents"
    );
});

test("Get selection block URL with column in DevOps", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://dev.azure.com/my-org/my-project/_git/repo",
        ref: { type: "branch", value: "master" },
        section: {
            startLine: 12,
            endLine: 23,
            startColumn: 8,
            endColumn: 9,
        },
        relativeFilePath: "test/file",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://dev.azure.com/my-org/my-project/_git/repo?path=%2Ftest%2Ffile&version=GBmaster&_a=contents&lineStyle=plain&line=12&lineEnd=23&lineStartColumn=8&lineEndColumn=9"
    );
});

test("Get URL with commit SHA in DevOps", async () => {
    const configInfo: GitConfigInfo = {
        remoteName,
        remoteUrl: "https://dev.azure.com/my-org/my-project/_git/repo",
        ref: { type: "commit", value: "59f76230dd5829a10aab717265b66c6b5849365e" },
        relativeFilePath: "test/file",
    };
    const result = await GitUrls.getUrl(configInfo);

    expect(result._unsafeUnwrap().url).toBe(
        "https://dev.azure.com/my-org/my-project/_git/repo?path=%2Ftest%2Ffile&version=GC59f76230dd5829a10aab717265b66c6b5849365e&_a=contents"
    );
});
