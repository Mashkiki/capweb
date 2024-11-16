let crystalSet = {
  Meadow: {
    S: { hp: 100 },
    M: { hp: 150 },
    L: { hp: 200 },
  },
  Forest: {
    S: { hp: 200 },
    M: { hp: 300 },
    L: { hp: 400 },
  },
  Desert: {
    S: { hp: 300 },
    M: { hp: 450 },
    L: { hp: 600 },
  },
  Arctic: {
    S: { hp: 400 },
    M: { hp: 600 },
    L: { hp: 800 },
  },
  Beach: {
    S: { hp: 500 },
    M: { hp: 750 },
    L: { hp: 1000 },
  },
  Mountains: {
    S: { hp: 600 },
    M: { hp: 900 },
    L: { hp: 1200 },
  },
  Jungle: {
    S: { hp: 700 },
    M: { hp: 1050 },
    L: { hp: 1400 },
  },
  Grotto: {
    S: { hp: 1200 },
    M: { hp: 1800 },
    L: { hp: 2400 },
  },
  Grove: {
    S: { hp: 5000 },
    M: { hp: 7500 },
    L: { hp: 10000 },
  },
  Mine: {
    S: { hp: 10_000_000_000 },
    M: { hp: 12_000_000_000 },
    L: { hp: 15_000_000_000 },
  },
};
let crystalSizes = {
  S: {width: 1, height: 1},
  M: {width: 2, height: 2},
  L: {width: 2, height: 3}
}
let crystalImages = {
  S: "assets/resources/small_crystal.png",
  M: "assets/resources/medium_crystal.png",
  L: "assets/resources/large_crystal.png"
}
let areaCrystalFilter = {
  Meadow: "hue-rotate(60deg) brightness(120%) contrast(175%)"
}

class Crystal {
  constructor(area, size, hp) {
    this.area = area;
    this.size = size;
    this.hp = hp;
    this.gridCoordinates = new Object()
    this.attackedBy = new Array()
  }
}
