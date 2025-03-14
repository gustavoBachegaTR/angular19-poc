import { Injectable } from '@angular/core';
import {
  SafSelectInstance,
  SafTextAreaInstance,
  SafTextFieldInstance,
} from '@saffron/core-components';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  // Subject to emit reset events
  private resetFormSubject = new Subject<string>();
  private confirmFormSubject = new Subject<string>();

  // Observable that components can subscribe to
  resetForm$ = this.resetFormSubject.asObservable();
  confirmForm$ = this.confirmFormSubject.asObservable();

  // Method to trigger form reset
  resetForm(formId: string): void {
    this.resetFormSubject.next(formId);
  }

  confirmForm(formId: string): void {
    this.confirmFormSubject.next(formId);
  }

  validateField(
    field: SafTextFieldInstance | SafSelectInstance | SafTextAreaInstance,
    isRequired: boolean = false,
  ): boolean {
    if (!field) return false;

    const isEmpty = !field.value || field.value.trim() === '';
    const isInvalid = isRequired && isEmpty;

    return !isInvalid;
  }

  validateForm(
    fields: {
      field: SafTextFieldInstance | SafSelectInstance | SafTextAreaInstance;
      required: boolean;
      error: string;
    }[],
  ): {
    isFormValid: boolean;
    errorFields: Array<{ name: string; error: string }>;
  } {
    let isFormValid = true;
    const errorFields = Array<{ name: string; error: string }>();

    fields.forEach(({ field, required, error }) => {
      const isFieldValid = this.validateField(field, required);
      if (!isFieldValid) {
        isFormValid = false;
        errorFields.push({ name: field.name, error });
      }
    });

    return { isFormValid, errorFields };
  }

  validateFieldLength(
    field: string,
    options: {
      minLength?: number;
      maxLength?: number;
    } = {},
  ): { isValid: boolean; errorType?: 'minLength' | 'maxLength' } {
    if (!field || !field.trim()) {
      return { isValid: true }; // If field is empty, length validation doesn't apply (use validateField for required check)
    }

    const { minLength, maxLength } = options;
    const fieldValue = field.toString().trim();

    // Check minimum length if specified
    if (minLength !== undefined && fieldValue.length < minLength) {
      return { isValid: false, errorType: 'minLength' };
    }

    // Check maximum length if specified
    if (maxLength !== undefined && fieldValue.length > maxLength) {
      return { isValid: false, errorType: 'maxLength' };
    }

    return { isValid: true };
  }

  /**
   * Validates if a field contains only alphanumeric characters (letters and numbers)
   * @param field The field to validate
   * @param allowSpaces Whether to allow spaces in the input (default: false)
   * @returns An object indicating if the field is valid
   */
  validateAlphanumeric(
    field: string,
    allowSpaces: boolean = false,
  ): { isValid: boolean } {
    if (!field || !field.trim()) {
      return { isValid: true }; // Empty field is considered valid for this check
    }

    const fieldValue = field.trim().toString();

    // Regular expression pattern:
    // - If spaces are allowed, use pattern that allows letters, numbers, and spaces
    // - If spaces are not allowed, use pattern that allows only letters and numbers
    const pattern = allowSpaces
      ? /^[a-z0-9\s]*$/i // 'i' flag makes it case insensitive
      : /^[a-z0-9]*$/i; // Only letters and numbers, case insensitive

    return { isValid: pattern.test(fieldValue) };
  }

  clearValidation(
    field: SafTextFieldInstance | SafSelectInstance | SafTextAreaInstance,
  ): void {
    if (field) {
      field.invalid = false;
    }
  }
}
