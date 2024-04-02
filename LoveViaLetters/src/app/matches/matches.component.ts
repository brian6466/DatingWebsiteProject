import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
export class MatchesComponent {

  constructor() {
    var modal = document.getElementById("messageModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];

  }

  

  openMessageModal(name: string) {
    console.log("Function called", name);
  }

}
