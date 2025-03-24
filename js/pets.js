// Create a pet class with it's rarity, crystal assignment and other stuff
// Handle targeting crystals
// make an inventory script...
// *shiny skins later
let pets = {
  Common: [
    "Labrador", "Dalmatian", "Snow Cat", "Brown Cat", "Snow Bunny", "Hare",
    "Chipmunk", "Squirrel", "Orange Squirrel", "Porcupine", "Possum", "Otter",
    "Deer", "Pig", "Boar", "Mole", "Chick", "Baby Ducky",
    "Duck", "Platypus", "Chicken", "Sheep", "Pink Ram", "Goat",
    "Donkey", "Mule", "Horse", "Meerkat", "Monkey", "Sloth",
    "Koala", "Tiger", "Armadillo", "Camel", "Owl", "Canary",
    "Emo Bird", "Baby Planta", "Aqua Dino", "Red Dino", "Mushroom", "Senior Shroom"
  ],
  Uncommon: [
    "Fox", "Red Panda", "Panther", "Leopard", "Siberian Tiger", "Cow",
    "Black Sheep", "Black Llama", "White Llama", "Skunk", "Mountain Goat", "White Pony",
    "Sand Camel", "Pangolin", "Tapir", "Dune Armadillo", "Baby Elephant", "Salamander",
    "Orange Salamander", "Chameleon", "Cool Chameleon", "Arctic Monkey", "Penguin", "Snow Owl",
    "Angry Hatchling", "Water Hatchling", "Planta", "Sweet Turnip", "Sour Turnip", "Bitter Turnip",
    "Spikey", "Ram", "Beaver", "Chunky Cat", "Spikey Shroom", "Brown Shroom",
    "Shadow Shroom", "Stressed Bird", "Demon Bird", "Terra Dino", "Starry Dino", "Springy Dragonette",
    "Fire Dragonette", "Greedy Dragonette", "Springy Unicorn", "Ethereal Unicorn", "Graceful Unicorn", "Swift Unicorn"
  ],
  Rare: [
    "Lion", "Lioness", "Wolf Pup", "Raccoon", "Wise Owl", "Snow Leopard",
    "Zebra", "Brown Bear", "Bull", "Bison", "Baby Buffalo", "Elephant",
    "Hippo", "Elk", "Anteater", "Ostrich", "Flamingo", "Kangaroo",
    "Fluffy", "Turtle", "Baby Crab", "Ruby Shellfish", "Emerald Shellfish", "Amethyst Shellfish",
    "Baby Octopus", "Cheery Nawhal", "Curious Narwhal", "Dizzy Narwhal", "Chill Penguin", "Honey Bee",
    "Baby Spider", "Angelic Spirit", "Wayward Spirit", "Evil Spirit", "Possessed Spirit", "Fireling",
    "Lava Shroom", "Ghostly Shroom", "Shroom Stumpy", "Vintage Stumpy", "Senior Planta", "Outcast Planta",
    "Karate Cactus", "Vibing Cactus", "Spikey Moomoo", "Aquatic Moomoo", "Spotted Hamster", "Ice Cream Hamster",
    "Dizzy Hamster", "Baby Hamster", "Fiendish Hatchling", "Wired Hatchling", "Ghostly Hatchling", "Hazey Dragonette",
    "Froggy Dragonette", "Yinyang Dragonette", "Fairy Unicorn", "Gallant Unicorn", "Radiant Unicorn", "Shamrock Unicorn"
  ]
}
let defaultPetDamage = {
  base: {
    Common: 10, Uncommon: 20, Rare: 30, Epic: 40, Legendary: 50, Prodigious: 60, Ascended: 70, Mythical: 80
  },
  shiny: {
    Common: 18, Uncommon: 36, Rare: 54, Epic: 72, Legendary: 90, Prodigious: 108, Ascended: 126, Mythical: 144
  }
}
class Pet {
  constructor(rarity) {
    this.id = player.inventory.total_pets
    this.rarity = rarity
    this.name = pets[this.rarity][Math.floor(Math.random() * pets[this.rarity].length)]
    this.equipped = false
    this.inMerge = false
    player.inventory.total_pets++
  }
}

let eggs = {
  Common: {
    price: {
      base: 750,
      cheaper_eggs: 650,
      even_cheaper_eggs: 550
    },
    icon: "assets/resources/common_egg.svg"
  },
  Uncommon: {
    price: {
      base: 3500,
      cheaper_eggs: 3000,
      even_cheaper_eggs: 2500
    },
    icon: "assets/resources/uncommon_egg.svg"
  },
  Rare: {
    price: {
      base: 16_000,
      cheaper_eggs: 14_000,
      even_cheaper_eggs: 12_000
    },
    icon: "assets/resources/rare_egg.svg"
  }
}
