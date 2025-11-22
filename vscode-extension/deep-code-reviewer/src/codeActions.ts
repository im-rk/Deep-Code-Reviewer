// import * as vscode from "vscode";

// export class CodeFixProvider implements vscode.CodeActionProvider {

//   provideCodeActions(
//     document: vscode.TextDocument,
//     range: vscode.Range | vscode.Selection,
//     context: vscode.CodeActionContext
//   ): vscode.CodeAction[] {

//     const actions: vscode.CodeAction[] = [];

//     for (const diagnostic of context.diagnostics) {
      

//       const fix = new vscode.CodeAction(
//         "Apply Suggested Fix",
//         vscode.CodeActionKind.QuickFix
//       );

//       fix.diagnostics = [diagnostic];
//       fix.isPreferred = true;

//       fix.edit = new vscode.WorkspaceEdit();

//       fix.edit.replace(
//         document.uri,
//         diagnostic.range,
//         diagnostic.code
//       );

//       actions.push(fix);
//     }

//     return actions;
//   }

//   static readonly metadata: vscode.CodeActionProviderMetadata = {
//     providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
//   };
// }
