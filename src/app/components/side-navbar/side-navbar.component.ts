import { Component, CUSTOM_ELEMENTS_SCHEMA, model } from '@angular/core';
import { SafSideNavInstance } from '@saffron/core-components';
import { SafSideNav } from '@saffron/core-components';

SafSideNav();
@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SideNavbarComponent {
  show = model<'closed' | 'open'>('closed');
}
