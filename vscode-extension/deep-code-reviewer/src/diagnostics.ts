import { serialize } from "v8";
import * as vscode from "vscode";
import { issueStore } from "./issueStore";
export const diagnosticCollection = vscode.languages.createDiagnosticCollection("deep-code-review");

export function applyDiagnostics(document: vscode.TextDocument, issues: any[]) {
  const diagnostics: vscode.Diagnostic[] = [];

  issues.forEach(issue => {
    const lineIndex = issue.line - 1;
    if (lineIndex < 0 || lineIndex >= document.lineCount) return;

    const range = new vscode.Range(lineIndex, 0, lineIndex, document.lineAt(lineIndex).text.length);

    let severity=vscode.DiagnosticSeverity.Information;

    if(issue.type=="error" || issue.type=="bug")
    {
      severity=vscode.DiagnosticSeverity.Error;
    }
    else if(issue.type=="warning"|| issue.type=="security")
    {
      severity=vscode.DiagnosticSeverity.Warning;
    }
    else if(issue.type=="style"|| issue.type=="suggestion")
    {
      severity=vscode.DiagnosticSeverity.Information;
    }
    const diagnostic = new vscode.Diagnostic(
      range,
      `[${issue.type}] ${issue.description}`,
      severity
    );
    const issueId = `${document.uri.toString()}-${issue.line}-${Math.random()}`;
    issueStore.set(issueId,{
      id:issueId,
      type:issue.type,
      description:issue.description,
      line: issue.line,
      suggestion: issue.suggestion,
      corrected : issue.corrected
    });
    diagnostic.code = issueId;

    diagnostics.push(diagnostic);
  });

  diagnosticCollection.set(document.uri, diagnostics);
}