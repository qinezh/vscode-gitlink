import * as path from "path";

import BasicHost from "./basicHost";
import { GitUrlInfo } from "../info";

export default class BitBucket extends BasicHost {
    protected override get separateFolder(): string | undefined {
        return "src";
    }

    public override match(url: string): boolean {
        return url.indexOf("bitbucket") >= 0;
    }

    public assemble(info: GitUrlInfo): string {
        const link = this.assembleLink(info);

        let fileName: string | null = null;
        if (info.relativeFilePath) {
            fileName = path.basename(info.relativeFilePath);
        }

        if (
            info.section &&
            info.section.startLine &&
            info.section.endLine &&
            info.section.startLine !== info.section.endLine &&
            fileName
        ) {
            return `${link}#${fileName}-${info.section.startLine}:${info.section.endLine}`;
        } else if (info.section && info.section.startLine && fileName) {
            return `${link}#${fileName}-${info.section.startLine}`;
        } else {
            return link;
        }
    }
}
