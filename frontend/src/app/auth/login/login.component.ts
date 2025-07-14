import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  isCheckingAuth = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.pipe(take(1)).subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate(['/dashboard']);
      } else {
        this.isCheckingAuth = false;
      }
    });
  }

  login() {
    this.error = '';
    this.authService
      .login(this.username, this.password)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.error = err.error?.message || 'Login failed';
      });
  }
}
