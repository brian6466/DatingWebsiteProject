import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CreateProfileComponent} from "./create-profile/create-profile.component";
import { SwipePageComponent } from './swipe-page/swipe-page.component';
import { AdminComponent } from './admin/admin.component';
import { MatchesComponent } from './matches/matches.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "create-profile",
    component: CreateProfileComponent
  },
  {
    path: "swipe-page",
    component: SwipePageComponent
  },
  {
    path: "admin",
    component: AdminComponent
  },
  {
    path: "matches",
    component: MatchesComponent
  }

];
