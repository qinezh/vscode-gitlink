import { GitConfigInfo, GitUrlInfo } from "../info";

interface Host {
    match(url: string): boolean;
    parse(info: GitConfigInfo): GitUrlInfo;
    assemble(info: GitUrlInfo): string;
}

export default Host;
