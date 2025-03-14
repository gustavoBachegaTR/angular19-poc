import {
  SafSelectInstance,
  SafTextAreaInstance,
  SafTextFieldInstance,
} from '@saffron/core-components';

export type SafField =
  | SafTextFieldInstance
  | SafSelectInstance
  | SafTextAreaInstance;

export interface FormField {
  field: SafField;
  error: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  alphanumericOnly?: boolean;
}

export interface FormValidationConfig {
  event: Event;
  minLength?: number;
  maxLength?: number;
  isOnlyAlphaNumeric?: boolean;
}

export interface FormFieldValidation {
  field: SafField;
  required: boolean;
  error: string;
}

export interface SourceInfo {
  id: number;
  description: string;
  notes: string;
}
