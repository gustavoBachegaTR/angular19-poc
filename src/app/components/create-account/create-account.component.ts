import { Component } from '@angular/core';
import { ConfirmCancelFormContainerComponent } from '@shared/components/confirm-cancel-form-container/confirm-cancel-form-container.component';
import { FormService } from '@shared/services/form/form.service';
import { ResetFormEnum } from '@shared/models/reset-form';
import { Router } from '@angular/router';
import { CreateUpdateAccountFormComponent } from '@app/shared/components/create-update-account-form/create-update-account-form.component';

@Component({
  selector: 'app-create-account',
  imports: [ConfirmCancelFormContainerComponent, CreateUpdateAccountFormComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(
    private formService: FormService,
    private router: Router,
  ) {}

  onCreateAccount(): void {
    this.formService.confirmForm(ResetFormEnum.ACCOUNT_FORM);
  }

  onCancel(): void {
    this.router.navigate(['/app']);
  }

  onReset(): void {
    this.formService.resetForm(ResetFormEnum.ACCOUNT_FORM);
  }
}