import { Component } from '@angular/core';
import { Routes, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: '<h1>Page not found</h1><a routerLink="/people">Back to people</a>',
})
class NotFound {}

// Match the literal "new" route before treating that path segment as a database ID.
export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', loadComponent: () => import('./people/people-list').then((m) => m.PeopleList), title: 'People | Pulse' },
  { path: 'people/new', loadComponent: () => import('./people/person-form').then((m) => m.PersonForm), title: 'Add person | Pulse' },
  { path: 'people/:id/edit', loadComponent: () => import('./people/person-form').then((m) => m.PersonForm), title: 'Edit person | Pulse' },
  { path: 'people/:id/interactions/new', loadComponent: () => import('./interactions/interaction-form').then((m) => m.InteractionForm), title: 'Log interaction | Pulse' },
  { path: 'people/:id/interactions/:interactionId/edit', loadComponent: () => import('./interactions/interaction-form').then((m) => m.InteractionForm), title: 'Edit interaction | Pulse' },
  { path: 'people/:id', loadComponent: () => import('./people/person-detail').then((m) => m.PersonDetail), title: 'Contact | Pulse' },
  { path: '**', component: NotFound, title: 'Page not found | Pulse' },
];
