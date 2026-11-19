import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

it('renders the Pulse navigation', async () => {
  await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] })
    .compileComponents();
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  expect(fixture.nativeElement.querySelector('nav').textContent).toContain('People');
});
