import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WjGridModule, WjFlexGrid } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { CollectionView } from '@grapecity/wijmo';
import { FlexGridXlsxConverter } from '@grapecity/wijmo.grid.xlsx';
import { AccountFeature } from 'src/app/shared/models/account/account-features.model';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-account-features-grid',
  templateUrl: './account-features-grid.component.html',
  styleUrls: ['./account-features-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, WjGridModule, WjGridFilterModule],
})
export class AccountFeaturesGridComponent implements OnInit, AfterViewInit {
  @Input() data!: CollectionView<AccountFeature>;
  @ViewChild('flex', { static: false }) flexGrid!: WjFlexGrid;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.flexGrid) {
      let col = this.flexGrid.columns.getColumn('id');
      if (col) {
        col.width = '10*';
      }
      col = this.flexGrid.columns.getColumn('displayName');
      if (col) {
        col.width = '22.5*';
      }
      col = this.flexGrid.columns.getColumn('ofs.name');
      if (col) {
        col.width = '22.5*';
      }
      col = this.flexGrid.columns.getColumn('status');
      if (col) {
        col.width = '22.5*';
      }
      col = this.flexGrid.columns.getColumn('isVisible');
      if (col) {
        col.width = '22.5*';
      }
    }
  }

  exportToExcel(): void {
    if (this.flexGrid) {
      FlexGridXlsxConverter.save(
        this.flexGrid,
        { includeColumnHeaders: true },
        'export.xlsx',
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge badge-green';
      case 'Canceled':
        return 'badge badge-red';
      case 'Trial':
        return 'badge badge-orange';
      default:
        return '';
    }
  }

  toggleAdminDisplay(item: any) {
    item.isVisible = !item.isVisible;
  }
}
