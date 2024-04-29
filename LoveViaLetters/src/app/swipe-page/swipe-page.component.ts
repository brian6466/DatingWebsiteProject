import {Component, OnInit} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import {UserFirebaseService} from "../shared/userFirebase.service";
import {UserProfileInterface} from "../interfaces/userProfile.interface";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ProfileDialogComponent} from "../profile-dialog/profile-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { User, user } from '@angular/fire/auth';


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



  constructor(private firebaseService: UserFirebaseService, private authService: AuthService, private dialog: MatDialog) {
    console.log("Constructor: ",this.user)
  }

  ngOnInit(): void {




    const currentUserId = this.authService.getUid()
    if (currentUserId) {
      this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
        this.profiles = users.filter(user => user.UserId !== currentUserId);
        if (this.profiles.length > 0) {
          this.profileData = this.profiles[this.currentProfileIndex];
          this.filteredProfiles = this.profiles

        }
      });
    }

    this.firebaseService.getUser().subscribe(
      (user: UserProfileInterface | undefined) => {
        this.user = user;
        console.log('User data:', this.user);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );


  }

  swipe(action: string): void {
    this.showModal = false;
    console.log("liked")
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

}
