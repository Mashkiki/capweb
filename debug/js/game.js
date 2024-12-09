function startGame() {
  currentArea = "Spawn"
  createAreaElement()
  renderArea()
  renderAreaWalls()
}

function createCrystal(area) {
  let newCrystal = generateCrystalObject(area)
  if (!newCrystal) {
    return
  }
  let crystalRender = renderCrystal(newCrystal)
  if (crystalRender) {
    Areas[area]["activeCrystals"].push(newCrystal);
    return crystalRender
  }
  console.error("Couldn't create crystal due to previous errors.\nError code: 15")
  return crystalRender
}
function createCrystalsForArea(chosenArea) {
  let result = createCrystal(chosenArea)
  if (result) {
    setTimeout(() => {createCrystalsForArea(chosenArea)}, 300)
  }
}

let previousAreaButton = document.querySelector("#previousAreaButton")
let changeAreaButton = document.querySelector("#changeAreaButton")
let changeAreaButtonText = changeAreaButton.querySelector("h2")
console.log
let nextAreaButton = document.querySelector("#nextAreaButton")
function areaControlButtonStatusUpdate() {
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  if (currentChangeArea == 0) {
    previousAreaButton.className = "area-button-disabled"
    nextAreaButton.className = "area-button-enabled"
  } else if (currentChangeArea == areaArray.length - 1) {
    previousAreaButton.className = "area-button-enabled"
    nextAreaButton.className = "area-button-disabled"
  } else {
    previousAreaButton.className = "area-button-enabled"
    nextAreaButton.className = "area-button-enabled"
  }
  if (areaArray[currentChangeArea] == currentArea) {
    changeAreaButton.className = "area-button-disabled"
  } else {
    changeAreaButton.className = "area-button-enabled"
  }
  if (player.unlocked_areas.includes(areaArray[currentChangeArea])) {
    changeAreaButtonText.innerText = `${currentChangeArea}: ${areaArray[currentChangeArea]}`
  } else {
    changeAreaButtonText.innerText = `${currentChangeArea}: Locked`
    changeAreaButton.className = "area-button-disabled"
  }
}
function nextChangeArea() {
  if (nextAreaButton.className == "area-button-disabled") {
    // Can't go further with areas
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeAreaButton.setAttribute("data-area", parseInt(currentChangeArea) + 1)

  areaControlButtonStatusUpdate()
}
nextAreaButton.addEventListener("click", nextChangeArea)
function previousChangeArea() {
  if (previousAreaButton.className == "area-button-disabled") {
    // Can't go earlier with areas
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeAreaButton.setAttribute("data-area", parseInt(currentChangeArea) - 1)

  areaControlButtonStatusUpdate()
}
previousAreaButton.addEventListener("click", previousChangeArea)
function clickChangeArea() {
  if (changeAreaButton.className == "area-button-disabled") {
    // Can't change to current area
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeArea(areaArray[currentChangeArea])

  areaControlButtonStatusUpdate()
}
changeAreaButton.addEventListener("click", clickChangeArea)

function changeArea(newArea) {
  if (document.getElementById(newArea)) {
    document.getElementById(currentArea).style.display = "none"
    currentArea = newArea
    document.getElementById(newArea).style.display = "block"
    return
  }
  document.getElementById(currentArea).style.display = "none"
  currentArea = newArea
  createAreaElement()
  renderArea()
  renderAreaWalls()
  createCrystalsForArea(newArea)
}

let navigationButtons = document.querySelectorAll(".navigation-button")
function changeTab(tab) {
  let activeTab = document.querySelector(".active-tab")
  activeTab.style.display = "none"
  activeTab.classList.remove("active-tab")
  let newTab = document.getElementById(tab)
  newTab.style = ""
  newTab.classList.add("active-tab")

  let activeTabNavigationButton = document.querySelector(`div[data-href="${activeTab.id}"]`)
  activeTabNavigationButton.classList.remove("active-tab-navigation-button")
  let newTabNavigationButton = document.querySelector(`div[data-href="${newTab.id}"]`)
  newTabNavigationButton.classList.add("active-tab-navigation-button")
}
for (i = 0; i < navigationButtons.length; i++) {
  let navButton = navigationButtons[i]
  let href = navButton.getAttribute("data-href")
  navButton.addEventListener("click", () => {changeTab(href)})
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
  petElement.classList.add(`${(pet.rarity).toLowerCase()}-pet`)
  petElement.setAttribute("data-petid", pet["id"])
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
  return petElement
}
let petSlots = document.querySelectorAll(".unlocked-pet-slot, .locked-pet-slot")
function findPetEquipSlot(pet) {
  for (i = 0; i < petSlots.length; i++) {
    let petSlotID = petSlots[i].id.replace("petSlot", "")
    let playerPetSlot = player["equipped_pets"][petSlotID]
    if (playerPetSlot["pet"] == pet) {
      return petSlotID
    }
  }
  console.warn("Couldn't find desired pet's equip slot.")
}
function unequipPet(pet) {
  let petSlotID = findPetEquipSlot(pet)
  let petSlotElement = document.getElementById(`petSlot${petSlotID}`)
  let petElement = document.querySelector(`[data-petid="${pet["id"]}"`)
  clearPetCrystal(pet)
  petElement.classList.remove("pet-element-equipped")
  let playerPetSlot = player["equipped_pets"][petSlotID]
  playerPetSlot["pet"] = null
  pet["equipped"] = false
  petSlotElement.innerHTML = ""
}
function unequipPetSlot(petSlotID) {
  let playerPetSlot = player["equipped_pets"][petSlotID]
  if (playerPetSlot["pet"] == null) {
    return
  }
  let petIndex = player.inventory.pets.indexOf(playerPetSlot["pet"])
  let pet = player.inventory.pets[petIndex]
  unequipPet(pet)
}
for (i = 0; i < petSlots.length; i++) {
  let petSlotID = petSlots[i].id.replace("petSlot", "")
  petSlots[i].addEventListener("click", () => {
    unequipPetSlot(petSlotID)
  })
}
function createEquippedPetElement(pet) {
  let equippedPetElement = createPetElement(pet)
  equippedPetElement.className = "equipped-pet-element"
  equippedPetElement.classList.add(`${(pet.rarity).toLowerCase()}-pet`)
  equippedPetElement.addEventListener("click", () => {unequipPet(pet)})
  return equippedPetElement
}
function equipPet(pet) {
  if (pet["equipped"] == true) {
    unequipPet(pet)
    return
  }
  let availablePetSlot = null;
  for (i = 0; i < petSlots.length; i++) {
    let petSlotID = petSlots[i].id.replace("petSlot", "")
    let playerPetSlot = player["equipped_pets"][petSlotID]
    if (playerPetSlot["unlocked"] == true && playerPetSlot["pet"] == null) {
      availablePetSlot = petSlotID
      break
    }
  }
  if (availablePetSlot == null) {
    console.log("Max pets equipped")
    return
  }

  pet["equipped"] = true
  let equippedPetElement = createEquippedPetElement(pet)
  let petSlotElement = document.getElementById(`petSlot${availablePetSlot}`)
  let petElement = document.querySelector(`[data-petid="${pet["id"]}"`)
  petElement.classList.add("pet-element-equipped")
  let playerPetSlot = player["equipped_pets"][availablePetSlot]
  playerPetSlot["pet"] = pet
  petSlotElement.appendChild(equippedPetElement)
  autoTargetCrystals()
}
let equipBestPetsDB = false;
function equipBestPets() { // AI made this :(
  if (equipBestPetsDB == true) {
    return
  }
  equipBestPetsDB = true
  const pets = player.inventory.pets;
  const petsWithDamage = pets.map(pet => {
    return { pet: pet, damage: defaultPetDamage["base"][pet.rarity] };
  });

  petsWithDamage.sort((a, b) => b.damage - a.damage);

  let equipSlot = 1;
  for (let i = 0; i < petsWithDamage.length && equipSlot <= 12; i++) {
    const petWithDamage = petsWithDamage[i];

    // Check if the pet can be equipped
    if (petWithDamage.pet && player.equipped_pets[equipSlot].unlocked) {
      unequipPetSlot(equipSlot)
      equipPet(petWithDamage.pet)
      equipSlot++;
    }
  }
  setTimeout(() => {
    equipBestPetsDB = false
  }, 500)
}
document.getElementById("equipBestPetsButton").addEventListener("click", () => { equipBestPets(); equipBestPets() })
function addPetToInventory(pet) {
  if (player.inventory.pets.length >= player.inventory.max_pets) {
    // Max pets reached. If the function was somehow called after reaching that limit, don't continue.
    return
  }
  player.inventory.pets.push(pet)
  let petElement = createPetElement(pet)
  petElement.addEventListener("click", () => { equipPet(pet) })
}

let petsEquipped = document.querySelector("#petsEquipped")
function updatePetsEquipped() {
  let unlockedPetSlots = 0
  let equippedPets = 0
  for (i = 0; i < petSlots.length; i++) {
    let petSlotID = petSlots[i].id.replace("petSlot", "")
    let playerPetSlot = player["equipped_pets"][petSlotID]
    if (playerPetSlot["unlocked"] == true) {
      unlockedPetSlots++
    }
    if (playerPetSlot["pet"] !== null) {
      equippedPets++
    }
  }
  petsEquipped.innerText = `${equippedPets} / ${unlockedPetSlots} equipped`
}
let petsShown = document.querySelector("#petsShown > h6")
function updatePetsShown() {
  // let shownPets = getShownPets()
  let shownPets = player.inventory.pets.length
  let totalPets = player.inventory.pets.length
  petsShown.innerText = `${shownPets} / ${totalPets} pets shown`
}

function updatePetInventory() {
  updatePetsEquipped()
  updatePetsShown()
  setTimeout(updatePetInventory, 400)
}
updatePetInventory()

function getRandomCrystal() {
  let activeCrystals = Areas[currentArea]["activeCrystals"]
  let crystalIndex = Math.floor(Math.random() * activeCrystals.length)
  return Areas[currentArea]["activeCrystals"][crystalIndex]
}
function getSlotOfPet(pet) {
  for (i = 1; i <= 12; i++) {
    if (pet && player.equipped_pets[i]["pet"] == pet) {
      return i
    }
  }
  console.error("Desired pet wasn't found in any of the equip slots")
}
function getCrystalOfPet(pet) {
  let petSlot = getSlotOfPet(pet)
  let slotCrystal = player.equipped_pets[petSlot]["crystal"]
  for (i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
    if (slotCrystal && Areas[currentArea]["activeCrystals"][i] == slotCrystal) {
      return i
    }
  }
}
function getCrystalElement(crystal) {
  let crystalID = `${crystal["area"]}x${crystal["gridCoordinates"]["x"]}y${crystal["gridCoordinates"]["y"]}`
  return document.querySelector(`#${crystalID}`)
}
function targetCrystal(pet, crystal) {
  crystal["attackedBy"].push(pet)
  player.equipped_pets[getSlotOfPet(pet)]["crystal"] = crystal
}
function clearCrystalTargets(crystal) {
  for (i = 0; i < crystal["attackedBy"].length; i++) {
    player.equipped_pets[getSlotOfPet(crystal["attackedBy"][i])]["crystal"] = null
  }
  crystal["attackedBy"] = new Array()
}
function clearPetCrystal(pet) {
  for (i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
    if (Areas[currentArea]["activeCrystals"][i]["attackedBy"] == new Array()) {
      continue
    }
    let petIndex = Areas[currentArea]["activeCrystals"][i]["attackedBy"].indexOf(pet)
    if (petIndex < 0) {
      continue // Couldn't find desired pet in this exact crystal
    }
    Areas[currentArea]["activeCrystals"][i]["attackedBy"].splice(petIndex, 1)
    player.equipped_pets[getSlotOfPet(pet)]["crystal"] = null
  }
}
function autoTargetCrystals() {
  for (i = 1; i <= 12; i++) {
    if (!(player.equipped_pets[i]["pet"] !== null && player.equipped_pets[i]["crystal"] == null)) {
      continue
    }
    let petIndex = player.inventory.pets.indexOf(player.equipped_pets[i]["pet"])
    let pet = player.inventory.pets[petIndex]
    targetCrystal(pet, getRandomCrystal())
  }
}
function calculateDamageMultiplier() {
  player.stats.damage_multiplier = 1
}
function calculatePetDamage(pet) {
  // let petType = actual pet type...
  let petType = "base"
  let defaultDamage = defaultPetDamage[petType][pet.rarity]
  return Math.round(defaultDamage * player.stats.damage_multiplier)
}
function calculateCrystalDamage(crystal, pet) {
  let petDamage = calculatePetDamage(pet)
  if (petDamage > crystal["hp"]) {
    return crystal["hp"]
  }
  if (petDamage <= crystal["hp"]) {
    return petDamage
  }
}
function destroyCrystal(crystal) {
  clearCrystalTargets(crystal)
  let crystalElement = getCrystalElement(crystal)
  crystalElement.parentNode.removeChild(crystalElement)
  let crystalIndex = Areas[currentArea]["activeCrystals"].indexOf(crystal)
  Areas[currentArea]["activeCrystals"].splice(crystalIndex, 1)
}
function attackCrystals() {
  for (i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
    for (j = 0; j < Areas[currentArea]["activeCrystals"][i]["attackedBy"].length; j++) {
      let crystalDamage = calculateCrystalDamage(Areas[currentArea]["activeCrystals"][i], Areas[currentArea]["activeCrystals"][i]["attackedBy"][j])
      console.log(`HP = ${Areas[currentArea]["activeCrystals"][i]["hp"]} - ${crystalDamage}`)
      let result = Areas[currentArea]["activeCrystals"][i]["hp"] - crystalDamage
      if (result == 0) {
        destroyCrystal(Areas[currentArea]["activeCrystals"][i])
        break
      }
      Areas[currentArea]["activeCrystals"][i]["hp"] -= crystalDamage

      // Calculate crystal scale
      let crystalMaxHP = crystalSet[currentArea][Areas[currentArea]["activeCrystals"][i]["size"]].hp
      let scaleMultiplier = Areas[currentArea]["activeCrystals"][i]["hp"] / crystalMaxHP
      let hpScale = 0.75 * scaleMultiplier
      getCrystalElement(Areas[currentArea]["activeCrystals"][i]).style.transform = `scale(${0.25 + hpScale})`

      // Update slot crystal
      let petSlotID = getSlotOfPet(Areas[currentArea]["activeCrystals"][i]["attackedBy"][j])
      player.equipped_pets[petSlotID]["crystal"] = Areas[currentArea]["activeCrystals"][i]
      console.log(i, j)
    }
  }
  createCrystalsForArea(currentArea)
  autoTargetCrystals()
}
function attackLoop() {
  attackCrystals()
  // console.log("loop works?")
  setTimeout(attackLoop, 2000 / player.stats.attack_speed)
}
attackLoop()

startGame()
