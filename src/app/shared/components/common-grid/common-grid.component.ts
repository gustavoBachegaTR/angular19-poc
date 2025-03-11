import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';
import { WjFlexGrid, WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-common-grid',
  template: `
  <wj-flex-grid #flex [itemsSource]="data" style="height: 500px;"> 
  <wj-flex-grid-column [header]="'Country'" [binding]="'country'">
      <ng-template wjFlexGridCellTemplate [cellType]="'Cell'" let-cell="cell">
          Template: 
          {{cell.item.country}}
      </ng-template>
    </wj-flex-grid-column> 
    <wj-flex-grid-column [header]="'Sales'" [binding]="'sales'" format="n2"></wj-flex-grid-column> 
    <wj-flex-grid-column [header]="'Expenses'" [binding]="'expenses'" format="n2"></wj-flex-grid-column> 
  </wj-flex-grid> 
`,
  imports: [RouterModule, WjGridModule, CommonModule],
})
export class CommonGridComponent {
  @Input() data!: any[];
  @Input() columns!: any[];
  @Input() columnsTemplateRef!: any[];
  @ViewChild('flex') flex!: WjFlexGrid;
}
