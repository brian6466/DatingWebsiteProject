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
      console.log("Users Name: ", this.name);
      console.log("Users Age: ", this.age);
      console.log("Users Description", this.description);
      console.log("Is Smoker: ", this.isSmoker);
      console.log("Wants Kids", this.wantsKids);
      this.router.navigate(['/']);
    } else {
      
    }

    console.log("Users Name: ", this.name);
    console.log("Users Age: ", this.age);
    console.log("Users Description", this.description);
    console.log("Is Smoker: ", this.isSmoker);
    console.log("Wants Kids", this.wantsKids);
    
  }

}
