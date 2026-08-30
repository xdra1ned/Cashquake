# Cashquake 🌋💰 — Real-Time Multiplayer Board Game

**Cashquake** is a free, browser-based, real-time multiplayer property trading and economy board game (inspired by Monopoly, Business, and RichUp.io).

Created with love and mild chaos by **Jasmine** ⭐.

---

## 🌟 Key Features

1. **100% Free & Zero Paywalls**:
   - Every single board map, game mode, rule setting, avatar, dice skin, and cosmetic is available without spending real money.
   - **QuakeVault In-Game Shop**: Unlock cosmetics and titles using *QuakeCoins* earned from playing matches, rolling doubles, collecting rent, and winning games!

2. **Instant Frictionless Play**:
   - **No Mandatory Login/Signup**: Friends receive a 5-letter room code (e.g. `CQ88X`) or direct link and start rolling immediately as guests.
   - **Reconnection Support**: If you refresh or drop connection, you seamlessly re-join with your money, properties, and position intact.
   - **Spectator Mode**: Watch games in real-time without taking a player slot.

3. **2D Top-Down Board with 5 Unique Themes**:
   - 🌍 **World Metropolis**: Tokyo, Paris, Cairo, New York, Rio, Sydney, London, and Rome.
   - ⚡ **Cyber Neon 2099**: Megacorps, Data Centers, Neural Nodes, and Cyber Prisons.
   - 🔮 **Mystic Fantasy Realm**: Dragon's Lair, Elven Spires, Goblin Mines, and Astral Observatories.
   - 🚀 **Cosmic Space Colony**: Lunar Base, Mars Outposts, Asteroid Mines, and Warp Gates.
   - 🌸 **Anime Akiba District**: Manga Cafes, Ramen Alley, Idol Stages, and Mecha Hangars.

4. **Deep Game Rules & Chaos Engine**:
   - **Categorized Rule Customizer**: Configure Economy (Starting Cash, GO rewards, rent multipliers, vacation cash pots), Properties (auctions, mortgage interest, even building), Movement, and Detention.
   - **Presets**: *Classic Tycoon, Speed Quake (15-min blitz), High Roller Strategy, Total Chaos, Anarchy Mode, and Custom*.
   - **Chaos Modifiers**: *Rent Roulette (3x rent surprise), Market Crash (-40% prices), Blood Money (rent redistribution to the poorest), Robin Hood, Bank Glitch, and Tax Surges*.

5. **Multiplayer & Smart AI Bots**:
   - Up to 8 players per room!
   - Built-in AI Bots (*Chaotic Carl, Safe Sally, Greedy Goblin, Tycoon Jasmine*) for instant solo practice or filling empty slots.

6. **Interactive Modals & Real-Time Trading**:
   - **Multi-Asset Trading Floor**: Propose trades with multiple properties, cash amounts, and Get-Out-of-Jail cards.
   - **Live Property Auctions**: Real-time bidding war with live countdown ticker and anti-sniping extensions.
   - **Property Portfolio Manager**: Construct houses/hotels, mortgage, and unmortgage with full rule enforcement.
   - **Web Audio Sound Effects**: Crispy synthesized dice rattling, cash register *cha-ching*, jail door slams, and victory fanfares.

7. **End-of-Game Ceremony & Friendship Destruction Stats**:
   - 🥇 🥈 🥉 Animated victory podium with celebratory confetti.
   - Match analytics: *The Ruthless Slumlord, The Money Pit, Frequent Convict, Master Diplomat, and Friendship Hazard Level*.

8. **Jasmine's Creator Easter Egg 💖**:
   - Interactive creator badge in the menu and footer.
   - Rare Fortune Card: *"Jasmine’s Blessing (+ $150 & +50 QuakeCoins)"*!

---

## 🚀 Quick Start & Installation

To run Cashquake locally:

```bash
# 1. Install dependencies in root, server, and client
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 2. Start both server and client concurrently
npm run dev
```

Open your browser to:
**`http://localhost:5173`**

To play with friends on the same local network:
Share your local IP address: `http://<YOUR_LOCAL_IP>:5173/?code=YOUR_ROOM_CODE`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API.
- **Backend**: Node.js, Express, Socket.IO, TypeScript, UUID.
- **Shared Logic**: Deterministic game engine rules and type definitions shared across client and server.
