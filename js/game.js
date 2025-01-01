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

  clearAreaTargets()
  currentArea = newArea
  createAreaElement()
  renderArea()
  renderAreaWalls()
  createCrystalsForArea(newArea)
  setTimeout(autoTargetCrystals, 1000)
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
for (let i = 0; i < navigationButtons.length; i++) {
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
  for (let i = 0; i < petSlots.length; i++) {
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
for (let i = 0; i < petSlots.length; i++) {
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
  for (let i = 0; i < petSlots.length; i++) {
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
  for (let i = 0; i < petSlots.length; i++) {
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
  if (!pet) return undefined;
  for (let i = 1; i <= 12; i++) {
    if (player.equipped_pets[i]?.pet === pet) {
      return i;
    }
  }
  return undefined;
}
function getCrystalOfPet(pet) {
  let petSlot = getSlotOfPet(pet)
  let slotCrystal = player.equipped_pets[petSlot]["crystal"]
  for (let i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
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
function clearPetCrystal(pet) {
  player.equipped_pets[getSlotOfPet(pet)]["crystal"] = null
  for (let i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
    if (Areas[currentArea]["activeCrystals"][i]["attackedBy"] == new Array()) {
      continue
    }
    let petIndex = Areas[currentArea]["activeCrystals"][i]["attackedBy"].indexOf(pet)
    if (petIndex < 0) {
      continue // Couldn't find desired pet in this exact crystal
    }
    Areas[currentArea]["activeCrystals"][i]["attackedBy"].splice(petIndex, 1)
  }
}
function clearCrystalTargets(crystal) {
  if (!crystal || !crystal.attackedBy) return;

  // Make a copy of the array since we'll be modifying references
  const petsToRemove = [...crystal.attackedBy];

  for (let i = 0; i < petsToRemove.length; i++) {
    const petId = petsToRemove[i];
    const slotIndex = getSlotOfPet(petId);
    if (slotIndex !== undefined) {
      player.equipped_pets[slotIndex].crystal = null;
    }
  }
  crystal.attackedBy = [];
}
function clearAreaTargets() {
  let crystalsToClear = [...Areas[currentArea]["activeCrystals"]]
  for (let i = 0; i < crystalsToClear.length; i++) {
    clearCrystalTargets(crystalsToClear[i])
  }
}
function autoTargetCrystals() {
  if (Areas[currentArea]["activeCrystals"].length === 0) {
    return
  }
  for (let i = 1; i <= 12; i++) {
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
  for (x = 0; x < crystalSizes[crystal["size"]]["width"]; x++) {
    for (y = 0; y < crystalSizes[crystal["size"]]["height"]; y++) {
      areaGrids[crystal["area"]][crystal["gridCoordinates"]["x"] - 1 + x][crystal["gridCoordinates"]["y"] - 1 + y].occupied = false
    }
  }
}
function checkForDeadCrystals() {
  for (let i = 0; i < Areas[currentArea]["activeCrystals"].length; i++) {
    if (Areas[currentArea]["activeCrystals"][i]["hp"] <= 0) {
      destroyCrystal(Areas[currentArea]["activeCrystals"][i])
    }
  }
}
function showGoldAmount(crystal, amt) {
  let crystalElement = getCrystalElement(crystal)
  let textElement = drawText(amt, 24)
  textElement.classList.add("fredoka")
  textElement.classList.add("gold-text")
  textElement.classList.add("thin-black-text-outline")
  textElement.style.position = "absolute"
  textElement.style.zIndex = 1000
  textElement.style.margin = 0
  textElement.style.left = "50%"
  textElement.style.top = "50%"
  textElement.style.transform = "translate(-50%, -50%)"
  textElement.style.transition = `${1000 / player.stats.attack_speed}ms ease`
  crystalElement.appendChild(textElement)

  let crystalDimensions = {width: crystalElement.offsetWidth, height: crystalElement.offsetHeight}
  let randomOffsetX = Math.floor(Math.random() * 100 - 50)
  let randomOffsetY = Math.floor(Math.random() * 50)
  setTimeout(() => {
    textElement.style.left = `calc(${randomOffsetX}% + ${crystalDimensions.width / 2}px)`
    textElement.style.top = `-${randomOffsetY}%`
    textElement.style.transform = "translate(0, 0)"
    setTimeout(() => {
      textElement.style.opacity = "0"
    }, 800)
  }, 100)
  setTimeout(() => {
    textElement.remove()
  }, 2000 / player.stats.attack_speed)
}
function getGoldAmountFromDamage(dmg) {
  let randomMultiplier = Number((Math.random() * 0.6 + 1.2).toFixed(2));
  let goldAmount = Math.round(dmg * randomMultiplier)
  return goldAmount
}
function attackCrystals() {
  const currentAreaCrystals = Areas[currentArea]["activeCrystals"];

  for (let crystal of currentAreaCrystals) {
    if (crystal.attackedBy.length === 0) continue;

    for (let petId of crystal.attackedBy) {
      const crystalDamage = calculateCrystalDamage(crystal, petId);
      crystal.hp -= crystalDamage;
      let goldAmount = getGoldAmountFromDamage(crystalDamage)
      player.gold += goldAmount
      showGoldAmount(crystal, goldAmount)

      // Calculate crystal scale
      const crystalMaxHP = crystalSet[currentArea][crystal.size].hp;
      const scaleMultiplier = crystal.hp / crystalMaxHP;
      const hpScale = 0.67 * scaleMultiplier;

      const crystalElement = getCrystalElement(crystal);
      crystalElement.style.transform = `scale(${0.33 + hpScale})`;
      crystalElement.style.transition = '0.25s ease';
    }
  }

  checkForDeadCrystals();
  createCrystalsForArea(currentArea);
  autoTargetCrystals();
}
function attackLoop() {
  if (Areas[currentArea]["activeCrystals"].length === 0) {
    setTimeout(attackLoop, 2000)
    return
  }
  attackCrystals()
  setTimeout(attackLoop, 2000)
}
attackLoop()

function updateGoldDisplay() {
  let goldAmountDisplay = document.querySelector("#goldDisplay > h2")
  goldAmountDisplay.innerText = formatNumber(player.gold)
}
function updateResourcesLoop() {
  updateGoldDisplay()

  setTimeout(updateResourcesLoop, 1000/30)
}
updateResourcesLoop()

function darkenScreen() {
  let darken = document.createElement("div")
  darken.id = "screenDarken"
  darken.style = "transition: opacity 0.5s ease; background-color: black; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; opacity: 0; z-index: 20;"
  document.body.appendChild(darken)
  setTimeout(() => {
    darken.style.opacity = 0.95
  }, 50)
}
function playEggAnimation(rarity) {
  let eggElement = document.createElement("div")
  document.body.appendChild(eggElement)
  eggElement.classList.add("opened-egg")
  setTimeout(() => {
    eggElement.style = `top: 50%; animation: ${3000 / player.stats.egg_hatch_speed}ms ease 0.1s 1 openEgg; background-image: url("${eggs[rarity]["icon"]}")`
    setTimeout(() => {
      eggElement.remove()
    }, 3100 / player.stats.egg_hatch_speed)
  }, 100)
}
function undarkenScreen() {
  let darken = document.querySelector("#screenDarken")
  darken.style.opacity = 0
  setTimeout(() => {
    darken.remove()
  }, 500)
}
let eggButtons = document.querySelectorAll(".egg-button")
function updateEggPriceDisplay() {
  for (let i = 0; i < eggButtons.length; i++) {
    let rarity = String(eggButtons[i].id).replace("Egg", "")
    rarity = rarity.charAt(0).toUpperCase() + rarity.slice(1)

    let eggPrice = eggs[rarity]["price"][player.egg_prices]
    let eggPriceTextElement = eggButtons[i].querySelector(".egg-price > h3")
    eggPriceTextElement.innerText = `${formatNumber(eggPrice)} G`
  }
}
updateEggPriceDisplay()
function openEgg(rarity) {
  if (!eggs[rarity]) {
    return
  }
  let eggPrice = eggs[rarity]["price"][player.egg_prices]
  if (player.gold < eggPrice) {
    return
  }
  updateEggPriceDisplay()
  player.gold -= eggPrice
  darkenScreen()
  playEggAnimation(rarity)
  let hatchedPet = new Pet(rarity)
  setTimeout(() => {
    let closeHatchScreenButton = document.createElement("div")
    let closeHatchScreenButtonText = document.createElement("h3")
    let darken = document.querySelector("#screenDarken")
    closeHatchScreenButton.className = "close-hatch-screen-button"
    closeHatchScreenButtonText.className = "fredoka white-text black-text-outline"
    closeHatchScreenButtonText.innerText = "Continue"
    closeHatchScreenButton.appendChild(closeHatchScreenButtonText)
    closeHatchScreenButton.addEventListener("click", () => {
      undarkenScreen()
    })
    darken.appendChild(closeHatchScreenButton)

    let hatchedPetText = document.createElement("h1")
    hatchedPetText.className = "hatched-pet-text fredoka white-text black-text-outline"
    hatchedPetText.innerText = hatchedPet["name"]
    darken.appendChild(hatchedPetText)

    let hatchedRarityText = document.createElement("h3")
    hatchedRarityText.className = `hatched-rarity-text fredoka ${rarity.toLowerCase()}-text ${rarity.toLowerCase()}-text-outline`
    hatchedRarityText.innerText = rarity
    darken.appendChild(hatchedRarityText)

    addPetToInventory(hatchedPet)
  }, 3800 / player.stats.egg_hatch_speed)
}
for (let i = 0; i < eggButtons.length; i++) {
  let rarity = String(eggButtons[i].id).replace("Egg", "")
  rarity = rarity.charAt(0).toUpperCase() + rarity.slice(1)
  eggButtons[i].addEventListener("click", () => {
    if (eggButtons[i].classList.contains("locked-egg-button")) {
      return
    }
    openEgg(rarity)
  })
}

startGame()
