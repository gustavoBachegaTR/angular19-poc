import { Component } from '@angular/core';
import { ConfirmCancelFormContainerComponent } from '@shared/components/confirm-cancel-form-container/confirm-cancel-form-container.component';
import { FormService } from '@shared/services/form/form.service';
import { Router } from '@angular/router';
import { ResetFormEnum } from '@shared/models/reset-form';
import { CreateUpdateAccountFormComponent } from '@app/shared/components/create-update-account-form/create-update-account-form.component';

@Component({
  selector: 'app-update-account',
  imports: [ConfirmCancelFormContainerComponent, CreateUpdateAccountFormComponent],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.scss',
})
export class UpdateAccountComponent {
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
