import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loginForm: FormGroup;
  loginError = false;
  isAuthenticating = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      credencial: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isAuthenticating = true;
      this.loginError = false;

      const pin = this.loginForm.get('password')?.value;

      // Simulate network request
      setTimeout(() => {
        const success = this.authService.login(pin);
        if (success) this.router.navigate(['/app/inicio']);
        else {
          this.loginError = true;
          this.isAuthenticating = false;
        }
      }, 800);
    }
  }
}
