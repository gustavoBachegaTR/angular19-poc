import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<div class="container">
  <nav class="nav">
    <a routerLink="/login">Login</a>
    <a routerLink="/account">Account</a>
  </nav>
</div>

<router-outlet />`,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule]
})
export class AppComponent {}
