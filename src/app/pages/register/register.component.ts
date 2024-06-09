import { Component } from '@angular/core';
import {RegisterRequest} from "../../models/register-request";
import {AuthenticationResponse} from "../../models/authentication-response";
import {AuthenticationService} from "../../serives/authentication.service";
import {Router} from "@angular/router";
import {VerificationRequest} from "../../models/verification-request";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  otpCode = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  registerUser() {
    if (!this.registerRequest.firstname || !this.registerRequest.lastname || !this.registerRequest.email || !this.registerRequest.password || !this.registerRequest.role) {
      this.errorMessage = 'All fields must be filled.';
      return;
    }
    else {
      this.errorMessage = '';
    }

    this.message = '';
    this.authService.register(this.registerRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.authResponse = response;
          } else {
            // inform the user
            this.message = 'Account created successfully\nYou will be redirected to the Login page in 3 seconds';
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 3000)
          }
        },
        error: (err) => {
          switch (err.status) {
            case 400:
              this.errorMessage = err.error;
              break;
          
            default:
              this.errorMessage = 'An error occurred during account creation.';
              break;
          }
          
        }
      });

  }

  verifyTfa() {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      email: this.registerRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          this.message = 'Account created successfully\nYou will be redirected to the Welcome page in 3 seconds';
          setTimeout(() => {
            localStorage.setItem('token', response.token as string);
            this.router.navigate([response.role === "USER" ? 'home' : 'admin']);
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred during verification.';
        }
      });
  }
}
