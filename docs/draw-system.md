# Draw & Reward System (§ 06 & § 07)

## 1. Cadence & Eligibility
- Draws occur on a monthly cadence.
- Eligible subscribers must have an `active` subscription and exactly 5 rolling scores recorded.

## 2. Draw Types & Generation Logic
### A. Random Draw (Standard Lottery RNG)
- Generates 5 unique integers between `1` and `45` using uniform random distribution.
- All numbers have equal drawing probability:
  $$P(N) = \frac{1}{45}$$

### B. Algorithmic Draw (Score Frequency Weighted)
- Calculates the frequency of each Stableford score among all active subscriber submissions for that month.
- Numbers with higher frequency among active players receive proportional weight boosts:
  $$W(n) = 1 + 3 \times \text{Count}(n)$$
- 5 unique numbers are drawn without replacement using the weighted distribution.

## 3. Simulation Before Publish
- Administrators can test simulations repeatedly with varying pool sizes or logic modes before committing.
- Previews the exact winner counts, equal split amounts, and rollover outcomes.
- Publishing locks the draw, assigns winnings to user accounts, and populates the winner verification audit queue.
