export class GitUrlError extends Error {
    constructor(public message: string) {
        super(message);
    }
}
