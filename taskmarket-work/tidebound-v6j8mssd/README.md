# Tidebound Isles

**Play:** https://tidebound-isles-v6j8mssd.goodcrypto1.chatgpt.site

An original turn-based territory game for **2–4 human and/or agent captains**, built for [Taskmarket TSK-V6J8MSSD](https://taskmarket.dev/tasks/0x1fb989a3256eadc92fe09e863ca36bed7765e5bcb2f8d2c28183201e467c272d). AI-assisted original design and implementation; no reused competitor game or submission.

## Rules, in one paragraph

Sail one fleet around a 5×5 archipelago for twelve turns each. Sailing claims the destination; a two-square gust costs one wind. Anchor your current tile for one wind: rivals pay two wind to take it, and it scores one extra point. Rest restores two wind (maximum three), while landing at the central well restores one. Fleets cannot pass through other fleets. At the end, score the values of your owned islands plus strongholds plus the size of your largest connected territory. Highest score wins; ties share victory.

## Play with friends or bots

Create a match, copy its eight-character code, and have friends join from separate browsers before starting. Choose two, three or four seats. The host's Start button fills vacant seats with built-in bots. Every participant has a private seat token stored in their own browser. No login, wallet or installation is required. A match has24–48 moves, designed for about five minutes; time depends on player decisions. Human and agent seats can share the same match.

The dashed islands are legal moves. The centre is valuable and restores wind, but defending your coast, connecting territory, saving wind for a raid and cutting an opponent's chain compete for the same turns. Strongholds cost wind both to build and attack. The board supports keyboard focus and reduced motion. The replay slider shows every committed move and board snapshot.

## Run locally

Node18+; no dependencies:

```sh
node dev-server.mjs
# open http://127.0.0.1:8787
node test.mjs
```

The local adapter stores matches in `.local-data/` (ignored by Git). The hosted Worker uses its provisioned R2 bucket. Match reads and moves are HTTP/JSON. Storage writes compare ETags atomically to prevent lost concurrent turns; every move also requires the current game revision. Tokens are omitted from public state. Matches stop being accessible after48 hours.

## Agent API

Full machine-readable documentation: **GET `/api/docs`**. Base URL is the Play origin above, or your local origin. POST bodies are JSON with `Content-Type: application/json`.

| Method | Path | Body / result |
|---|---|---|
| POST | `/api/matches` | `{ "name": "My agent", "players": 2 }` → `code`, `playerToken`, `state` |
| POST | `/api/matches/CODE/join` | `{ "name": "Guest agent" }` → private `playerToken`, public `state` |
| GET | `/api/matches/CODE` | Public state, legal moves, revision, scores and replay log |
| POST | `/api/matches/CODE/start` | Host's `{ "playerToken": "...", "revision": 0 }`; fill vacant seats with bots |
| POST | `/api/matches/CODE/move` | `{ "playerToken": "...", "revision": 1, "move": { "type": "sail", "to": 1 } }` |
| GET | `/sample-bot.mjs` | Runnable Node example; creates its own two-seat match and plays against a bot |

Use the current `state.revision`, not the example literal. `state.currentPlayer` is the zero-based seat whose turn it is. A creator holds seat0; joining fills successive vacant seats. Choose a move from `state.legalMoves`: sail supplies `type` and `to`; anchor/rest need only `type`. Grid indices are `y*5+x` with zero-based x/y (A1=0, E5=24). Poll at most once every two seconds while another human or agent has the turn. Built-in bots move during the same committed update until a human/agent turn is reached.

```sh
curl -o sample-bot.mjs https://tidebound-isles-v6j8mssd.goodcrypto1.chatgpt.site/sample-bot.mjs
node sample-bot.mjs https://tidebound-isles-v6j8mssd.goodcrypto1.chatgpt.site
```

Responses:400 invalid move/body,403 invalid seat token or non-host start,404 unknown code,409 wrong turn/stale revision/concurrent update,410 expired match. After409, read state and choose a move using its new revision. Do not blindly replay an uncertain write: inspect the state/log first. Keep seat tokens private; a public code permits spectators and, before start, new players.

## Implementation and verification

`worker/index.js` contains the original game engine, API, HTML/CSS/browser client and downloadable bot. `dev-server.mjs` adapts it to Node HTTP and local persistence. `test.mjs` exercises90 full engine games,2/3/4-player invariants, stronghold and movement rules, a complete two-agent API game, token privacy, invalid/out-of-turn/stale writes and concurrent ETag updates. The initial local run passed16,517 assertions. The Worker artifact passed ESM/build validation. Browser visual QA was unavailable in the build environment; no automated visual pass is claimed. Live API verification is recorded with the submission after deployment.

## Pitch

An open sea shared by people and agents: one small API drives both. Tidebound Isles turns a tiny board into a choice between expansion, connected coasts and costly strongholds; its wind economy makes reaching the centre powerful without making defence free.

## License

Original game source in this directory is MIT licensed. Permission is granted, free of charge, to use, copy, modify, distribute, sublicense and sell this software, subject to retaining this notice. The software is provided AS IS, without warranty of any kind. Copyright2026 Tidebound Isles contributors.
