import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore'
import {UserInterface} from "../interfaces/user.interface";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {
  firestore = inject(Firestore)
  usersCollection = collection(this.firestore, 'users')

  getUsers(): Observable<UserInterface[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<UserInterface[]>;
    //To use this
    //this.userFirebaseService.getUsers().subscribe((users) => {
    //  console.log(users)
    //})
  }

  getUserById(userId: string): Observable<UserInterface | undefined> {
    const userDocRef = doc(this.firestore, 'users', userId);
    return new Observable<UserInterface | undefined>(observer => {
      getDoc(userDocRef).then(docSnapshot => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as UserInterface;
          observer.next(userData);
        } else {
          observer.next(undefined);
        }
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }


  async createUser(name: string, email: string, userId: any): Promise<void> {
    try{
      await setDoc(doc(this.firestore, 'users', userId), {
        name: name,
        email: email,
        isBanned: false
      });
    } catch (error) {
      console.error('Error creating new user document: ', error);
      throw error;
    }
  }

}
