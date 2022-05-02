import * as vscode from "vscode";

enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
}

class Logger {
    outputChannel: vscode.OutputChannel;

    constructor() {
        const channelName = "GitLink";
        this.outputChannel = vscode.window.createOutputChannel(channelName);
    }

    public debug(message: string): void {
        this.log(LogLevel.Debug, message);
    }

    public info(message: string): void {
        this.log(LogLevel.Info, message);
    }

    public warning(message: string): void {
        this.log(LogLevel.Warning, message);
    }

    public error(message: string): void {
        this.log(LogLevel.Error, message);
    }

    private log(logLevel: LogLevel, message: string) {
        if (logLevel > LogLevel.Info) {
            this.outputChannel.show();
        }

        const dateString = new Date().toJSON();
        const line = `[${dateString}] [${LogLevel[logLevel]}] - ${message}`;
        this.outputChannel.appendLine(line);
    }
}

export const logger = new Logger();
