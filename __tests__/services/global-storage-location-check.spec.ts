import * as vscode from 'vscode'
import * as jestMockExtended from 'jest-mock-extended'
import {ExtensionMetaService} from '../../src/services/extension-meta.service'
import {GlobalStorageLocationCheckService} from '../../src/services/global-storage-location-check.service'

jest.mock('vscode')

describe(GlobalStorageLocationCheckService.name, () => {
  let globalStorageLocationCheckService: GlobalStorageLocationCheckService
  let extensionMetaService: ExtensionMetaService
  let mockContext: vscode.ExtensionContext
  beforeAll(() => {
    mockContext = jestMockExtended.mock<vscode.ExtensionContext>()
    extensionMetaService = new ExtensionMetaService(mockContext)
    globalStorageLocationCheckService = new GlobalStorageLocationCheckService(
      mockContext,
      extensionMetaService,
    )
  })

  describe('checkProfilesLocationAsync', () => {
    test('should return true if rootDir does not exist', async () => {
      await globalStorageLocationCheckService.checkProfilesLocationAsync()
    })
  })
})
