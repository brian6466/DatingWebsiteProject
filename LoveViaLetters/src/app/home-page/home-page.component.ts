import { Component, OnInit } from "@angular/core";
import { UserProfileInterface } from "../interfaces/userProfile.interface";
import { UserFirebaseService } from "../shared/userFirebase.service";
import { AuthService } from "../shared/auth.service";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import {Observable, switchMap, take} from "rxjs";

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

    this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          this.userId = user.uid;
          return this.firebaseService.getUser();
        } else {
          return new Observable<UserProfileInterface | null>();
        }
      })
    ).subscribe(data => {
      console.log(data);
      if (data) {
        if (data.Interests) {
          this.interests = data.Interests;
          this.triggerFilterProfilesByInterests();
        }
      }
    });


    this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
      this.profiles = users.filter(user => user.UserId !== this.userId);
      if (this.profiles.length > 0) {
        this.filteredProfiles = this.profiles
        console.log(this.filteredProfiles)
        this.triggerFilterProfilesByInterests();
      }

    });

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
    console.log(this.interests)
    if (this.interests != null && this.interests.length > 0) {

      const MIN_COMMON_INTERESTS = 2;


      this.filteredInterestProfiles = this.filteredProfiles.filter(profile =>
        this.countCommonInterests(profile.Interests, this.interests) >= MIN_COMMON_INTERESTS
      );

    } else {

      //
      // this.loadProfiles()
      // this.filteredProfiles = this.profiles;
    }
    console.log(this.filteredInterestProfiles)
  }

  countCommonInterests(profileInterests: string[], userInterests: string[]): number {
    return profileInterests.filter(interest => userInterests.includes(interest)).length;
  }

  getInterests() {
    this.interests = this.user?.Interests || [];

  }


  private triggerFilterProfilesByInterests() {
    if (this.interests.length > 0 && this.profiles.length > 0) {
      this.filterProfilesByInterests();
    }
  }
}
