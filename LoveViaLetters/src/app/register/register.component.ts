import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  fullName: string = "";
  email: string = "";
  password: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(private router: Router) {

  }

  createProfile() {
    console.log("Profile Name: ", this.fullName);
    console.log("Email ", this.email);
    console.log("password", this.password);

    if (this.fullName != "" && !this.emailRegex.test(this.email) && this.password != "" ) {
      this.router.navigate(["/"]);
    }

    
  }
}
