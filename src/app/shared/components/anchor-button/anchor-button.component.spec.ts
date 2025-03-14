import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnchorButtonComponent } from './anchor-button.component';

describe('AnchorButtonComponent', () => {
  let component: AnchorButtonComponent;
  let fixture: ComponentFixture<AnchorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnchorButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // For saf-button
    }).compileComponents();

    fixture = TestBed.createComponent(AnchorButtonComponent);
    component = fixture.componentInstance;

    // Set required input
    component.buttonText = 'Test Button';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should display the button text correctly', () => {
      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.textContent.trim()).toBe('Test Button');

      // Change the button text and verify
      component.buttonText = 'Updated Text';
      fixture.detectChanges();
      expect(buttonElement.textContent.trim()).toBe('Updated Text');
    });

    it('should have isDisabled set to false by default', () => {
      expect(component.isDisabled).toBeFalse();
      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.disabled).toBeFalsy();
    });

    it('should set disabled attribute when isDisabled is true', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.disabled).toBeTrue();
    });
  });

  describe('Button appearance', () => {
    it('should have tertiary appearance', () => {
      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.getAttribute('appearance')).toBe('tertiary');
    });

    it('should have button type', () => {
      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.getAttribute('type')).toBe('button');
    });

    it('should have correct CSS classes', () => {
      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      expect(buttonElement.classList.contains('btn')).toBeTrue();
      expect(
        buttonElement.classList.contains('btn-outline-primary'),
      ).toBeTrue();
    });
  });

  describe('Event emitters', () => {
    it('should emit click event when handleClick is called', () => {
      const clickSpy = spyOn(component.click, 'emit');

      component.handleClick();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit click event when button is clicked', () => {
      const clickSpy = spyOn(component.click, 'emit');

      const buttonElement = fixture.nativeElement.querySelector('saf-button');
      buttonElement.click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
