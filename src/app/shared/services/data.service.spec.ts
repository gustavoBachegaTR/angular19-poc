import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Account } from '../models/account/account.model';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DataService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('should return data from the API', () => {
      const mockData = [
        { id: 1, name: 'Test' },
        { id: 2, name: 'Test 2' },
      ];

      service.getData().subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(data.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/data`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('isUniqueUnitNumber', () => {
    it('should return true when no accounts with the given unit number exist', () => {
      const unitNumber = 'ABC123';
      const mockResponse: any[] = [];

      service.isUniqueUnitNumber(unitNumber).subscribe((isUnique) => {
        expect(isUnique).toBe(true);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/account?riaCustomerNumber=${unitNumber}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return false when accounts with the given unit number exist', () => {
      const unitNumber = 'ABC123';
      const mockResponse = [{ id: 1, riaCustomerNumber: unitNumber }];

      service.isUniqueUnitNumber(unitNumber).subscribe((isUnique) => {
        expect(isUnique).toBe(false);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/account?riaCustomerNumber=${unitNumber}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getAccount', () => {
    it('should return the account with the specified ID', () => {
      const accountId = '123';
      const mockAccount: Account = {
        id: '123',
        firmName: 'Test Firm',
        name: 'Test Account',
        riaCustomerNumber: 'ABC123',
        // Add other required properties based on your Account model
      } as Account;

      service.getAccount(accountId).subscribe((account) => {
        expect(account).toEqual(mockAccount);
        expect(account.id).toBe('123');
        expect(account.firmName).toBe('Test Firm');
      });

      const req = httpMock.expectOne(`${apiUrl}/account/${accountId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAccount);
    });

    it('should handle error when account is not found', () => {
      const accountId = '999';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getAccount(accountId).subscribe({
        next: () => fail('Expected an error, not an account'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/account/${accountId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Not found', errorResponse);
    });
  });

  describe('createAccount', () => {
    it('should create a new account', () => {
      const newAccount: Partial<Account> = {
        firmName: 'New Firm',
        name: 'New Account',
        riaCustomerNumber: 'NEW123',
      };

      const mockResponse: Account = {
        id: '456',
        ...newAccount,
      } as Account;

      service.createAccount(newAccount).subscribe((account) => {
        expect(account).toEqual(mockResponse);
        expect(account.id).toBe('456');
        expect(account.firmName).toBe('New Firm');
      });

      const req = httpMock.expectOne(`${apiUrl}/account`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAccount);
      req.flush(mockResponse);
    });

    it('should handle validation errors during account creation', () => {
      const invalidAccount: Partial<Account> = {
        // Missing required fields
      };

      const errorResponse = {
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Validation failed' },
      };

      service.createAccount(invalidAccount).subscribe({
        next: () => fail('Expected an error, not success'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe('Validation failed');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/account`);
      expect(req.request.method).toBe('POST');
      req.flush(errorResponse.error, errorResponse);
    });
  });

  describe('updateAccount', () => {
    it('should update an existing account', () => {
      const accountId = '789';
      const updateData: Partial<Account> = {
        firmName: 'Updated Firm',
        notes: 'Updated notes',
      };

      const mockResponse: Account = {
        id: '789',
        firmName: 'Updated Firm',
        name: 'Existing Account',
        riaCustomerNumber: 'EXI123',
        notes: 'Updated notes',
      } as Account;

      service.updateAccount(accountId, updateData).subscribe((account) => {
        expect(account).toEqual(mockResponse);
        expect(account.firmName).toBe('Updated Firm');
        expect(account.notes).toBe('Updated notes');
      });

      const req = httpMock.expectOne(`${apiUrl}/account/${accountId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });

    it('should handle errors when updating a non-existent account', () => {
      const accountId = '999';
      const updateData: Partial<Account> = {
        firmName: 'Updated Firm',
      };

      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.updateAccount(accountId, updateData).subscribe({
        next: () => fail('Expected an error, not success'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/account/${accountId}`);
      expect(req.request.method).toBe('PUT');
      req.flush('Not found', errorResponse);
    });
  });

  describe('edge cases', () => {
    it('should handle empty response arrays correctly', () => {
      service.getData().subscribe((data) => {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/data`);
      req.flush([]);
    });

    it('should handle network errors', () => {
      const mockError = new ErrorEvent('Network error', {
        message: 'Failed to connect to the server',
      });

      service.getData().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.error.message).toBe('Failed to connect to the server');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/data`);
      req.error(mockError);
    });

    it('should handle server errors', () => {
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      service.getData().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/data`);
      req.flush('Server error', errorResponse);
    });
  });
});
