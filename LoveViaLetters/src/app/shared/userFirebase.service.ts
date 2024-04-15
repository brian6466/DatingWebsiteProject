import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore'
import {getDownloadURL, ref, Storage, uploadBytes, uploadString} from '@angular/fire/storage'
import {UserInterface} from "../interfaces/user.interface";
import {EMPTY, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import { UserProfileInterface } from '../interfaces/userProfile.interface';


@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {
  firestore = inject(Firestore)
  storage = inject(Storage);
  auth = inject(AuthService)
  usersCollection = collection(this.firestore, 'users')


  async createProfileFromForm(formData: any): Promise<void> {
    try {
      const url = await this.uploadFile(formData.profilePicture);
      const userId = this.auth.getUid();

      if (userId) {
        await setDoc(doc(this.firestore, 'users', userId), {
          Name: formData.name,
          Age: formData.age,
          Gender: formData.gender,
          Height: formData.height,
          Description: formData.description,
          Smoke: formData.smoke,
          Drink: formData.drink,
          Interests: formData.selectedInterests,
          LookingFor: formData.lookingFor,
          profilePic: url,
          UserId: userId,
        });
        console.log('Profile created successfully!');
      } else {
        console.error('User ID not available.');
      }
    } catch (error) {
      console.error('Error creating new user document:', error);
      throw error;
    }

  }

  uploadFile(file: any): Promise<string> {
    const storageRef = ref(this.storage, `profilePictures/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            resolve(url);
          })
          .catch((error) => {
            console.error(`Error getting download URL: ${error}`);
            reject(error);
          });
      })
        .catch((error) => {
          console.error(`Error uploading file: ${error}`);
          reject(error);
        });
    });
  }


  loadFile(){

  }

  getUsers(): Observable<UserProfileInterface[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<UserProfileInterface[]>;
  }

  getUser(): Observable<UserProfileInterface | undefined> {
    console.log('getUser called')
    const userId = this.auth.getUid();
    if (userId) {
      const userDocRef = doc(this.firestore, 'users', userId);
      return new Observable<UserProfileInterface | undefined>(observer => {
        getDoc(userDocRef).then(docSnapshot => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserProfileInterface;
            observer.next(userData);
          } else {
            observer.next(undefined);
          }
          observer.complete();
        }).catch(error => {
          observer.error(error);
        });
      });
    } else {
      return EMPTY;
    }
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
