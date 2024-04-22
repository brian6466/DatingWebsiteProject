import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BannedService } from '../shared/banned.service';
import { Subscription } from 'rxjs';
import { UserFirebaseService } from '../shared/userFirebase.service';
import { UserProfileInterface } from '../interfaces/userProfile.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {

  banned: boolean = false;
  admin: boolean = false;
  user: any;
  private subscription: Subscription;

  constructor(private router: Router, public authService: AuthService, private bannedService: BannedService, private firebaseService: UserFirebaseService) {
    this.subscription = this.bannedService.buttonClick$.subscribe(() => {
      this.handleButtonClick();
    });

    
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleButtonClick() {
    console.log("Header ban var: ", this.bannedService.isBanned())
    console.log("User being checked: ", this.authService.getUid())
    //this.banned = this.bannedService.checkBan(this.authService.getUid())
    this.banned = this.bannedService.isBanned()
    console.log("Admin status header ", this.admin)
    this.admin = this.bannedService.isAdmin()
    console.log("header ban status, ", this.banned);
    console.log("header admin, ", this.admin)
  }

  logOut() {
    this.authService.logout();
  }

}
