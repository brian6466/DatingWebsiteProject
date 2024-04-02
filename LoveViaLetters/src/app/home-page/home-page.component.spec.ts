import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponennt } from './home-page.component';

describe('HeaderComponent', () => {
  let component: HomePageComponennt;
  let fixture: ComponentFixture<HomePageComponennt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponennt]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomePageComponennt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
