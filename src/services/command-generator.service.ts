import * as os from 'os'
import * as path from 'path'
import * as vscode from 'vscode'
import type { OSType } from '../types'

export type GeneratedCommand = {
  command: string;
  shell: string;
}

export class CommandGeneratorService {
  private readonly osType: OSType

  private readonly shellRecords: Record<OSType, string> = {
    Darwin: 'bash',
    Linux: 'bash',
    Windows_NT: 'powershell.exe',
  }

  public constructor() {
    this.osType = os.type() as any
  }

  public generateCommand(program: string,
    args: string | undefined,
    extraArgs: { [key in OSType]: string | undefined } | undefined = undefined,
  ): GeneratedCommand {
    const shell: string = this.shellRecords[this.osType]

    let customizedProgramForOS = this.customizeProgram(program)

    return {
      command: `${customizedProgramForOS} ${extraArgs ? extraArgs[this.osType] ?? '' : ''} ${args ?? ''}`,
      shell,
    }
  }

  public customizeProgram(programName: string): string {
    let programWithExecChanges = ''

    if (programName !== 'code') { programWithExecChanges = programName }
    else {
      let execPrefixPath = ''

      switch (this.osType) {
        case 'Linux':
        case 'Darwin':
          execPrefixPath = path.join(vscode.env.appRoot, 'bin')
          break
        case 'Windows_NT':
          execPrefixPath = path.resolve(vscode.env.appRoot, '..', '..', 'bin')
      }

      if (vscode.env.appName === 'Visual Studio Code - Insiders') {
        programWithExecChanges = path.join(execPrefixPath, 'code-insiders')
      }
      else {
        programWithExecChanges = path.join(execPrefixPath, 'code')
      }
    }

    if (this.osType === 'Windows_NT') {
      programWithExecChanges = `& "${programWithExecChanges}"`
    }

    return programWithExecChanges
  }
}
