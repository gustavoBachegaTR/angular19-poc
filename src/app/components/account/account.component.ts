import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RouterModule } from '@angular/router';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { CommonGridComponent } from '../../shared/components/common-grid/common-grid.component';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-account',
  template: `
  <app-common-grid [data]="data" [columns]="columns">
  </app-common-grid>

  `,
  imports: [RouterModule, CommonGridComponent, WjGridModule]
})
export class AccountComponent implements OnInit {
  @ViewChild('columnsTemplate') columnsTemplateRef!: any;
  data!: any[];
  columns: any[] = [
    { header: 'Country', binding: 'country' },
    { header: 'Sales', binding: 'sales', format: 'n2' },
    { header: 'Expenses', binding: 'expenses', format: 'n2' }
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    console.log('AccountComponent initialized');
    this.dataService.getData().subscribe(data => {
      this.data = data;
    });
  }
}
