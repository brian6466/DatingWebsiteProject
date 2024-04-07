import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private errorMessage: any;


  constructor(private router: Router, private authService: AuthService) {

  }

  showLogin() {

    if (!this.emailRegex.test(this.email)) {
      console.log("Invalid email format");
      return;
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (err) => {
          //TODO: Make this error message appear on the login screen, also look into potential error messages that can happen
          this.errorMessage = err.code;
          console.log(this.errorMessage);
        }
      })
    }
  }

  logUserOut() {

  }
}
