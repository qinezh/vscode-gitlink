import Ref from "./ref";
import Section from "./section";

export default class ConfigInfo {
    remoteUrl: string;
    ref: Ref;
    relativePath?: string;
    section?: Section;

    constructor(remoteUrl: string, ref: Ref, relativePath?: string, section?: Section) {
        this.remoteUrl = remoteUrl;
        this.ref = ref;
        this.relativePath = relativePath;
        this.section = section;
    }
}
