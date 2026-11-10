import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should open the sign-in dialog from the profile button', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.profile-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[role="dialog"]')?.textContent).toContain('Vitaj späť');
    expect(compiled.textContent).toContain('Firebase Web konfigurácia chýba');
  });
});
