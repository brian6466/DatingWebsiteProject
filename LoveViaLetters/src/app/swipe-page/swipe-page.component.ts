import { Component } from '@angular/core';

@Component({
  selector: 'app-swipe-page',
  standalone: true,
  imports: [],
  templateUrl: './swipe-page.component.html',
  styleUrl: './swipe-page.component.css'
})
export class SwipePageComponent {


  count: number = 0;

  constructor() { }

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

    // Remove card after animation
    setTimeout(() => {
      const cardContainer: HTMLElement | null = document.querySelector('.card-container');
      if (!cardContainer) return;
      cardContainer.innerHTML = `<div class="card"><span class="card-overlay">${this.count}</span><img src="blank_profile.jpg" alt="Blank Profile"></div>`;
    }, 300); // Change 300 to match transition duration
  }

  updateOverlay(): void {
    const overlay: HTMLElement | null = document.querySelector('.card-overlay');
    if (!overlay) return;
    overlay.textContent = this.count.toString();
  }


}
