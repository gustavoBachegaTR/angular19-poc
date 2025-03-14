import { TestBed } from '@angular/core/testing';
import { FormService } from './form.service';

describe('FormService', () => {
  let service: FormService;

  // Mock Saffron components
  const createMockTextField = (
    value: string = '',
    name: string = 'mockField',
  ): any => ({
    value,
    name,
    invalid: false,
    trim: () => value.trim(),
  });

  const createMockSelectField = (
    value: string = '',
    name: string = 'mockSelect',
  ): any => ({
    value,
    name,
    invalid: false,
  });

  const createMockTextAreaField = (
    value: string = '',
    name: string = 'mockTextArea',
  ): any => ({
    value,
    name,
    invalid: false,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resetForm', () => {
    it('should emit the formId through resetForm$ observable', (done) => {
      const formId = 'testForm';

      service.resetForm$.subscribe((emittedFormId) => {
        expect(emittedFormId).toBe(formId);
        done();
      });

      service.resetForm(formId);
    });
  });

  describe('confirmForm', () => {
    it('should emit the formId through confirmForm$ observable', (done) => {
      const formId = 'testForm';

      service.confirmForm$.subscribe((emittedFormId) => {
        expect(emittedFormId).toBe(formId);
        done();
      });

      service.confirmForm(formId);
    });
  });

  describe('validateField', () => {
    it('should return false if field is null or undefined', () => {
      expect(service.validateField(null as any)).toBe(false);
      expect(service.validateField(undefined as any)).toBe(false);
    });

    it('should return true for non-required fields regardless of value', () => {
      const emptyField = createMockTextField('');
      const whitespaceField = createMockTextField('   ');
      const populatedField = createMockTextField('value');

      expect(service.validateField(emptyField, false)).toBe(true);
      expect(service.validateField(whitespaceField, false)).toBe(true);
      expect(service.validateField(populatedField, false)).toBe(true);
    });

    it('should return false for required fields with empty values', () => {
      const emptyField = createMockTextField('');
      const whitespaceField = createMockTextField('   ');

      expect(service.validateField(emptyField, true)).toBe(false);
      expect(service.validateField(whitespaceField, true)).toBe(false);
    });

    it('should return true for required fields with non-empty values', () => {
      const populatedField = createMockTextField('value');

      expect(service.validateField(populatedField, true)).toBe(true);
    });

    it('should work with different field types', () => {
      const textField = createMockTextField('text');
      const selectField = createMockSelectField('option');
      const textAreaField = createMockTextAreaField('content');

      expect(service.validateField(textField, true)).toBe(true);
      expect(service.validateField(selectField, true)).toBe(true);
      expect(service.validateField(textAreaField, true)).toBe(true);
    });
  });

  describe('validateForm', () => {
    it('should validate all fields and return form validity', () => {
      const fields = [
        {
          field: createMockTextField('value', 'field1'),
          required: true,
          error: 'Field 1 is required',
        },
        {
          field: createMockTextField('', 'field2'),
          required: true,
          error: 'Field 2 is required',
        },
        {
          field: createMockTextField('', 'field3'),
          required: false,
          error: 'Field 3 is required',
        },
      ];

      const result = service.validateForm(fields);

      expect(result.isFormValid).toBe(false);
      expect(result.errorFields.length).toBe(1);
      expect(result.errorFields[0]).toEqual({
        name: 'field2',
        error: 'Field 2 is required',
      });
    });

    it('should return true for form validity when all required fields are valid', () => {
      const fields = [
        {
          field: createMockTextField('value1', 'field1'),
          required: true,
          error: 'Field 1 is required',
        },
        {
          field: createMockTextField('value2', 'field2'),
          required: true,
          error: 'Field 2 is required',
        },
        {
          field: createMockTextField('', 'field3'),
          required: false,
          error: 'Field 3 is required',
        },
      ];

      const result = service.validateForm(fields);

      expect(result.isFormValid).toBe(true);
      expect(result.errorFields.length).toBe(0);
    });

    it('should handle empty field array', () => {
      const result = service.validateForm([]);

      expect(result.isFormValid).toBe(true);
      expect(result.errorFields.length).toBe(0);
    });
  });

  describe('validateFieldLength', () => {
    it('should return valid for empty fields', () => {
      expect(service.validateFieldLength('')).toEqual({ isValid: true });
      expect(service.validateFieldLength('   ')).toEqual({ isValid: true });
      expect(service.validateFieldLength(null as any)).toEqual({
        isValid: true,
      });
      expect(service.validateFieldLength(undefined as any)).toEqual({
        isValid: true,
      });
    });

    it('should validate minimum length', () => {
      expect(service.validateFieldLength('abc', { minLength: 2 })).toEqual({
        isValid: true,
      });
      expect(service.validateFieldLength('a', { minLength: 2 })).toEqual({
        isValid: false,
        errorType: 'minLength',
      });
    });

    it('should validate maximum length', () => {
      expect(service.validateFieldLength('abc', { maxLength: 5 })).toEqual({
        isValid: true,
      });
      expect(service.validateFieldLength('abcdef', { maxLength: 5 })).toEqual({
        isValid: false,
        errorType: 'maxLength',
      });
    });

    it('should validate both min and max length', () => {
      expect(
        service.validateFieldLength('abc', { minLength: 2, maxLength: 5 }),
      ).toEqual({ isValid: true });
      expect(
        service.validateFieldLength('a', { minLength: 2, maxLength: 5 }),
      ).toEqual({
        isValid: false,
        errorType: 'minLength',
      });
      expect(
        service.validateFieldLength('abcdef', { minLength: 2, maxLength: 5 }),
      ).toEqual({
        isValid: false,
        errorType: 'maxLength',
      });
    });

    it('should trim the input before validation', () => {
      expect(
        service.validateFieldLength('  abc  ', { minLength: 2, maxLength: 5 }),
      ).toEqual({ isValid: true });
      expect(
        service.validateFieldLength('  a  ', { minLength: 2, maxLength: 5 }),
      ).toEqual({
        isValid: false,
        errorType: 'minLength',
      });
    });
  });

  describe('validateAlphanumeric', () => {
    it('should return valid for empty fields', () => {
      expect(service.validateAlphanumeric('')).toEqual({ isValid: true });
      expect(service.validateAlphanumeric('   ')).toEqual({ isValid: true });
      expect(service.validateAlphanumeric(null as any)).toEqual({
        isValid: true,
      });
      expect(service.validateAlphanumeric(undefined as any)).toEqual({
        isValid: true,
      });
    });

    it('should validate alphanumeric characters without spaces', () => {
      expect(service.validateAlphanumeric('abc123')).toEqual({ isValid: true });
      expect(service.validateAlphanumeric('ABC123')).toEqual({ isValid: true });
      expect(service.validateAlphanumeric('abc 123')).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('abc-123')).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('abc_123')).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('abc@123')).toEqual({
        isValid: false,
      });
    });

    it('should validate alphanumeric characters with spaces when allowSpaces is true', () => {
      expect(service.validateAlphanumeric('abc 123', true)).toEqual({
        isValid: true,
      });
      expect(service.validateAlphanumeric('ABC 123', true)).toEqual({
        isValid: true,
      });
      expect(service.validateAlphanumeric('abc-123', true)).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('abc_123', true)).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('abc@123', true)).toEqual({
        isValid: false,
      });
    });

    it('should trim the input before validation', () => {
      expect(service.validateAlphanumeric('  abc123  ')).toEqual({
        isValid: true,
      });
      expect(service.validateAlphanumeric('  abc 123  ')).toEqual({
        isValid: false,
      });
      expect(service.validateAlphanumeric('  abc 123  ', true)).toEqual({
        isValid: true,
      });
    });
  });

  describe('clearValidation', () => {
    it('should set invalid property to false', () => {
      const textField = createMockTextField();
      textField.invalid = true;

      service.clearValidation(textField);

      expect(textField.invalid).toBe(false);
    });

    it('should handle null or undefined fields', () => {
      expect(() => {
        service.clearValidation(null as any);
        service.clearValidation(undefined as any);
      }).not.toThrow();
    });
  });
});
