import { Injectable, signal } from '@angular/core';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseConfig } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly isConfigured = Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );

  private readonly auth = this.initializeAuth();

  constructor() {
    if (!this.auth) {
      this.loading.set(false);
      return;
    }

    onAuthStateChanged(
      this.auth,
      (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      (error) => {
        console.error('Firebase authentication state could not be loaded.', error);
        this.loading.set(false);
      },
    );
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.requireAuth(), email, password);
    this.user.set(credential.user);
    await updateProfile(credential.user, { displayName });

    try {
      await sendEmailVerification(credential.user);
    } catch (error) {
      throw new Error(
        `Účet bol vytvorený, ale overovací e-mail sa nepodarilo odoslať: ${this.getErrorMessage(error)}`,
      );
    }

    this.user.set(credential.user);
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.requireAuth(), email, password);
    this.user.set(credential.user);
  }

  async logout(): Promise<void> {
    await signOut(this.requireAuth());
    this.user.set(null);
  }

  async updateDisplayName(displayName: string): Promise<void> {
    const user = this.requireAuth().currentUser;
    if (!user) {
      throw new Error('Najprv sa prihlás do svojho účtu.');
    }

    await updateProfile(user, { displayName });
    this.user.set(null);
    this.user.set(user);
  }

  errorMessage(error: unknown): string {
    return this.getErrorMessage(error);
  }

  private initializeAuth(): Auth | null {
    if (!this.isConfigured) {
      return null;
    }

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getAuth(app);
  }

  private requireAuth(): Auth {
    if (!this.auth) {
      throw new Error(
        'Firebase Web konfigurácia chýba. Doplň ju v src/app/firebase.config.ts.',
      );
    }

    return this.auth;
  }

  private getErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return error instanceof Error ? error.message : 'Skús to znova.';
    }

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Tento e-mail už má vytvorený účet.';
      case 'auth/invalid-email':
        return 'Zadaj platnú e-mailovú adresu.';
      case 'auth/weak-password':
        return 'Heslo musí mať aspoň 6 znakov.';
      case 'auth/invalid-credential':
        return 'E-mail alebo heslo nie sú správne.';
      case 'auth/operation-not-allowed':
        return 'Vo Firebase Console povoľ prihlasovanie cez E-mail/heslo.';
      case 'auth/too-many-requests':
        return 'Príliš veľa pokusov. Skús to znova o chvíľu.';
      case 'auth/network-request-failed':
        return 'Nepodarilo sa pripojiť k Firebase. Skontroluj internetové pripojenie.';
      default:
        return 'Pri práci s účtom nastala chyba. Skús to znova.';
    }
  }
}
