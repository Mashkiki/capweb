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
    this.rarity = rarity
    this.petid = Math.floor(Math.random() * pets[this.rarity].length)
    this.name = pets[this.rarity][this.petid]
  }
}

let petInventory = document.querySelector("#petInventory")
function createPetElement(pet) {
  let petElement = document.createElement("div")
  let petName = document.createElement("div")
  let petNameText = document.createElement("p")
  let petInfo = document.createElement("div")
  let petRarity = document.createElement("p")
  let petDamage = document.createElement("p")
  petElement.className = "pet-element"
  petName.className = "pet-name"
  petNameText.className = "fredoka black-text-outline"
  petInfo.className = "pet-info"
  petRarity.className = "fredoka pet-rarity"
  petDamage.className = "fredoka black-text-outline pet-damage"

  petNameText.innerText = pet.name
  petRarity.innerText = pet.rarity
  petDamage.innerText = defaultPetDamage["base"][pet.rarity]

  petInfo.appendChild(petRarity)
  petInfo.appendChild(petDamage)
  petName.appendChild(petNameText)
  petElement.appendChild(petName)
  petElement.appendChild(petInfo)
  petInventory.appendChild(petElement)
}
function addPetToInventory(pet) {
  if (player.inventory.pets.length >= player.inventory.max_pets) {
    // Max pets reached. If the function was somehow called after reaching that limit, don't continue.
    return
  }
  player.inventory.pets.push(pet)
  createPetElement(pet)
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
