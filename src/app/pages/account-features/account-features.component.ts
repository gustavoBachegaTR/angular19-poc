import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
  resource,
  computed,
  Signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { CollectionView } from '@grapecity/wijmo';
import { CommonModule } from '@angular/common';
import { AccountFeaturesGridComponent } from './account-features-grid/account-features-grid.component';
import { firstValueFrom } from 'rxjs';
import { AccountFeature } from 'src/app/shared/models/account/account-features.model';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-account-features-page',
  templateUrl: './account-features.component.html',
  styleUrls: ['./account-features.component.scss'],
  imports: [RouterModule, CommonModule, AccountFeaturesGridComponent],
})
export class AccountFeaturesPageComponent implements OnInit {
  @ViewChild('accountFeaturesGrid', { static: false })
  accountFeaturesGrid!: AccountFeaturesGridComponent;

  accountFeaturesResource = resource({
    request: () => ({}),
    loader: async () => {
      const response = await firstValueFrom(
        this.dataService.getAccountFeature(),
      );
      if (!response || !response[0]?.row) {
        return new CollectionView<AccountFeature>([]);
      }
      return new CollectionView<AccountFeature>(response[0].row);
    },
  });

  data: Signal<CollectionView<AccountFeature> | null> = computed(() => {
    const value = this.accountFeaturesResource.value();
    return value && value.sourceCollection?.length > 0 ? value : null;
  });

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  exportToExcel(): void {
    if (this.accountFeaturesGrid) {
      this.accountFeaturesGrid.exportToExcel();
    }
  }

  searchFilter(event: any): void {
    const value = (event.target?.value || '').toLowerCase().trim();
    const currentData = this.data();
    if (!currentData) {
      return;
    }
    currentData.filter = (item: AccountFeature) => {
      return (
        item.id.toString().includes(value) ||
        (item.displayName || '').toLowerCase().includes(value) ||
        (item.status || '').toLowerCase().includes(value) ||
        (item.ofs?.name || '').toLowerCase().includes(value) ||
        (item.isVisible ? 'yes' : 'no').includes(value)
      );
    };
    currentData.refresh();
  }
}
