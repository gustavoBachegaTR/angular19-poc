import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, model, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralItem } from '../../models/general-item';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('menu', { static: false }) menu: any;
  @ViewChild('trigger', { static: false }) trigger: any;
  @Input() label!: string;
  @Input() appearance: 'secondary' | 'primary' | 'tertiary' = 'secondary';
  @Input() items!: Array<GeneralItem>;
  @Output() itemSelected = new EventEmitter<GeneralItem>();
  open = model(false);
  triggerBtn: HTMLElement | null = null;
  clickOutsideHandler: any;


  ngOnInit() {
    this.clickOutsideHandler = this.handleClickOutside.bind(this);
    document.addEventListener('click', this.clickOutsideHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  ngAfterViewInit(): void {
    // Identify the button within chip as it is the focused element.
    this.triggerBtn =
      this.trigger.nativeElement.shadowRoot.querySelector('.control');
  }

  clickHandler() {
    this.open.update((v) => !v);
    if (this.open()) {
      setTimeout(() => {
        this.menu.nativeElement.focus();
      });
    }
  }

  closeMenu() {
    this.open.set(false);
    setTimeout(() => {
      this.triggerBtn?.focus();
    });
  }

  handleClickOutside(event: MouseEvent) {
    if (this.trigger.nativeElement.contains(event.target)) {
      // If the event target is the button itself, return immediately
      return;
    }

    if (this.open() && !this.menu.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  handleMenuItemKeydown(e: KeyboardEvent, item: GeneralItem) {
    if (e.key === 'Enter') {
      this.handleItemSelected(item);
    } else if (e.key === 'Escape') {
      this.closeMenu();
    }
  }

  handleItemSelected(item: GeneralItem): void {
    this.itemSelected.emit(item);
    this.closeMenu();
  }

  handleTriggerKeydown(e: KeyboardEvent) {
    // The menu can be opened by using the Down Arrow, Up Arrow, Enter key or the Space bar.
    // https://trten.sharepoint.com/sites/intr-digital-accessibility-coe/SitePages/Dropdown---Actions-Menu.aspx#functional-requirements
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      this.open.set(true);
      setTimeout(() => {
        this.menu.nativeElement.focus();
      });
    }
  }
}
