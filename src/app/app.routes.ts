import { Component } from '@angular/core';
import { Routes, RouterLink } from '@angular/router';

import { InteractionForm } from './interactions/interaction-form';
import { PeopleList } from './people/people-list';
import { PersonForm } from './people/person-form';
import { PersonDetail } from './people/person-detail';

@Component({
  imports: [RouterLink],
  template: '<h1>Page not found</h1><a routerLink="/people">Back to people</a>',
})
class NotFound {}

export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', component: PeopleList, title: 'People | Pulse' },
  { path: 'people/new', component: PersonForm, title: 'Add person | Pulse' },
  { path: 'people/:id/edit', component: PersonForm, title: 'Edit person | Pulse' },
  { path: 'people/:id/interactions/new', component: InteractionForm, title: 'Log interaction | Pulse' },
  { path: 'people/:id/interactions/:interactionId/edit', component: InteractionForm, title: 'Edit interaction | Pulse' },
  { path: 'people/:id', component: PersonDetail, title: 'Contact | Pulse' },
  { path: '**', component: NotFound, title: 'Page not found | Pulse' },
];
