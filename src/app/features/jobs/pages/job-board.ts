import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../auth/data-access/firebase-auth.service';

interface JobOffer {
  id: number;
  company: string;
  title: string;
  location: string;
  type: string;
  remote: string;
  salaryMin: number;
  salaryMax: number;
  date: string;
  letter: string;
  color: string;
  favorite: boolean;
}

const initialJobs: JobOffer[] = [
  {
    id: 1,
    company: 'Lidl Slovenská republika',
    title: 'Predavač / Pokladník',
    location: 'Bratislava · Ružinov',
    type: 'Plný úväzok',
    remote: 'Plný úväzok',
    salaryMin: 1100,
    salaryMax: 1350,
    date: 'Zverejnené Mar 15, 2026',
    letter: 'L',
    color: 'linear-gradient(135deg, #dfe7ff 0%, #c7d1f7 100%)',
    favorite: false,
  },
  {
    id: 2,
    company: 'Reštaurácia Staré Mesto',
    title: 'Čašník / Servírka',
    location: 'Košice · Centrum',
    type: 'Plný úväzok',
    remote: 'Plný úväzok',
    salaryMin: 900,
    salaryMax: 1050,
    date: 'Zverejnené Mar 12, 2026',
    letter: 'R',
    color: 'linear-gradient(135deg, #e5f4ff 0%, #d0e4ff 100%)',
    favorite: false,
  },
  {
    id: 3,
    company: 'Hotel Riverside',
    title: 'Samostatný kuchár',
    location: 'Poprad / Vysoké Tatry',
    type: 'Plný úväzok',
    remote: 'Plný úväzok',
    salaryMin: 1500,
    salaryMax: 2000,
    date: 'Zverejnené Mar 9, 2026',
    letter: 'H',
    color: 'linear-gradient(135deg, #dde9ff 0%, #cfe3ff 100%)',
    favorite: true,
  },
  {
    id: 4,
    company: 'Logistics Park',
    title: 'Skladník / Vodič',
    location: 'Senec',
    type: 'Plný úväzok',
    remote: 'Nadčas',
    salaryMin: 1200,
    salaryMax: 1450,
    date: 'Zverejnené Mar 8, 2026',
    letter: 'L',
    color: 'linear-gradient(135deg, #e8f7ed 0%, #d4ebdb 100%)',
    favorite: false,
  },
  {
    id: 5,
    company: 'Sky Bar & Lounge',
    title: 'Barman',
    location: 'Bratislava',
    type: 'Plný úväzok',
    remote: 'Flexibilné časy / Nočné smeny',
    salaryMin: 1000,
    salaryMax: 1200,
    date: 'Zverejnené Mar 4, 2026',
    letter: 'S',
    color: 'linear-gradient(135deg, #efeaff 0%, #ddd3ff 100%)',
    favorite: false,
  },
  {
    id: 6,
    company: 'Penzion Pohoda',
    title: 'Úpratováčka / Chyžná',
    location: 'Banská Bystrica',
    type: 'Plný úväzok',
    remote: 'Plný úväzok',
    salaryMin: 850,
    salaryMax: 950,
    date: 'Zverejnené Mar 1, 2026',
    letter: 'P',
    color: 'linear-gradient(135deg, #e5f7f0 0%, #d0efe3 100%)',
    favorite: true,
  },
];

@Component({
  selector: 'app-job-board',
  imports: [CommonModule, FormsModule],
  styleUrl: './job-board.css',
  templateUrl: './job-board.html',
})
export class JobBoard {
  readonly auth = inject(FirebaseAuthService);
  readonly jobs = signal<JobOffer[]>(initialJobs);
  readonly jobFormOpen = signal(false);
  readonly authDialogOpen = signal(false);
  readonly profileDialogOpen = signal(false);
  readonly editingProfile = signal(false);
  readonly authMode = signal<'login' | 'register'>('login');
  readonly authBusy = signal(false);
  readonly authError = signal('');
  readonly authNotice = signal('');

  readonly authForm = {
    name: '',
    email: '',
    password: '',
  };

  readonly profileName = signal('');

  readonly jobForm = {
    company: '',
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    type: 'Plný úväzok',
    remote: 'Plný úväzok',
  };

  protected toggleFavorite(id: number): void {
    const nextJobs = this.jobs().map((job) =>
      job.id === id ? { ...job, favorite: !job.favorite } : job,
    );
    this.jobs.set(nextJobs);
  }

  protected removeJob(id: number): void {
    this.jobs.set(this.jobs().filter((job) => job.id !== id));
  }

  protected toggleForm(): void {
    this.jobFormOpen.update((state) => !state);
  }

  protected submitJob(): void {
    const company = this.jobForm.company.trim();
    const title = this.jobForm.title.trim();
    const location = this.jobForm.location.trim() || 'Slovensko';
    const salaryMin = Number(this.jobForm.salaryMin) || 800;
    const salaryMax = Number(this.jobForm.salaryMax) || salaryMin + 250;

    if (!company || !title) {
      return;
    }

    const job: JobOffer = {
      id: Date.now(),
      company,
      title,
      location,
      type: this.jobForm.type,
      remote: this.jobForm.remote,
      salaryMin,
      salaryMax,
      date: 'Zverejnené dnes',
      letter: company.charAt(0).toUpperCase(),
      color: 'linear-gradient(135deg, #e6ebff 0%, #d7ddff 100%)',
      favorite: false,
    };

    this.jobs.update((jobs) => [job, ...jobs]);
    this.jobForm.company = '';
    this.jobForm.title = '';
    this.jobForm.location = '';
    this.jobForm.salaryMin = '';
    this.jobForm.salaryMax = '';
    this.jobForm.type = 'Plný úväzok';
    this.jobForm.remote = 'Plný úväzok';
    this.jobFormOpen.set(false);
  }

  protected trackJob(index: number, job: JobOffer): number {
    return job.id;
  }

  protected clearFilters(): void {
    const fields = document.querySelectorAll<HTMLInputElement>('.field input');
    fields.forEach((field) => {
      field.value = '';
    });
  }

  protected openAccount(): void {
    this.authError.set('');
    this.authNotice.set('');

    if (this.auth.user()) {
      this.profileName.set(this.auth.user()?.displayName ?? '');
      this.profileDialogOpen.set(true);
      return;
    }

    this.authMode.set('login');
    this.authDialogOpen.set(true);
  }

  protected closeAccountDialogs(): void {
    this.authDialogOpen.set(false);
    this.profileDialogOpen.set(false);
    this.editingProfile.set(false);
    this.authForm.password = '';
    this.authError.set('');
    this.authNotice.set('');
  }

  protected switchAuthMode(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.authError.set('');
    this.authNotice.set('');
  }

  protected async submitAuth(): Promise<void> {
    this.authBusy.set(true);
    this.authError.set('');
    this.authNotice.set('');

    try {
      const email = this.authForm.email.trim();
      if (this.authMode() === 'register') {
        await this.auth.register(email, this.authForm.password, this.authForm.name.trim());
        this.authNotice.set('Účet je vytvorený. Poslali sme ti overovací e-mail.');
      } else {
        await this.auth.login(email, this.authForm.password);
      }

      this.profileName.set(this.auth.user()?.displayName ?? this.authForm.name.trim());
      this.authForm.password = '';
      this.authDialogOpen.set(false);
      this.profileDialogOpen.set(true);
    } catch (error) {
      this.authError.set(this.auth.errorMessage(error));
      if (this.auth.user()) {
        this.profileName.set(this.auth.user()?.displayName ?? this.authForm.name.trim());
        this.authForm.password = '';
        this.authDialogOpen.set(false);
        this.profileDialogOpen.set(true);
      }
    } finally {
      this.authBusy.set(false);
    }
  }

  protected async saveProfile(): Promise<void> {
    const name = this.profileName().trim();
    if (!name) {
      this.authError.set('Meno nemôže byť prázdne.');
      return;
    }

    this.authBusy.set(true);
    this.authError.set('');
    this.authNotice.set('');

    try {
      await this.auth.updateDisplayName(name);
      this.editingProfile.set(false);
      this.authNotice.set('Meno profilu bolo aktualizované.');
    } catch (error) {
      this.authError.set(this.auth.errorMessage(error));
    } finally {
      this.authBusy.set(false);
    }
  }

  protected async logout(): Promise<void> {
    this.authBusy.set(true);
    this.authError.set('');

    try {
      await this.auth.logout();
      this.closeAccountDialogs();
      this.authForm.name = '';
      this.authForm.email = '';
    } catch (error) {
      this.authError.set(this.auth.errorMessage(error));
    } finally {
      this.authBusy.set(false);
    }
  }

  protected userInitials(): string {
    const user = this.auth.user();
    const value = user?.displayName?.trim() || user?.email?.split('@')[0] || '?';
    return value
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
