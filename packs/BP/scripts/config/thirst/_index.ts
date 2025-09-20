// Central configuration for the thirst system
// Tweak these values to balance gameplay.

const thirstConfig = {
  max: 20, // Maximum thirst value
  decay: {
    minTicks: 1200, // Randomized decay window (min)
    maxTicks: 2400, // Randomized decay window (max)
    step: 20, // Interval driver step in ticks
  },
  ui: {
    titlePrefix: "updateThirst:", // Used by helper to show HUD title value
  },
};

export default thirstConfig;
