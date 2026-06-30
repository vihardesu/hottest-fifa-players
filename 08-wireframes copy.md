# Wireframes

## Context

- [Product Requirements](01-product-requirements.md)
- [User Flows](02-user-flows.md)

## Stakeholder & Client Map

| Stakeholder | Client Interface | Screens |
|-------------|------------------|---------|
| Anonymous visitor | Responsive web (mobile + desktop) | [Matchup View](#matchup-view), [Leaderboard View](#leaderboard-view) |

## Coverage

All in-scope PRD features are represented:

- Head-to-head matchup with side-by-side player cards and tap-to-vote — **Matchup View**
- Fair matchup selection from global pool — **Matchup View** (implicit via "Next matchup" cycle)
- Global ELO leaderboard with live updates — **Leaderboard View**
- View switching between game and leaderboard — shared tab bar on both screens
- Anonymous participation (no login) — no auth screens; app loads directly into matchup
- Responsive mobile/desktop layout — wireframes show mobile-first; desktop adds side-by-side width

No `[Future]` screens — admin panel, auth, filters, and social sharing are out of scope.

---

## Matchup View

**Stakeholder**: Anonymous visitor  
**Client Interface**: Responsive web (mobile + desktop)  
**Related Flow**: [Head-to-Head Vote](02-user-flows.md)

### Purpose

Present two FIFA players side by side; user taps the one they consider hotter. After voting, the next pair loads automatically.

### Wireframe

```
┌─────────────────────────────────────┐
│  FIFA Face-Off          [Board]   │
├─────────────────────────────────────┤
│                                     │
│   ┌───────────┐   ┌───────────┐    │
│   │           │   │           │    │
│   │  [Photo]  │   │  [Photo]  │    │
│   │           │   │           │    │
│   ├───────────┤   ├───────────┤    │
│   │ Player A  │   │ Player B  │    │
│   │ ELO 1542  │   │ ELO 1487  │    │
│   └───────────┘   └───────────┘    │
│                                     │
│        "Who's hotter?"              │
│                                     │
├─────────────────────────────────────┤
│  [ Matchup ]    [ Leaderboard ]     │
└─────────────────────────────────────┘
```

### Elements

- **Header**: App title; lightweight link/button to switch to leaderboard
- **Player card (×2)**: Photo, name, current ELO rating; entire card is tappable
- **Prompt text**: Short instruction ("Who's hotter?")
- **Tab bar**: Matchup (active) and Leaderboard tabs
- **Loading state** (not shown): Skeleton cards while next pair fetches
- **Rate-limit toast** (not shown): Brief message if vote throttled

### Actions

- Tap either player card → submit vote, show brief confirmation, load next pair
- Tap "Leaderboard" tab or header link → navigate to Leaderboard View
- Tap inactive tab → switch views

---

## Leaderboard View

**Stakeholder**: Anonymous visitor  
**Client Interface**: Responsive web (mobile + desktop)  
**Related Flow**: [Live Leaderboard Viewing](02-user-flows.md)

### Purpose

Display globally ranked players by ELO. List updates in real time as votes arrive from all users worldwide.

### Wireframe

```
┌─────────────────────────────────────┐
│  FIFA Face-Off          [Vote]    │
├─────────────────────────────────────┤
│  LIVE  Global Hotness Rankings      │
├─────────────────────────────────────┤
│  #1  [img]  Kylian Mbappé    1682  │
│  #2  [img]  Erling Haaland   1671  │
│  #3  [img]  Jude Bellingham  1654  │
│  #4  [img]  Vinícius Jr.     1648  │
│  #5  [img]  Bukayo Saka      1639  │
│              ...                    │
│  #50 [img]  Player Name      1521  │
├─────────────────────────────────────┤
│  [ Matchup ]    [ Leaderboard ]     │
└─────────────────────────────────────┘
```

### Elements

- **Header**: App title; link back to matchup ("Vote")
- **Live indicator**: "LIVE" badge showing SSE connection is active
- **Ranking list**: Rank number, thumbnail, player name, ELO score; top 50 by default
- **Row highlight** (not shown): Brief flash on rows whose ELO changed from SSE push
- **Tab bar**: Matchup and Leaderboard (active) tabs
- **Empty/loading state** (not shown): Spinner on first fetch before SSE connects

### Actions

- Scroll list to browse rankings
- Tap "Matchup" tab or header "Vote" link → navigate to Matchup View
- Passive: list re-orders or updates scores when SSE `ranking_update` events arrive

---

## Desktop Layout Note

On viewports ≥768px, both screens expand to a centered max-width column (~480px cards side by side on matchup; wider ranking table on leaderboard). Tab bar remains at bottom on mobile and may move to top nav on desktop — layout detail left to implementation.
