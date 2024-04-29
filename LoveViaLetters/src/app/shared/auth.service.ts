import {inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword, signOut,
  updateProfile,
  user
} from "@angular/fire/auth";
import {from, Observable} from "rxjs";
import { UserInterface } from "../interfaces/user.interface";
import { UserFirebaseService } from '../shared/userFirebase.service';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firestore = inject(Firestore)
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSignal = signal<UserInterface | null | undefined>(undefined)
  userCollection = collection(this.firestore, 'user')
  private auth = getAuth();

  register(email: string, password: string, name: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => updateProfile(response.user, {displayName: name}))

    return from(promise)
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password)
      .then(() => {

        console.log("User ID: ", this.getUid())
        
        
         //console.log(this.filteredProfiles)
        /////

      })
    return from(promise)
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }

  getUid() {
    return this.firebaseAuth.currentUser?.uid
  }

  getUser() {
    return this.firebaseAuth.currentUser
  }

  isAuthenticated(): boolean {
    // Check if user is authenticated by verifying authentication token in sessionStorage or localStorage
    return !!sessionStorage.getItem('authToken');
  }

  getAuthToken() {
    return sessionStorage.getItem('authToken')
  }

  saveAuthToken(token: string): void {
    // Save authentication token to sessionStorage or localStorage
    sessionStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    // Clear authentication token from sessionStorage or localStorage
    sessionStorage.removeItem('authToken');
  }

}
