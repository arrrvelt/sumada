# Sumada

Sumada is a mobile-first event judging and tabulation app. Organizers can create an event and share its room code with judges. Judges score contestants against weighted criteria, and Sumada calculates totals and rankings, with an optional criterion used to break ties.

The project is under active development and is not finished. Features, workflows, and setup may change as the app takes shape.

## Current project

- Expo and React Native app with Expo Router
- Event creation and event list backed by Supabase
- Room-code generation for sharing an event with judges
- Weighted score calculation and contestant ranking utilities

## Getting started

Install dependencies:

```sh
npm install
```

Start the Expo development server:

```sh
npm run start
```

The app uses Supabase. Configure the required Supabase environment values in `.env.local` before using features that connect to the backend. Never commit secrets or private keys.

## Available scripts

```sh
npm run start    # Start Expo
npm run android  # Start Expo for Android
npm run ios      # Start Expo for iOS
npm run web      # Start Expo for web
npm run lint     # Run Expo lint
npm test         # Run Jest tests
```

## Project structure

- `src/app/` — Expo Router screens and layouts
- `src/components/` — reusable UI components
- `src/lib/` — shared application and backend utilities
- `src/tabulation/` — score calculation and ranking logic
- `supabase/` — database-related project files

## License

See [LICENSE](LICENSE).
