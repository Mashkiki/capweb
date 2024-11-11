class Area {
  constructor(id, name, maxCrystals) {
    this.id = id;
    this.name = name;
    this.maxCrystals = maxCrystals;
    this.activeCrystals = new Array();
  }
  setRequirement(type, amount) {
    this.requirementType = type;
    this.requirementAmount = amount;
  }
}

let Areas = {};
Areas.Spawn = new Area(0, "Spawn", 0);
Areas.Spawn.setRequirement("free", 0);

Areas.Meadow = new Area(1, "Meadow", 12);
Areas.Meadow.setRequirement("free", 0);

Areas.Forest = new Area(2, "Forest", 12);
Areas.Forest.setRequirement("petScore", 15);

Areas.Desert = new Area(3, "Desert", 12);
Areas.Desert.setRequirement("petScore", 40);

Areas.Arctic = new Area(4, "Arctic", 10);
Areas.Arctic.setRequirement("petScore", 75);

Areas.Beach = new Area(5, "Beach", 12);
Areas.Beach.setRequirement("petScore", 120);

Areas.Mountains = new Area(6, "Mountains", 8);
Areas.Mountains.setRequirement("petScore", 175);

Areas.Jungle = new Area(7, "Jungle", 14);
Areas.Jungle.setRequirement("petScore", 210);

Areas.Grotto = new Area(8, "Grotto", 20);
Areas.Grotto.setRequirement("shinyScore", 100);

Areas.Grove = new Area(9, "Grove", 24);
Areas.Grove.setRequirement("shinyScore", 1000);

Areas.Mine = new Area(10, "Mine", 12);
Areas.Mine.setRequirement("metallicScore", 100);

function generateCrystal(specifiedArea) {
  if (!(specifiedArea in Areas)) {
    console.error("Error while generating crystal. Specified area doesn't exist. Maybe a typo?",);
    return 0;
  }
  if (specifiedArea == "Spawn") {
    console.error("Error while generating crystal. The specified area CANNOT be Spawn.",);
    return 0;
  }
  if (Areas[specifiedArea]["activeCrystals"].length >= Areas[specifiedArea].maxCrystals) {
    console.error("Error while generating crystal. Area already has maximum crystals active.",);
    return 0;
  }

  const POSSIBLE_CRYSTAL_SIZES = ["S", "M", "L"];
  let newCrystalSize = POSSIBLE_CRYSTAL_SIZES[Math.floor(Math.random() * POSSIBLE_CRYSTAL_SIZES.length)];
  Areas[specifiedArea]["activeCrystals"].push(
    new Crystal(
      specifiedArea,
      newCrystalSize,
      crystalSet[specifiedArea][newCrystalSize].hp
    ),
  );

  console.log("Crystal finished generation successfully.");
}
