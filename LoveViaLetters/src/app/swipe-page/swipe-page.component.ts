import {Component, OnInit} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import {UserFirebaseService} from "../shared/userFirebase.service";
import {UserProfileInterface} from "../interfaces/userProfile.interface";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ProfileDialogComponent} from "../profile-dialog/profile-dialog.component";
import {MatDialog} from "@angular/material/dialog";


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
  filteredProfiles: UserProfileInterface[] = [];
  currentProfileIndex: number = 0;
  profileData: UserProfileInterface | null = null;
  currentUser: UserProfileInterface | null = null;
  user: UserProfileInterface | undefined;
  showModal: boolean = false;
  pic: any;
  name: string | undefined;
  userId: any;



  constructor(private firebaseService: UserFirebaseService, private authService: AuthService, private dialog: MatDialog) {
    //this.loadData()
    this.profileData = null
    this.userId = this.authService.getUid();
    console.log("Constructor: ",this.user)
  }

  ngOnInit(): void {

    
    this.profileData = null

    //const currentUserId = this.authService.getUid()
    //if (currentUserId) {
    //  this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
    //    this.profiles = users.filter(user => user.UserId !== currentUserId);
    //    if (this.profiles.length > 0) {
    //      this.profileData = this.profiles[this.currentProfileIndex];
    //      this.filteredProfiles = this.profiles

    //    }
    //  });
    //}

    this.loadData()
    

    this.firebaseService.getUser().subscribe(
      (user: UserProfileInterface | undefined) => {
        this.user = user;
        console.log('User data:', this.user);
        console.log("User matches: ", this.user?.Matches)
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );

    
  }

  swipe(action: string): void {
    this.showModal = false;
    console.log(this.user)
    if (action === 'like' && this.user && this.filteredProfiles) {
      console.log('liked')
      this.firebaseService.addLike(this.authService.getUid(), this.filteredProfiles[this.currentProfileIndex].UserId)
      if(this.user.likesReceived) {
      for (let i = 0; i < Math.min(this.user.likesReceived.length, this.filteredProfiles.length); i++) {
        if (this.user.likesReceived[i] == this.filteredProfiles[this.currentProfileIndex]?.UserId) {
          console.log("Match")
          console.log(this.profileData)
          this.firebaseService.addMatch(this.authService.getUid(), this.filteredProfiles[this.currentProfileIndex].UserId)
          this.profileData = this.filteredProfiles[this.currentProfileIndex]
          console.log(this.profileData)
          this.pic = this.filteredProfiles[this.currentProfileIndex].profilePic
          this.name = this.filteredProfiles[this.currentProfileIndex].Name
          this.showModal = true;
          break;
        }
      }
      }
    }




    this.currentProfileIndex++;
    if (this.currentProfileIndex < this.filteredProfiles.length) {
      this.profileData = this.filteredProfiles[this.currentProfileIndex];
    } else {
      this.profileData = null;
    }
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: this.profiles
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.currentProfileIndex = 0;
      this.profileData = result.data[0];
      this.filteredProfiles = result.data;
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadData() {

    if (this.userId) {
      this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
        // Filter out profiles based on the current user's ID and exclude matches
        this.profiles = users.filter(user => {
          // Exclude profiles where the user is the current user or in the matches list
          return user.UserId !== this.userId && !this.user?.Matches.includes(user.UserId);
        });
        if (this.profiles.length > 0) {
          // Assign filtered profiles after filtering operation is completed
          this.filteredProfiles = this.profiles;
          this.profileData = this.filteredProfiles[this.currentProfileIndex];
          console.log(this.filteredProfiles);
        }
      });
    }
  }

}
