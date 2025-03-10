import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { GeneralItem } from '../../shared/models/general-item';
import { AlertService } from '../../shared/services/alert/alert.service';
import { EAlertMessage } from '../../shared/services/alert/alert-messages';
import { SafAppearance } from '../../shared/types/saf-appearance';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-landing',
  imports: [MenuComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private alertService = inject(AlertService);

  menuItems: Array<GeneralItem> = [
    { text: 'Menu item 1', id: 1 },
    { text: 'Menu item 2', id: 2 },
    { text: 'Menu item 3', id: 3 },
  ];

  onItemSelected(item: GeneralItem): void {
    let appearance: SafAppearance;
    switch (item.id) {
      case 1:
        appearance = 'informational';
        break;
      case 2:
        appearance = 'success'
        break;
      case 3:
        appearance = 'error'
        break;
      default:
        appearance = 'warning'
        break;
    }

    this.alertService.showMessage({
      message: item.text,
      appearance: appearance
    })
  }

  onSearch(event: any): void {
    console.log('event', event)
    this.alertService.show(EAlertMessage.DefaultMessage);
  }
}
