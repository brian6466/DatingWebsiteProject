import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  userEmail: string = "";
  reason: string = "";
  banTime: number = 0;

  constructor() {

  }

  banProfile() {
    console.log("Banneded Email: ", this.userEmail);
    console.log("Reason: ", this.reason);
    console.log("BanTime: ", this.banTime);
  }
}
