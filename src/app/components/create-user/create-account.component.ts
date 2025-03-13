import { Component } from '@angular/core';
import { ConfirmCancelFormContainerComponent } from '../../shared/components/confirm-cancel-form-container/confirm-cancel-form-container.component';
import { CreateUpdateUserFormComponent } from '../../shared/components/create-update-user-form/create-update-user-form.component';
import { FormService } from '../../shared/services/reset-form/form.service';
import { ResetFormEnum } from '../../shared/models/reset-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  imports: [ConfirmCancelFormContainerComponent, CreateUpdateUserFormComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(
    private formService: FormService,
    private router: Router,
  ) {}

  onCreateUser(): void {
    this.formService.confirmForm(ResetFormEnum.ACCOUNT_FORM);
  }

  onCancel(): void {
    console.log('Canceling user creation...');
    this.router.navigate(['/app']);
  }

  onReset(): void {
    this.formService.resetForm(ResetFormEnum.ACCOUNT_FORM);
  }
}
