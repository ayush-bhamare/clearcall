# ClearCall (prototype v0.1)

Voice call between two people, with in-call text and a spell-out tool.

## Run it
1. Install Node.js (v18 or newer) from nodejs.org
2. In this folder run:  `npm install`  then  `npm start`
3. Open http://localhost:3000 in two browser tabs (or two Chrome windows)
4. Enter the same call code in both and press Start call

## Test on two phones
Browsers only allow the microphone on https (or localhost). While the server runs, expose it with a tunnel, for example:
`npx cloudflared tunnel --url http://localhost:3000`
Open the https link it prints on both phones.

## Features
- Voice call (WebRTC)
- Message tab: normal text during the call
- Spell out tab: big tiles with phonetic words (B = Bravo), and a "Got it" button for the other person
- "Suggest from what I say": uses Chrome speech recognition on your own microphone and offers to send detected letters/numbers as spelled-out text (experimental)
