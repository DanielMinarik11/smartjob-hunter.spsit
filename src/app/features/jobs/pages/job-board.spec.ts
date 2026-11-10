import { TestBed } from '@angular/core/testing';
import { JobBoard } from './job-board';

describe('JobBoard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobBoard],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(JobBoard);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should open the sign-in dialog from the profile button', async () => {
    const fixture = TestBed.createComponent(JobBoard);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.profile-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[role="dialog"]')?.textContent).toContain('Vitaj späť');
  });
});
