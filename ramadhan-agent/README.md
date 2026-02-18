# Ramadhan Agent

A Node.js CLI app that gives you prayer times, Suhur and Iftar highlights, and a daily Ramadan objective — for any city in the world.

## Features

- Fetches real-time prayer times from the [Aladhan API](https://aladhan.com/prayer-times-api) (free, no key required)
- Highlights **Suhur** (Fajr) and **Iftar** (Maghrib) prominently
- Shows all 5 daily prayers
- Displays a unique daily Ramadan objective for each of the 30 days
- Works for any city and country worldwide

## Usage

```bash
node index.js --city "London" --country "UK"
node index.js --city "Nairobi" --country "Kenya"
node index.js --city "Mogadishu" --country "Somalia"
node index.js --city "New York" --country "US"
```

### Example Output

```
══════════════════════════════════════════════════
  ☪   RAMADAN PRAYER TIMES
  London, UK
  Ramaḍān 1, 1447 AH
══════════════════════════════════════════════════

  *** SUHUR ends at (Fajr): 05:36 ***

──────────────────────────────────────────────────
  Daily Prayers:
──────────────────────────────────────────────────
  Fajr    (Dawn)      :  05:36
  Dhuhr   (Midday)    :  12:14
  Asr     (Afternoon) :  14:48
  Maghrib (Sunset)    :  17:21
  Isha    (Night)     :  18:53
──────────────────────────────────────────────────

  *** IFTAR at (Maghrib): 17:21 ***

══════════════════════════════════════════════════
  RAMADAN DAY 1 — DAILY OBJECTIVE
══════════════════════════════════════════════════

  Day 1: Set your Ramadan intention (niyyah). Write down 3 goals for this month.

══════════════════════════════════════════════════
```

## Requirements

- Node.js v18+ (uses native `fetch`)

## Installation

```bash
git clone https://github.com/abdiwahabnunow/ramadhan-agent.git
cd ramadhan-agent
npm install
```

## Project Structure

```
ramadhan-agent/
├── index.js       ← CLI entry point
├── prayers.js     ← Fetches prayer times from Aladhan API
├── objectives.js  ← 30 daily Ramadan objectives
├── context.js     ← Parses CLI arguments
└── display.js     ← Formats and prints output
```

## Extendability

- `prayers.js` can be imported by a Telegram bot or Express server
- `objectives.js` is a pure data file, easy to expand
- `display.js` can be swapped for an HTML renderer or JSON API response
- `context.js` can be extended to read from a config file or database
