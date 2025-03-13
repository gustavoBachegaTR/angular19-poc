import {
  SafSelectInstance,
  SafTextAreaInstance,
  SafTextFieldInstance,
} from '@saffron/core-components';

export interface FormField {
  field: SafTextFieldInstance | SafSelectInstance | SafTextAreaInstance;
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
