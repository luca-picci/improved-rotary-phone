import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      console.error('Email or password is missing!');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.router.navigate(['/events']);
        } else {
          console.error("Token not received in response");
        }
      },
      error: (error) => {
        console.error("Login failed", error); // Logga l'errore
      }
    });
  }
}

