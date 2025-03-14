import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, signal } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-user-select-view',
  imports: [CommonModule],
  templateUrl: './user-select-view.component.html',
  styleUrl: './user-select-view.component.scss'
})
export class UserSelectViewComponent {
  unselectedUser = signal<boolean>(false);
  selectedValue?: string = '';
  validationMessage = signal<string>('');
  filteredUsers = signal<any[]>([]);
  users =  signal([
    { username: 'jacobo', accountName: 'Account name Inc', checked: false },
    { username: 'Username2', accountName: 'Account name Inc', checked: false },
    { username: 'Username3', accountName: 'Account name Inc', checked: false },
    { username: 'clarita', accountName: 'Account name Inc', checked: false },
    { username: 'Username5', accountName: 'Account name Inc', checked: false },
    { username: 'Username6', accountName: 'Account name Inc', checked: false },
    { username: 'Username7', accountName: 'Account name Inc', checked: false },
    { username: 'Username8', accountName: 'Account name Inc', checked: false },
    { username: 'Username9', accountName: 'Account name Inc', checked: false },
  ]);

  constructor(){
    effect(() => {
     if(this.users()){
        this.filteredUsers.set([...this.users()]);
     }
    });
  }

  searchFilter(event: any) {
    const filter = event.target.control.value.toLowerCase();
    const userCopy = [...this.users()];
    this.filteredUsers.set(userCopy.filter(user => user.username.toLowerCase().includes(filter) || user.accountName.toLowerCase().includes(filter)));
  }

  onUserChange (event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.selectedValue = value;
    this.checkUserChecked();
  }

  clearSearch() {
    this.filteredUsers.set([...this.users()]);
  }

  checkUserChecked() {
    if(!this.selectedValue || this.selectedValue === null) {
      this.unselectedUser.set(true);
      this.validationMessage.set('Select one of the options below to continue.');
    } else {
      this.unselectedUser.set(false);
      this.validationMessage.set('');
    }
  }
}
