import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { FormService } from '@shared/services/form/form.service';
import { DataService } from '@shared/services/data.service';
import { Account } from '@shared/models/account/account.model';
import { CreateUpdateAccountFormComponent } from './create-update-account-form.component';

describe('CreateUpdateAccountFormComponent', () => {
  let component: CreateUpdateAccountFormComponent;
  let fixture: ComponentFixture<CreateUpdateAccountFormComponent>;
  let formService: jasmine.SpyObj<FormService>;
  let dataService: jasmine.SpyObj<DataService>;
  let activatedRoute: { params: jasmine.SpyObj<any> };

  // Mock data
  const mockAccount: Account = {
    id: '123',
    accountCrossReference: null,
    accountDomains: [],
    accountExt: { accountType: 'REGULAR' },
    accountExtInfo: null,
    authorizationCode: null,
    firmName: 'Test Firm',
    groups: [],
    name: 'ACC',
    notes: 'Test notes',
    riaCustomerNumber: '12345',
    sapCustomerNumber: '67890',
    sourceInfos: [{ id: 1, description: 'Test Source' }],
    startDate: '2023-01-01',
    status: { id: 1, code: 1, description: 'Active' },
    siteAdmin: 'admin',
    sourceInfo: 'Test Source',
    totalOrders: 0,
    totalUsers: 0,
    supportsIpOverrideToken: null,
  };

  // Mock response for create/update operations
  const mockCreatedAccount: Account = {
    ...mockAccount,
    id: '456',
    name: 'NEW',
    firmName: 'New Firm',
  };

  const mockUpdatedAccount: Account = {
    ...mockAccount,
    firmName: 'Updated Firm',
    notes: 'Updated notes',
  };

  // Mock form elements
  const createMockElementRef = (initialValue = '') => {
    return {
      nativeElement: {
        value: initialValue,
        name: '',
        label: '',
        validationMessage: '',
        required: false,
      },
    } as unknown as ElementRef;
  };

  beforeEach(async () => {
    // Create spies for services
    const formServiceSpy = jasmine.createSpyObj(
      'FormService',
      [
        'validateForm',
        'validateAlphanumeric',
        'validateFieldLength',
        'resetForm',
        'confirmForm',
      ],
      {
        resetForm$: of(null),
        confirmForm$: of(null),
      },
    );

    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'getAccount',
      'isUniqueUnitNumber',
      'createAccount',
      'updateAccount',
      'getSourceInfo',
    ]);

    dataServiceSpy.getSourceInfo.and.returnValue(of([]));

    const activatedRouteMock = {
      params: jasmine.createSpyObj('params', ['pipe']),
    };

    await TestBed.configureTestingModule({
      imports: [CreateUpdateAccountFormComponent],
      providers: [
        { provide: FormService, useValue: formServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    formService = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as unknown as {
      params: jasmine.SpyObj<any>;
    };

    fixture = TestBed.createComponent(CreateUpdateAccountFormComponent);
    component = fixture.componentInstance;

    // Set up ViewChild elements
    component.firmNameInput = createMockElementRef();
    component.accountUserPrefixInput = createMockElementRef();
    component.unitNumberInput = createMockElementRef();
    component.platformAccountNumberInput = createMockElementRef();
    component.accountTypeSelect = createMockElementRef();
    component.firmIndicatorSelect = createMockElementRef();
    component.notesInput = createMockElementRef();

    // Set names for form elements
    component.firmNameInput.nativeElement.name = 'FirmName';
    component.accountUserPrefixInput.nativeElement.name = 'AccountUserPrefix';
    component.unitNumberInput.nativeElement.name = 'UnitNumber';
    component.platformAccountNumberInput.nativeElement.name =
      'PlatformAccountNumber';
    component.accountTypeSelect.nativeElement.name = 'AccountType';
    component.firmIndicatorSelect.nativeElement.name = 'FirmIndicator';
    component.notesInput.nativeElement.name = 'Notes';

    // Set labels for form elements
    component.firmNameInput.nativeElement.label = 'Firm Name';
    component.accountUserPrefixInput.nativeElement.label =
      'Account User Prefix';
    component.unitNumberInput.nativeElement.label = 'Unit Number';
    component.platformAccountNumberInput.nativeElement.label =
      'Platform Account Number';

    // Set up form validation return values
    formService.validateForm.and.returnValue({
      isFormValid: true,
      errorFields: [],
    });

    formService.validateAlphanumeric.and.returnValue({ isValid: true });

    formService.validateFieldLength.and.returnValue({
      isValid: true,
      errorType: undefined,
    });

    // Set up data service return values with proper Account types
    dataService.isUniqueUnitNumber.and.returnValue(of(true));
    dataService.getAccount.and.returnValue(of(mockAccount));
    dataService.createAccount.and.returnValue(of(mockCreatedAccount));
    dataService.updateAccount.and.returnValue(of(mockUpdatedAccount));

    // Set up route params
    activatedRoute.params.pipe.and.returnValue(of({ id: '123' }));
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize in create mode by default', () => {
      fixture.detectChanges();
      expect(component.isUpdate).toBeFalse();
    });

    it('should initialize form subscriptions', () => {
      spyOn(component as any, 'initFormSubscriptions').and.callThrough();
      fixture.detectChanges();
      expect((component as any).initFormSubscriptions).toHaveBeenCalled();
    });

    it('should initialize in update mode when isUpdate is true', () => {
      component.isUpdate = true;
      spyOn(component as any, 'initUpdateMode').and.callThrough();
      fixture.detectChanges();
      expect((component as any).initUpdateMode).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should validate form fields', () => {
      fixture.detectChanges();

      // Setup validation return values
      formService.validateForm.and.returnValue({
        isFormValid: true,
        errorFields: [],
      });

      const result = (component as any).validateForm();

      expect(result).toBeTrue();
      expect(formService.validateForm).toHaveBeenCalled();
    });

    it('should handle form validation errors', () => {
      fixture.detectChanges();

      // Setup validation return values with errors
      formService.validateForm.and.returnValue({
        isFormValid: false,
        errorFields: [{ name: 'FirmName', error: 'Firm name is required' }],
      });

      const result = (component as any).validateForm();

      expect(result).toBeFalse();
      expect(component.formErrors['FirmName']).toBe('Firm name is required');
    });

    it('should validate field length', () => {
      fixture.detectChanges();

      // Test valid length
      formService.validateFieldLength.and.returnValue({
        isValid: true,
        errorType: undefined,
      });

      const inputElement = {
        name: 'TestField',
        value: 'test',
        label: 'Test Field',
      } as unknown as HTMLInputElement;
      const result = (component as any).validateLength({
        inputElement,
        minLength: 2,
        maxLength: 10,
      });

      expect(result).toBeTrue();
      expect(formService.validateFieldLength).toHaveBeenCalledWith('test', {
        minLength: 2,
        maxLength: 10,
      });
    });

    it('should handle minimum length validation errors', () => {
      fixture.detectChanges();

      // Test minimum length error
      formService.validateFieldLength.and.returnValue({
        isValid: false,
        errorType: 'minLength',
      });

      const inputElement = {
        name: 'TestField',
        value: 't',
        label: 'Test Field',
      } as unknown as HTMLInputElement;
      const result = (component as any).validateLength({
        inputElement,
        minLength: 2,
        maxLength: 10,
      });

      expect(result).toBeFalse();
      expect(component.formErrors['TestField']).toBe(
        'Test Field must be at least 2 characters.',
      );
    });

    it('should handle maximum length validation errors', () => {
      fixture.detectChanges();

      // Test maximum length error
      formService.validateFieldLength.and.returnValue({
        isValid: false,
        errorType: 'maxLength',
      });

      const inputElement = {
        name: 'TestField',
        value: 'toolongvalue',
        label: 'Test Field',
      } as unknown as HTMLInputElement;
      const result = (component as any).validateLength({
        inputElement,
        minLength: 2,
        maxLength: 10,
      });

      expect(result).toBeFalse();
      expect(component.formErrors['TestField']).toBe(
        'Test Field must be less than 10 characters.',
      );
    });

    it('should validate alphanumeric characters', () => {
      fixture.detectChanges();

      // Test valid alphanumeric
      formService.validateAlphanumeric.and.returnValue({ isValid: true });

      const inputElement = {
        name: 'TestField',
        value: 'Test123',
        label: 'Test Field',
      } as unknown as HTMLInputElement;
      const result = (component as any).validateCharacters(inputElement);

      expect(result).toBeTrue();
      expect(formService.validateAlphanumeric).toHaveBeenCalledWith('Test123');
    });

    it('should handle alphanumeric validation errors', () => {
      fixture.detectChanges();

      // Test invalid alphanumeric
      formService.validateAlphanumeric.and.returnValue({ isValid: false });

      const inputElement = {
        name: 'TestField',
        value: 'Test@123',
        label: 'Test Field',
      } as unknown as HTMLInputElement;
      const result = (component as any).validateCharacters(inputElement);

      expect(result).toBeFalse();
      expect(component.formErrors['TestField']).toBe(
        'Test Field must be alphanumeric.',
      );
    });
  });

  describe('Form Value Changes', () => {
    it('should handle value changes and validate fields', () => {
      fixture.detectChanges();

      spyOn(component as any, 'clearFieldError');
      spyOn(component as any, 'validateLength').and.returnValue(true);
      spyOn(component as any, 'validateCharacters').and.returnValue(true);

      const event = {
        target: { name: 'TestField', value: 'test' },
      };

      component.onValueChange({
        event: event as any,
        minLength: 2,
        maxLength: 10,
        isOnlyAlphaNumeric: true,
      });

      expect((component as any).clearFieldError).toHaveBeenCalledWith(
        'TestField',
      );
      expect((component as any).validateLength).toHaveBeenCalled();
      expect((component as any).validateCharacters).toHaveBeenCalled();
    });
  });

  describe('Unit Number Validation', () => {
    it('should validate unit number uniqueness for new accounts', fakeAsync(() => {
      fixture.detectChanges();

      // Setup for unique unit number
      dataService.isUniqueUnitNumber.and.returnValue(of(true));

      const event = {
        target: { name: 'UnitNumber', value: '12345' },
      };

      component.unitNumberExists(event as any);
      tick();

      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect(component.formErrors['UnitNumber']).toBeUndefined();
    }));

    it('should show error for non-unique unit number', fakeAsync(() => {
      fixture.detectChanges();

      // Setup for non-unique unit number
      dataService.isUniqueUnitNumber.and.returnValue(of(false));

      const event = {
        target: { name: 'UnitNumber', value: '12345' },
      };

      component.unitNumberExists(event as any);
      tick();

      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect(component.formErrors['UnitNumber']).toBe(
        'Unit number must be unique.',
      );
    }));

    it('should handle unit number validation for update mode', fakeAsync(() => {
      component.isUpdate = true;
      fixture.detectChanges();

      // Mock private accountId
      (component as any).accountId = '123';

      // Setup for account with different unit number
      dataService.getAccount.and.returnValue(
        of({
          ...mockAccount,
          riaCustomerNumber: '54321', // Different from input
        }),
      );

      dataService.isUniqueUnitNumber.and.returnValue(of(true));

      const event = {
        target: { name: 'UnitNumber', value: '12345' },
      };

      component.unitNumberExists(event as any);
      tick();

      expect(dataService.getAccount).toHaveBeenCalledWith('123');
      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
    }));

    it('should skip validation if unit number is unchanged in update mode', fakeAsync(() => {
      component.isUpdate = true;
      fixture.detectChanges();

      // Mock private accountId
      (component as any).accountId = '123';

      // Setup for account with same unit number
      dataService.getAccount.and.returnValue(
        of({
          ...mockAccount,
          riaCustomerNumber: '12345', // Same as input
        }),
      );

      const event = {
        target: { name: 'UnitNumber', value: '12345' },
      };

      component.unitNumberExists(event as any);
      tick();

      expect(dataService.getAccount).toHaveBeenCalledWith('123');
      expect(dataService.isUniqueUnitNumber).not.toHaveBeenCalled();
    }));
  });

  describe('Form Submission', () => {
    it('should validate form before submission', () => {
      fixture.detectChanges();

      spyOn(component as any, 'validateForm').and.returnValue(false);
      spyOn(component as any, 'processFormSubmission');

      component.confirmForm();

      expect((component as any).validateForm).toHaveBeenCalled();
      expect((component as any).processFormSubmission).not.toHaveBeenCalled();
    });

    it('should submit form when validation passes', () => {
      fixture.detectChanges();

      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to empty to skip uniqueness validation
      component.unitNumberInput.nativeElement.value = '';

      component.confirmForm();

      expect((component as any).validateForm).toHaveBeenCalled();
      expect((component as any).processFormSubmission).toHaveBeenCalled();
    });

    it('should create account for new form submission', fakeAsync(() => {
      fixture.detectChanges();

      const formData: Partial<Account> = {
        firmName: 'New Firm',
        name: 'NEW',
        riaCustomerNumber: '54321',
        sapCustomerNumber: '98765',
        sourceInfos: [{ id: 2 }],
        accountExt: { accountType: 'REGULAR' },
        notes: 'New account notes',
      };

      spyOn(component as any, 'collectFormData').and.returnValue(formData);
      spyOn(component as any, 'createAccount').and.callThrough();
      spyOn(console, 'log');

      (component as any).processFormSubmission();
      tick();

      expect((component as any).collectFormData).toHaveBeenCalled();
      expect((component as any).createAccount).toHaveBeenCalled();
      expect(dataService.createAccount).toHaveBeenCalledWith(formData);
      expect(console.log).toHaveBeenCalledWith(
        'Account created successfully',
        jasmine.any(Object),
      );
    }));

    it('should update account for existing form submission', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = '123';
      fixture.detectChanges();

      const formData: Partial<Account> = {
        firmName: 'Updated Firm',
        name: 'UPD',
        riaCustomerNumber: '12345',
        sapCustomerNumber: '67890',
        sourceInfos: [{ id: 1 }],
        accountExt: { accountType: 'REGULAR' },
        notes: 'Updated notes',
      };

      spyOn(component as any, 'collectFormData').and.returnValue(formData);
      spyOn(component as any, 'updateAccount').and.callThrough();
      spyOn(console, 'log');

      (component as any).processFormSubmission();
      tick();

      expect((component as any).collectFormData).toHaveBeenCalled();
      expect((component as any).updateAccount).toHaveBeenCalled();
      expect(dataService.updateAccount).toHaveBeenCalledWith('123', formData);
      expect(console.log).toHaveBeenCalledWith(
        'Account updated successfully',
        jasmine.any(Object),
      );
    }));

    it('should handle errors during account creation', fakeAsync(() => {
      fixture.detectChanges();

      spyOn(component as any, 'collectFormData').and.returnValue({
        firmName: 'New Firm',
      });

      spyOn(console, 'error');
      dataService.createAccount.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      (component as any).processFormSubmission();
      tick();

      expect(console.error).toHaveBeenCalledWith(
        'Error creating account',
        jasmine.any(Error),
      );
    }));

    it('should handle errors during account update', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = '123';
      fixture.detectChanges();

      spyOn(component as any, 'collectFormData').and.returnValue({
        firmName: 'Updated Firm',
      });

      spyOn(console, 'error');
      dataService.updateAccount.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      (component as any).processFormSubmission();
      tick();

      expect(console.error).toHaveBeenCalledWith(
        'Error updating account',
        jasmine.any(Error),
      );
    }));
  });

  describe('Form Reset', () => {
    it('should clear form fields when reset in create mode', () => {
      fixture.detectChanges();

      spyOn(component as any, 'clearFormFields');

      (component as any).resetForm();

      expect(component.formErrors).toEqual({});
      expect((component as any).clearFormFields).toHaveBeenCalled();
    });

    it('should reload data when reset in update mode', () => {
      component.isUpdate = true;
      fixture.detectChanges();

      spyOn(component as any, 'preloadForm');

      (component as any).resetForm();

      expect(component.formErrors).toEqual({});
      expect((component as any).preloadForm).toHaveBeenCalled();
    });
  });

  describe('Form Data Collection', () => {
    it('should collect form data correctly', () => {
      fixture.detectChanges();

      // Set form values
      component.firmNameInput.nativeElement.value = 'Test Firm';
      component.accountUserPrefixInput.nativeElement.value = 'TEST';
      component.unitNumberInput.nativeElement.value = '12345';
      component.platformAccountNumberInput.nativeElement.value = '67890';
      component.accountTypeSelect.nativeElement.value = '2';
      component.firmIndicatorSelect.nativeElement.value = 'regular';
      component.notesInput.nativeElement.value = 'Test notes';

      const formData = (component as any).collectFormData();

      expect(formData).toEqual({
        firmName: 'Test Firm',
        name: 'TEST',
        riaCustomerNumber: '12345',
        sapCustomerNumber: '67890',
        sourceInfos: [{ id: 2 }],
        accountExt: { accountType: 'REGULAR' },
        notes: 'Test notes',
      });
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe from all subscriptions on destroy', () => {
      fixture.detectChanges();

      const subscriptionSpy = spyOn(
        (component as any).subscriptions,
        'unsubscribe',
      );

      component.ngOnDestroy();

      expect(subscriptionSpy).toHaveBeenCalled();
    });
  });

  describe('Form Submission with Unit Number Validation', () => {
    it('should validate unit number uniqueness before form submission in create mode', fakeAsync(() => {
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';
      dataService.isUniqueUnitNumber.and.returnValue(of(true));

      component.confirmForm();
      tick();

      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect((component as any).processFormSubmission).toHaveBeenCalled();
    }));

    it('should show error when unit number is not unique in create mode', fakeAsync(() => {
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';
      dataService.isUniqueUnitNumber.and.returnValue(of(false));

      component.confirmForm();
      tick();

      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect(component.formErrors['UnitNumber']).toBe(
        'Unit number must be unique.',
      );
      expect((component as any).processFormSubmission).not.toHaveBeenCalled();
    }));

    it('should handle errors during unit number validation in create mode', fakeAsync(() => {
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');
      spyOn(console, 'error');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';
      dataService.isUniqueUnitNumber.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      component.confirmForm();
      tick();

      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect(console.error).toHaveBeenCalled();
      expect(component.formErrors['UnitNumber']).toBe(
        'Error validating unit number. Please try again.',
      );
      expect((component as any).processFormSubmission).not.toHaveBeenCalled();
    }));

    it('should validate unit number uniqueness before form submission in update mode', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = '123';
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';

      // Setup for account with different unit number
      dataService.getAccount.and.returnValue(
        of({
          ...mockAccount,
          riaCustomerNumber: '54321', // Different from input
        }),
      );

      dataService.isUniqueUnitNumber.and.returnValue(of(true));

      component.confirmForm();
      tick();

      expect(dataService.getAccount).toHaveBeenCalledWith('123');
      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect((component as any).processFormSubmission).toHaveBeenCalled();
    }));

    it('should skip unit number validation if unchanged in update mode', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = '123';
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';

      // Setup for account with same unit number
      dataService.getAccount.and.returnValue(
        of({
          ...mockAccount,
          riaCustomerNumber: '12345', // Same as input
        }),
      );

      component.confirmForm();
      tick();

      expect(dataService.getAccount).toHaveBeenCalledWith('123');
      expect(dataService.isUniqueUnitNumber).not.toHaveBeenCalled();
      expect((component as any).processFormSubmission).toHaveBeenCalled();
    }));

    it('should handle errors during unit number validation in update mode', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = '123';
      fixture.detectChanges();

      // Setup validation to pass
      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');
      spyOn(console, 'error');

      // Set unit number to trigger uniqueness validation
      component.unitNumberInput.nativeElement.value = '12345';

      // Setup for account with different unit number
      dataService.getAccount.and.returnValue(
        of({
          ...mockAccount,
          riaCustomerNumber: '54321', // Different from input
        }),
      );

      dataService.isUniqueUnitNumber.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      component.confirmForm();
      tick();

      expect(dataService.getAccount).toHaveBeenCalledWith('123');
      expect(dataService.isUniqueUnitNumber).toHaveBeenCalledWith('12345');
      expect(console.error).toHaveBeenCalled();
      expect(component.formErrors['UnitNumber']).toBe(
        'Error validating unit number. Please try again.',
      );
      expect((component as any).processFormSubmission).not.toHaveBeenCalled();
    }));
  });

  describe('Form Event Handling', () => {
    it('should ignore form events for other forms', fakeAsync(() => {
      fixture.detectChanges();

      spyOn(component as any, 'resetForm');
      spyOn(component, 'confirmForm');

      // Trigger events for different form
      formService.resetForm$ = of('OTHER_FORM' as any);
      formService.confirmForm$ = of('OTHER_FORM' as any);
      component.ngOnInit();
      tick();

      expect((component as any).resetForm).not.toHaveBeenCalled();
      expect(component.confirmForm).not.toHaveBeenCalled();
    }));
  });

  describe('Form Field Validation', () => {
    it('should handle value changes with no validations', () => {
      fixture.detectChanges();

      spyOn(component as any, 'clearFieldError');

      const event = {
        target: { name: 'TestField', value: 'test' },
      };

      component.onValueChange({
        event: event as any,
      });

      expect((component as any).clearFieldError).toHaveBeenCalledWith(
        'TestField',
      );
    });

    it('should skip unit number validation when empty', () => {
      fixture.detectChanges();

      const event = {
        target: { name: 'UnitNumber', value: '' },
      };

      component.unitNumberExists(event as any);

      expect(dataService.isUniqueUnitNumber).not.toHaveBeenCalled();
    });

    it('should skip unit number update check when accountId is null', () => {
      component.isUpdate = true;
      (component as any).accountId = null;
      fixture.detectChanges();

      const event = {
        target: { name: 'UnitNumber', value: '12345' },
      };

      component.unitNumberExists(event as any);

      expect(dataService.getAccount).not.toHaveBeenCalled();
    });
  });

  describe('Form Data Handling', () => {
    it('should populate form with account data', () => {
      fixture.detectChanges();

      (component as any).populateFormWithAccount(mockAccount);

      expect(component.firmNameInput.nativeElement.value).toBe('Test Firm');
      expect(component.accountUserPrefixInput.nativeElement.value).toBe('ACC');
      expect(component.unitNumberInput.nativeElement.value).toBe('12345');
      expect(component.platformAccountNumberInput.nativeElement.value).toBe(
        '67890',
      );
      expect(component.accountTypeSelect.nativeElement.value).toBe('1');
      expect(component.firmIndicatorSelect.nativeElement.value).toBe('regular');
      expect(component.notesInput.nativeElement.value).toBe('Test notes');
    });

    it('should handle missing values when populating form', () => {
      fixture.detectChanges();

      const incompleteAccount = {
        id: 123,
        // Missing most fields
      } as unknown as Account;

      (component as any).populateFormWithAccount(incompleteAccount);

      expect(component.firmNameInput.nativeElement.value).toBe('');
      expect(component.accountUserPrefixInput.nativeElement.value).toBe('');
      expect(component.unitNumberInput.nativeElement.value).toBe('');
      expect(component.platformAccountNumberInput.nativeElement.value).toBe('');
      expect(component.accountTypeSelect.nativeElement.value).toBe('');
      expect(component.firmIndicatorSelect.nativeElement.value).toBe('');
      expect(component.notesInput.nativeElement.value).toBe('');
    });

    it('should clear form fields', () => {
      fixture.detectChanges();

      // First set some values
      component.firmNameInput.nativeElement.value = 'Test';
      component.accountUserPrefixInput.nativeElement.value = 'TEST';
      component.unitNumberInput.nativeElement.value = '12345';
      component.platformAccountNumberInput.nativeElement.value = '67890';
      component.accountTypeSelect.nativeElement.value = '1';
      component.firmIndicatorSelect.nativeElement.value = 'regular';
      component.notesInput.nativeElement.value = 'Notes';

      // Then clear them
      (component as any).clearFormFields();

      expect(component.firmNameInput.nativeElement.value).toBe('');
      expect(component.accountUserPrefixInput.nativeElement.value).toBe('');
      expect(component.unitNumberInput.nativeElement.value).toBe('');
      expect(component.platformAccountNumberInput.nativeElement.value).toBe('');
      expect(component.accountTypeSelect.nativeElement.value).toBe('');
      expect(component.firmIndicatorSelect.nativeElement.value).toBe('');
      expect(component.notesInput.nativeElement.value).toBe('');
    });
  });

  describe('Update Mode Initialization', () => {
    it('should skip preloading form if no id in route params', fakeAsync(() => {
      component.isUpdate = true;

      // Setup route params with no id
      activatedRoute.params.pipe.and.returnValue(of({}));

      spyOn(component as any, 'preloadForm');

      fixture.detectChanges();
      tick();

      expect((component as any).preloadForm).not.toHaveBeenCalled();
    }));

    it('should skip update account if accountId is null', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = null;
      fixture.detectChanges();

      const formData = { firmName: 'Test' };

      (component as any).updateAccount(formData);
      tick();

      expect(dataService.updateAccount).not.toHaveBeenCalled();
    }));

    it('should skip preloading if accountId is null', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = null;
      fixture.detectChanges();

      (component as any).preloadForm();
      tick();

      expect(dataService.getAccount).not.toHaveBeenCalled();
    }));
  });

  describe('Edge Cases', () => {
    it('should handle existing form errors during validation', () => {
      fixture.detectChanges();

      // Set existing errors
      component.formErrors = { FirmName: 'Existing error' };

      const result = (component as any).validateForm();

      expect(result).toBeFalse();
      expect(formService.validateForm).not.toHaveBeenCalled();
    });

    it('should clear specific field error', () => {
      fixture.detectChanges();

      // Set multiple errors
      component.formErrors = {
        FirmName: 'Error 1',
        AccountUserPrefix: 'Error 2',
      };

      (component as any).clearFieldError('FirmName');

      expect(component.formErrors).toEqual({ AccountUserPrefix: 'Error 2' });
    });
  });

  describe('Form Initialization and Data Loading', () => {
    it('should load source info on initialization', () => {
      const mockSourceInfo = [
        { id: 1, description: 'Source 1' },
        { id: 2, description: 'Source 2' }
      ];
      dataService.getSourceInfo.and.returnValue(of(mockSourceInfo));
      
      fixture.detectChanges();
      
      expect(dataService.getSourceInfo).toHaveBeenCalled();
    });
  });

  describe('Unit Number Validation Scenarios', () => {
    it('should handle empty unit number in confirmForm', fakeAsync(() => {
      fixture.detectChanges();

      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission');

      // Set unit number to empty
      component.unitNumberInput.nativeElement.value = '';

      component.confirmForm();
      tick();

      // Should skip unit number validation and proceed to submission
      expect(dataService.isUniqueUnitNumber).not.toHaveBeenCalled();
      expect((component as any).processFormSubmission).toHaveBeenCalled();
    }));
  });

  describe('Form Data Collection Edge Cases', () => {
    it('should handle empty values when collecting form data', () => {
      fixture.detectChanges();

      // Clear all form values
      component.firmNameInput.nativeElement.value = '';
      component.accountUserPrefixInput.nativeElement.value = '';
      component.unitNumberInput.nativeElement.value = '';
      component.platformAccountNumberInput.nativeElement.value = '';
      component.accountTypeSelect.nativeElement.value = '';
      component.firmIndicatorSelect.nativeElement.value = '';
      component.notesInput.nativeElement.value = '';

      const formData = (component as any).collectFormData();

      expect(formData).toEqual({
        firmName: '',
        name: '',
        riaCustomerNumber: '',
        sapCustomerNumber: '',
        sourceInfos: [{ id: NaN }],
        accountExt: { accountType: '' },
        notes: '',
      });
    });

    it('should handle non-numeric account type when collecting form data', () => {
      fixture.detectChanges();

      // Set invalid account type
      component.accountTypeSelect.nativeElement.value = 'invalid';

      const formData = (component as any).collectFormData();

      // Should handle parsing error and set NaN
      expect(formData.sourceInfos[0].id).toBeNaN();
    });
  });

  describe('Form Reset Behavior', () => {
    it('should handle preloadForm when accountId is not available', fakeAsync(() => {
      component.isUpdate = true;
      (component as any).accountId = null;
      fixture.detectChanges();

      spyOn(component as any, 'clearFormFields');

      (component as any).resetForm();
      tick();

      // Should not call preloadForm or clearFormFields when accountId is null
      expect(dataService.getAccount).not.toHaveBeenCalled();
    }));
  });

  describe('Form Submission with Empty Fields', () => {
    it('should handle form submission with empty optional fields', fakeAsync(() => {
      fixture.detectChanges();

      // Set required fields but leave optional fields empty
      component.firmNameInput.nativeElement.value = 'Test Firm';
      component.accountUserPrefixInput.nativeElement.value = 'TEST';
      component.unitNumberInput.nativeElement.value = '12345';
      component.platformAccountNumberInput.nativeElement.value = '67890';
      component.accountTypeSelect.nativeElement.value = '1';
      component.firmIndicatorSelect.nativeElement.value = ''; // Optional
      component.notesInput.nativeElement.value = ''; // Optional

      spyOn(component as any, 'validateForm').and.returnValue(true);
      spyOn(component as any, 'processFormSubmission').and.callThrough();

      dataService.isUniqueUnitNumber.and.returnValue(of(true));

      component.confirmForm();
      tick();

      expect((component as any).processFormSubmission).toHaveBeenCalled();
      expect(dataService.createAccount).toHaveBeenCalled();

      // Verify empty optional fields are handled correctly
      const submittedData =
        dataService.createAccount.calls.mostRecent().args[0];
      expect(submittedData.accountExt?.accountType).toBe('');
      expect(submittedData.notes).toBe('');
    }));
  });

  describe('Error Handling', () => {
    it('should handle errors when clearing field errors', () => {
      fixture.detectChanges();

      // Set up an error object with non-standard properties
      component.formErrors = {
        FirmName: 'Error 1',
        NonExistentField: 'Error 2',
      };

      // This should not throw an error
      (component as any).clearFieldError('NonExistentField');

      expect(component.formErrors).toEqual({ FirmName: 'Error 1' });
    });
  });

  describe('Component Lifecycle', () => {
    it('should properly initialize in create mode', () => {
      component.isUpdate = false;

      spyOn(component as any, 'initFormSubscriptions');
      spyOn(component as any, 'initUpdateMode');

      fixture.detectChanges();

      expect((component as any).initFormSubscriptions).toHaveBeenCalled();
      expect((component as any).initUpdateMode).not.toHaveBeenCalled();
    });

    it('should properly initialize in update mode', () => {
      component.isUpdate = true;

      spyOn(component as any, 'initFormSubscriptions');
      spyOn(component as any, 'initUpdateMode');

      fixture.detectChanges();

      expect((component as any).initFormSubscriptions).toHaveBeenCalled();
      expect((component as any).initUpdateMode).toHaveBeenCalled();
    });
  });
});
