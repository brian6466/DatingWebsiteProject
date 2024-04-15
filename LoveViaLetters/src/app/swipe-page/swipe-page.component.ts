import {Component, OnInit} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import {UserFirebaseService} from "../shared/userFirebase.service";
import {UserProfileInterface} from "../interfaces/userProfile.interface";
import * as console from "console";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";





@Component({
  selector: 'app-swipe-page',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './swipe-page.component.html',
  styleUrl: './swipe-page.component.css'
})
export class SwipePageComponent implements OnInit{


  profiles: UserProfileInterface[] = [];
  currentProfileIndex: number = 0;
  profileData: UserProfileInterface | null = null;

  constructor(private firebaseService: UserFirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
      this.profiles = users;
      if (this.profiles.length > 0) {
        this.profileData = this.profiles[this.currentProfileIndex];
      }
    });
  }

  swipe(action: string): void {
    if (action === 'like') {
      // Handle 'like' action logic here, e.g., save the liked profile to a liked list
    }

    // Move to the next profile
    this.currentProfileIndex++;
    if (this.currentProfileIndex < this.profiles.length) {
      this.profileData = this.profiles[this.currentProfileIndex];
    } else {
      // End of profiles, handle what should happen when all profiles have been viewed
      this.profileData = null;
      console.log('No more profiles to swipe');
    }
  }
}
