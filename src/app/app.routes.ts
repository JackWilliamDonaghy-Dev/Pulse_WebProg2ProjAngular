import { Component } from '@angular/core';
import { Routes, RouterLink } from '@angular/router';

import { PeopleList } from './people/people-list';
import { PersonDetail } from './people/person-detail';

@Component({
  imports: [RouterLink],
  template: '<h1>Page not found</h1><a routerLink="/people">Back to people</a>',
})
class NotFound {}

export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', component: PeopleList, title: 'People | Pulse' },
  { path: 'people/:id', component: PersonDetail, title: 'Contact | Pulse' },
  { path: '**', component: NotFound, title: 'Page not found | Pulse' },
];
