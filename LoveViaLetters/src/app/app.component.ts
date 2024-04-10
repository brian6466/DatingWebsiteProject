import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from "./shared/auth.service";
import { AngularFireModule } from '@angular/fire/compat'; // Import AngularFireModule
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { firebaseConfig } from '../firebase.config';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AngularFireModule, AngularFireStorageModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService)
  title = 'LoveViaLetters';

  ngOnInit(){
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
          name: user.displayName!,
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }

}
