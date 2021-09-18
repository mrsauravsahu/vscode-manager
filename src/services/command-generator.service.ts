import * as os from 'os'
import type { OSType } from '../types'

export type GeneratedCommand = {
  command: string,
  shell: string
}

export class CommandGeneratorService {
  private readonly osType: OSType

  private readonly shellRecords: Record<OSType, string> = {
    Darwin: 'bash',
    Linux: 'bash',
    Windows_NT: 'powershell'
  }

  public constructor() {
    this.osType = os.type() as any
  }

  public generateCommand(program: string,
    args: string | undefined,
    extraArgs: { [key in OSType]: string | undefined } | undefined = undefined
  ): GeneratedCommand {
    const shell: string = this.osType === 'Windows_NT' ? 'powershell.exe' : 'bash'

    return {
      command: `${program} ${extraArgs ? extraArgs[this.osType] ?? '' : ''} ${args ?? ''}`,
      shell,
    }
  }
}
