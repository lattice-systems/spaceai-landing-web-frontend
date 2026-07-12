import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Faq } from './faq';

describe('Faq', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Faq],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders questions and CTA links', async () => {
    const fixture = TestBed.createComponent(Faq);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Preguntas frecuentes');
    expect(el.querySelectorAll('article').length).toBe(4);
    expect([...el.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toContain(
      '/cotizador',
    );
  });
});
