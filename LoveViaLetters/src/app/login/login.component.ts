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
  

  constructor(private router: Router, private authService: AuthService) {

  }

  showLogin() {

    if (!this.emailRegex.test(this.email)) {
      console.log("Invalid email format");
      console.log("Is user logged in: ", this.authService.isLoggedIn);
      // You can also display a message to the user indicating that the email format is invalid
      return; // Exit the method if email format is invalid
    } else {
      console.log("User Email: ", this.email);
      console.log("User Password: ", this.password);
      this.authService.isLoggedIn = true;
      console.log("Is user logged in: ",this.authService.isLoggedIn);
      this.router.navigate(["/"]);
    }
  }

  logUserOut() {
    this.authService.isLoggedIn = false;
  }
}
