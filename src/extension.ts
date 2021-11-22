import * as vscode from "vscode";

const notifType: string[] = ["warning", "error", "info", "loading"];

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "custom-notification.popNotification",
    async () => {
      const selectedType = await vscode.window.showQuickPick(notifType, {
        placeHolder: "Notification type",
      });
      const message = await vscode.window.showInputBox({
        placeHolder: "Insert message",
      });
      let loadingTime = 0;
      if (selectedType === "loading") {
        const loadingValue = await vscode.window.showInputBox({
          placeHolder: "Insert loading time (seconds)",
        });
        loadingTime = parseInt(loadingValue || "1");
      }
      const delayValue = await vscode.window.showInputBox({
        placeHolder: "Insert delay time (seconds)",
      });
      const delayTime = parseInt(delayValue || "1");
      const notif = new Promise<void>((resolve) => {
        setTimeout(() => {
          if (message && selectedType && notifType.includes(selectedType)) {
            if (selectedType === "warning") {
              vscode.window.showWarningMessage(message);
            }
            if (selectedType === "error") {
              vscode.window.showErrorMessage(message);
            }
            if (selectedType === "info") {
              vscode.window.showInformationMessage(message);
            }
            if (selectedType === "loading") {
              vscode.window.withProgress(
                {
                  location: vscode.ProgressLocation.Notification,
                  title: message,
                  cancellable: false,
                },
                () => {
                  const p = new Promise<void>((resolve) => {
                    setTimeout(() => {
                      resolve();
                    }, loadingTime * 1000);
                  });

                  return p;
                }
              );
            }
          }
          resolve();
        }, delayTime * 1000);
      });

      return notif;
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
