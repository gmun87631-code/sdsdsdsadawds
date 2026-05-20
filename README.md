# Clash Hands

A working browser prototype for a server-authoritative multiplayer survival card game based on rock-paper-scissors logic.

## Run

```powershell
npm start
```

Open `http://localhost:3000` in one or more browser tabs. The host can add bots from the lobby so the match can be tested without ten human clients.

## Implemented Prototype Rules

- Up to 10 players in a free-for-all survival match.
- No movement, no board movement, round-based play only.
- Each alive player draws 3 cards every round.
- Each alive player locks 1 card during an 8 second selection phase.
- Server auto-selects a random valid card when time expires.
- Hidden selections are not sent to clients before reveal.
- Server validates alive state, card ownership, duplicate locks, and Dodge chaining.
- Scissors, Rock, Paper, Guard, Pierce, and Dodge are the only cards.
- Starting lives are 2, with a host-controlled hardcore option.
- Eliminated players become spectators.
- Last surviving player wins.
- Sudden death starts after 6 minutes, sets alive players to 1 life, removes Dodge, weakens Guard, and can activate danger cards after 3 no-elimination rounds.

## Main Systems

The prototype keeps the requested systems as explicit classes:

- `LobbyManager`
- `MatchManager`
- `RoundManager`
- `DeckSystem`
- `CardDrawSystem`
- `CardSelectionSystem`
- `ResultResolver`
- `PlayerState`
- `SpectatorSystem`
- `UIManager`
- `NetworkManager`

Configurable gameplay values are grouped in `GAME_CONFIG` at the top of `server.js`.
