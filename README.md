# Pulse

Pulse helps you keep in touch with people. Set a check-in frequency, save conversation starters and log a history of calls, messages and meetings.

## Run locally

Use Node 22.12 or later from the Node 22 LTS line. You need a running MongoDB server or an Atlas database.

1. In one terminal, clone the [Express repository, assignment-2 branch](https://github.com/JackWilliamDonaghy-Dev/Pulse_WebProg2Proj/tree/assignment-2). Run `npm install`. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string. The local example expects MongoDB on port 27017. The Express app selects the `WP2Project` database. Run `npm run dev`.
2. In another terminal, in this Angular repository, run `npm ci` followed by `npm start`. Open [localhost:4200](http://localhost:4200).
3. Keep the Express port at 3001, or change the target in `proxy.conf.json` to match. The Angular development server forwards `/api/v1/**` to Express, so the browser sees a same-origin request. For a deployment, configure the host to forward those paths too.

Use a disposable database and fictional contact details for the class demo. The API was built for local coursework and does not include sign-in. Keep the real backend `.env` out of GitHub and use the private assignment upload for it.

## What is available

- Add, view, edit and delete people. Filter the list by name and check-in status.
- From a person’s detail page, add, edit and delete interactions. Remove any interaction history before deleting its contact.
- Person forms require non-blank names and a whole-number check-in frequency of at least one day. The interaction form requires a date and contact type.
- Interaction history is linked by `personId`. Logging an interaction does not change the separate, manually maintained **Last contacted** field.

## Build and test

```sh
npm run build
npm test -- --watch=false
```

The Angular suite passed 7 tests and the Express suite passed 32 against a disposable local MongoDB. A browser smoke test exercised both CRUD workflows, invalid form feedback, delete cancellation and name filtering at 1366 px and 390 px.

The [worksheet walkthrough and demo checklist](docs/walkthrough.md) explain how the code is organised and what to show in the interview.
