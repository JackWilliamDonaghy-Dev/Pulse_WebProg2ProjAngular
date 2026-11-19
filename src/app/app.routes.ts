import { Component } from '@angular/core';
import { Routes, RouterLink } from '@angular/router';

@Component({ template: '<h1>People</h1><p>Keep in touch with the people who matter to you.</p>' })
class PeopleHome {}

@Component({
  imports: [RouterLink],
  template: '<h1>Page not found</h1><a routerLink="/people">Back to people</a>',
})
class NotFound {}

export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', component: PeopleHome, title: 'People | Pulse' },
  { path: '**', component: NotFound, title: 'Page not found | Pulse' },
];
