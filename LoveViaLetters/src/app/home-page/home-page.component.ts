import { Component, OnInit } from "@angular/core";
import { UserProfileInterface } from "../interfaces/userProfile.interface";
import { UserFirebaseService } from "../shared/userFirebase.service";
import { AuthService } from "../shared/auth.service";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";

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
  userId: any;
  pic: any;
  interests: string[] = []

  constructor(private firebaseService: UserFirebaseService, public authService: AuthService) {

  }

  ngOnInit(): void {
    this.userId = this.authService.getAuthToken()

    this.loadProfiles()
    // Fetch user data asynchronously
    this.firebaseService.getUser().subscribe(
      (user: UserProfileInterface | undefined): void => {

        this.user = user;

        this.getInterests();
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  loadProfiles() {
      this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
        this.profiles = users.filter(user => user.UserId !== this.userId);
        if (this.profiles.length > 0) {
          this.filteredProfiles = this.profiles
          this.filterProfilesByInterests();
        }

      });
  }

  filterProfilesByInterests() {
    if (this.user?.Interests != null && this.user.Interests.length > 0) {

      const MIN_COMMON_INTERESTS = 2; // Minimum number of common interests required


      this.filteredInterestProfiles = this.filteredProfiles.filter(profile =>
        this.countCommonInterests(profile.Interests, this.interests) >= MIN_COMMON_INTERESTS
      );

    } else {


      this.loadProfiles()
      this.filteredProfiles = this.profiles;
    }
  }

  countCommonInterests(profileInterests: string[], userInterests: string[]): number {
    return profileInterests.filter(interest => userInterests.includes(interest)).length;
  }

  getInterests() {
    this.interests = this.user?.Interests || [];

  }


}
