import * as vscode from "vscode";

let diagnosticCollection = vscode.languages.createDiagnosticCollection("deep-code-review");

export function activate(context: vscode.ExtensionContext) {
    console.log("Deep Code Reviewer Activated!");

    let disposable = vscode.commands.registerCommand("deepCodeReviewer.reviewCode", async () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("Open a file to review.");
            return;
        }

        const document = editor.document;
        const language = document.languageId;
        const fileName = document.fileName.split("/").pop();

        let code = editor.document.getText(editor.selection);
        if (!code || code.trim().length === 0) {
            code = editor.document.getText();
        }

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Reviewing code with AI...",
                cancellable: false,
            },
            async () => {
                try {
                    const response = await fetch("http://localhost:8000/review_code", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            code: code,
                            language: language,
                            fileName: fileName,
                        }),
                    });

                    const result = await response.json();

                    applyDiagnostics(document, result.issues);
                    vscode.window.showInformationMessage("Review completed!");

                } catch (error: any) {
                    vscode.window.showErrorMessage("Error reviewing code: " + error.message);
                }
            }
        );
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(diagnosticCollection);
}

function applyDiagnostics(document: vscode.TextDocument, issues: any[]) {
    const diagnostics: vscode.Diagnostic[] = [];

    issues.forEach(issue => {
        const lineIndex = Number(issue.line) - 1;
        if (lineIndex < 0 || lineIndex >= document.lineCount) return;

        const range = new vscode.Range(
            lineIndex,
            0,
            lineIndex,
            document.lineAt(lineIndex).text.length
        );

        const diagnostic = new vscode.Diagnostic(
            range,
            `[${issue.type}] ${issue.description}\nSuggestion: ${issue.suggestion}`,
            vscode.DiagnosticSeverity.Warning
        );

        diagnostics.push(diagnostic);
    });

    diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {}
