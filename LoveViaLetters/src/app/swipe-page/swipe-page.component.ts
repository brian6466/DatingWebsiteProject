import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-swipe-page',
  standalone: true,
  imports: [],
  templateUrl: './swipe-page.component.html',
  styleUrl: './swipe-page.component.css'
})
export class SwipePageComponent {


  count: number = 0;
  images: string[] = []; // Array to store image URLs
  currentImageIndex: number = 0;


  constructor(private authService: AuthService, private fireStorage: AngularFireStorage) {
    console.log("Constructor called");
    this.preloadImages()
  }

  preloadImages() {

    const storageRef = this.fireStorage.ref('profilePictues/images/');
    storageRef.listAll().subscribe(result =>  {
      result.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          console.log(url)
          this.images.push(url); // Add URL to the images array          
        });
      });
    }); 
  }

  swipe = (action: string): void => {
    const card: HTMLElement | null = document.querySelector('.card');
    if (!card) return;

    if (action === 'like' && this.images.length > this.count) {
      card.classList.add('like');
    } else if (action === 'dislike' && this.images.length > this.count) {
      card.classList.add('dislike');
    }


    this.count++; // Increment counter
    if (this.images.length < this.count) {
      setTimeout(() => {
        const cardContainer: HTMLElement | null = document.querySelector('.card-container');
        if (!cardContainer) return;
        cardContainer.innerHTML = `<div class="card"><span class="card-overlay">${this.count}</span><h1>Out of swipes</h1></div>`;
      }, 300); // Change 300 to match transition duration

    } else {
      this.updateOverlay(); // Update overlay with new count
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      console.log(this.images.length)

      //Remove card after animation
      setTimeout(() => {
        const cardContainer: HTMLElement | null = document.querySelector('.card-container');
        if (!cardContainer) return;
        cardContainer.innerHTML = `<div class="card"><span class="card-overlay">${this.count}</span><img src="${this.images[this.currentImageIndex]}" alt="Profile Image"></div>`;
      }, 300); // Change 300 to match transition duration
    }
    
  }



  updateOverlay(): void {
    const overlay: HTMLElement | null = document.querySelector('.card-overlay');
    if (!overlay) return;
    overlay.textContent = this.count.toString();
  }


}
