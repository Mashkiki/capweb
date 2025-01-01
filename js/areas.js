let areaArray = new Array()
class Area {
  constructor(id, name, maxCrystals) {
    this.id = id;
    this.name = name;
    this.maxCrystals = maxCrystals;
    this.activeCrystals = new Array();
    this.loaded = false
    areaArray.push(name)
  }
  setRequirement(type, amount) {
    this.requirementType = type;
    this.requirementAmount = amount;
  }
  setSurfaceImage(image) {
    this.surfaceImage = image // THIS WILL BE CHECKED FROM THE HTML FILE
                              // SO THE SYNTAX IS "assets/resources/FILE"
  }
}

let Areas = new Object();
Areas.Spawn = new Area(0, "Spawn", 0);
Areas.Spawn.setRequirement("free", 0);
Areas.Spawn.setSurfaceImage("assets/resources/spawn_grass.png")

Areas.Meadow = new Area(1, "Meadow", 16);
Areas.Meadow.setRequirement("free", 0);
Areas.Meadow.setSurfaceImage("assets/resources/meadow_grass.png")

Areas.Forest = new Area(2, "Forest", 18);
Areas.Forest.setRequirement("petScore", 15);
Areas.Forest.setSurfaceImage("assets/resources/forest_grass.png")

Areas.Desert = new Area(3, "Desert", 16);
Areas.Desert.setRequirement("petScore", 40);
Areas.Desert.setSurfaceImage("assets/resources/desert_sand.png")

Areas.Arctic = new Area(4, "Arctic", 15);
Areas.Arctic.setRequirement("petScore", 75);

Areas.Beach = new Area(5, "Beach", 16);
Areas.Beach.setRequirement("petScore", 120);

Areas.Mountains = new Area(6, "Mountains", 14);
Areas.Mountains.setRequirement("petScore", 175);

Areas.Jungle = new Area(7, "Jungle", 22);
Areas.Jungle.setRequirement("petScore", 210);

Areas.Grotto = new Area(8, "Grotto", 32);
Areas.Grotto.setRequirement("shinyScore", 100);

Areas.Grove = new Area(9, "Grove", 20);
Areas.Grove.setRequirement("shinyScore", 1000);

Areas.Mine = new Area(10, "Mine", 16);
Areas.Mine.setRequirement("metallicScore", 100);

function generateCrystalObject(specifiedArea) {
  if (!(specifiedArea in Areas)) {
    console.error("Error while generating crystal. Specified area doesn't exist. Maybe a typo?\nError code: 11");
    return;
  }
  if (specifiedArea == "Spawn") {
    // console.error("Error while generating crystal. The specified area CANNOT be Spawn.\nError code: 12");
    return;
  }
  if (Areas[specifiedArea]["activeCrystals"].length >= Areas[specifiedArea].maxCrystals) {
    // console.error("Error while generating crystal. Area already has maximum crystals active.\nError code: 13");
    return;
  }

  const POSSIBLE_CRYSTAL_SIZES = ["S", "M", "L"];
  let newCrystalSize = POSSIBLE_CRYSTAL_SIZES[Math.floor(Math.random() * POSSIBLE_CRYSTAL_SIZES.length)];
  let newCrystal = new Crystal(specifiedArea, newCrystalSize, crystalSet[specifiedArea][newCrystalSize].hp)

  // console.log("Crystal finished generation successfully.");
  return newCrystal
}
