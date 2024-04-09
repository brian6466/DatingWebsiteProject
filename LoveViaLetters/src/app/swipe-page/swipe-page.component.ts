import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';



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


  constructor(private authService: AuthService) {
    this.preloadImages()
  }

  preloadImages(): void {
    this.images = ['assets/face-1.png',
      'assets/face2.jpg', 'assest/face-3.jpg', 'assets/face-4.jpg'];
  }

  swipe = (action: string): void => {
    const card: HTMLElement | null = document.querySelector('.card');
    if (!card) return;

    if (action === 'like') {
      card.classList.add('like');
    } else if (action === 'dislike') {
      card.classList.add('dislike');
    }

    this.count++; // Increment counter
    this.updateOverlay(); // Update overlay with new count
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    console.log(this.currentImageIndex)

    // Remove card after animation
    setTimeout(() => {
      const cardContainer: HTMLElement | null = document.querySelector('.card-container');
      if (!cardContainer) return;
      cardContainer.innerHTML = `<div class="card"><span class="card-overlay">${this.count}</span><img src="${this.images[this.currentImageIndex]}" alt="Profile Image"></div>`;
    }, 300); // Change 300 to match transition duration
  }

  updateOverlay(): void {
    const overlay: HTMLElement | null = document.querySelector('.card-overlay');
    if (!overlay) return;
    overlay.textContent = this.count.toString();
  }


}
