import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { CollectionView } from '@grapecity/wijmo';
import { CommonModule } from '@angular/common';
import { AccountFeaturesGridComponent } from './account-features-grid/account-features-grid.component';

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
  data!: CollectionView;
  searchValue = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAccountFeature().subscribe((response) => {
      console.log('Data received:', response);
      this.data = new CollectionView(response[0].row);
    });
  }

  exportToExcel(): void {
    if (this.accountFeaturesGrid) {
      this.accountFeaturesGrid.exportToExcel();
    }
  }

  searchFilter(event: any): void {
    const value = (event.target?.value || '').toLowerCase().trim();
    this.data.filter = (item: any) => {
      return (
        item.id.toString().includes(value) ||
        (item.displayName || '').toLowerCase().includes(value) ||
        (item.status || '').toLowerCase().includes(value) ||
        (item.ofs?.name || '').toLowerCase().includes(value) ||
        (item.isVisible ? 'yes' : 'no').includes(value)
      );
    };
    this.data.refresh();
  }
}
