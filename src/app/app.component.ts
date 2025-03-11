import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafAlert, SafFooter, SafMenuItem, SafProductHeader, SafSearchField, SafSideNav, SafSrOnly, SafTooltip } from '@saffron/core-components';

SafSideNav();
SafMenuItem();
SafTooltip();
SafFooter();
SafProductHeader();
SafSrOnly();
SafSearchField();
SafAlert();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule]
})
export class AppComponent { }
