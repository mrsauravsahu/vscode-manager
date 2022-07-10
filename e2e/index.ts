import * as jest from 'jest'
import * as vscode from 'vscode'

export async function run(): Promise<void> {
  await vscode.window.showInformationMessage('Starting to run tests...')

  const jestRunResult = await jest.runCLI({
    ci: true,
    color: true,
    testRegex: [/e2e\.js$/],
    roots: ['./out/e2e'],
  } as any, [])

  if (jestRunResult.results.success) {
    console.log('Tests completed')
  } else {
    throw new Error('Tests failed')
  }
}
