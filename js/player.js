let player = {} // empty object
let playerDefaults = {
  gold: 1000,
  pet_score: 0,
  rebirth_stones: 0,
  rebirth_count: 0,
  crystals_destroyed: 0,
  stats: {
    gold_multiplier: 1.00,
    damage_multiplier: 1.00,
    attack_speed: 1.00,
    egg_hatch_speed: 1.00
  },
  inventory: {
    max_pets: 500,
    total_pets: 0,
    pets: [],
    shiny_skins: {},
    metallic_skins: {
      chrome: {},
      gold: {},
      diamond: {},
      obsidian: {},
      titanium: {},
    },
  },
  unlocked_areas: ["Spawn", "Meadow"],
  titanium_ingots: 0,
  equipped_pets: {
    1: { unlocked: true, pet: null, crystal: null },
    2: { unlocked: true, pet: null, crystal: null },
    3: { unlocked: true, pet: null, crystal: null },
    4: { unlocked: true, pet: null, crystal: null },
    5: { unlocked: false, pet: null, crystal: null },
    6: { unlocked: false, pet: null, crystal: null },
    7: { unlocked: false, pet: null, crystal: null },
    8: { unlocked: false, pet: null, crystal: null },
    9: { unlocked: false, pet: null, crystal: null },
    10: { unlocked: false, pet: null, crystal: null },
    11: { unlocked: false, pet: null, crystal: null },
    12: { unlocked: false, pet: null, crystal: null },
  },
  discovered_pets: [],
  premium_pet_slots: false,
  egg_prices: "base",
};
