import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSelectViewComponent } from './user-select-view.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserSelectViewComponent', () => {
  let component: UserSelectViewComponent;
  let fixture: ComponentFixture<UserSelectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSelectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filteredUsers with all users', () => {
    expect(component.filteredUsers()).toEqual(component.users());
  });

  it('should filter users based on search input', () => {
    const event = { target: { control: { value: 'jacobo' } } };
    component.searchFilter(event);
    expect(component.filteredUsers()).toEqual([{ username: 'jacobo', accountName: 'Account name Inc', checked: false }]);
  });

  it('should update selectedValue on user change', () => {
    const event = { target: { value: 'jacobo' } } as unknown as Event;
    component.onUserChange(event);
    expect(component.selectedValue).toBe('jacobo');
  });

  it('should set validation message if no user is selected', () => {
    component.selectedValue = '';
    component.checkUserChecked();
    expect(component.unselectedUser()).toBeTrue();
    expect(component.validationMessage()).toBe('Select one of the options below to continue.');
  });

  it('should clear validation message if a user is selected', () => {
    component.selectedValue = 'jacobo';
    component.checkUserChecked();
    expect(component.unselectedUser()).toBeFalse();
    expect(component.validationMessage()).toBe('');
  });

  it('should reset filteredUsers to all users on clearSearch', () => {
    // Simulate a search to change the filteredUsers
    const event = { target: { control: { value: 'jacobo' } } };
    component.searchFilter(event);
    expect(component.filteredUsers()).toEqual([{ username: 'jacobo', accountName: 'Account name Inc', checked: false }]);

    // Call clearSearch and check if filteredUsers is reset
    component.clearSearch();
    expect(component.filteredUsers()).toEqual(component.users());
  });
});
