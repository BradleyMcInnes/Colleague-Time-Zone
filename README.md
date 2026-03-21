# Time Zone Overlap

A lightweight, frontend-only tool for finding the best meeting times across global teams. Add up to 5 colleagues, pick their cities, and instantly see a 24-hour side-by-side view of everyone's working hours.

## Features

- **Auto-detects your timezone** on load based on your browser
- **111 major cities** across all continents, searchable by name or country
- **24-hour overlap table** showing each person's local time for every hour of your day
- **Working hours highlighted** (9 AM – 6 PM) per column
- **Perfect overlap rows** — prominently highlighted when everyone is in working hours simultaneously
- **Half-hour & quarter-hour timezone support** — cities like Mumbai (UTC+5:30) and Kathmandu (UTC+5:45) display correctly (e.g. "4:30 AM" not "4 AM")
- **Day-change labels** — shows the weekday (e.g. "SUN") when a colleague's timezone crosses midnight relative to yours
- **Drag to reorder columns** — drag colleague cards to rearrange the column order in the table
- **Live current time** — the current hour is highlighted and each column header shows the live local time, updating every minute
- **Up to 5 colleagues** plus yourself (6 columns total)

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide React](https://lucide.dev/) — icons
- Native `Intl` API — all timezone calculations, no external timezone library needed

## How It Works

All timezone math runs entirely in the browser using the built-in `Intl.DateTimeFormat` API — no backend, no database, no API calls.

The table anchors 24 hourly rows to **midnight in your selected base timezone**, not the browser's system timezone. This means the table is always correct even if your browser's system timezone differs from your chosen city.

## Getting Started

```bash
pnpm install
pnpm --filter @workspace/timezone-tool run dev
```

Then open the URL shown in the terminal.

## Project Structure

```
artifacts/timezone-tool/
├── src/
│   ├── components/
│   │   ├── city-picker.tsx      # Searchable city combobox
│   │   ├── overlap-table.tsx    # The 24-hour comparison table
│   │   └── person-card.tsx      # Individual person / timezone card
│   ├── lib/
│   │   ├── cities.ts            # 111-city dataset with IANA timezone mappings
│   │   └── time-utils.ts        # All timezone math (Intl API)
│   └── pages/
│       └── home.tsx             # Main page layout and state
```
