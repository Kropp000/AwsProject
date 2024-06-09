import { Component } from '@angular/core';
import {AuthenticationRequest} from "../../models/authentication-request";
import {AuthenticationResponse} from "../../models/authentication-response";
import {AuthenticationService} from "../../serives/authentication.service";
import {Router} from "@angular/router";
import {VerificationRequest} from "../../models/verification-request";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  authenticate() {
    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          this.authResponse = response;
          if (!this.authResponse.tfaEnabled) {
            localStorage.setItem('token', response.token as string);
            this.router.navigate([response.role === "USER" ? 'home' : 'admin']);
          }
        },
        error: (err) => {
          switch (err.status) {
            case 403:
              this.errorMessage = "User with this email and password doesn't exist. Please check your credentials and try again."
              break;
            case 404:
              this.errorMessage = "Service is currently unaccessable. Please try again later."
              break;
            default:
              this.errorMessage = 'An error occurred during login.';
              break;
          }
        }
      });
  }

  verifyCode() {
    const verifyRequest: VerificationRequest = {
      email: this.authRequest.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token as string);
          console.log(response.role);
          this.router.navigate([response.role === "USER" ? 'home' : 'admin']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.message || 'An error occurred during verification.';
        }
      });
  }
}
