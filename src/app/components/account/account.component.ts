import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  template: `<!-- <app-common-grid [data]="data" [columns]="columns"></app-common-grid> -->
              <h1>Hello assdsa</h1>`,
  imports: [RouterModule]
})
export class AccountComponent implements OnInit {
  data!: any[];
  columns: any[] = [
    { header: 'Country', binding: 'country' },
    { header: 'Sales', binding: 'sales', format: 'n2' },
    { header: 'Expenses', binding: 'expenses', format: 'n2' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    console.log('AccountComponent initialized');
    this.dataService.getData().subscribe(data => {
      this.data = data;
    });
  }
}
