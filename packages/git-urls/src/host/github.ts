import BasicHost from "./basicHost";
import { GitUrlInfo } from "../info";

export default class GitHub extends BasicHost {
    protected override get separateFolder(): string | undefined {
        return "blob";
    }

    public override get name(): string {
        return "GitHub";
    }

    public override match(url: string): boolean {
        return url.indexOf("github") >= 0;
    }

    public override assemble(info: GitUrlInfo): string {
        const link = this.assembleLink(info);

        if (
            info.section &&
            info.section.startLine &&
            info.section.endLine &&
            info.section.startLine !== info.section.endLine
        ) {
            return `${link}#L${info.section.startLine}-L${info.section.endLine}`;
        } else if (info.section && info.section.startLine) {
            return `${link}#L${info.section.startLine}`;
        } else {
            return link;
        }
    }
}
