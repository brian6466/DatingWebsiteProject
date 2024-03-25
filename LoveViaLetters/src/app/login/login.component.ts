import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: String = "";
  password: String = "";

  constructor(private router: Router) {

  }

  showLogin() {

    console.log("User Email: ", this.email);
    console.log("User Password: ", this.password);
  }


}
