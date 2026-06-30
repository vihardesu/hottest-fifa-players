# Choosing a Ranking Algorithm for a Crowd-Sourced "Who's Better?" App

## The short answer

Use **Glicko-2** to rate the players, and choose which two players to show each
voter using **uncertainty-targeted matchmaking**. Together they do one thing
well: extract the most signal from every single vote, which is exactly what you
care about.

Plain Elo (what we sketched earlier) is a fine starting point and easy to reason
about, but it throws away the one piece of information that makes signal
optimization possible: *how sure the system currently is about each player.*
Glicko-2 tracks that, and once you have it, everything else falls into place.

---

## Why not just plain Elo?

Elo gives every player a single number: their rating. That number can't tell the
difference between two very different situations:

- A player rated 1700 because **thousands** of people have voted on them, and
  the crowd clearly agrees.
- A player rated 1700 because **four** people voted and it could easily be noise.

To Elo, those are identical. But for getting good signal, they're opposites. The
first player is *settled* — asking more questions about them is mostly wasted
votes. The second is *uncertain* — a few more votes there would genuinely sharpen
the ranking. If you can't tell them apart, you can't aim your votes where they
matter.

That "how sure am I" measurement is the whole game, and it's what Glicko-2 adds.

---

## How Glicko-2 works, in plain English

Every player carries three numbers instead of one:

- **Rating** — the same idea as Elo: roughly, how good the crowd thinks they are.
- **Rating Deviation (RD)** — the *uncertainty* around that rating. Think of it as
  an error bar. High RD means "we're guessing"; low RD means "we're confident."
  New players start with a big error bar; it shrinks as votes come in.
- **Volatility** — how erratic the player's results have been. It lets a player
  who's suddenly behaving unexpectedly move faster, then calms down again.

When a head-to-head vote comes in, Glicko-2 updates both players the way Elo
does — winner up, loser down — but with two improvements that matter for you:

1. **A player with a big error bar moves more.** If the crowd is still unsure
   about someone, one vote shifts them a lot. Once they're well-established, the
   same vote barely nudges them. (This is the smarter, automatic version of the
   "adaptive K-factor" hack from the Elo version — you get it for free.)

2. **The error bar shrinks as evidence accumulates,** and slowly grows back during
   long stretches with no votes, so a player nobody has compared in a while is
   correctly treated as "less certain than they used to be."

The headline ranking people see is just the rating, sorted high to low. The error
bar mostly works behind the scenes — but it's the thing that powers signal
optimization.

---

## The signal idea, made concrete

Here's the intuition that should drive the whole design:

**A vote teaches you the most when the outcome is hard to predict.**

If you show someone Messi vs. a third-choice goalkeeper, you already know how 95%
of people will vote. That vote confirms what you knew and changes almost nothing.
It's a wasted question.

If you show two players the system currently rates as roughly equal, the vote is a
genuine coin-flip — and *that's* where the answer actually moves the ranking. A
close matchup carries far more information than a blowout.

So the rule for maximizing signal per vote is:

> Show pairs that are **(a) close in rating** (so the outcome is uncertain) and
> **(b) involve at least one player the system is still unsure about** (high error
> bar).

Glicko-2 hands you both ingredients directly. (a) comes from comparing ratings;
(b) is the error bar (RD). You don't have to estimate uncertainty with a crude
proxy like "number of votes so far" — it's a real, maintained number.

A simple, effective recipe for picking each matchup:

1. Pick a first player with probability weighted toward **high RD** (the ones
   you're least sure about).
2. Pick their opponent from players with a **similar rating**, again leaning
   toward higher RD.
3. Add a little randomness so the same matchup isn't served repeatedly.

That's it. This quietly steers the crowd's attention toward the questions that
still need answering, and leaves the settled parts of the ranking alone.

---

## Good defaults

These are the standard, well-tested Glicko-2 starting values. You can ship with
them as-is.

| Setting | Default | What it means |
|---|---|---|
| Starting rating | **1500** | Everyone begins at the middle. |
| Starting RD | **350** | "We know nothing yet" — a wide error bar. |
| Starting volatility | **0.06** | Standard; rarely needs touching. |
| System constant (tau) | **0.5** | Controls how fast volatility can change. 0.3–0.6 is the normal range; lower = steadier. |
| Rating period | **batch every few hours** | Glicko-2 is designed to update in periodic batches rather than one vote at a time (see below). |

For matchmaking defaults: pair players within roughly **150–200 rating points** of
each other, and weight player selection by RD. Widen the window early on when the
roster is sparse; you can tighten it later once most players have a low RD.

---

## One practical wrinkle: rating periods

Elo updates instantly, one vote at a time. Glicko-2 is designed a little
differently — it expects you to collect votes over a **rating period** (a fixed
window of time) and apply them together. This is what lets it estimate volatility
properly.

For a live app this is easy to handle: collect incoming votes, and every few hours
run the Glicko-2 update for everyone who got voted on in that window. The public
ranking refreshes on that cadence. If you truly want second-by-second movement,
you can run very short periods, but a few hours is plenty for a leaderboard and
keeps the numbers stable and meaningful.

---

## Guardrails that matter regardless of algorithm

A few things sit outside the math but will make or break the app:

- **Store every raw vote** (winner, loser, timestamp, session), not just the
  ratings. The log lets you recompute the entire ranking from scratch for a clean,
  reproducible result, and it's the evidence you need to spot abuse later.

- **Expect people to brigade their favorites.** Cheap, effective defenses:
  rate-limit votes per session, ignore identical rapid-fire votes, and cap how far
  one session can move a single player in a day. Because you kept the raw log, you
  can retroactively discount suspicious sessions and just recompute.

- **Don't show the error bars to users.** They're a powerful internal tool but
  confusing on a public leaderboard. Show the rating and the rank; keep the
  uncertainty under the hood where it does its job.

---

## If you outgrow this

Glicko-2 is the right call for now: it's open, well-documented, online-friendly,
and gives you the uncertainty signal you wanted. Two directions you might look
later, neither of which you need on day one:

- **TrueSkill** — a close cousin (also tracks skill plus uncertainty). Comparable
  results; slightly more involved to implement. No real reason to switch unless
  you later add team-based or multi-player comparisons, which it handles natively.

- **A full Bayesian pairwise model (Bradley-Terry) run in batch** — the most
  statistically principled way to rank from pairwise votes, and it can pick
  maximally-informative matchups in a formally optimal way. It's heavier and not
  as natural for a continuously-running live app, so it's better as an occasional
  offline "ground truth" recompute than as your live engine.

---

## TL;DR

- **Rating engine:** Glicko-2 (rating + uncertainty + volatility).
- **Why:** the uncertainty estimate is what lets you optimize for signal.
- **Matchmaking:** show close-rated pairs, favor high-uncertainty players — that's
  where each vote teaches the most.
- **Defaults:** 1500 / RD 350 / vol 0.06 / tau 0.5, batch updates every few hours.
- **Don't forget:** keep the raw vote log, rate-limit to resist brigading, hide
  the error bars from users.