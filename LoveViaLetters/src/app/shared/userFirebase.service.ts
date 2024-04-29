import {inject, Injectable} from '@angular/core';
import {
  arrayUnion,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
  addDoc,
  Query, or, DocumentData, and
} from '@angular/fire/firestore'
import {getDownloadURL, ref, Storage, uploadBytes, uploadString} from '@angular/fire/storage'
import {UserInterface} from "../interfaces/user.interface";
import {EMPTY, from, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {UserProfileInterface} from '../interfaces/userProfile.interface';
import {ChatMessageInterface} from "../interfaces/chatMessage.interface";



@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {
  firestore = inject(Firestore)
  storage = inject(Storage);
  auth = inject(AuthService)
  usersCollection = collection(this.firestore, 'users')
  messagesCollection = collection(this.firestore, 'messages')

  //Ignore how messy this file is lol

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


  loadFile() {

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
    try {
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

  async addLike(userId: any, likedId: any): Promise<void> {
    try {
      // Query Firestore to find the document of the user being liked
      const querySnapshot = await getDocs(query(collection(this.firestore, 'users'), where('UserId', '==', likedId)));

      if (!querySnapshot.empty) {
        // If the user being liked exists, update their document to add the userId to the likesReceived array
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          likesReceived: arrayUnion(userId.toString()) // Use arrayUnion with the userId to add it to the likesReceived array
        });
        console.log(`User with id ${userId} has liked ${likedId}.`);
      } else {
        console.error(`User with id ${likedId} not found.`);
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  }


  async banUserById(id: any): Promise<void> {
    try {
      const querySnapshot = await getDocs(query(this.usersCollection, where('UserId', '==', id)));
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {isBanned: true});
        console.log(`User with id ${id} has been banned.`);
      } else {
        console.error(`User with id ${id} not found.`);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  }

  async unBanUserById(id: any): Promise<void> {
    try {
      const querySnapshot = await getDocs(query(this.usersCollection, where('UserId', '==', id)));
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {isBanned: false});
        console.log(`User with id ${id} has been unBanned.`);
      } else {
        console.error(`User with id ${id} not found.`);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  }

  async setAdmin(status: boolean, id: any): Promise<void> {
    try {
      const querySnapshot = await getDocs(query(this.usersCollection, where('UserId', '==', id)));
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {isAdmin: status});
        console.log(`User with id ${id} has admin status of ${status}.`);
      } else {
        console.error(`User with id ${id} not found.`);
      }
    } catch (error) {
      throw error
    }
  }

  async deleteUser(userID: any) {
    await deleteDoc(doc(this.firestore, 'users', userID))
    console.log("User with ID: ", userID, " deleted")
  }


  async createMatch(UserId1: string | undefined, UserId2: string) {
    try {
      await addDoc(collection(this.firestore, 'matches'),
        {
          userId1: UserId1,
          userId2: UserId2
        });
    } catch (error) {
      console.error('Error creating new user document: ', error);
      throw error;
    }
  }

  async getMatchesForUser(userId: string | undefined) {
    const matchesArray: DocumentData[] = []
    const q = query(collection(this.firestore, "matches"), or(where("userId1", "==", userId), where("userId2", "==", userId)));

    const queryResult =  await getDocs(q)
    queryResult.docs.map((matches) =>
        matchesArray.push(matches.data())
      );
    return matchesArray;
  }

  async addMatch(userId: any, MatchedId: any): Promise<void> {
    console.log(userId)
    console.log(MatchedId)
    try {
      await updateDoc(doc(this.firestore, 'users', MatchedId), {
        Matches: arrayUnion(userId.toString())
      });
      await updateDoc(doc(this.firestore, 'users' ,userId), {
        Matches: arrayUnion(MatchedId.toString())
      });
      }
     catch (error) {
    }
  }

  async sendMessage(senderId: string, recipientId: string, content: string): Promise<void> {
    try {
      await addDoc(collection(this.firestore, 'messages'),
        {
          senderId: senderId,
          recipientId: recipientId,
          content: content,
          createdAt: new Date()
        });
    } catch (error) {
      console.error('Error creating new user document: ', error);
      throw error;
    }
  }

  getMatchMessages(userId: any, MatchedId: any):  Observable<ChatMessageInterface[]> {
    const q = query(this.messagesCollection, and(
      where('senderId', 'in', [userId, MatchedId]),
      where('recipientId', 'in', [userId, MatchedId])))
    return collectionData(q, {
      idField: 'id'
    }) as Observable<ChatMessageInterface[]>;
  }





}

