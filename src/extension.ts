'use strict';

import * as vscode from "vscode";
import GitUrl from "git-urls";

let copyPaste = require("copy-paste");

export function activate(context: vscode.ExtensionContext) {
    let window = vscode.window;
    let workspace = vscode.workspace;

    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', async () => {
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            const linkMap = await getOnlineLinkAsync(window.activeTextEditor.document.fileName, position);
            if (linkMap.size === 1) {
                return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.values().next().value));
            }

            const itemPickList: vscode.QuickPickItem[] = [];
            for (const [remoteName, url] of linkMap) {
                itemPickList.push({ label: remoteName, description: "" });
            }

            let choice = await vscode.window.showQuickPick(itemPickList);
            if (choice === undefined) {
                return;
            }

            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(choice.label)));
        } catch (ex) {
            return vscode.window.showWarningMessage(ex.message);
        }
    });

    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', async () => {
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            const linkMap = await getOnlineLinkAsync(window.activeTextEditor.document.fileName, position)
            if (linkMap.size === 1) {
                copyPaste.copy(linkMap.values().next().value);
                return vscode.window.showInformationMessage(`The link has been copied to the clipboard.`);
            }

            const itemPickList: vscode.QuickPickItem[] = [];
            for (const [remoteName, url] of linkMap) {
                itemPickList.push({ label: remoteName, description: "" });
            }

            let choice = await vscode.window.showQuickPick(itemPickList);
            if (choice === undefined) {
                return;
            }

            copyPaste.copy(linkMap.get(choice.label));
            return vscode.window.showInformationMessage(`The link of ${choice.label} has been copied to the clipboard.`);
        } catch (ex) {
            return vscode.window.showWarningMessage(ex.message);
        }
    });

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

async function getOnlineLinkAsync(filePath: string, position: vscode.Selection): Promise<Map<string, string>> {
    return GitUrl.getUrlsAsync(filePath, {
        startLine: position.start.line + 1,
        endLine: position.end.line + 1,
        startColumn: position.start.character + 1,
        endColumn: position.end.character + 1
    });
}