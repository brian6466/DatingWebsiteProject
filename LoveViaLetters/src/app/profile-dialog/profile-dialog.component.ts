import {Component, Inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatSlider} from "@angular/material/slider";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {UserProfileInterface} from "../interfaces/userProfile.interface";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NgForOf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatSlider,
    MatLabel,
    MatFormField,
    MatCheckbox,
    MatRadioGroup,
    MatRadioButton,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent {
  genderPreference: string = '';
  drinksPreference: string = '';
  smokesPreference: string = '';
  interests = ['Hiking', 'Cooking', 'Gaming', 'Traveling', 'Reading'];
  selectedInterests: { [key: string]: boolean } = {};
  unfilteredProfiles: UserProfileInterface[] = [];
  filteredProfiles: UserProfileInterface[] = [];
  minAge: number = 18;
  maxAge: number = 100;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProfileInterface[]
  ) {
    this.unfilteredProfiles = data;
    console.log(this.unfilteredProfiles)
  }

  ngOnInit(): void {
    this.interests.forEach(interest => {
      this.selectedInterests[interest] = true;
    });
  }

  applyFilter(): void {
    this.unfilteredProfiles.forEach(profile => {

      const age = profile.Age;
      if (age >= this.minAge && age <= this.maxAge) {

        if (this.genderPreference === '') {
        } else if (
          (this.genderPreference === 'male' && profile.Gender === 'male') ||
          (this.genderPreference === 'female' && profile.Gender === 'female')
        ) {
        } else {
          return
        }

        if (this.drinksPreference === '') {
        } else {
          const drinkMatches = (this.drinksPreference === 'yes') ? profile.Drink : !profile.Drink;
          if (!drinkMatches) {
            return;
          }
        }

        if (this.smokesPreference === '') {
        } else {
          const smokeMatches = (this.smokesPreference === 'yes') ? profile.Smoke : !profile.Smoke;
          if (!smokeMatches) {
            return
          }
        }

        if (Object.keys(this.selectedInterests).length === 0) {
          this.filteredProfiles.push(profile);
        } else {
          const hasSelectedInterest = profile.Interests.some(interest => this.selectedInterests[interest]);
          if (hasSelectedInterest) {
            this.filteredProfiles.push(profile);
          }
        }


      }

    });

    console.log(this.filteredProfiles)
    this.dialogRef.close({data: this.filteredProfiles});
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
