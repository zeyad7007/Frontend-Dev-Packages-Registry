// tests/unit/ApiTests.test.tsx

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

// Import your API client and functions
import {
  apiClient, // Correctly import apiClient
  resetRegistry,
  getPackageById,
  updatePackageById,
  uploadPackage,
  getPackagesByRegex,
  getPackageCost,
  getPackageRating,
  getTracks,
  authenticate,
  logout,
  updatePermissions,
  getPermissions,
  registerUser,
  createGroup,
  assignUserToGroup,
  assignPackageToGroup,
  getGroups,
  getUsersInGroup,
} from '../../src/api'; // Adjust the path as necessary

// Import necessary interfaces
import {
  Package,
  PackageUpdateI,
  PackageUploadI,
  Metrics,
  CostI,
  AuthenticateI,
  TokenI,
  PermissionsI,
  UserPermissionsResponseI,
  UserRegisterI,
  GroupI,
  UsertoGroupI,
  PackettoGroupI,
  GroupResponseI,
  UserinGroupI,
} from '../../src/Interface';

// Mocking localStorage (if needed)
const localStorageMock: Storage = {
  length: 0,
  clear: vi.fn(),
  getItem: vi.fn(),
  key: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('API Client Test Suite', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Attach the mock adapter to the custom apiClient instance
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    // Reset the mock adapter after each test
    mock.reset();
    vi.clearAllMocks(); // Clear all mocks after each test
  });

 

  describe('resetRegistry', () => {
    it('should reset the registry successfully', async () => {
      mock.onDelete('/reset').reply(200);

      await expect(resetRegistry()).resolves.toBeUndefined();
    });
  });

  describe('getPackageById', () => {
    it('should get package by ID successfully', async () => {
      const packageId = '1';
      const mockData: Package = {
        id: packageId,
        name: 'Test Package',
        version: '1.0.0',
        description: 'A test package',
        dependencies: [],
        // Add other necessary fields based on your Package interface
      };
      mock.onGet(`/package/${packageId}`).reply(200, mockData);

      const result = await getPackageById(packageId);
      expect(result).toEqual(mockData);
    });
  });

  describe('updatePackageById', () => {
    it('should update package by ID successfully', async () => {
      const packageId = '1';
      const updateData: PackageUpdateI = {
        metadata: { version: '1.1.0', name: 'Updated Package' },
        data: 'Updated package content',
      };
      mock.onPost(`/package/${packageId}`).reply(200);

      await expect(updatePackageById(packageId, updateData)).resolves.toBeUndefined();
    });
  });

  describe('uploadPackage', () => {
    it('should upload a package successfully', async () => {
      const uploadData: PackageUploadI = {
        Name: 'New Package',
        Version: '1.0.0',
        JSProgram: 'console.log("Hello World");',
      };
      const mockData: Package = {
        id: '2',
        name: uploadData.Name,
        version: uploadData.Version,
        description: '',
        dependencies: [],
        // Add other necessary fields based on your Package interface
      };
      mock.onPost('/package').reply(200, mockData);

      const result = await uploadPackage(uploadData);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPackagesByRegex', () => {
    it('should get packages by regex successfully', async () => {
      const regex = '^Test';
      const mockData: Package[] = [
        {
          id: '1',
          name: 'Test Package',
          version: '1.0.0',
          description: 'A test package',
          dependencies: [],
          // Add other necessary fields based on your Package interface
        },
      ];
      mock.onPost('/package/byRegEx').reply(200, mockData);

      const result = await getPackagesByRegex(regex);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPackageCost', () => {
    it('should get package cost successfully', async () => {
      const packageId = '1';
      const mockData: CostI[] = [{ id: packageId, cost: 100 }];
      mock.onGet(`/package/${packageId}/cost`).reply(200, mockData);

      const result = await getPackageCost(packageId);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPackageRating', () => {
    it('should get package rating successfully', async () => {
      const packageId = '1';
      const mockData: Metrics = { id: packageId, rating: 4.5 };
      mock.onGet(`/package/${packageId}/rate`).reply(200, mockData);

      const result = await getPackageRating(packageId);
      expect(result).toEqual(mockData);
    });
  });

  describe('getTracks', () => {
    it('should get tracks successfully', async () => {
      const mockData = { plannedTracks: ['Track1', 'Track2'] };
      mock.onGet('/tracks').reply(200, mockData);

      const result = await getTracks();
      expect(result).toEqual(mockData.plannedTracks);
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      const authData: AuthenticateI = {
        User: 'testuser',
        Secret: 'testpass',
      };
      const mockData: TokenI = { token: 'testtoken' };
      mock.onPut('/authenticate').reply(200, mockData);

      const result = await authenticate(authData);
      expect(result).toEqual(mockData);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockData = { message: 'Logged out successfully' };
      mock.onPost('/logout').reply(200, mockData);

      const result = await logout();
      expect(result).toEqual(mockData.message);
    });
  });

  describe('updatePermissions', () => {
    it('should update permissions successfully', async () => {
      const userId = '1';
      const permissionsData: PermissionsI = {
        can_download: true,
        can_upload: false,
        can_search: true,
      };
      const mockData: UserPermissionsResponseI = { message: 'Permissions updated' };
      mock.onPost(`/Access/${userId}`).reply(200, mockData);

      const result = await updatePermissions(userId, permissionsData);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPermissions', () => {
    it('should get permissions successfully', async () => {
      const userId = '1';
      const mockData: PermissionsI = {
        can_download: true,
        can_upload: false,
        can_search: true,
      };
      mock.onGet(`/Access/${userId}`).reply(200, mockData);

      const result = await getPermissions(userId);
      expect(result).toEqual(mockData);
    });
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const registerData: UserRegisterI = {
        name: 'newuser',
        password: 'newpass',
        isAdmin: false,
        groupId: 1,
        canDownload: true,
        canUpload: false,
        canSearch: true,
      };
      const mockData = { message: 'User registered successfully' };
      mock.onPost('/register').reply(200, mockData);

      const result = await registerUser(registerData);
      expect(result).toEqual(mockData.message);
    });
  });

  describe('createGroup', () => {
    it('should create group successfully', async () => {
      const groupData: GroupI = {
        name: 'New Group',
        description: 'A new group',
      };
      const mockData = { id: 1 };
      mock.onPost('/group').reply(200, mockData);

      const result = await createGroup(groupData);
      expect(result).toEqual(mockData.id);
    });
  });

  describe('assignUserToGroup', () => {
    it('should assign user to group successfully', async () => {
      const groupId = 1;
      const userData: UsertoGroupI = {
        userId: 1,
      };
      const mockData = { message: 'User added to group' };
      mock.onPost(`/add_user/${groupId}`).reply(200, mockData);

      const result = await assignUserToGroup(userData, groupId);
      expect(result).toEqual(mockData.message);
    });
  });

  describe('assignPackageToGroup', () => {
    it('should assign package to group successfully', async () => {
      const groupId = 1;
      const packageData: PackettoGroupI = {
        packageId: 1,
      };
      const mockData = { message: 'Package added to group' };
      mock.onPost(`/add_package/${groupId}`).reply(200, mockData);

      const result = await assignPackageToGroup(packageData, groupId);
      expect(result).toEqual(mockData.message);
    });
  });

  describe('getGroups', () => {
    it('should get groups successfully', async () => {
      const mockData: GroupResponseI[] = [
        { id: 1, name: 'Group 1', description: 'First group' },
        // Add other necessary fields based on your GroupResponseI interface
      ];
      mock.onGet('/groups').reply(200, mockData);

      const result = await getGroups();
      expect(result).toEqual(mockData);
    });
  });

  describe('getUsersInGroup', () => {
    it('should get users in group successfully', async () => {
      const groupId = 1;
      const mockData: UserinGroupI[] = [
        { userId: 1, username: 'User1' },
        // Add other necessary fields based on your UserinGroupI interface
      ];
      mock.onGet(`/groups/${groupId}`).reply(200, mockData);

      const result = await getUsersInGroup(groupId);
      expect(result).toEqual(mockData);
    });
  });

 
});
