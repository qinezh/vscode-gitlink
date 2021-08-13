'use strict';

import * as vscode from "vscode";
import GitUrl from "git-urls";

export function activate(context: vscode.ExtensionContext) {
    let gitlinkConfig = vscode.workspace.getConfiguration("gitlink");

    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', async () => gotoCommandAsync(gitlinkConfig));
    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', async () => copyCommandAsync(gitlinkConfig));

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

async function gotoCommandAsync(gitlinkConfig: {}) {
    let position = vscode.window.activeTextEditor.selection;
    try {
        const linkMap = await getOnlineLinkAsync(vscode.window.activeTextEditor.document.fileName, position);
        if (linkMap.size === 1) {
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.values().next().value));
        }

        let defaultRemote = gitlinkConfig["defaultRemote"];
        if (defaultRemote && linkMap.get(defaultRemote)) {
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(defaultRemote)));
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
}

async function copyCommandAsync(gitlinkConfig: {}) {
    let position = vscode.window.activeTextEditor.selection;
    try {
        const linkMap = await getOnlineLinkAsync(vscode.window.activeTextEditor.document.fileName, position)
        if (linkMap.size === 1) {
            await vscode.env.clipboard.writeText(linkMap.values().next().value);
            return vscode.window.setStatusBarMessage(`The link has been copied to the clipboard.`, 10000);
        }

        let defaultRemote = gitlinkConfig["defaultRemote"];
        if (defaultRemote && linkMap.get(defaultRemote)) {
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(linkMap.get(defaultRemote)));
        }

        const itemPickList: vscode.QuickPickItem[] = [];
        for (const [remoteName, url] of linkMap) {
            itemPickList.push({ label: remoteName, description: "" });
        }

        let choice = await vscode.window.showQuickPick(itemPickList);
        if (choice === undefined) {
            return;
        }

        await vscode.env.clipboard.writeText(linkMap.get(choice.label));
        return vscode.window.setStatusBarMessage(`The link of ${choice.label} has been copied to the clipboard.`, 10000);
    } catch (ex) {
        return vscode.window.showWarningMessage(ex.message);
    }
}

async function getOnlineLinkAsync(filePath: string, position: vscode.Selection): Promise<Map<string, string>> {
    return GitUrl.getUrlsAsync(filePath, {
        startLine: position.start.line + 1,
        endLine: position.end.line + 1,
        startColumn: position.start.character + 1,
        endColumn: position.end.character + 1
    });
}