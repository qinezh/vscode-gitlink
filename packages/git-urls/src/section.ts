export default class Section {
    startLine: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;

    constructor(startLine: number, endLine?: number, startColumn?: number, endColumn?: number) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.startColumn = startColumn;
        this.endColumn = endColumn;
    }
}