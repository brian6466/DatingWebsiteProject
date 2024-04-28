import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CreateProfileComponent} from "./create-profile/create-profile.component";
import { SwipePageComponent } from './swipe-page/swipe-page.component';
import { AdminComponent } from './admin/admin.component';
import {HomePageComponennt} from "./home-page/home-page.component";
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
  {
    path:'',
    component : HomePageComponennt
  },
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
    path: "messages",
    component: MessagesComponent
  }



];
