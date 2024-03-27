import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


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

  constructor(private router: Router) {

  }

  showLogin() {

    if (!this.emailRegex.test(this.email)) {
      console.log("Invalid email format");
      // You can also display a message to the user indicating that the email format is invalid
      return; // Exit the method if email format is invalid
    } else {
      console.log("User Email: ", this.email);
      console.log("User Password: ", this.password);
      this.router.navigate(["/"]);
    }
  }
}
