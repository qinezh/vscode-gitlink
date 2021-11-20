import BasicHost from "./basicHost";
import GitInfo from "../gitInfo";

export default class GitHub extends BasicHost {
    protected separateFolder = "blob";

    assemble(info: GitInfo): string {
        const link = this.assembleLink(info);

        if (info.section && info.section.startLine && info.section.endLine && info.section.startLine !== info.section.endLine) {
            return `${link}#L${info.section.startLine}-L${info.section.endLine}`;
        } else if (info.section && info.section.startLine) {
            return `${link}#L${info.section.startLine}`;
        } else {
            return link;
        }
    }
}