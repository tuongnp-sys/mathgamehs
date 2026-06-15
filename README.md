# MathGameHS

Portal-ready THPT math exam game — QĐ 764 format (22 questions, 90 minutes).

## Quick start

```bash
npm install
npm run dev          # http://localhost:5180
npm run build        # production build → dist/
```

## Game modes

| Mode | Description |
|------|-------------|
| **Treasure quest** | Matrix exam (22 Q) with world map, trail, micro-rewards, region cutscenes |
| **Official exams** | Fixed 2025-0101 / 2026-0116 (bilingual VI/EN) |
| **Practice** | Part I / II / III only |
| **Mistake notebook** | Review wrong answers with static wizard tips |

## Portal builds

```bash
npm run build:portal
npm run package:itch
npm run package:gamepix
npm run package:crazygames
npm run package:poki
npm run measure:dist
```

Test locally: `http://localhost:5180/?platform=gamepix`

See [docs/PORTAL_PLAYBOOK.md](docs/PORTAL_PLAYBOOK.md) and [docs/AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md).

## Content

- `content/bank/questions.json` — seed question bank (22 matrix slots)
- `content/bank/official/` — official exam packs
- `content/bank/matrix-764.json` — QĐ 764 slot definitions
- `npm run extract:exam-pages` — PDF page images for official exams

## Architecture

- **Tier A (V1):** Vite static JSON + client exam engine (`src/app/exam-engine.js`, `scoring.js`)
- **Tier B (later):** Postgres admin + AI bulk import (`server/schema.sql`)
- **No AI at runtime** — wizard hints are static `mistakeFeedback` or topic templates

## Project status (V1 basic)

- [x] Quest flow: hub → briefing → trail → cutscenes → treasure
- [x] Unified VI/EN toggle (UI + exam content)
- [x] Quest resume, session gold, history (20 sessions)
- [x] Mistake notebook + wizard static hints
- [x] Portal adapters + ad policy (restart only)
- [ ] Large question bank (~100/slot) — content pipeline Phase C
- [ ] Admin moderation UI — Phase C
