import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a home link', async () => {
    const fixture = TestBed.createComponent(NotFound);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Página no encontrada');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});
