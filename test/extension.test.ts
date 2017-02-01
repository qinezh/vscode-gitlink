import * as assert from 'assert';

import { GitConfigParse } from '../src/gitConfigParse';

suite("Extension Tests", () => {
    const headConfig = `ref: refs/heads/master`;
    test("Parse origin HTTPS url in github", () => {
        const gitConfig = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = https://github.com/qinezh/vscode-gitlink.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master`;
        let parser = new GitConfigParse();
        let info = parser.getLinkInfo(gitConfig, headConfig, "index.md");
        let url = info.toLink();
        assert.equal("https://github.com/qinezh/vscode-gitlink/blob/master/index.md", url);
    });

    test("Parse origin HTTPS url with username in github", () => {
        const gitConfig = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = https://qinezh@github.com/qinezh/vscode-gitlink.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master`;
        let parser = new GitConfigParse();
        let info = parser.getLinkInfo(gitConfig, headConfig, "index.md");
        let url = info.toLink();
        assert.equal("https://github.com/qinezh/vscode-gitlink/blob/master/index.md", url);
    });

    test("Parse origin SSH url in github", () => {
        const gitConfig = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = git@github.com:qinezh/vscode-gitlink.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master`;
        let parser = new GitConfigParse();
        let info = parser.getLinkInfo(gitConfig, headConfig, "index.md");
        let url = info.toLink();
        assert.equal("https://github.com/qinezh/vscode-gitlink/blob/master/index.md", url);
    });

    test("Parse origin SSH url in bitbucket", () => {
        const gitConfig = `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = git@bitbucket.org:qinezh/vscode-gitlink.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master`;
        let parser = new GitConfigParse();
        let info = parser.getLinkInfo(gitConfig, headConfig, "index.md");
        let url = info.toLink();
        assert.equal("https://bitbucket.org/qinezh/vscode-gitlink/src/master/index.md", url);
    });
});