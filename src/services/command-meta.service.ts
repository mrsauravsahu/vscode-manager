import * as vscode from 'vscode'

export class CommandMetaService {
  async getProgramBasedOnMetaAsync(programName: string): Promise<string> {
    if (programName === 'code') {
      if (vscode.env.appName === 'Visual Studio Code - Insiders') {
        return 'code-insiders'
      }

      return 'code'
    }

    return programName
  }
}
