import * as vscode from "vscode";
import type {ReviewResponse} from "./types";
import { applyDiagnostics } from "./diagnostics";
import { registerHoverProvider } from "./hover";
import { registerCodeLensProvider } from "./codelens";
import { CodeFixProvider } from "./codeActions";
import { diagnosticCollection } from "./diagnostics";

export function activate(context: vscode.ExtensionContext) {
	console.log("Deep Code Reviewer Activated!");
	registerHoverProvider(context);
	registerCodeLensProvider(context);
	vscode.commands.registerCommand(
		"deepCodeReview.clearSingleDiagnostic",
		(uri:vscode.Uri,diagtoRemove:vscode.Diagnostic)=>{
			const existing=diagnosticCollection.get(uri);
			if(!existing){
				return ;
			}
			const updated=existing.filter(d=>d!=diagtoRemove);
			diagnosticCollection.set(uri,updated);
		}
	);
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

					const json = await response.json();
					const result=json as ReviewResponse;
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
	context.subscriptions.push(
	vscode.languages.registerCodeActionsProvider(
		{ scheme: "file", language: "*" },
		new CodeFixProvider(),
		{
		providedCodeActionKinds: CodeFixProvider.metadata.providedCodeActionKinds
		}
	)
	);
	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument((doc)=>{
			vscode.commands.executeCommand("deepCodeReviewer.reviewCode");
		})
	);
}


export function deactivate() {}
