import { Component, Input, ViewChild } from '@angular/core';
import { WjFlexGrid } from '@mescius/wijmo.angular2.grid';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-grid',
  template: `<!-- <wj-flex-grid #flex [itemsSource]="data" [columns]="columns"></wj-flex-grid> -->`,
  imports: [RouterModule]
})
export class CommonGridComponent {
  @Input() data!: any[];
  @Input() columns!: any[];
  @ViewChild('flex') flex!: WjFlexGrid;
}
