import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Signal, signal } from '@angular/core';
import { HttpLoginService } from '@app/serviceshttp/http-login.service';
import { LoginState } from '@app/state/login.state';
import { UserSelect } from '@app/shared/models/user-select';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-user-select-view',
  imports: [CommonModule],
  providers: [LoginState, HttpLoginService],
  templateUrl: './user-select-view.component.html',
  styleUrl: './user-select-view.component.scss'
})
export class UserSelectViewComponent {
  loginState = inject(LoginState);
  unselectedUser = signal<boolean>(false);
  selectedValue?: string = '';
  validationMessage = signal<string>('');
  filteredUsers = signal<UserSelect[]>([]);
  users : Signal<UserSelect[]> = computed(() => {
    return this.loginState.loginUsersResource.value();
  }
  );

  constructor(){
    this.loginState.loginUsersResource.reload();
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
