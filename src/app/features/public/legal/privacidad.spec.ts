import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Privacidad } from './privacidad';

describe('Privacidad', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Privacidad],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders privacy content', async () => {
    const fixture = TestBed.createComponent(Privacidad);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Política de privacidad');
    expect(el.querySelectorAll('li').length).toBe(3);
  });
});
