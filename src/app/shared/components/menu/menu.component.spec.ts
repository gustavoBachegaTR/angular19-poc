import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { GeneralItem } from '../../models/general-item';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports:[MenuComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  const mockItems: GeneralItem[] = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' }
  ];

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize open state as false', () => {
    expect(component.open()).toBeFalse();
  });

  it('should add clickOutsideHandler on ngOnInit', () => {
    const spy = spyOn(document, 'addEventListener');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('click', component.clickOutsideHandler);
  });

  it('should remove clickOutsideHandler on ngOnDestroy', () => {
    const spy = spyOn(document, 'removeEventListener');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith('click', component.clickOutsideHandler);
  });

  it('should focus on the menu after opening', () => {
    component.menu = { nativeElement: { focus: jasmine.createSpy() } };
    component.clickHandler();
    setTimeout(() => {
      expect(component.menu.nativeElement.focus).toHaveBeenCalled();
    });
  });

  it('should close the menu and focus on the trigger button', () => {
    component.triggerBtn = { focus: jasmine.createSpy() } as any;
    component.closeMenu();
    setTimeout(() => {
      expect(component.triggerBtn?.focus).toHaveBeenCalled();
    });
  });

  it('should close the menu when clicking outside', () => {
    component.menu = { nativeElement: { contains: jasmine.createSpy().and.returnValue(false) } };
    component.trigger = { nativeElement: { contains: jasmine.createSpy().and.returnValue(false) } };
    const closeMenuSpy = spyOn(component, 'closeMenu');
    component.open.set(true)
    component.handleClickOutside({ target: {} as any } as MouseEvent);
    expect(closeMenuSpy).toHaveBeenCalled();
  });

  it('should handle Enter key press on menu item', () => {
    const mockItem: GeneralItem = { id: 1, text: 'Item 1' };
    const handleItemSelectedSpy = spyOn(component, 'handleItemSelected');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleMenuItemKeydown(event, mockItem);
    expect(handleItemSelectedSpy).toHaveBeenCalledWith(mockItem);
  });

  it('should handle Escape key press and close the menu', () => {
    const closeMenuSpy = spyOn(component, 'closeMenu');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.handleMenuItemKeydown(event, { id: 1, text: 'Item 1' });
    expect(closeMenuSpy).toHaveBeenCalled();
  });

  it('should emit itemSelected on menu item selection', () => {
    const mockItem: GeneralItem = { id: 1, text: 'Item 1' };
    const itemSelectedSpy = spyOn(component.itemSelected, 'emit');
    component.handleItemSelected(mockItem);
    expect(itemSelectedSpy).toHaveBeenCalledWith(mockItem);
  });

  it('should handle ArrowDown or ArrowUp key press and open the menu', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.handleTriggerKeydown(event);
    expect(component.open()).toBeTrue();
  });
});
