import GitInfo from "../gitInfo";
import ConfigInfo from "../configInfo";

interface Host {
    parse(info: ConfigInfo): GitInfo;
    assemble(info: GitInfo): string;
}

export default Host;