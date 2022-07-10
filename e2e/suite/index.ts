import * as jest from 'jest'

export async function run(): Promise<void> {
  const jestRunResult = await jest.runCLI(({
    ci: true,
    color: true,
    roots: ['./e2e'],
  } as any), ['e2e'])

  if (jestRunResult.results.success) {
    console.log('Tests completed')
  } else {
    console.error('Tests failed')
    process.exit(1)
  }
}
