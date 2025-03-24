import { Component } from '@angular/core';
import { SideNavbarComponent } from '@app/components/side-navbar/side-navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { CreateDomElementService } from '@shared/services/create-dom-element/create-dom-element.service';
import { AlertService } from '@shared/services/alert/alert.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [RouterModule, SideNavbarComponent, FooterComponent, HeaderComponent],
  providers: [
    CreateDomElementService, AlertService
  ]
})
export class MainLayoutComponent {

}
