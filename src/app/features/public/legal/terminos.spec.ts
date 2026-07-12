import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Terminos } from './terminos';

describe('Terminos', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Terminos],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders terms content', async () => {
    const fixture = TestBed.createComponent(Terminos);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Términos de uso');
    expect(el.querySelectorAll('article').length).toBe(3);
  });
});
