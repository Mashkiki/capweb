// Create a pet class with it's rarity, crystal assignment and other stuff
// Handle targeting crystals
// make an inventory script...
// *shiny skins later
let pets = {
  Common: [
    "Labrador", "Dalmatian", "Snow Cat", "Brown Cat", "Snow Bunny", "Hare",
    "Chipmunk", "Squirrel", "Orange Squirrel", "Porcupine", "Possum", "Otter",
    "Deer", "Pig", "Boar", "Mole", "Chick", "Baby Ducky",
    "Duck", "Platypus", "Chicken", "Sheep", "Ram", "Goat",
    "Donkey", "Mule", "Horse", "Meerkat", "Monkey", "Sloth",
    "Koala", "Tiger", "Armadillo", "Camel", "Owl", "Canary",
    "Albino Canary", "Baby Union", "Water Dino", "Red Dino", "Mushroom", "Senior Shroom"
  ],
  Uncommon: [
    "Fox", "Red Panda", "Panther", "Leopard", "Snow Leopard", "Cow",
    "Black Sheep", "Black Llama", "White Llama", "Skunk", "Alpine Ibex", "White Pony"
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
    player.inventory.total_pets++
  }
}

let petInventoryNavigationButtons = document.querySelectorAll(".pet-inventory-tab-button")
function changePetInventoryTab(tab) {
  let activePetInventoryTab = document.querySelector(".active-pet-inventory-tab")
  activePetInventoryTab.style.display = "none"
  activePetInventoryTab.classList.remove("active-pet-inventory-tab")
  let newPetInventoryTab = document.getElementById(tab)
  newPetInventoryTab.style = ""
  newPetInventoryTab.classList.add("active-pet-inventory-tab")

  let activePetInventoryTabNavigationButton = document.querySelector(`div[data-href="${activePetInventoryTab.id}"]`)
  activePetInventoryTabNavigationButton.classList.remove("pet-inventory-tab-button-active")
  let newPetInventoryTabNavigationButton = document.querySelector(`div[data-href="${newPetInventoryTab.id}"]`)
  newPetInventoryTabNavigationButton.classList.add("pet-inventory-tab-button-active")
}
for (i = 0; i < petInventoryNavigationButtons.length; i++) {
  let navButton = petInventoryNavigationButtons[i]
  let href = navButton.getAttribute("data-href")
  navButton.addEventListener("click", () => {changePetInventoryTab(href)})
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
