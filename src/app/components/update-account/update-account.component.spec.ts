import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateAccountComponent } from './update-account.component';
import { FormService } from '@shared/services/form/form.service';
import { ResetFormEnum } from '@shared/models/reset-form';

// Create mock components to avoid dependency issues
@Component({
  selector: 'app-confirm-cancel-form-container',
  template: '<ng-content></ng-content>',
  standalone: true, // Make sure this is standalone
})
class MockConfirmCancelFormContainerComponent {
  @Input() headerText?: string;
  @Input() acceptButtonText?: string;
  @Input() cancelButtonText?: string;
  @Input() resetButtonText?: string;
  @Input() isFormInvalid?: boolean;
  @Input() isProcessing?: boolean;
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
}

@Component({
  selector: 'app-create-update-account-form',
  template: '<div></div>',
  standalone: true, // Make sure this is standalone
})
class MockCreateUpdateAccountFormComponent {
  @Input() isUpdate?: boolean;
}

describe('UpdateAccountComponent', () => {
  let component: UpdateAccountComponent;
  let fixture: ComponentFixture<UpdateAccountComponent>;
  let formService: jasmine.SpyObj<FormService>;
  let router: jasmine.SpyObj<Router>;
  let mockConfirmCancelContainer: MockConfirmCancelFormContainerComponent;

  beforeEach(async () => {
    // Create spies for the dependencies
    const formServiceSpy = jasmine.createSpyObj('FormService', [
      'confirmForm',
      'resetForm',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock ActivatedRoute
    const activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap({}),
        queryParamMap: convertToParamMap({}),
      },
      paramMap: of(convertToParamMap({})),
      queryParamMap: of(convertToParamMap({})),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FormService, useValue: formServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    TestBed.overrideComponent(UpdateAccountComponent, {
      set: {
        imports: [
          MockConfirmCancelFormContainerComponent,
          MockCreateUpdateAccountFormComponent,
        ],
      },
    });

    formService = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UpdateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Get reference to the mock container component
    const containerDebugElement = fixture.debugElement.query(
      By.directive(MockConfirmCancelFormContainerComponent),
    );
    mockConfirmCancelContainer = containerDebugElement?.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct inputs on the confirm-cancel-form-container', () => {
    expect(mockConfirmCancelContainer).toBeTruthy();
    expect(mockConfirmCancelContainer.headerText).toBe('Update account');
    expect(mockConfirmCancelContainer.acceptButtonText).toBe('Update account');
    expect(mockConfirmCancelContainer.cancelButtonText).toBe('Cancel');
    expect(mockConfirmCancelContainer.resetButtonText).toBe('Reset form');
    expect(mockConfirmCancelContainer.isFormInvalid).toBe(false);
    expect(mockConfirmCancelContainer.isProcessing).toBe(false);
  });

  it('should set isUpdate to true on the create-update-account-form', () => {
    const accountFormDebugElement = fixture.debugElement.query(
      By.directive(MockCreateUpdateAccountFormComponent),
    );
    expect(accountFormDebugElement).toBeTruthy();
    const accountFormComponent = accountFormDebugElement.componentInstance;
    expect(accountFormComponent.isUpdate).toBe(true);
  });

  describe('onCreateAccount', () => {
    it('should call formService.confirmForm with the correct enum value', () => {
      // Act
      component.onCreateAccount();

      // Assert
      expect(formService.confirmForm).toHaveBeenCalledTimes(1);
      expect(formService.confirmForm).toHaveBeenCalledWith(
        ResetFormEnum.ACCOUNT_FORM,
      );
    });

    it('should be called when accept event is emitted from container', () => {
      // Arrange
      spyOn(component, 'onCreateAccount');

      // Act
      mockConfirmCancelContainer.accept.emit();

      // Assert
      expect(component.onCreateAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('onCancel', () => {
    it('should navigate to the /app route', () => {
      // Act
      component.onCancel();

      // Assert
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/app']);
    });

    it('should be called when cancel event is emitted from container', () => {
      // Arrange
      spyOn(component, 'onCancel');

      // Act
      mockConfirmCancelContainer.cancel.emit();

      // Assert
      expect(component.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('onReset', () => {
    it('should call formService.resetForm with the correct enum value', () => {
      // Act
      component.onReset();

      // Assert
      expect(formService.resetForm).toHaveBeenCalledTimes(1);
      expect(formService.resetForm).toHaveBeenCalledWith(
        ResetFormEnum.ACCOUNT_FORM,
      );
    });

    it('should be called when reset event is emitted from container', () => {
      // Arrange
      spyOn(component, 'onReset');

      // Act
      mockConfirmCancelContainer.reset.emit();

      // Assert
      expect(component.onReset).toHaveBeenCalledTimes(1);
    });
  });
});
