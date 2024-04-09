import { Component, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { UserFirebaseService } from "../shared/userFirebase.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  fullName: string = "";
  email: string = "";
  password: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  registerError: boolean = false;
  errorMessage: string | undefined;
  constructor(private router: Router, private authService: AuthService, private userFirebaseService: UserFirebaseService) {

  }

  registerUser() {
    if (this.fullName != "" && this.emailRegex.test(this.email) && this.password != "") {
      this.authService.register(this.email, this.password, this.fullName).subscribe({
        next: () => {
          this.router.navigate(["create-profile"]);
          this.userFirebaseService.createUser(
            this.fullName,
            this.email,
            this.authService.getUid());
        },
        error: (err) => {
          this.registerError = true
          //TODO: Make this error message appear on the login screen, also look into potential error messages that can happen
          this.errorMessage = err.code;
          console.log(this.errorMessage);
        }
      })
    } else {
      this.registerError = true
    }


  }
}
