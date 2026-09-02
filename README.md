# Cashquake 🌋💰

A multiplayer browser board game for rolling dice, buying questionable properties, making trades, and generally causing problems for your friends.

---

## What is Cashquake?

Cashquake is an independent property-trading board game you can play straight from your browser. 

You spin up a room, share a 5-letter code with friends, roll dice, buy up tiles, construct properties, haggle over trades, fight through auctions, and try to keep your bank balance above zero. No downloads, no signups, and no microtransactions—just open a link and start rolling.

---

## What's different about it?

I didn't try to reinvent how property board games work, but I wanted to make one that felt much less static and a lot more atmospheric to play online.

Instead of playing on the same plain board every time, Cashquake transforms into different visual and acoustic worlds with custom styling, background music, and sound design. 

Here is what gives matches their personality:

* **Eight Distinct Worlds:** Play across environments ranging from a neon-drenched cyberpunk city to a glossy 2000s Frutiger Aero landscape, a dark fantasy realm, or a retro 8-bit arcade.
* **Wild Rule Modifiers:** Turn on optional event shifts like market price crashes, rent roulette surprises, or tax redistributions that shake up the leaderboard when someone gets too comfortable.
* **Custom Game Rules:** Adjust starting money, GO pass rewards, auction timers, and mortgage penalties, or drop in quick presets for 15-minute speed matches or high-stakes strategy games.
* **Live Auctions & Multi-Item Trading:** Put unbought properties up for real-time bidding wars, or construct complex trade deals offering properties, cash, and jail passes.
* **AI Bot Personalities:** Fill open slots or play solo against distinct bot personalities like *Chaotic Carl*, *Safe Sally*, *Greedy Goblin*, and *Tycoon Jasmine*.

---

## The Eight Worlds

Each theme gives the game board, UI, and audio a completely different mood:

* 🌍 **World Metropolis** — Financial skyscrapers at dusk with urban architectural tones and city chimes.
* ⚡ **Cyber Neon 2099** — Dark cyberpunk grid with circuit lines, corporate megacorps, and terminal overlays.
* 🔮 **Mystic Fantasy Realm** — Arcane runes, dragon lairs, goblin mines, and crystal sound effects.
* 🚀 **Cosmic Space Expanse** — Deep space nebula, orbital outposts, constellation maps, and satellite comms.
* 🌸 **Anime Akiba District** — Akihabara neon, gachapon machines, idol billboards, and train platform audio.
* 🎰 **Casino Royale** — Deep green velvet felt, gold-rimmed roulette wheels, slot reels, and jackpot fanfares.
* 🕹️ **Pixel Quest 8-Bit** — Retro CRT arcade screen framing, pixel graphics, and chiptune soundscapes.
* 🌿 **Frutiger Aero** — Glossy aqua glass, optimistic eco-tech hills, water drops, and 2000s skeuomorphic details.

---

## A Note on Inspiration & Originality

Cashquake is a personal project created for fun, learning, and playing matches with friends.

It is heavily inspired by classic property-trading board games (such as *Monopoly* and *Business*) as well as modern browser implementations like *RichUp.io*. I make no claim to have invented the underlying board-game mechanics, dice movement rules, tile layouts, or property trading concepts. 

Cashquake is simply my own visual, audio, and code implementation of that familiar style of game. It is an independent personal project and is not affiliated with, sponsored by, authorized by, or endorsed by Hasbro, Inc., Monopoly, or any official rights holders.

---

## Why I Built It

I wanted a fast, lightweight way to play this style of board game with friends in a browser window without dealing with heavy downloads or account setups—while giving the board itself a lot more color, music, and energy. It also gave me an excuse to mess around with real-time multiplayer, custom themes, and way too many different board-game sound effects.

---

## How It Works & Local Setup

The project uses a Node.js and Express backend with Socket.IO to keep player turns, rolls, auctions, and game state synchronized in real time across clients, paired with a React and TypeScript frontend built using Vite.

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xdra1ned/Cashquake.git
   cd Cashquake
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development:**
   ```bash
   npm run dev
   ```
   This launches:
   * Backend server on `http://localhost:4000`
   * Vite frontend client on `http://localhost:5173`

4. **Play in browser:**
   Open `http://localhost:5173` in your browser.

### Testing the Single-Service Production Server

Cashquake is structured so a single Node server can serve both the API, WebSockets, and built frontend static assets:

```bash
# Build the client and type-check the server
npm run build

# Start the server in production mode
npm start
```
The server will run on `http://localhost:4000` (or `process.env.PORT`).

---

## Built With

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Web Audio API
* **Backend:** Node.js, Express, Socket.IO
