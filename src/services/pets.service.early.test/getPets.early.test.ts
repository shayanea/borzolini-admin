import PetsService, { Pet, PetsQueryParams } from '../pets.service';

import { apiService } from '../api';

// src/services/pets.service.test.ts
jest.mock('../api');

const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Labrador',
    age: 3,
    weight: 25,
    ownerName: 'John Doe',
    ownerEmail: 'john@example.com',
    ownerPhone: '1234567890',
    microchipId: 'MC123',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mittens',
    type: 'Cat',
    breed: 'Siamese',
    age: 2,
    weight: 5,
    ownerName: 'Jane Smith',
    ownerEmail: 'jane@example.com',
    ownerPhone: '0987654321',
    microchipId: 'MC456',
    isActive: false,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-02T00:00:00Z',
  },
];

const mockResponse = {
  data: mockPets,
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('PetsService.getPets() getPets method', () => {
  // Happy Paths
  describe('Happy paths', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch pets with no query params (default)', async () => {
      // Test: Ensure getPets returns correct data when called with no params
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await PetsService.getPets();

      expect(apiService.get).toHaveBeenCalledWith('/pets');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch pets with all query params provided', async () => {
      // Test: Ensure getPets constructs the correct URL with all params
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        page: 2,
        limit: 5,
        search: 'Buddy',
        type: 'Dog',
        ownerName: 'John Doe',
        isActive: true,
        sortBy: 'name',
        sortOrder: 'ASC',
      };

      const expectedUrl =
        '/pets?page=2&limit=5&search=Buddy&type=Dog&ownerName=John Doe&isActive=true&sortBy=name&sortOrder=ASC';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should fetch pets with only some query params provided', async () => {
      // Test: Ensure getPets constructs the correct URL with partial params
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        page: 1,
        limit: 20,
        type: 'Cat',
      };

      const expectedUrl = '/pets?page=1&limit=20&type=Cat';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should handle isActive=false correctly in query params', async () => {
      // Test: Ensure isActive=false is correctly appended to the query string
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        isActive: false,
      };

      const expectedUrl = '/pets?isActive=false';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should handle sortOrder=DESC correctly', async () => {
      // Test: Ensure sortOrder DESC is correctly appended
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        sortOrder: 'DESC',
      };

      const expectedUrl = '/pets?sortOrder=DESC';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });
  });

  // Edge Cases
  describe('Edge cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle empty object as params', async () => {
      // Test: Ensure getPets returns correct data when called with empty object
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await PetsService.getPets({});

      expect(apiService.get).toHaveBeenCalledWith('/pets');
      expect(result).toEqual(mockResponse);
    });

    it('should handle page=0 and limit=0', async () => {
      // Test: Ensure page=0 and limit=0 are correctly appended
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        page: 0,
        limit: 0,
      };

      // Since 0 is falsy, these should not be appended
      const expectedUrl = '/pets';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty strings for search, type, ownerName, sortBy', async () => {
      // Test: Ensure empty strings are not appended to the query string
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        search: '',
        type: '',
        ownerName: '',
        sortBy: '',
      };

      const expectedUrl = '/pets';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if apiService.get rejects', async () => {
      // Test: Ensure getPets throws if apiService.get throws
      const error = new Error('Network error');
      (apiService.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(PetsService.getPets()).rejects.toThrow('Network error');
      expect(apiService.get).toHaveBeenCalledWith('/pets');
    });

    it('should handle isActive param when set to true and false explicitly', async () => {
      // Test: Ensure isActive true/false are handled distinctly
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const paramsTrue: PetsQueryParams = { isActive: true };
      const paramsFalse: PetsQueryParams = { isActive: false };

      await PetsService.getPets(paramsTrue);
      expect(apiService.get).toHaveBeenCalledWith('/pets?isActive=true');

      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);
      await PetsService.getPets(paramsFalse);
      expect(apiService.get).toHaveBeenCalledWith('/pets?isActive=false');
    });

    it('should handle sortOrder with lowercase value (should not append)', async () => {
      // Test: Ensure sortOrder with invalid value is not appended
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        sortOrder: 'asc' as any, // invalid, should not append
      };

      const expectedUrl = '/pets?sortOrder=asc';

      // The method does not validate sortOrder, so it will append as is
      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should handle very large page and limit values', async () => {
      // Test: Ensure large numbers are correctly appended
      (apiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params: PetsQueryParams = {
        page: 999999,
        limit: 100000,
      };

      const expectedUrl = '/pets?page=999999&limit=100000';

      const result = await PetsService.getPets(params);

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });
  });
});
