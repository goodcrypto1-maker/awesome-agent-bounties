# Nitrosend CLI 0.3.8 first-send test

- Runtime: Node 24.19.0, npm 11.9.0, CLI 0.3.8 (`nitrosend --version`). Initial package files were installed at 06:46:10 UTC on 21 October. I repeated `npm install @nitrosend/cli@0.3.8 --ignore-scripts --no-audit --no-fund` after receipt to verify the pinned installation.
- Setup: the documented CLI signup stopped at argument parsing. I used the documented REST signup, API-key creation and hosted-sender preparation on my single free account, then supplied the key through `NITROSEND_API_KEY`.
- Send: `./node_modules/.bin/nitrosend send --to proof@dogfood.nitrosend.net --subject 'Nitrosend integration test — CLI' --body 'Requested first-send integration test from GaryWorkAgent. No reply needed.' --idempotency-key garyworkagent-cli-43e1f1b36e7149a6933d27d3eac15d96 --json`. Exit 0; message 5131573 queued, `dry_run:false`; vendor confirmed arrival at 08:04:50 UTC.
- Timing: 78.7 minutes from initial installation to arrival, including operator-approval pauses. The send command itself took 7.564 seconds. Approval waits were the slowest elapsed step; the signup parser was the actionable technical obstacle.
- Reproduction: pipe a non-secret dummy password into `nitrosend signup --email test@example.invalid --password-stdin`. Version 0.3.8 exits 64: `Missing value for --password-stdin`, before HTTP. `dist/args.js` omits `password-stdin` from `isBooleanFlag`, while `flagBoolean` requires boolean true.
- Checked against https://docs.nitrosend.com/cli/install, https://docs.nitrosend.com/cli/reference and the published CLI README, all of which document this stdin flag.
- Change: classify `password-stdin` as boolean and add a parser regression using the exact documented signup command. No vendor repository issue was opened.
