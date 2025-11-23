import * as vscode from "vscode";
import { issueStore } from "./issueStore";
export class CodeFixProvider implements vscode.CodeActionProvider {

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {

    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      const issueId=String(diagnostic.code); 
      const issueData=issueStore.get(issueId);
      if (!issueData || !issueData.corrected) continue;

      const fix = new vscode.CodeAction(
        "💡 Deep Code Review: Apply Suggested Fix",
        vscode.CodeActionKind.QuickFix
      );

      fix.diagnostics = [diagnostic];
      fix.isPreferred = true;

      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.replace(
        document.uri,
        diagnostic.range,
        issueData.corrected
      );

      actions.push(fix);
    }

    return actions;
  }

  static readonly metadata: vscode.CodeActionProviderMetadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
  };
}
