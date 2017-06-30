'use strict';

import * as vscode from "vscode";
import GitUrl from "git-urls";

let copyPaste = require("copy-paste");

export function activate(context: vscode.ExtensionContext) {
    let window = vscode.window;
    let workspace = vscode.workspace;

    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', () => {
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            getOnlineLinkAsync(window.activeTextEditor.document.fileName, position)
                .then(onlineLink => {
                    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(onlineLink));
                });
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
    });

    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', () => {
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            getOnlineLinkAsync(window.activeTextEditor.document.fileName, position)
                .then(onlineLink => {
                    copyPaste.copy(onlineLink);
                    vscode.window.showInformationMessage("The link has been copied to the clipboard.");
                });
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
    });

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

async function getOnlineLinkAsync(filePath: string, position: vscode.Selection): Promise<string> {
    let startIndex = position.start.line + 1;
    let endIndex = position.end.line + 1;

    return GitUrl.getOnlineLinkAsync(filePath, startIndex, endIndex);
}