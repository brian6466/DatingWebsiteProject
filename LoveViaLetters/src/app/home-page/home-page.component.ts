import { Component, OnInit } from "@angular/core";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { UserProfileInterface } from "../interfaces/userProfile.interface";
import { UserFirebaseService } from "../shared/userFirebase.service";
import { AuthService } from "../shared/auth.service";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { getAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl:'./home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponennt implements OnInit{

  profiles: UserProfileInterface[] = [];
  filteredProfiles: UserProfileInterface[] = [];
  filteredInterestProfiles: UserProfileInterface[] = [];
  currentProfileIndex: number = 0;
  profileData: UserProfileInterface | null = null;
  currentUser: UserProfileInterface | null = null;
  user: UserProfileInterface | undefined;
  userId: any = this.authService.getUid()
  pic: any;
  interests: string[] = []

  constructor(private firebaseService: UserFirebaseService, public authService: AuthService) {
    this.firebaseService.getUser().subscribe(
      (user: UserProfileInterface | undefined) => {
        this.user = user;
        console.log('User data:', this.user);
        this.getInterests()
        this.loadProfiles()
        this.filterProfilesByInterests()
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
    
  }

  ngOnInit(): void {

    
    this.filterProfilesByInterests()
  }

  loadProfiles() {
    const currentUserId = this.authService.getUid()
    if (currentUserId) {
      this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
        this.profiles = users.filter(user => user.UserId !== currentUserId);
        if (this.profiles.length > 0) {
          this.filteredProfiles = this.profiles
          console.log(this.filteredProfiles)
        }
        
      });
    }
  }

  getInterests() {
    this.user?.Interests.forEach( (hobby) => {
      this.interests.push(hobby);
    });
    console.log("user interests: ", this.interests)
  }

  filterProfilesByInterests() {
    if (this.user?.Interests != null && this.user.Interests.length > 0) {
      // Check if the user's interests exist and the array is not empty
      console.log("Current user interests:", this.user?.Interests);

      // Filter profiles based on interests
      this.filteredProfiles = this.profiles.filter(profile =>
        profile.Interests.some(interest => this.interests.includes(interest))
      );
      console.log("Adjusted List:", this.filteredProfiles);
      this.filteredInterestProfiles = this.filteredProfiles
    } else {
      // If user interests are not available or empty, reset filtered profiles to all profiles
      console.log("User interests not available or empty. Showing all profiles.");
      this.loadProfiles()
      this.filteredProfiles = this.profiles;
    }
  }



}
