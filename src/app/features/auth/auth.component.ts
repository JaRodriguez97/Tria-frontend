import { Component, OnInit } from '@angular/core';
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
export class AuthComponent implements OnInit {
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

  ngOnInit(): void {
    this.authService.clearSession();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isAuthenticating = true;
      this.loginError = false;

      const cred = this.loginForm.get('credencial')?.value;
      const pwd = this.loginForm.get('password')?.value;

      this.authService.login(cred, pwd).subscribe({
        next: (success) => {
          this.isAuthenticating = false;
          if (success) {
            this.router.navigate(['/app/inicio']);
          } else {
            this.loginError = true;
          }
        },
        error: () => {
          this.isAuthenticating = false;
          this.loginError = true;
        },
      });
    }
  }
}
