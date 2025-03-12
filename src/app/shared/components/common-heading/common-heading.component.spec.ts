import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonHeadingComponent } from './common-heading.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CommonHeadingComponent', () => {
  let component: CommonHeadingComponent;
  let fixture: ComponentFixture<CommonHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, CommonHeadingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonHeadingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('saf-text[appearance="heading-3xl"]')).nativeElement;
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should display the subtitle if provided', () => {
    component.subtitle = 'Test Subtitle';
    fixture.detectChanges();
    const subtitleElement = fixture.debugElement.query(By.css('.common-heading__subtitle saf-text')).nativeElement;
    expect(subtitleElement.textContent).toContain('Test Subtitle');
  });

  it('should not display the subtitle if not provided', () => {
    component.subtitle = undefined;
    fixture.detectChanges();
    const subtitleElement = fixture.debugElement.query(By.css('.common-heading__subtitle saf-text'));
    expect(subtitleElement).toBeNull();
  });

  it('should display the tertiary title if provided', () => {
    component.tertiaryTitle = 'Test Tertiary Title';
    fixture.detectChanges();
    const tertiaryTitleElement = fixture.debugElement.query(By.css('.common-heading__tertiary saf-text')).nativeElement;
    expect(tertiaryTitleElement.textContent).toContain('Test Tertiary Title');
  });

  it('should not display the tertiary title if not provided', () => {
    component.tertiaryTitle = undefined;
    fixture.detectChanges();
    const tertiaryTitleElement = fixture.debugElement.query(By.css('.common-heading__tertiary saf-text'));
    expect(tertiaryTitleElement).toBeNull();
  });
});