[![npm](https://img.shields.io/npm/dt/git-urls.svg)](https://www.npmjs.com/package/git-urls)
[![AppVeyor](https://img.shields.io/appveyor/ci/qinezh/git-urls.svg)](https://ci.appveyor.com/project/qinezh/git-urls)

# git-urls

Get online link of file with git remote URL(support Github, GitLab, Bitbucket, VSTS, DevOps)

## Install

```bash
npm install git-urls
```

## Usage example

```javascript
import GitUrls from "git-urls";

const f = async () => {
    return await GitUrls.getUrlsAsync(__filename);
};

f().then(linkMap => {
    for (const [remoteName, link] of linkMap) {
        console.log(`${remoteName}: ${link}`);
    }
});
```
