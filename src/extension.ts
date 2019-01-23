'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const rp = require("request-promise");
const ncp = require("copy-paste");

interface Options {
  method: string;
  uri: string;
  headers: {
    [key: string]: string;
  };
  body: {
    description: string;
    private: number;
    filename: string;
    sunset: number;
    content: string;
  };
  json: boolean;
}
let options: Options = {
  method: "POST",
  uri: "https://ptpb.pw/",
  headers: {
    "User-Agent": "Request-Promise",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: {
    description: "Pasted from vscode with webpaste",
    private: 0,
    filename: '',
    sunset: 300,
    content: ''
  },
  json: true
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.webpaste', () => {
    // The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const fullText = editor.document.getText();
    const filename = editor.document.fileName;
    options.body.filename = filename;
    options.body.content = fullText;
    console.log(options);
    rp(options).then((result: any) => {
      ncp.copy(result.url, () => {
        vscode.window.showInformationMessage(`Copied to pasteboard: ${result.url}`);
      });
    }).catch((err: any) => console.log(err));
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
