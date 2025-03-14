import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmCancelFormContainerComponent } from './confirm-cancel-form-container.component';
import { CommonHeadingComponent } from '../common-heading/common-heading.component';
import { AnchorButtonComponent } from '../anchor-button/anchor-button.component';

describe('ConfirmCancelFormContainerComponent', () => {
  let component: ConfirmCancelFormContainerComponent;
  let fixture: ComponentFixture<ConfirmCancelFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmCancelFormContainerComponent,
        CommonHeadingComponent,
        AnchorButtonComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // For saf-toolbar and saf-button
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values for input properties', () => {
      expect(component.headerText).toBe('Form');
      expect(component.subHeaderText).toBeUndefined();
      expect(component.isFormInvalid).toBeFalse();
      expect(component.isProcessing).toBeFalse();
      expect(component.acceptButtonText).toBe('Accept');
      expect(component.cancelButtonText).toBe('Cancel');
      expect(component.resetButtonText).toBe('Reset form');
    });

    it('should set input properties correctly', () => {
      component.headerText = 'Custom Header';
      component.subHeaderText = 'Custom Subheader';
      component.isFormInvalid = true;
      component.isProcessing = true;
      component.acceptButtonText = 'Submit';
      component.cancelButtonText = 'Go Back';
      component.resetButtonText = 'Clear';

      fixture.detectChanges();

      expect(component.headerText).toBe('Custom Header');
      expect(component.subHeaderText).toBe('Custom Subheader');
      expect(component.isFormInvalid).toBeTrue();
      expect(component.isProcessing).toBeTrue();
      expect(component.acceptButtonText).toBe('Submit');
      expect(component.cancelButtonText).toBe('Go Back');
      expect(component.resetButtonText).toBe('Clear');
    });
  });

  describe('Event emitters', () => {
    it('should emit accept event when onAccept is called', () => {
      const acceptSpy = spyOn(component.accept, 'emit');

      component.onAccept();

      expect(acceptSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit cancel event when onCancel is called', () => {
      const cancelSpy = spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit reset event when onReset is called', () => {
      const resetSpy = spyOn(component.reset, 'emit');

      component.onReset();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Template rendering', () => {
    it('should render common-heading with correct inputs', () => {
      component.headerText = 'Test Header';
      component.subHeaderText = 'Test Subheader';
      fixture.detectChanges();

      const headingElement = fixture.debugElement.query(
        By.directive(CommonHeadingComponent),
      );
      expect(headingElement).toBeTruthy();

      const headingComponent = headingElement.componentInstance;
      expect(headingComponent.title).toBe('Test Header');
      expect(headingComponent.subtitle).toBe('Test Subheader');
      expect(headingComponent.tertiaryTitle).toBe('* Indicates required field');
    });

    it('should render content in ng-content', () => {
      const hostElement = fixture.nativeElement;
      const formContent = hostElement.querySelector('.form-content');
      expect(formContent).toBeTruthy();
    });

    it('should render saf-toolbar with buttons', () => {
      const toolbar = fixture.nativeElement.querySelector('saf-toolbar');
      expect(toolbar).toBeTruthy();

      const primaryButton = toolbar.querySelector(
        'saf-button[appearance="primary"]',
      );
      expect(primaryButton).toBeTruthy();
      expect(primaryButton.textContent.trim()).toBe(component.acceptButtonText);

      const secondaryButton = toolbar.querySelector(
        'saf-button[appearance="secondary"]',
      );
      expect(secondaryButton).toBeTruthy();
      expect(secondaryButton.textContent.trim()).toBe(
        component.cancelButtonText,
      );
    });

    it('should render anchor-button for reset', () => {
      const anchorButton = fixture.debugElement.query(
        By.directive(AnchorButtonComponent),
      );
      expect(anchorButton).toBeTruthy();

      const anchorButtonComponent = anchorButton.componentInstance;
      expect(anchorButtonComponent.buttonText).toBe(component.resetButtonText);
      expect(anchorButtonComponent.isDisabled).toBe(component.isProcessing);
    });

    it('should disable primary button when form is invalid', () => {
      component.isFormInvalid = true;
      fixture.detectChanges();

      const primaryButton = fixture.nativeElement.querySelector(
        'saf-button[appearance="primary"]',
      );
      expect(primaryButton.disabled).toBeTrue();
    });

    it('should disable primary button when processing', () => {
      component.isProcessing = true;
      fixture.detectChanges();

      const primaryButton = fixture.nativeElement.querySelector(
        'saf-button[appearance="primary"]',
      );
      expect(primaryButton.disabled).toBeTrue();
    });

    it('should disable secondary button when processing', () => {
      component.isProcessing = true;
      fixture.detectChanges();

      const secondaryButton = fixture.nativeElement.querySelector(
        'saf-button[appearance="secondary"]',
      );
      expect(secondaryButton.disabled).toBeTrue();
    });

    it('should disable reset button when processing', () => {
      component.isProcessing = true;
      fixture.detectChanges();

      const anchorButton = fixture.debugElement.query(
        By.directive(AnchorButtonComponent),
      );
      const anchorButtonComponent = anchorButton.componentInstance;
      expect(anchorButtonComponent.isDisabled).toBeTrue();
    });
  });

  describe('Button click events', () => {
    it('should call onAccept when primary button is clicked', () => {
      const acceptSpy = spyOn(component, 'onAccept');

      const primaryButton = fixture.nativeElement.querySelector(
        'saf-button[appearance="primary"]',
      );
      primaryButton.click();

      expect(acceptSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when secondary button is clicked', () => {
      const cancelSpy = spyOn(component, 'onCancel');

      const secondaryButton = fixture.nativeElement.querySelector(
        'saf-button[appearance="secondary"]',
      );
      secondaryButton.click();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when anchor button is clicked', () => {
      const resetSpy = spyOn(component, 'onReset');

      const anchorButton =
        fixture.nativeElement.querySelector('app-anchor-button');
      anchorButton.click();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
