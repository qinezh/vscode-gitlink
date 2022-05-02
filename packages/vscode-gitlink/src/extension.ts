"use strict";

import * as vscode from "vscode";
import GitUrl, { GitUrlResult } from "git-urls";

export function activate(context: vscode.ExtensionContext) {
    const gotoDisposable = vscode.commands.registerCommand("extension.gotoOnlineLink", gotoCommandAsync);
    const copyDisposable = vscode.commands.registerCommand("extension.copyOnlineLink", copyCommandAsync);

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

async function getGitLink(): Promise<string | null> {
    const position = vscode.window.activeTextEditor.selection;
    const filePath = vscode.window.activeTextEditor.document.fileName;
    const obsoleteGitLinkConfig = vscode.workspace.getConfiguration("gitlink");
    const gitLinkConfig = vscode.workspace.getConfiguration("GitLink");

    const customizedHostType = gitLinkConfig["hostType"];
    const linkMap = await GitUrl.getUrls(
        filePath,
        {
            startLine: position.start.line + 1,
            endLine: position.end.line + 1,
            startColumn: position.start.character + 1,
            endColumn: position.end.character + 1,
        },
        customizedHostType
    );

    // single result.
    if (linkMap.size === 1) {
        const result = [...linkMap.values()][0];
        return await transform(result);
    }

    // multiple results chosen by default git remote set.
    const defaultRemote = gitLinkConfig["defaultRemote"] || obsoleteGitLinkConfig["defaultRemote"];
    if (defaultRemote && linkMap.get(defaultRemote)) {
        const result = linkMap.get(defaultRemote);
        return await transform(result);
    }

    // multiple results chosen by user input.
    const itemPickList: vscode.QuickPickItem[] = [];
    for (const [remoteName, _] of linkMap) {
        itemPickList.push({ label: remoteName, description: "" });
    }

    const choice = await vscode.window.showQuickPick(itemPickList, {
        placeHolder: "Select the git remote source",
    });
    if (choice === undefined) {
        // cancel
        return null;
    }

    const result = linkMap.get(choice.label);
    return await transform(result);
}

async function gotoCommandAsync() {
    try {
        const gitLink = await getGitLink();
        if (gitLink) {
            return vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(gitLink));
        }
    } catch (ex) {
        return vscode.window.showErrorMessage(ex.message);
    }
}

async function copyCommandAsync() {
    try {
        const gitLink = await getGitLink();
        if (gitLink) {
            await vscode.env.clipboard.writeText(gitLink);
            return vscode.window.showInformationMessage(`The link has been copied to the clipboard.`);
        }
    } catch (ex) {
        return vscode.window.showErrorMessage(ex.message);
    }
}

async function transform(result: GitUrlResult): Promise<string | null> {
    if (result.isErr()) {
        await vscode.window.showErrorMessage(result.error.message);
        return null;
    }

    return result.value.url;
}
