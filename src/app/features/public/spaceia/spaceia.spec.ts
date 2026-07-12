import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Spaceia } from './spaceia';

describe('Spaceia', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spaceia],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the ecosystem heading and product anchors', async () => {
    const fixture = TestBed.createComponent(Spaceia);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('operación conectada');
    expect(el.querySelector('#movil')).toBeTruthy();
    expect(el.querySelector('#acceso')).toBeTruthy();
    expect(el.querySelector('#kiosco')).toBeTruthy();
    expect(el.querySelector('#robot')).toBeTruthy();
  });
});
