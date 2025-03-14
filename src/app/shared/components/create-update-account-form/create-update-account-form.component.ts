import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormService } from '@shared/services/form/form.service';
import { Subscription, of } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import {
  SafSelectInstance,
  SafTextAreaInstance,
  SafTextFieldInstance,
} from '@saffron/core-components';
import { ResetFormEnum } from '@shared/models/reset-form';
import { DataService } from '@shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormField,
  FormValidationConfig,
} from '@shared/models/account/create-update-account.model';
import { Account } from '@shared/models/account/account.model';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-create-update-account-form',
  imports: [],
  templateUrl: './create-update-account-form.component.html',
  styleUrl: './create-update-account-form.component.scss',
})
export class CreateUpdateAccountFormComponent implements OnInit, OnDestroy {
  @Input() isUpdate = false;

  // Form fields
  @ViewChild('firmNameInput') firmNameInput!: ElementRef<SafTextFieldInstance>;
  @ViewChild('accountUserPrefixInput')
  accountUserPrefixInput!: ElementRef<SafTextFieldInstance>;
  @ViewChild('unitNumberInput')
  unitNumberInput!: ElementRef<SafTextFieldInstance>;
  @ViewChild('platformAccountNumberInput')
  platformAccountNumberInput!: ElementRef<SafTextFieldInstance>;
  @ViewChild('accountTypeSelect')
  accountTypeSelect!: ElementRef<SafSelectInstance>;
  @ViewChild('firmIndicatorSelect')
  firmIndicatorSelect!: ElementRef<SafSelectInstance>;
  @ViewChild('notesInput') notesInput!: ElementRef<SafTextAreaInstance>;

  formErrors: { [key: string]: string } = {};
  private subscriptions = new Subscription();
  private accountId: string | null = null;

  constructor(
    private formService: FormService,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initFormSubscriptions();

    if (this.isUpdate) {
      this.initUpdateMode();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Form validation and submission
  confirmForm(): void {
    // First run standard form validation
    if (!this.validateForm()) {
      return;
    }

    const unitNumber = this.unitNumberInput.nativeElement.value;

    // If unit number is empty, no need to validate uniqueness
    if (!unitNumber) {
      this.processFormSubmission();
      return;
    }

    // Check if we need to validate unit number uniqueness
    if (this.isUpdate && this.accountId) {
      // For updates, first check if unit number has changed
      this.dataService
        .getAccount(this.accountId)
        .pipe(
          take(1),
          switchMap((account) => {
            // If unit number hasn't changed, no need to validate uniqueness
            if (account.riaCustomerNumber === unitNumber) {
              return of(true); // Skip validation
            }
            // Otherwise check if the new unit number is unique
            return this.dataService.isUniqueUnitNumber(unitNumber);
          }),
        )
        .subscribe({
          next: (isUnique) => {
            if (isUnique) {
              this.processFormSubmission();
            } else {
              this.formErrors['UnitNumber'] = 'Unit number must be unique.';
            }
          },
          error: (error) => {
            console.error('Error validating unit number uniqueness', error);
            this.formErrors['UnitNumber'] =
              'Error validating unit number. Please try again.';
          },
        });
    } else {
      // For new accounts, always validate unit number uniqueness
      this.dataService
        .isUniqueUnitNumber(unitNumber)
        .pipe(take(1))
        .subscribe({
          next: (isUnique) => {
            if (isUnique) {
              this.processFormSubmission();
            } else {
              this.formErrors['UnitNumber'] = 'Unit number must be unique.';
            }
          },
          error: (error) => {
            console.error('Error validating unit number uniqueness', error);
            this.formErrors['UnitNumber'] =
              'Error validating unit number. Please try again.';
          },
        });
    }
  }

  // Helper method to process the form submission after all validations pass
  private processFormSubmission(): void {
    const formData = this.collectFormData();

    if (this.isUpdate && this.accountId) {
      this.updateAccount(formData);
    } else {
      this.createAccount(formData);
    }
  }

  // Form field validation handlers
  onValueChange(config: FormValidationConfig): void {
    const { event, minLength, maxLength, isOnlyAlphaNumeric } = config;
    const inputElement = event.target as HTMLInputElement;

    // Clear previous error for this field
    this.clearFieldError(inputElement.name);

    // Perform validations in sequence
    if (!this.validateLength({ inputElement, minLength, maxLength })) {
      return;
    }

    if (isOnlyAlphaNumeric && !this.validateCharacters(inputElement)) {
      return;
    }
  }

  unitNumberExists(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value) return;

    if (this.isUpdate) {
      this.checkUnitNumberForUpdate(inputElement);
    } else {
      this.validateUnitNumber(inputElement);
    }
  }

  // Private methods
  private initFormSubscriptions(): void {
    // Subscribe to form reset events
    const resetSub = this.formService.resetForm$
      .pipe(filter((formId) => formId === ResetFormEnum.ACCOUNT_FORM))
      .subscribe(() => this.resetForm());

    // Subscribe to form confirm events
    const confirmSub = this.formService.confirmForm$
      .pipe(filter((formId) => formId === ResetFormEnum.ACCOUNT_FORM))
      .subscribe(() => this.confirmForm());

    this.subscriptions.add(resetSub);
    this.subscriptions.add(confirmSub);
  }

  private initUpdateMode(): void {
    const routeSub = this.route.params
      .pipe(
        take(1),
        tap((params) => (this.accountId = params['id'])),
        filter((params) => !!params['id']),
        tap(() => this.preloadForm()),
      )
      .subscribe();

    this.subscriptions.add(routeSub);
  }

  private checkUnitNumberForUpdate(inputElement: HTMLInputElement): void {
    if (!this.accountId) return;

    const accountSub = this.dataService
      .getAccount(this.accountId)
      .pipe(
        take(1),
        tap((account) => {
          // If the unit number hasn't changed, no need to validate
          if (account.riaCustomerNumber !== inputElement.value) {
            this.validateUnitNumber(inputElement);
          }
        }),
      )
      .subscribe();

    this.subscriptions.add(accountSub);
  }

  private validateUnitNumber(inputElement: HTMLInputElement): void {
    const unitSub = this.dataService
      .isUniqueUnitNumber(inputElement.value)
      .pipe(
        take(1),
        tap((isUnique) => {
          if (!isUnique) {
            this.formErrors[inputElement.name] = 'Unit number must be unique.';
          }
        }),
      )
      .subscribe();

    this.subscriptions.add(unitSub);
  }

  private validateForm(): boolean {
    if (Object.keys(this.formErrors).length > 0) {
      return false;
    }

    // Clear previous errors
    this.formErrors = {};

    const fieldsToValidate = this.getFieldsToValidate();
    const validatedForm = this.formService.validateForm(fieldsToValidate);

    validatedForm.errorFields.forEach((field) => {
      this.formErrors[field.name] = field.error;
    });

    return validatedForm.isFormValid;
  }

  private validateCharacters(inputElement: HTMLInputElement): boolean {
    const { label } = inputElement as unknown as SafTextFieldInstance;
    const fieldLabel = label || 'This field';

    if (!this.formService.validateAlphanumeric(inputElement.value).isValid) {
      this.formErrors[inputElement.name] =
        `${fieldLabel} must be alphanumeric.`;
      return false;
    }
    return true;
  }

  private validateLength(config: {
    inputElement: HTMLInputElement;
    minLength?: number;
    maxLength?: number;
  }): boolean {
    const { inputElement, minLength, maxLength } = config;
    const validatedLength = this.formService.validateFieldLength(
      inputElement.value,
      { minLength, maxLength },
    );

    if (!validatedLength.isValid) {
      const { label } = inputElement as unknown as SafTextFieldInstance;
      const fieldLabel = label || 'This field';

      if (validatedLength.errorType === 'minLength') {
        this.formErrors[inputElement.name] =
          `${fieldLabel} must be at least ${minLength} characters.`;
        return false;
      } else if (validatedLength.errorType === 'maxLength') {
        this.formErrors[inputElement.name] =
          `${fieldLabel} must be less than ${maxLength} characters.`;
        return false;
      }
    }
    return true;
  }

  private preloadForm(): void {
    if (!this.accountId) return;

    const accountSub = this.dataService
      .getAccount(this.accountId)
      .pipe(
        take(1),
        tap((account) => this.populateFormWithAccount(account)),
      )
      .subscribe();

    this.subscriptions.add(accountSub);
  }

  private resetForm(): void {
    this.formErrors = {};

    if (this.isUpdate) {
      this.preloadForm();
      return;
    }

    this.clearFormFields();
  }

  private clearFieldError(fieldName: string): void {
    const { [fieldName]: _, ...rest } = this.formErrors;
    this.formErrors = rest;
  }

  private getFieldsToValidate(): FormField[] {
    return [
      {
        field: this.firmNameInput.nativeElement,
        error: 'Firm name is required',
        required: true,
      },
      {
        field: this.accountUserPrefixInput.nativeElement,
        error: 'Account user prefix is required',
        required: true,
      },
      {
        field: this.unitNumberInput.nativeElement,
        error: '',
        required: false,
      },
      {
        field: this.platformAccountNumberInput.nativeElement,
        error: '',
        required: false,
      },
      {
        field: this.accountTypeSelect.nativeElement,
        error: 'Account type is required',
        required: true,
      },
      {
        field: this.firmIndicatorSelect.nativeElement,
        error: '',
        required: false,
      },
      {
        field: this.notesInput.nativeElement,
        error: '',
        required: false,
      },
    ];
  }

  private populateFormWithAccount(account: Account): void {
    this.firmNameInput.nativeElement.value = account.firmName || '';
    this.accountUserPrefixInput.nativeElement.value = account.name || '';
    this.unitNumberInput.nativeElement.value = account.riaCustomerNumber || '';
    this.platformAccountNumberInput.nativeElement.value =
      account.sapCustomerNumber || '';
    this.accountTypeSelect.nativeElement.value =
      account.sourceInfos?.[0]?.id?.toString() || '';
    this.firmIndicatorSelect.nativeElement.value =
      account.accountExt?.accountType?.toLowerCase() || '';
    this.notesInput.nativeElement.value = account.notes || '';
  }

  private clearFormFields(): void {
    this.firmNameInput.nativeElement.value = '';
    this.accountUserPrefixInput.nativeElement.value = '';
    this.unitNumberInput.nativeElement.value = '';
    this.platformAccountNumberInput.nativeElement.value = '';
    this.accountTypeSelect.nativeElement.value = '';
    this.firmIndicatorSelect.nativeElement.value = '';
    this.notesInput.nativeElement.value = '';
  }

  private collectFormData(): Partial<Account> {
    return {
      firmName: this.firmNameInput.nativeElement.value,
      name: this.accountUserPrefixInput.nativeElement.value,
      riaCustomerNumber: this.unitNumberInput.nativeElement.value,
      sapCustomerNumber: this.platformAccountNumberInput.nativeElement.value,
      sourceInfos: [
        { id: parseInt(this.accountTypeSelect.nativeElement.value, 10) },
      ],
      accountExt: {
        accountType: this.firmIndicatorSelect.nativeElement.value.toUpperCase(),
      },
      notes: this.notesInput.nativeElement.value,
    };
  }

  private createAccount(formData: Partial<Account>): void {
    // Implementation for creating account
    this.dataService
      .createAccount(formData)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log('Account created successfully', response);
          // Handle success (e.g., show notification, navigate)
        },
        error: (error) => {
          console.error('Error creating account', error);
          // Handle error
        },
      });
  }

  private updateAccount(formData: Partial<Account>): void {
    if (!this.accountId) return;

    // Implementation for updating account
    this.dataService
      .updateAccount(this.accountId, formData)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log('Account updated successfully', response);
          // Handle success
        },
        error: (error) => {
          console.error('Error updating account', error);
          // Handle error
        },
      });
  }
}
