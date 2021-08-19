import * as os from 'os'
import { OSType } from '../types';

export class CommandGeneratorService {

    private readonly osType: OSType;

    private readonly shellRecords: Record<OSType, string> = {
        'Darwin': 'bash',
        'Linux': 'bash',
        'Windows_NT': 'powershell'
    }

    public constructor() {
        this.osType = os.type() as any

    }

    public generateCommand(program: string,
        args: string | undefined,
        extraArgs: { [key in OSType]: string | undefined } | undefined = undefined,
    ): string {

        let commandShell: string;

        if (this.osType === 'Windows_NT') {
            commandShell = 'powershell -Command'
        }
        else {
            commandShell = 'bash -c'
        }

        return `${commandShell} "${program} ${extraArgs ? extraArgs[this.osType] ?? '' : ''} ${args ?? ''}"`
    }
}