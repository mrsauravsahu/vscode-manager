import * as path from 'path'
import * as vscode from 'vscode'

export class CommandMetaService {
  /**
   * @param programName Name of program (code/code-insiders)
   * @returns Full path to the executable, if it is code/code-insiders
   */
  async getProgramBasedOnMetaAsync(programName: string): Promise<string> {
    if (programName === 'code') {
      if (vscode.env.appName === 'Visual Studio Code - Insiders') {
        return `'${path.join(vscode.env.appRoot, 'bin', 'code-insiders')}'`
      }

      return `'${path.join(vscode.env.appRoot, 'bin', 'code')}'`
    }

    return programName
  }
}
