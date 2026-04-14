import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import Helper from "../src/helper";
import GitUrls from "../src";
import { GitConfigInfo } from "../src/info";

describe("resolveGitDir", () => {
    let normalRepoDir: string;
    let worktreeDir: string;
    let mainRepoGitDir: string;

    beforeAll(async () => {
        // Set up a normal repo
        normalRepoDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-normal-"));
        await fs.ensureDir(path.join(normalRepoDir, ".git"));
        await fs.writeFile(
            path.join(normalRepoDir, ".git/config"),
            '[remote "origin"]\n    url = git@github.com:test/repo\n'
        );
        await fs.writeFile(path.join(normalRepoDir, ".git/HEAD"), "ref: refs/heads/main\n");

        // Set up a worktree
        worktreeDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-worktree-"));
        mainRepoGitDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-main-git-"));

        // Create the main repo's .git structure
        const worktreeGitDir = path.join(mainRepoGitDir, "worktrees/my-worktree");
        await fs.ensureDir(worktreeGitDir);
        await fs.writeFile(path.join(worktreeGitDir, "commondir"), "../../\n");
        await fs.writeFile(path.join(worktreeGitDir, "HEAD"), "ref: refs/heads/feature-branch\n");
        await fs.writeFile(
            path.join(mainRepoGitDir, "config"),
            '[remote "origin"]\n    url = git@github.com:test/repo\n'
        );

        // The worktree's .git is a file pointing to the worktree git dir
        await fs.writeFile(path.join(worktreeDir, ".git"), `gitdir: ${worktreeGitDir}\n`);
    });

    afterAll(async () => {
        await fs.remove(normalRepoDir);
        await fs.remove(worktreeDir);
        await fs.remove(mainRepoGitDir);
    });

    test("normal repo returns .git dir for both gitDir and commonDir", async () => {
        const result = await Helper.resolveGitDir(normalRepoDir);
        const expected = path.join(normalRepoDir, ".git");
        expect(result.gitDir).toBe(expected);
        expect(result.commonDir).toBe(expected);
    });

    test("worktree returns worktree gitDir and main repo commonDir", async () => {
        const result = await Helper.resolveGitDir(worktreeDir);
        const worktreeGitDir = path.join(mainRepoGitDir, "worktrees/my-worktree");
        expect(result.gitDir).toBe(worktreeGitDir);
        expect(path.resolve(result.commonDir)).toBe(path.resolve(mainRepoGitDir));
    });
});

describe("parseConfigAsync with worktree", () => {
    let worktreeDir: string;
    let mainRepoGitDir: string;

    beforeAll(async () => {
        worktreeDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-wt-parse-"));
        mainRepoGitDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-main-parse-"));

        const worktreeGitDir = path.join(mainRepoGitDir, "worktrees/my-wt");
        await fs.ensureDir(worktreeGitDir);
        await fs.writeFile(path.join(worktreeGitDir, "commondir"), "../../\n");
        await fs.writeFile(path.join(worktreeGitDir, "HEAD"), "ref: refs/heads/feature-branch\n");

        await fs.writeFile(
            path.join(mainRepoGitDir, "config"),
            `\n[remote "origin"]\n    url = git@github.com:test/repo\n    fetch = +refs/heads/*:refs/remotes/origin/*\n`
        );

        await fs.writeFile(path.join(worktreeDir, ".git"), `gitdir: ${worktreeGitDir}\n`);
    });

    afterAll(async () => {
        await fs.remove(worktreeDir);
        await fs.remove(mainRepoGitDir);
    });

    test("reads config from commonDir and HEAD from worktree gitDir", async () => {
        const configMap = await GitUrls["parseConfigAsync"](worktreeDir);
        const origin = configMap.get("origin") as GitConfigInfo;
        expect(origin).toBeDefined();
        expect(origin.remoteUrl).toBe("git@github.com:test/repo");
        expect(origin.ref).toEqual({ type: "branch", value: "feature-branch" });
    });
});
