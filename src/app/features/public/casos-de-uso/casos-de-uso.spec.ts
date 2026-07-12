import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CasosDeUso } from './casos-de-uso';

describe('CasosDeUso', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosDeUso],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders use cases and contact CTA', async () => {
    const fixture = TestBed.createComponent(CasosDeUso);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('SpaceIA');
    expect(el.querySelectorAll('article').length).toBe(4);
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/contacto');
  });
});
