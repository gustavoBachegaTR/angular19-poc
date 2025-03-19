import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SafAlert,
  SafButton,
  SafFooter,
  SafListboxOption,
  SafMenuItem,
  SafProductHeader,
  SafSearchField,
  SafSelect,
  SafSideNav,
  SafSrOnly,
  SafText,
  SafTextarea,
  SafTextfield,
  SafToolbar,
  SafTooltip,
  SafDivider,
  SafEmptyState,
} from '@saffron/core-components';
import { SafAlert, SafButton, SafFooter, SafListboxOption, SafMenuItem, SafProductHeader, SafSearchField, SafSelect, SafSideNav, SafSrOnly, SafText, SafTextarea, SafTextfield, SafToolbar, SafTooltip, SafCard, SafBadge, SafRadio, SafRadioGroup, SafIcon, SafStatus } from '@saffron/core-components';

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
SafDivider();
SafEmptyState();
SafCard();
SafBadge();
SafRadio();
SafRadioGroup();
SafIcon();
SafStatus();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
})
export class AppComponent {}
