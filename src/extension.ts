'use strict';

import * as vscode from 'vscode';

import { GitConfigParse } from './gitConfigParse'

let copyPaste = require("copy-paste");

export function activate(context: vscode.ExtensionContext) {
    let window = vscode.window;
    let workspace = vscode.workspace;

    let gotoDisposable = vscode.commands.registerCommand('extension.gotoOnlineLink', () => {
        let parser = new GitConfigParse();
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            onlineLink = parser.getOnlineLink(window.activeTextEditor.document.fileName, position);
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(onlineLink));
    });

    let copyDisposable = vscode.commands.registerCommand('extension.copyOnlineLink', () => {
        let parser = new GitConfigParse();
        let position = window.activeTextEditor.selection;
        let onlineLink;
        try {
            onlineLink = parser.getOnlineLink(window.activeTextEditor.document.fileName, position);
        } catch (ex) {
            vscode.window.showWarningMessage(ex.message);
            return;
        }
        copyPaste.copy(onlineLink);
        vscode.window.showInformationMessage("the Link is copyed");
    });

    context.subscriptions.push(gotoDisposable, copyDisposable);
}

export function deactivate() {

}