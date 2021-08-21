'use strict';

import * as vscode from "vscode";
import GitUrl from "git-urls";

export function activate(context: vscode.ExtensionContext) {
    const gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', gotoCommandAsync);
    const copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', copyCommandAsync);

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

async function getGitLink(): Promise<string | null> {
    const position = vscode.window.activeTextEditor.selection;
    const filePath = vscode.window.activeTextEditor.document.fileName;
    const gitlinkConfig = vscode.workspace.getConfiguration("gitlink");

    const linkMap = await getOnlineLinkAsync(filePath, position);
    if (linkMap.size === 1) {
        return linkMap.values().next().value;
    }

    const defaultRemote = gitlinkConfig["defaultRemote"];
    if (defaultRemote && linkMap.get(defaultRemote)) {
        return linkMap.get(defaultRemote);
    }

    const itemPickList: vscode.QuickPickItem[] = [];
    for (const [remoteName, _] of linkMap) {
        itemPickList.push({ label: remoteName, description: "" });
    }

    const choice = await vscode.window.showQuickPick(itemPickList, {
        placeHolder: "Select the git remote source"
    });
    if (choice === undefined) {
        // cancel
        return null;
    }

    return linkMap.get(choice.label);
}

async function gotoCommandAsync() {
    try {
        const gitlink = await getGitLink();
        if (gitlink) {
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(gitlink));
        }
    } catch (ex) {
        return vscode.window.showWarningMessage(ex.message);
    }
}

async function copyCommandAsync() {
    try {
        const gitlink = await getGitLink();
        if (gitlink) {
            await vscode.env.clipboard.writeText(gitlink);
            return vscode.window.showInformationMessage(`The link has been copied to the clipboard.`);
        }
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