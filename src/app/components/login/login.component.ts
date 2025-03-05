import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
  <div class="login-container">
  <form (ngSubmit)="onSubmit()">
    <div>
      <label for="username">Username:</label>
      <input id="username" formControlName="username" type="text">
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" formControlName="password" type="password">
    </div>
    <button type="submit" [disabled]="loginForm.invalid">Login</button>
  </form>
</div>`,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log('Form Submitted', this.loginForm.value);
    }
  }
}
