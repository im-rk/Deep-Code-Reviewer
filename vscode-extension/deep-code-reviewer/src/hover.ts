import { issueStore } from './issueStore';
import * as vscode from "vscode";
import { diagnosticCollection } from "./diagnostics";
export function registerHoverProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("*", {
      provideHover(document, position) {
        const diags = diagnosticCollection.get(document.uri) || [];
        const match = diags.find(d => d.range.contains(position));
        if (!match) return;


        // if (typeof match.code === "object" && match.code !== null && "value" in match.code) {
        //   suggestion = String(match.code.value);
        // } else {
        //   suggestion = String(match.code);
        // }
        const issueId=String(match.code);
        const issueData=issueStore.get(issueId);
        if(!issueData)
        {
          return ;
        }
        return new vscode.Hover("💡 Suggestion: " + issueData.suggestion);
      }
    })
  );
}