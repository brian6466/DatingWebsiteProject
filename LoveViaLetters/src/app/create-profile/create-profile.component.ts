import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {

  }

  showProfile() {
    if (this.age > 18 && this.name != "") {
      this.router.navigate(['/']);
    } else {

    }
  }

}
