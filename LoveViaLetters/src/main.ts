import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { CreateProfileComponent } from './app/create-profile/create-profile.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
