import * as vscode from "vscode";

export const diagnosticCollection = vscode.languages.createDiagnosticCollection("deep-code-review");

export function applyDiagnostics(document: vscode.TextDocument, issues: any[]) {
  const diagnostics: vscode.Diagnostic[] = [];

  issues.forEach(issue => {
    const lineIndex = issue.line - 1;
    if (lineIndex < 0 || lineIndex >= document.lineCount) return;

    const range = new vscode.Range(lineIndex, 0, lineIndex, document.lineAt(lineIndex).text.length);

    const diagnostic = new vscode.Diagnostic(
      range,
      `[${issue.type}] ${issue.description}`,
      vscode.DiagnosticSeverity.Warning
    );

    diagnostic.code = issue.suggestion

    diagnostics.push(diagnostic);
  });

  diagnosticCollection.set(document.uri, diagnostics);
}
