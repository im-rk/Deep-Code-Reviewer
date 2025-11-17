import * as vscode from "vscode";
import { diagnosticCollection } from "./diagnostics";

export function registerCodeLensProvider(context: vscode.ExtensionContext) {
  const provider = {
    provideCodeLenses(document: vscode.TextDocument) {
      const diags = diagnosticCollection.get(document.uri) || [];
      if (diags.length === 0) return [];

      const range = new vscode.Range(0, 0, 0, 0);
      return [
        new vscode.CodeLens(range, {
          title: `${diags.length} issues found by Deep Code Reviewer`,
          command: "workbench.action.problems.focus",
        }),
      ];
    },
  };

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ scheme: "file" }, provider)
  );
}
