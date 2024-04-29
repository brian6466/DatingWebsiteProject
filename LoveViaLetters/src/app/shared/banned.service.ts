import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { UserFirebaseService } from './userFirebase.service';
import { UserProfileInterface } from '../interfaces/userProfile.interface';
import { getAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BannedService {
  private bannedSubject = new BehaviorSubject<boolean>(false);
  firestore = inject(Firestore)
  profiles: UserProfileInterface[] = [];
  filteredProfiles: UserProfileInterface[] = [];
  profileData: UserProfileInterface | null = null;
  currentProfileIndex: number = 0;
  auth: any = getAuth()
  user: any = this.auth.currentUser;
  banned: boolean = false;
  admin: boolean = false;
  private readonly bannedKey = 'isBanned';
  private readonly adminkey = 'isAdmin';

  constructor(private authService: AuthService, private firebaseService: UserFirebaseService) {
    this.checkBan(this.authService.getUid())
  }

  private buttonClickSubject = new Subject<void>();

  buttonClick$ = this.buttonClickSubject.asObservable();

  notifyButtonClick() {
    this.buttonClickSubject.next();
  }


  setBanned(value: boolean) {
    sessionStorage.setItem(this.bannedKey, JSON.stringify(value));
    
  }

  isAdmin(): boolean {
    console.log("banned service set admin", this.admin)
    return this.admin
  }

  setAdmin(value: boolean) {
    this.admin = value

  }

  isBanned(): boolean {

    const bannedString = sessionStorage.getItem(this.bannedKey);
    return bannedString ? JSON.parse(bannedString) : false;
  }

  loadProfiles() {
    this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
      this.profiles = users.filter(user => user.UserId);
      if (this.profiles.length > 0) {
        this.profileData = this.profiles[this.currentProfileIndex];
        this.filteredProfiles = this.profiles
        console.log(this.filteredProfiles)
      }
    });

  }


  checkBan(currentUserId: any): boolean {
    this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
      this.profiles = users.filter(user => user.UserId);
      if (this.profiles.length > 0) {
        // Once profiles are loaded, check for banned status
        const isBanned = this.profiles.some(profile => {
          return profile.UserId === currentUserId && profile.isBanned;
        });

        // Set the banned status
        this.setBanned(isBanned);
      } else {
        // If no profiles found, set banned status to false
        this.setBanned(false);
      }
    });

    // Return the banned status
    return this.banned;
  }


}
