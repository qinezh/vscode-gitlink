import BasicHost from "./basicHost";
import { GitUrlInfo } from "../info";

export default class GitLab extends BasicHost {
    public override match(url: string): boolean {
        return url.indexOf("gitlab") >= 0;
    }

    protected override get separateFolder(): string | undefined {
        return "blob";
    }

    assemble(info: GitUrlInfo): string {
        const link = this.assembleLink(info);

        if (
            info.section &&
            info.section.startLine &&
            info.section.endLine &&
            info.section.startLine !== info.section.endLine
        ) {
            return `${link}#L${info.section.startLine}-${info.section.endLine}`;
        } else if (info.section && info.section.startLine) {
            return `${link}#L${info.section.startLine}`;
        } else {
            return link;
        }
    }
}
