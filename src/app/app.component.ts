import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafAlert, SafButton, SafFooter, SafListboxOption, SafMenuItem, SafProductHeader, SafSearchField, SafSelect, SafSideNav, SafSrOnly, SafText, SafTextarea, SafTextfield, SafToolbar, SafTooltip } from '@saffron/core-components';

SafSideNav();
SafMenuItem();
SafTooltip();
SafFooter();
SafProductHeader();
SafSrOnly();
SafSearchField();
SafAlert();
SafText();
SafToolbar();
SafButton();
SafTextfield();
SafSelect();
SafListboxOption();
SafTextarea();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule]
})
export class AppComponent { }
