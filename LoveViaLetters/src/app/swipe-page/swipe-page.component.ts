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


  constructor(private firebaseService: UserFirebaseService, private authService: AuthService, private dialog: MatDialog) { }

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

  }

  swipe(action: string): void {
    if (action === 'like') {
      //TODO: add logic here
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

}
