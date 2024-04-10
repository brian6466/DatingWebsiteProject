import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {UserFirebaseService} from "../shared/userFirebase.service";

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {

  name: string = "";
  age: number = 0;
  description: string = "";
  isSmoker: boolean = false;
  wantsKids: boolean = false;

  constructor(private router: Router, private fireStorage:AngularFireStorage, private userFirebaseService: UserFirebaseService) {

  }

  async onFileChange(event: any) {
    const file = event.target.files[0]
    if (file) {
      console.log(file)
      const path = `yt/${file.name}`
      const uploadTask = await this.fireStorage.upload(path, file)
      const url = await uploadTask.ref.getDownloadURL()
      console.log(url)
    }
  }

  showProfile() {
    if (this.age > 18 && this.name != "") {
      this.router.navigate(['/']);
    } else {

    }
  }

}
