import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { firebaseConfig } from "../firebase.config";


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage())
    ])
  ]
};
