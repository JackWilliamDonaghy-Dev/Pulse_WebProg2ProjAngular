# Walk through Pulse from the browser back to MongoDB

## Start with what you can see

| Worksheet example | Pulse equivalent | What to explain |
| --- | --- | --- |
| `car-list` → `car-card` | `people-list.html` → `person-card.ts` | The parent passes `[person]="person"`. The child declares `input.required<Person>()` and reads it as `person()`. |
| `cars/new` before `cars/:id` | `app.routes.ts` | If the ID route came first, Angular could treat `new` as a MongoDB ID. |
| `[formGroup]="carForm"` | `person-form.html` and `person-form.ts` | `ReactiveFormsModule` makes the template directive available. `FormBuilder` creates the actual group. `formControlName` connects each field to a named control. |
| Form submit | `PersonForm.onSubmit()` and `PulseApi` | Validate and normalise input, then send POST for a new record or PUT for an existing ID. |
| Angular service | `data/pulse-api.ts` | Templates do not know API URLs. Components ask the service, which sends the HTTP requests. |
| A related model | `person-detail.ts` and `interaction-form.ts` | Each interaction has a matching `personId`. Express filters that history and rejects a person deletion while linked records exist. |

## What changed across the five commits

1. Add Angular CLI scaffolding, Material theme, navigation and the development proxy.
2. Read the Express people endpoint and render a list, signal-input cards and a detail page.
3. Add reactive forms and create/update methods for people.
4. Add related interaction history with create/edit/delete and add confirmation for deletions.
5. Add filtering, route-level lazy loading, automated tests and this walkthrough.

## Ten-minute demonstration

1. Open the browser Network tab and filter for `/api/v1/`. Start at `/people` and open **Add person**.
2. Submit the empty form. Point out the validation messages and the absence of a POST request. Add a made-up person and inspect the **201** response and its `_id`.
3. Edit the name, show the **PUT** request and reload the person page to show the change persisted.
4. Log, edit and delete an interaction. Point out the `personId` on the POST payload and the filtered GET after returning to the contact page.
5. Delete the contact. Show the **DELETE** response and confirm the contact disappears from the list. Switch to a narrow viewport and demonstrate the search and status filters.
6. If asked to trace a save, point to the template, then the form handler, then the HTTP service, then the Express route/controller and Mongoose model.

Try one modification before the meeting. Change the initial check-in frequency in `person-form.ts`, then explain why the new default affects **Add** but not **Edit**.

## References

- [Angular reactive forms](https://v21.angular.dev/guide/forms/reactive-forms)
- [Angular input properties](https://v21.angular.dev/guide/components/inputs)
- [Angular HTTP setup](https://v21.angular.dev/guide/http/setup)
- [Angular Material components](https://material.angular.dev/components/categories)
