const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const titleOverlay = document.getElementById('titleOverlay');
const newGameBtn = document.getElementById('newGameBtn');
const continueBtn = document.getElementById('continueBtn');
const continueHint = document.getElementById('continueHint');
const modalEl = document.getElementById('modal');
const modalKickerEl = document.getElementById('modalKicker');
const modalTitleEl = document.getElementById('modalTitle');
const modalBodyEl = document.getElementById('modalBody');
const modalChoicesEl = document.getElementById('modalChoices');
const modalFooterEl = document.getElementById('modalFooter');
const areaNameEl = document.getElementById('areaName');
const storySummaryEl = document.getElementById('storySummary');
const questTitleEl = document.getElementById('questTitle');
const questBodyEl = document.getElementById('questBody');
const stampListEl = document.getElementById('stampList');
const statsEl = document.getElementById('stats');
const questLogEl = document.getElementById('questLog');
const qaPanelEl = document.getElementById('qaPanel');
const talkBtn = document.getElementById('talkBtn');
const runBtn = document.getElementById('runBtn');
const saveBtn = document.getElementById('saveBtn');

const data = window.RedleafData;
const TILE = 32;
const VIEW_W = canvas.width / TILE;
const VIEW_H = canvas.height / TILE;
const SAVE_KEY = 'redleaf-learning-quest-save-v1';
const USE_IMAGE_ASSETS = false;

const DIRS = {
  up: { dx: 0, dy: -1, row: 3 },
  down: { dx: 0, dy: 1, row: 0 },
  left: { dx: -1, dy: 0, row: 1 },
  right: { dx: 1, dy: 0, row: 2 }
};

const MAP_BLURBS = {
  redbudTown: 'A cheerful starting town where the lantern adventure begins.',
  academyRoom: 'A bright classroom full of counting practice and quiet courage.',
  sunnyRoute: 'A breezy learning trail with a bridge made for subtraction.',
  riverTown: 'A waterside village where reading and careful noticing matter.',
  libraryRoom: 'A story room where every sentence hides a clue.',
  marketMeadow: 'Bustling stalls, garden paths, and equal groups everywhere.',
  storybookWoods: 'A lantern-lit forest where comprehension lights the path.',
  moonriseWorkshop: 'A harbour workshop where mixed questions repair the lantern train.',
  starSummit: 'The high festival plaza waiting for every learning stamp.',
  observatoryRoom: 'The final hall where maths and reading shine together.'
};

const PRACTICE_REQUIREMENTS = {
  scoutTessa: 'metMayor',
  coachDot: 'academyComplete',
  samReader: 'routeComplete',
  bakerBea: 'libraryComplete',
  camperKit: 'gardenComplete',
  helperPip: 'woodsComplete',
  helperJoy: 'observatoryComplete'
};

const MAP_THEMES = {
  redbudTown: 'town',
  academyRoom: 'academy',
  sunnyRoute: 'route',
  riverTown: 'river',
  libraryRoom: 'library',
  marketMeadow: 'market',
  storybookWoods: 'woods',
  moonriseWorkshop: 'workshop',
  starSummit: 'summit',
  observatoryRoom: 'observatory'
};

const THEME_STYLES = {
  town: {
    label: 'Lantern Town',
    indoor: false,
    hud: '#204235',
    hudSoft: 'rgba(247, 252, 244, 0.92)',
    accent: '#f0c96e',
    accentSoft: '#ffe7ad',
    grass: '#8cc56f',
    grassDark: '#649a56',
    meadow: '#78b16a',
    meadowDark: '#5c8c55',
    path: '#ddc48d',
    pathDark: '#b39263',
    water: '#69c4db',
    waterDeep: '#377aa3',
    wood: '#b98c59',
    woodDark: '#805731',
    floor: '#dcc391',
    floorDark: '#c3a66d',
    wall: '#7a6d61',
    wallDark: '#5d564d',
    plaza: '#e4ddcd',
    plazaDark: '#c8bfab',
    rug: '#cc7163',
    rugTrim: '#f4dd8c'
  },
  academy: {
    label: 'Sun Classroom',
    indoor: true,
    hud: '#395541',
    hudSoft: 'rgba(251, 250, 244, 0.94)',
    accent: '#f2cb72',
    accentSoft: '#ffe7af',
    grass: '#95cd7d',
    grassDark: '#6f9f60',
    meadow: '#88c07a',
    meadowDark: '#67915e',
    path: '#deca99',
    pathDark: '#b69d6f',
    water: '#70bfd8',
    waterDeep: '#4186ab',
    wood: '#b48856',
    woodDark: '#7c5430',
    floor: '#e3cf9f',
    floorDark: '#c6ad77',
    wall: '#8b8070',
    wallDark: '#675e52',
    plaza: '#ece5d6',
    plazaDark: '#cec4b2',
    rug: '#ce7a6f',
    rugTrim: '#f8e2a3'
  },
  route: {
    label: 'Sunny Trail',
    indoor: false,
    hud: '#295446',
    hudSoft: 'rgba(246, 252, 242, 0.92)',
    accent: '#ffd875',
    accentSoft: '#ffecb7',
    grass: '#89c468',
    grassDark: '#5f9653',
    meadow: '#78aa63',
    meadowDark: '#527e4b',
    path: '#d8c08a',
    pathDark: '#b08f5c',
    water: '#67c1e0',
    waterDeep: '#2f77a4',
    wood: '#bc8f5d',
    woodDark: '#845731',
    floor: '#dbc18f',
    floorDark: '#c4aa75',
    wall: '#7b7064',
    wallDark: '#61584d',
    plaza: '#e6ddca',
    plazaDark: '#c8bea9',
    rug: '#c46859',
    rugTrim: '#f4db8c'
  },
  river: {
    label: 'Riverside',
    indoor: false,
    hud: '#23425d',
    hudSoft: 'rgba(244, 249, 253, 0.93)',
    accent: '#f1d084',
    accentSoft: '#fff0c3',
    grass: '#7fbe7d',
    grassDark: '#5f925f',
    meadow: '#73a77a',
    meadowDark: '#507a59',
    path: '#d4c2a0',
    pathDark: '#ab9372',
    water: '#6bc9eb',
    waterDeep: '#2d78a8',
    wood: '#b98f62',
    woodDark: '#7b5735',
    floor: '#dcc6a3',
    floorDark: '#bea57b',
    wall: '#7b7280',
    wallDark: '#5d5762',
    plaza: '#e5dfd7',
    plazaDark: '#c9c0b6',
    rug: '#c96f63',
    rugTrim: '#f6deb0'
  },
  library: {
    label: 'Story Hall',
    indoor: true,
    hud: '#4c4a63',
    hudSoft: 'rgba(249, 247, 252, 0.95)',
    accent: '#f2ca7a',
    accentSoft: '#ffedbf',
    grass: '#86c07a',
    grassDark: '#618f58',
    meadow: '#7baf71',
    meadowDark: '#587e53',
    path: '#dbc7a0',
    pathDark: '#b79d70',
    water: '#6abfe0',
    waterDeep: '#3c82ac',
    wood: '#b48658',
    woodDark: '#79522e',
    floor: '#d8c5a5',
    floorDark: '#b99f75',
    wall: '#84788b',
    wallDark: '#615a6e',
    plaza: '#e8e1d8',
    plazaDark: '#ccc0b0',
    rug: '#b96564',
    rugTrim: '#f3ddb4'
  },
  market: {
    label: 'Meadow Market',
    indoor: false,
    hud: '#32523a',
    hudSoft: 'rgba(249, 251, 244, 0.92)',
    accent: '#f4c96d',
    accentSoft: '#ffe8b2',
    grass: '#91c96f',
    grassDark: '#699e59',
    meadow: '#7caf65',
    meadowDark: '#59814d',
    path: '#dcc48d',
    pathDark: '#b39061',
    water: '#6abed7',
    waterDeep: '#397aa0',
    wood: '#c38c54',
    woodDark: '#87552d',
    floor: '#dcc28d',
    floorDark: '#c2a56d',
    wall: '#7f7268',
    wallDark: '#5e574e',
    plaza: '#e6dfcf',
    plazaDark: '#c9beab',
    rug: '#ce715f',
    rugTrim: '#f5dd97'
  },
  woods: {
    label: 'Lantern Woods',
    indoor: false,
    hud: '#21382f',
    hudSoft: 'rgba(243, 250, 241, 0.92)',
    accent: '#f3c86b',
    accentSoft: '#ffe9b3',
    grass: '#62915a',
    grassDark: '#486c46',
    meadow: '#567d4f',
    meadowDark: '#3d5e3b',
    path: '#d1ba86',
    pathDark: '#aa8758',
    water: '#5ea5c9',
    waterDeep: '#2a648b',
    wood: '#aa7646',
    woodDark: '#6b4424',
    floor: '#d4bc8e',
    floorDark: '#b29462',
    wall: '#6d655d',
    wallDark: '#4f4a44',
    plaza: '#ddd6c7',
    plazaDark: '#beb5a4',
    rug: '#bc6354',
    rugTrim: '#f0d78d'
  },
  workshop: {
    label: 'Harbour Workshop',
    indoor: false,
    hud: '#2f4357',
    hudSoft: 'rgba(245, 249, 252, 0.93)',
    accent: '#f2c86b',
    accentSoft: '#ffebb9',
    grass: '#85ba74',
    grassDark: '#608f59',
    meadow: '#729e68',
    meadowDark: '#537557',
    path: '#d5be93',
    pathDark: '#a98a66',
    water: '#68bbda',
    waterDeep: '#326f9e',
    wood: '#b4865d',
    woodDark: '#764e2c',
    floor: '#d7c19a',
    floorDark: '#b99d74',
    wall: '#78808b',
    wallDark: '#58606d',
    plaza: '#e3ddd5',
    plazaDark: '#c7bcb1',
    rug: '#c66f59',
    rugTrim: '#f4d59f'
  },
  summit: {
    label: 'Festival Plaza',
    indoor: false,
    hud: '#40385d',
    hudSoft: 'rgba(250, 247, 253, 0.93)',
    accent: '#f6ce76',
    accentSoft: '#fff0bf',
    grass: '#92c175',
    grassDark: '#6d975a',
    meadow: '#81b36b',
    meadowDark: '#5d844c',
    path: '#e0caa1',
    pathDark: '#b69871',
    water: '#79c8e4',
    waterDeep: '#3a82b0',
    wood: '#bf8c60',
    woodDark: '#865534',
    floor: '#ddc7a4',
    floorDark: '#c3aa81',
    wall: '#80758a',
    wallDark: '#5f5968',
    plaza: '#ece4d8',
    plazaDark: '#d0c3b5',
    rug: '#cf7364',
    rugTrim: '#f7dfaa'
  },
  observatory: {
    label: 'Star Observatory',
    indoor: true,
    hud: '#26354c',
    hudSoft: 'rgba(244, 247, 252, 0.95)',
    accent: '#f5cf78',
    accentSoft: '#fff0c1',
    grass: '#8fc07c',
    grassDark: '#668f5d',
    meadow: '#7aa772',
    meadowDark: '#567861',
    path: '#d8c4a0',
    pathDark: '#ad9470',
    water: '#74bfdf',
    waterDeep: '#3b7aa8',
    wood: '#b48659',
    woodDark: '#7a5130',
    floor: '#d9c6ab',
    floorDark: '#bba27c',
    wall: '#7d7f95',
    wallDark: '#5a6171',
    plaza: '#e5e0da',
    plazaDark: '#c7c0b6',
    rug: '#bf6574',
    rugTrim: '#f3dfaa'
  }
};

const CHARACTER_STYLES = {
  player: { skin: '#f6d2ba', hair: '#6b4a34', outfit: '#de6f61', trim: '#f4efe5', legs: '#32516c', boots: '#433224', accessory: '#ebc76e', accessoryType: 'satchel', hat: '#f7f0e3', hatBand: '#d7695f' },
  mentor: { skin: '#efc6a8', hair: '#6e736d', outfit: '#3f8877', trim: '#f7e8c7', legs: '#4d5f77', boots: '#433224', accessory: '#efc96f', accessoryType: 'scarf', hat: '#f1ecd8', hatBand: '#7bb5d4' },
  teacher: { skin: '#f2cfb8', hair: '#915b45', outfit: '#cb756f', trim: '#fff5ee', legs: '#51657d', boots: '#463023', accessory: '#f0cf6f', accessoryType: 'book', hat: '#f5e7cf', hatBand: '#db8f54' },
  reader: { skin: '#f4d6c0', hair: '#3c4d5d', outfit: '#5b8cb8', trim: '#f0f6fb', legs: '#4b5a71', boots: '#433122', accessory: '#f7d37b', accessoryType: 'book', hat: '#e4ecf4', hatBand: '#6a95be' },
  gardener: { skin: '#e9c5a7', hair: '#7d5533', outfit: '#6cab64', trim: '#fff6e9', legs: '#5b6f56', boots: '#473422', accessory: '#f4cf6d', accessoryType: 'apron', hat: '#f3dca6', hatBand: '#89b06d' },
  inventor: { skin: '#f0cfb3', hair: '#7a7d86', outfit: '#5d8e9a', trim: '#f4f7f0', legs: '#495b73', boots: '#433020', accessory: '#f5b965', accessoryType: 'tool', hat: '#dae0e8', hatBand: '#efb15f' },
  headmaster: { skin: '#f1d2bc', hair: '#ccd2dc', outfit: '#3f5f74', trim: '#f8edd5', legs: '#425065', boots: '#3c2c22', accessory: '#f0c869', accessoryType: 'cape', hat: '#eef1f4', hatBand: '#7896ba' },
  owl: { species: 'owl', body: '#8a653f', belly: '#f1d6ab', wing: '#6b4c31', beak: '#efb957', eyes: '#fff6d6', trim: '#e2ae56' }
};

const BUILDING_STYLES = {
  home: { roof: '#e48a73', roofDark: '#b85f58', wall: '#fff0d6', trim: '#7e9d83', window: '#9fd4e8', door: '#7e5332', sign: 'Home' },
  academy: { roof: '#d96a5d', roofDark: '#aa4a49', wall: '#fff6e3', trim: '#5d88a4', window: '#a9dff1', door: '#7b5330', sign: 'Academy' },
  library: { roof: '#8a6db2', roofDark: '#5c4b7e', wall: '#f7edd9', trim: '#6b7f9a', window: '#b2dff1', door: '#6e4c33', sign: 'Library' },
  market: { roof: '#ef9a62', roofDark: '#c16d43', wall: '#fff2df', trim: '#93ad78', window: '#a7dbeb', door: '#774f31', sign: 'Market' },
  greenhouse: { roof: '#8cc6a7', roofDark: '#5f9576', wall: '#d8f3e6', trim: '#6d8d73', window: '#c7f7f2', door: '#6b5138', sign: 'Garden' },
  workshop: { roof: '#6b93b6', roofDark: '#47607f', wall: '#f3e7d5', trim: '#8f6e56', window: '#a9d7ef', door: '#6a4833', sign: 'Workshop' },
  observatory: { roof: '#7181bb', roofDark: '#4d587e', wall: '#f6eef1', trim: '#7a86a1', window: '#b4ddff', door: '#6e4d3a', sign: 'Observatory' },
  hall: { roof: '#c7685d', roofDark: '#9e4c46', wall: '#fff0df', trim: '#8f9570', window: '#aad9ea', door: '#735039', sign: 'Hall' }
};

const input = {
  held: { up: false, down: false, left: false, right: false },
  run: false,
  runLock: false
};

const state = {
  ready: false,
  mode: 'title',
  mapId: 'redbudTown',
  player: {
    x: data.maps.redbudTown.start.x,
    y: data.maps.redbudTown.start.y,
    fromX: data.maps.redbudTown.start.x,
    fromY: data.maps.redbudTown.start.y,
    toX: data.maps.redbudTown.start.x,
    toY: data.maps.redbudTown.start.y,
    direction: 'down',
    moving: false,
    progress: 0,
    frame: 1
  },
  flags: {},
  stamps: [],
  ribbons: [],
  stats: { attempted: 0, correct: 0, saves: 0 },
  visitedMaps: ['redbudTown'],
  message: 'Meet Mayor Clover to begin the lantern-festival adventure.',
  modal: null,
  assets: { sprites: {}, buildings: {} },
  qaReport: null
};

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function seededNoise(...values) {
  const seed = values.reduce((sum, value, index) => sum + value * (index + 11) * 17.23, 0);
  const wave = Math.sin(seed * 12.9898) * 43758.5453;
  return wave - Math.floor(wave);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function loadAssets() {
  if (!USE_IMAGE_ASSETS) return;
  const spriteEntries = Object.entries(data.assets.sprites);
  const buildingEntries = Object.entries(data.assets.buildings);
  await Promise.all(spriteEntries.map(async ([key, src]) => {
    try {
      state.assets.sprites[key] = await loadImage(src);
    } catch (error) {
      console.warn(`Failed to load sprite ${key}`, error);
    }
  }));
  await Promise.all(buildingEntries.map(async ([key, src]) => {
    try {
      state.assets.buildings[key] = await loadImage(src);
    } catch (error) {
      console.warn(`Failed to load building ${key}`, error);
    }
  }));
}

function roundRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fillPanel(x, y, width, height, radius, fill, stroke = null) {
  roundRectPath(x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function syncContinueAvailability() {
  const available = !!localStorage.getItem(SAVE_KEY);
  continueBtn.disabled = !available;
  continueHint.textContent = available ? 'A save file is ready to continue.' : 'Continue will unlock after your first save.';
}

function hasFlag(flag) {
  return !!state.flags[flag];
}

function currentMap() {
  return data.maps[state.mapId];
}

function currentTheme() {
  return THEME_STYLES[MAP_THEMES[state.mapId]] || THEME_STYLES.town;
}

function actorList() {
  return Object.values(data.actors).filter((actor) => actor.mapId === state.mapId);
}

function activeQuest() {
  return data.questLine.find((quest) => !hasFlag(quest.flag)) || {
    id: 'adventureComplete',
    title: 'Adventure Complete',
    location: 'Redleaf Valley',
    summary: 'The Great Reading Lantern is glowing. You can keep exploring and replaying practice ribbons.'
  };
}

function saveSnapshot() {
  return {
    mapId: state.mapId,
    player: { x: state.player.x, y: state.player.y, direction: state.player.direction },
    flags: state.flags,
    stamps: state.stamps,
    ribbons: state.ribbons,
    stats: state.stats,
    visitedMaps: state.visitedMaps,
    message: state.message
  };
}

function quickSave(showMessage = true) {
  if (state.modal) {
    state.message = 'Finish the current talk or question before saving.';
    updatePanels();
    return;
  }
  state.stats.saves += 1;
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveSnapshot()));
  syncContinueAvailability();
  if (showMessage) state.message = 'Adventure saved. You can continue later.';
  updatePanels();
}

function loadSavedGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const saved = JSON.parse(raw);
    state.mapId = saved.mapId || 'redbudTown';
    Object.assign(state.player, {
      x: saved.player?.x ?? data.maps.redbudTown.start.x,
      y: saved.player?.y ?? data.maps.redbudTown.start.y,
      fromX: saved.player?.x ?? data.maps.redbudTown.start.x,
      fromY: saved.player?.y ?? data.maps.redbudTown.start.y,
      toX: saved.player?.x ?? data.maps.redbudTown.start.x,
      toY: saved.player?.y ?? data.maps.redbudTown.start.y,
      direction: saved.player?.direction || 'down',
      moving: false,
      progress: 0,
      frame: 1
    });
    state.flags = saved.flags || {};
    state.stamps = saved.stamps || [];
    state.ribbons = saved.ribbons || [];
    state.stats = saved.stats || { attempted: 0, correct: 0, saves: 0 };
    state.visitedMaps = saved.visitedMaps || [state.mapId];
    state.message = saved.message || 'Welcome back to Redleaf Learning Quest.';
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function clearHeldInputs() {
  Object.keys(input.held).forEach((key) => {
    input.held[key] = false;
  });
  input.run = false;
  document.querySelectorAll('[data-hold]').forEach((button) => button.classList.remove('active'));
  updateRunButton();
}

function newGame() {
  clearHeldInputs();
  input.runLock = false;
  state.mapId = 'redbudTown';
  Object.assign(state.player, {
    x: data.maps.redbudTown.start.x,
    y: data.maps.redbudTown.start.y,
    fromX: data.maps.redbudTown.start.x,
    fromY: data.maps.redbudTown.start.y,
    toX: data.maps.redbudTown.start.x,
    toY: data.maps.redbudTown.start.y,
    direction: 'down',
    moving: false,
    progress: 0,
    frame: 1
  });
  state.flags = {};
  state.stamps = [];
  state.ribbons = [];
  state.stats = { attempted: 0, correct: 0, saves: 0 };
  state.visitedMaps = ['redbudTown'];
  state.modal = null;
  state.message = 'Meet Mayor Clover to begin the lantern-festival adventure.';
  state.mode = 'play';
  renderModal();
  updateRunButton();
  updatePanels();
}

function warpTo(targetMap, targetX, targetY) {
  state.mapId = targetMap;
  Object.assign(state.player, {
    x: targetX,
    y: targetY,
    fromX: targetX,
    fromY: targetY,
    toX: targetX,
    toY: targetY,
    moving: false,
    progress: 0,
    frame: 1
  });
  if (!state.visitedMaps.includes(targetMap)) state.visitedMaps.push(targetMap);
  state.message = `Entered ${data.maps[targetMap].name}.`;
  updatePanels();
}

function buildCollisionSet(map) {
  const blocked = new Set();
  map.tiles.forEach((row, y) => row.forEach((tile, x) => {
    if (['water', 'wall'].includes(tile)) blocked.add(`${x},${y}`);
  }));
  map.buildings.forEach((building) => {
    for (let y = building.y; y < building.y + building.h; y += 1) {
      for (let x = building.x; x < building.x + building.w; x += 1) {
        const door = building.door && building.door.x === x && building.door.y === y;
        if (!door) blocked.add(`${x},${y}`);
      }
    }
  });
  map.decorations.forEach((item) => {
    if (item.solid) blocked.add(`${item.x},${item.y}`);
  });
  map.signs.forEach((sign) => blocked.add(`${sign.x},${sign.y}`));
  return blocked;
}

const collisionCache = Object.fromEntries(Object.values(data.maps).map((map) => [map.id, buildCollisionSet(map)]));

function actorAt(x, y) {
  return actorList().find((actor) => actor.x === x && actor.y === y);
}

function tileBlocked(x, y) {
  const map = currentMap();
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
  if (collisionCache[state.mapId].has(`${x},${y}`)) return true;
  return !!actorAt(x, y);
}

function findWarp(x, y) {
  const buildingDoor = currentMap().buildings.find((building) => building.door && building.door.x === x && building.door.y === y);
  if (buildingDoor) return buildingDoor.door;
  return currentMap().warps.find((warp) => x >= warp.x && x < warp.x + warp.w && y >= warp.y && y < warp.y + warp.h);
}

function getHeldDirection() {
  if (input.held.up) return 'up';
  if (input.held.down) return 'down';
  if (input.held.left) return 'left';
  if (input.held.right) return 'right';
  return null;
}

function isRunning() {
  return input.run || input.runLock;
}

function updateRunButton() {
  if (!runBtn) return;
  runBtn.classList.toggle('active', isRunning());
  runBtn.setAttribute('aria-pressed', String(input.runLock));
  runBtn.textContent = input.runLock ? 'Run: On' : 'Run Toggle';
}

function toggleRunLock(showMessage = true) {
  input.runLock = !input.runLock;
  updateRunButton();
  if (showMessage && state.mode !== 'title') {
    state.message = input.runLock ? 'Run mode turned on.' : 'Run mode turned off.';
    updatePanels();
  }
}

function beginMove(direction) {
  const vector = DIRS[direction];
  const nextX = state.player.x + vector.dx;
  const nextY = state.player.y + vector.dy;
  state.player.direction = direction;
  if (tileBlocked(nextX, nextY)) return;
  state.player.moving = true;
  state.player.progress = 0;
  state.player.fromX = state.player.x;
  state.player.fromY = state.player.y;
  state.player.toX = nextX;
  state.player.toY = nextY;
}

function updateMovement(delta) {
  if (state.player.moving) {
    const duration = isRunning() ? 110 : 170;
    state.player.progress += delta / duration;
    state.player.frame = state.player.progress < 0.5 ? 0 : 2;
    if (state.player.progress >= 1) {
      state.player.x = state.player.toX;
      state.player.y = state.player.toY;
      state.player.fromX = state.player.x;
      state.player.fromY = state.player.y;
      state.player.moving = false;
      state.player.progress = 0;
      state.player.frame = 1;
      const warp = findWarp(state.player.x, state.player.y);
      if (warp) warpTo(warp.targetMap, warp.targetX, warp.targetY);
    }
    return;
  }

  const direction = getHeldDirection();
  if (direction && state.mode === 'play') beginMove(direction);
}

function tileAt(map, x, y) {
  return map.tiles[y]?.[x] ?? null;
}

function drawGrassClumps(sx, sy, light, dark, gx, gy) {
  ctx.fillStyle = dark;
  const offsets = [
    [4, 20],
    [12, 10],
    [23, 18]
  ];
  offsets.forEach(([ox, oy], index) => {
    const sway = Math.floor(seededNoise(gx, gy, index) * 3);
    ctx.fillRect(sx + ox, sy + oy - sway, 2, 6 + sway);
    ctx.fillRect(sx + ox - 2, sy + oy + 1 - sway, 2, 4 + sway);
    ctx.fillRect(sx + ox + 2, sy + oy + 1 - sway, 2, 4 + sway);
  });
  if (seededNoise(gx, gy, 99) > 0.78) {
    ctx.fillStyle = light;
    ctx.fillRect(sx + 7, sy + 9, 2, 2);
    ctx.fillRect(sx + 9, sy + 7, 2, 2);
    ctx.fillRect(sx + 11, sy + 9, 2, 2);
    ctx.fillRect(sx + 9, sy + 11, 2, 2);
  }
}

function drawPathPebbles(sx, sy, dark, light, gx, gy) {
  ctx.fillStyle = light;
  ctx.fillRect(sx + 4, sy + 4, 24, 24);
  ctx.fillStyle = dark;
  for (let i = 0; i < 3; i += 1) {
    const px = 6 + Math.floor(seededNoise(gx, gy, i) * 18);
    const py = 7 + Math.floor(seededNoise(gx, gy, i + 7) * 16);
    ctx.fillRect(sx + px, sy + py, 3, 2);
  }
}

function drawWaterRipples(sx, sy, theme, tick, gx, gy) {
  ctx.fillStyle = theme.water;
  ctx.fillRect(sx, sy, TILE, TILE);
  ctx.fillStyle = theme.waterDeep;
  ctx.fillRect(sx, sy + 18, TILE, 14);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  const driftA = Math.sin(tick / 240 + gx * 0.5 + gy) * 2;
  const driftB = Math.sin(tick / 300 + gx + gy * 0.6) * 2;
  ctx.beginPath();
  ctx.moveTo(sx + 5, sy + 9 + driftA);
  ctx.lineTo(sx + 14, sy + 8 + driftA);
  ctx.moveTo(sx + 14, sy + 20 + driftB);
  ctx.lineTo(sx + 25, sy + 19 + driftB);
  ctx.stroke();
  if (seededNoise(gx, gy, 3) > 0.65) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.fillRect(sx + 8, sy + 5, 3, 2);
  }
}

function drawTile(tile, gx, gy, sx, sy, tick, theme, map) {
  if (tile === 'grass') {
    ctx.fillStyle = theme.grass;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(sx, sy, TILE, 7);
    drawGrassClumps(sx, sy, theme.accentSoft, theme.grassDark, gx, gy);
  } else if (tile === 'meadow') {
    ctx.fillStyle = theme.meadow;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(sx, sy, TILE, 6);
    drawGrassClumps(sx, sy, '#f3df90', theme.meadowDark, gx + 11, gy + 7);
  } else if (tile === 'path') {
    ctx.fillStyle = theme.path;
    ctx.fillRect(sx, sy, TILE, TILE);
    drawPathPebbles(sx, sy, theme.pathDark, 'rgba(255, 245, 215, 0.55)', gx, gy);
  } else if (tile === 'water') {
    drawWaterRipples(sx, sy, theme, tick, gx, gy);
  } else if (tile === 'bridge' || tile === 'boardwalk') {
    ctx.fillStyle = tile === 'bridge' ? theme.wood : theme.woodDark;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = 'rgba(255, 233, 196, 0.28)';
    for (let offset = 2; offset < TILE; offset += 8) ctx.fillRect(sx, sy + offset, TILE, 2);
    ctx.fillStyle = 'rgba(98, 57, 27, 0.28)';
    for (let offset = 4; offset < TILE; offset += 8) ctx.fillRect(sx + offset, sy, 2, TILE);
  } else if (tile === 'floor') {
    ctx.fillStyle = theme.floor;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(sx, sy, TILE, 5);
    ctx.fillStyle = theme.floorDark;
    ctx.fillRect(sx, sy + 10, TILE, 2);
    ctx.fillRect(sx, sy + 21, TILE, 2);
  } else if (tile === 'rug') {
    ctx.fillStyle = theme.rug;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = theme.rugTrim;
    ctx.fillRect(sx + 3, sy + 3, TILE - 6, TILE - 6);
    ctx.fillStyle = theme.rug;
    ctx.fillRect(sx + 8, sy + 8, TILE - 16, TILE - 16);
  } else if (tile === 'wall') {
    ctx.fillStyle = theme.wall;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = theme.wallDark;
    ctx.fillRect(sx, sy + 10, TILE, 3);
    ctx.fillRect(sx + 8, sy, 3, TILE);
    ctx.fillRect(sx + 20, sy, 3, TILE);
  } else if (tile === 'plaza') {
    ctx.fillStyle = theme.plaza;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.strokeStyle = theme.plazaDark;
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 1.5, sy + 1.5, TILE - 3, TILE - 3);
    ctx.beginPath();
    ctx.moveTo(sx + 16, sy + 2);
    ctx.lineTo(sx + 16, sy + 30);
    ctx.moveTo(sx + 2, sy + 16);
    ctx.lineTo(sx + 30, sy + 16);
    ctx.stroke();
  }

  if (tile !== 'water') {
    if (tileAt(map, gx, gy + 1) === 'water') {
      ctx.fillStyle = 'rgba(255, 248, 224, 0.42)';
      ctx.fillRect(sx, sy + TILE - 3, TILE, 3);
    }
    if (tile === 'path') {
      ctx.fillStyle = 'rgba(177, 145, 93, 0.32)';
      if (tileAt(map, gx, gy - 1) !== 'path') ctx.fillRect(sx, sy, TILE, 2);
      if (tileAt(map, gx - 1, gy) !== 'path') ctx.fillRect(sx, sy, 2, TILE);
      if (tileAt(map, gx + 1, gy) !== 'path') ctx.fillRect(sx + TILE - 2, sy, 2, TILE);
      if (tileAt(map, gx, gy + 1) !== 'path') ctx.fillRect(sx, sy + TILE - 2, TILE, 2);
    }
  }
}

function drawDecoration(item, sx, sy, tick) {
  if (item.type === 'tree') {
    ctx.fillStyle = 'rgba(28, 43, 31, 0.22)';
    ctx.beginPath();
    ctx.ellipse(sx + 16, sy + 27, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6bb071';
    ctx.beginPath();
    ctx.arc(sx + 12, sy + 12, 9, 0, Math.PI * 2);
    ctx.arc(sx + 20, sy + 11, 10, 0, Math.PI * 2);
    ctx.arc(sx + 16, sy + 7, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a7b49';
    ctx.beginPath();
    ctx.arc(sx + 14, sy + 14, 8, 0, Math.PI * 2);
    ctx.arc(sx + 22, sy + 14, 7, 0, Math.PI * 2);
    ctx.arc(sx + 17, sy + 9, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7b5433';
    ctx.fillRect(sx + 13, sy + 16, 6, 10);
  } else if (item.type === 'flowers') {
    const sway = Math.sin(tick / 300 + sx) * 0.8;
    ctx.fillStyle = '#5a8b4d';
    ctx.fillRect(sx + 8, sy + 13, 2, 8);
    ctx.fillRect(sx + 14, sy + 10, 2, 11);
    ctx.fillRect(sx + 20, sy + 13, 2, 8);
    ctx.fillStyle = '#ffdda1';
    ctx.fillRect(sx + 7, sy + 9 + sway, 4, 4);
    ctx.fillStyle = '#ff92b0';
    ctx.fillRect(sx + 12, sy + 7 - sway, 5, 5);
    ctx.fillStyle = '#8bd6f0';
    ctx.fillRect(sx + 18, sy + 10 + sway, 4, 4);
  } else if (item.type === 'lamp') {
    ctx.fillStyle = '#6f5135';
    ctx.fillRect(sx + 14, sy + 10, 4, 15);
    ctx.fillStyle = '#f8d67d';
    ctx.beginPath();
    ctx.arc(sx + 16, sy + 9, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 232, 174, 0.22)';
    ctx.beginPath();
    ctx.arc(sx + 16, sy + 9, 11 + Math.sin(tick / 250 + sx) * 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type === 'fence') {
    ctx.fillStyle = '#9b7653';
    ctx.fillRect(sx + 2, sy + 18, TILE - 4, 4);
    ctx.fillRect(sx + 6, sy + 9, 4, 13);
    ctx.fillRect(sx + 14, sy + 9, 4, 13);
    ctx.fillRect(sx + 22, sy + 9, 4, 13);
  } else if (item.type === 'crate' || item.type === 'desk' || item.type === 'shelf') {
    ctx.fillStyle = item.type === 'shelf' ? '#8e6a45' : '#a97a4e';
    ctx.fillRect(sx + 4, sy + 4, TILE - 8, TILE - 8);
    ctx.fillStyle = 'rgba(255, 229, 185, 0.34)';
    ctx.fillRect(sx + 7, sy + 7, TILE - 14, 4);
    ctx.strokeStyle = 'rgba(104, 67, 38, 0.42)';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 5, sy + 5, TILE - 10, TILE - 10);
  } else if (item.type === 'banner') {
    ctx.fillStyle = '#a84648';
    ctx.fillRect(sx + 10, sy + 4, 12, 18);
    ctx.fillStyle = '#f5e39a';
    ctx.fillRect(sx + 13, sy + 8, 6, 6);
    ctx.fillStyle = '#f7eee0';
    ctx.fillRect(sx + 10, sy + 4, 12, 2);
  } else if (item.type === 'fountain') {
    ctx.fillStyle = '#c9d6dd';
    ctx.beginPath();
    ctx.arc(sx + 16, sy + 17, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#75c3e5';
    ctx.beginPath();
    ctx.arc(sx + 16, sy + 17, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.54)';
    ctx.fillRect(sx + 14, sy + 7, 4, 7 + Math.sin(tick / 220 + sx) * 2);
  } else if (item.type === 'telescope') {
    ctx.fillStyle = '#7d8493';
    ctx.fillRect(sx + 8, sy + 10, 14, 5);
    ctx.fillRect(sx + 14, sy + 15, 3, 10);
    ctx.fillRect(sx + 22, sy + 11, 4, 3);
    ctx.fillStyle = '#c4ccd7';
    ctx.fillRect(sx + 10, sy + 9, 10, 2);
  }
}

function drawBuildingShadow(bx, by, bw, bh) {
  ctx.fillStyle = 'rgba(22, 34, 28, 0.2)';
  ctx.beginPath();
  ctx.ellipse(bx + bw / 2, by + bh - 2, bw * 0.38, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawDoorTile(building, bx, by, style) {
  const doorTile = building.door ? building.door.x - building.x : Math.floor(building.w / 2);
  const doorX = bx + doorTile * TILE + 8;
  const doorY = by + building.h * TILE - 27;
  ctx.fillStyle = style.door;
  ctx.fillRect(doorX, doorY, 16, 19);
  ctx.fillStyle = 'rgba(255, 240, 191, 0.24)';
  ctx.fillRect(doorX + 3, doorY + 4, 10, 6);
  ctx.fillStyle = 'rgba(255, 238, 180, 0.12)';
  ctx.fillRect(doorX - 4, doorY + 16, 24, 10);
}

function drawWindow(x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.46)';
  ctx.fillRect(x + 2, y + 2, width - 4, 2);
  ctx.fillStyle = 'rgba(77, 111, 132, 0.35)';
  ctx.fillRect(x + Math.floor(width / 2) - 1, y, 2, height);
  ctx.fillRect(x, y + Math.floor(height / 2) - 1, width, 2);
}

function drawSignPlaque(cx, y, label, fill, textColor = '#375046') {
  fillPanel(cx - 22, y, 44, 13, 6, fill, 'rgba(255, 255, 255, 0.4)');
  ctx.fillStyle = textColor;
  ctx.font = 'bold 7px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, y + 7);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawHouseBuilding(building, bx, by, style, tick) {
  const bw = building.w * TILE;
  const bh = building.h * TILE;
  drawBuildingShadow(bx, by, bw, bh);

  fillPanel(bx + 8, by + 24, bw - 16, bh - 28, 14, style.wall, 'rgba(108, 92, 75, 0.24)');
  ctx.fillStyle = style.trim;
  ctx.fillRect(bx + 5, by + 24, bw - 10, 6);
  ctx.fillRect(bx + 5, by + bh - 10, bw - 10, 6);

  ctx.fillStyle = style.roofDark;
  ctx.beginPath();
  ctx.moveTo(bx + 6, by + 28);
  ctx.lineTo(bx + bw / 2, by + 2);
  ctx.lineTo(bx + bw - 6, by + 28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = style.roof;
  ctx.beginPath();
  ctx.moveTo(bx + 10, by + 27);
  ctx.lineTo(bx + bw / 2, by + 6);
  ctx.lineTo(bx + bw - 10, by + 27);
  ctx.closePath();
  ctx.fill();

  const windowWidth = building.w === 3 ? 16 : 18;
  drawWindow(bx + 16, by + 38, windowWidth, 16, style.window);
  drawWindow(bx + bw - 16 - windowWidth, by + 38, windowWidth, 16, style.window);
  if (building.w > 3) drawWindow(bx + bw / 2 - 9, by + 36, 18, 18, style.window);

  ctx.fillStyle = 'rgba(116, 180, 104, 0.58)';
  ctx.fillRect(bx + 12, by + bh - 13, 12, 5);
  ctx.fillRect(bx + bw - 24, by + bh - 13, 12, 5);
  ctx.fillStyle = '#ffd898';
  ctx.fillRect(bx + 15, by + bh - 13 + Math.sin(tick / 260 + bx) * 0.4, 2, 2);
  ctx.fillRect(bx + bw - 17, by + bh - 12 - Math.sin(tick / 280 + bx) * 0.4, 2, 2);

  drawDoorTile(building, bx, by, style);
  drawSignPlaque(bx + bw / 2, by + 12, style.sign, '#f8e5a5');
}

function drawMarketBuilding(building, bx, by, style) {
  const bw = building.w * TILE;
  const bh = building.h * TILE;
  drawBuildingShadow(bx, by, bw, bh);
  fillPanel(bx + 8, by + 25, bw - 16, bh - 28, 14, style.wall, 'rgba(109, 92, 73, 0.22)');
  fillPanel(bx + 4, by + 10, bw - 8, 22, 11, style.roofDark);
  fillPanel(bx + 7, by + 8, bw - 14, 20, 10, style.roof);
  for (let stripeX = bx + 10; stripeX < bx + bw - 10; stripeX += 18) {
    ctx.fillStyle = stripeX % 36 === 10 ? '#fff6ee' : '#f4d392';
    ctx.fillRect(stripeX, by + 31, 10, 12);
  }
  drawWindow(bx + 18, by + 46, 16, 13, style.window);
  drawWindow(bx + bw - 34, by + 46, 16, 13, style.window);
  drawDoorTile(building, bx, by, style);
  drawSignPlaque(bx + bw / 2, by + 13, style.sign, '#fff0af');
}

function drawGreenhouseBuilding(building, bx, by, style, tick) {
  const bw = building.w * TILE;
  const bh = building.h * TILE;
  drawBuildingShadow(bx, by, bw, bh);
  fillPanel(bx + 8, by + 20, bw - 16, bh - 22, 14, style.trim, 'rgba(71, 96, 77, 0.28)');
  fillPanel(bx + 12, by + 18, bw - 24, bh - 24, 12, style.wall, 'rgba(255, 255, 255, 0.28)');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.fillRect(bx + 18, by + 26, bw - 36, 14);
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < building.w; col += 1) {
      drawWindow(bx + 16 + col * 24, by + 34 + row * 17, 18, 13, style.window);
    }
  }
  ctx.fillStyle = '#6db064';
  ctx.fillRect(bx + 22, by + bh - 15, bw - 44, 6);
  ctx.fillStyle = '#f0d46d';
  ctx.fillRect(bx + 27, by + bh - 14 + Math.sin(tick / 230 + bx) * 0.6, 2, 2);
  ctx.fillRect(bx + bw - 30, by + bh - 12 - Math.sin(tick / 230 + bx) * 0.6, 2, 2);
  drawDoorTile(building, bx, by, style);
  drawSignPlaque(bx + bw / 2, by + 11, style.sign, '#e1f4d6');
}

function drawWorkshopBuilding(building, bx, by, style, tick) {
  const bw = building.w * TILE;
  const bh = building.h * TILE;
  drawBuildingShadow(bx, by, bw, bh);
  fillPanel(bx + 10, by + 24, bw - 20, bh - 28, 13, style.wall, 'rgba(96, 81, 70, 0.26)');
  fillPanel(bx + 6, by + 11, bw - 12, 24, 10, style.roof);
  ctx.fillStyle = style.roofDark;
  ctx.fillRect(bx + 14, by + 7, 16, 18);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(bx + 17, by + 11, 10, 4);
  drawWindow(bx + 18, by + 42, 16, 16, style.window);
  drawWindow(bx + bw - 34, by + 42, 16, 16, style.window);
  ctx.strokeStyle = '#f0c96e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bx + bw / 2 + 20, by + 30, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + bw / 2 + 20, by + 22);
  ctx.lineTo(bx + bw / 2 + 20, by + 38);
  ctx.moveTo(bx + bw / 2 + 12, by + 30);
  ctx.lineTo(bx + bw / 2 + 28, by + 30);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 229, 185, 0.35)';
  ctx.fillRect(bx + 15, by + bh - 15 + Math.sin(tick / 220 + bx) * 0.5, 3, 3);
  drawDoorTile(building, bx, by, style);
  drawSignPlaque(bx + bw / 2, by + 13, style.sign, '#f6e8cb');
}

function drawObservatoryBuilding(building, bx, by, style) {
  const bw = building.w * TILE;
  const bh = building.h * TILE;
  drawBuildingShadow(bx, by, bw, bh);
  fillPanel(bx + 12, by + 28, bw - 24, bh - 30, 14, style.wall, 'rgba(95, 92, 111, 0.24)');
  ctx.fillStyle = style.roofDark;
  ctx.beginPath();
  ctx.arc(bx + bw / 2, by + 28, 32, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = style.roof;
  ctx.beginPath();
  ctx.arc(bx + bw / 2, by + 31, 28, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  drawWindow(bx + 18, by + 46, 15, 14, style.window);
  drawWindow(bx + bw - 33, by + 46, 15, 14, style.window);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(bx + bw / 2 - 4, by + 10, 8, 16);
  drawDoorTile(building, bx, by, style);
  drawSignPlaque(bx + bw / 2, by + 11, style.sign, '#eef0ff');
}

function drawBuilding(building, cameraX, cameraY, tick) {
  const image = state.assets.buildings[building.sprite];
  const bx = building.x * TILE - cameraX;
  const by = building.y * TILE - cameraY;
  const style = BUILDING_STYLES[building.sprite] || BUILDING_STYLES.home;

  if (USE_IMAGE_ASSETS && image) {
    ctx.drawImage(image, bx, by, building.w * TILE, building.h * TILE);
    return;
  }

  if (building.sprite === 'market') {
    drawMarketBuilding(building, bx, by, style);
    return;
  }
  if (building.sprite === 'greenhouse') {
    drawGreenhouseBuilding(building, bx, by, style, tick);
    return;
  }
  if (building.sprite === 'workshop') {
    drawWorkshopBuilding(building, bx, by, style, tick);
    return;
  }
  if (building.sprite === 'observatory') {
    drawObservatoryBuilding(building, bx, by, style);
    return;
  }
  drawHouseBuilding(building, bx, by, style, tick);
}

function drawPlayerShadow(drawX, drawY) {
  ctx.fillStyle = 'rgba(26, 32, 28, 0.22)';
  ctx.beginPath();
  ctx.ellipse(drawX + 16, drawY + 28, 8.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawOwl(drawX, drawY, frame, direction, palette) {
  const wingShift = frame === 1 ? 0 : frame === 0 ? -1 : 1;
  drawPlayerShadow(drawX, drawY);
  ctx.fillStyle = palette.wing;
  ctx.beginPath();
  ctx.ellipse(drawX + 10, drawY + 18, 4, 6, -0.2, 0, Math.PI * 2);
  ctx.ellipse(drawX + 22, drawY + 18, 4, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.body;
  ctx.beginPath();
  ctx.ellipse(drawX + 16, drawY + 17, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.belly;
  ctx.beginPath();
  ctx.ellipse(drawX + 16, drawY + 19, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.eyes;
  ctx.beginPath();
  ctx.arc(drawX + 12, drawY + 14, 3.4, 0, Math.PI * 2);
  ctx.arc(drawX + 20, drawY + 14, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b2521';
  if (direction !== 'up') {
    ctx.fillRect(drawX + 11, drawY + 13, 2, 2);
    ctx.fillRect(drawX + 19, drawY + 13, 2, 2);
  }
  ctx.fillStyle = palette.beak;
  ctx.beginPath();
  ctx.moveTo(drawX + 16, drawY + 16);
  ctx.lineTo(drawX + 12, drawY + 20);
  ctx.lineTo(drawX + 20, drawY + 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = palette.trim;
  ctx.fillRect(drawX + 12 + wingShift, drawY + 4, 2, 5);
  ctx.fillRect(drawX + 18 - wingShift, drawY + 4, 2, 5);
}

function drawHumanoid(drawX, drawY, direction, frame, palette) {
  const side = direction === 'left' ? -1 : 1;
  const step = frame === 0 ? -1 : frame === 2 ? 1 : 0;
  drawPlayerShadow(drawX, drawY);

  ctx.fillStyle = palette.legs;
  ctx.fillRect(drawX + 10, drawY + 21, 5, 6 + Math.max(0, step));
  ctx.fillRect(drawX + 17, drawY + 21, 5, 6 + Math.max(0, -step));
  ctx.fillStyle = palette.boots;
  ctx.fillRect(drawX + 9, drawY + 27, 6, 3);
  ctx.fillRect(drawX + 17, drawY + 27, 6, 3);

  fillPanel(drawX + 9, drawY + 12, 14, 12, 4, palette.outfit);
  ctx.fillStyle = palette.trim;
  ctx.fillRect(drawX + 12, drawY + 14, 8, 3);
  ctx.fillStyle = palette.skin;
  ctx.fillRect(drawX + 8 + side, drawY + 14, 2, 8);
  ctx.fillRect(drawX + 22 - side, drawY + 14, 2, 8);

  if (palette.accessoryType === 'satchel') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 18, drawY + 17, 4, 5);
    ctx.fillRect(drawX + 15, drawY + 13, 1.5, 8);
  } else if (palette.accessoryType === 'book') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 18, drawY + 15, 4, 6);
    ctx.fillStyle = '#fff5d3';
    ctx.fillRect(drawX + 19, drawY + 16, 2, 4);
  } else if (palette.accessoryType === 'apron') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 12, drawY + 16, 8, 7);
  } else if (palette.accessoryType === 'tool') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 19, drawY + 14, 3, 8);
  } else if (palette.accessoryType === 'scarf') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 11, drawY + 13, 10, 3);
  } else if (palette.accessoryType === 'cape') {
    ctx.fillStyle = palette.accessory;
    ctx.fillRect(drawX + 9, drawY + 15, 3, 9);
    ctx.fillRect(drawX + 20, drawY + 15, 3, 9);
  }

  ctx.fillStyle = palette.skin;
  ctx.beginPath();
  ctx.arc(drawX + 16, drawY + 9, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.hair;
  if (direction === 'up') {
    ctx.fillRect(drawX + 10, drawY + 2, 12, 7);
    ctx.fillRect(drawX + 11, drawY + 9, 10, 2);
  } else if (direction === 'left') {
    ctx.fillRect(drawX + 10, drawY + 2, 12, 5);
    ctx.fillRect(drawX + 9, drawY + 4, 6, 6);
  } else if (direction === 'right') {
    ctx.fillRect(drawX + 10, drawY + 2, 12, 5);
    ctx.fillRect(drawX + 17, drawY + 4, 6, 6);
  } else {
    ctx.fillRect(drawX + 10, drawY + 2, 12, 5);
    ctx.fillRect(drawX + 9, drawY + 4, 14, 3);
  }

  if (palette.hat) {
    ctx.fillStyle = palette.hat;
    ctx.fillRect(drawX + 9, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 11, drawY, 10, 3);
    ctx.fillStyle = palette.hatBand;
    ctx.fillRect(drawX + 10, drawY + 3, 12, 1.5);
  }

  if (direction !== 'up') {
    ctx.fillStyle = '#2c261f';
    if (direction === 'left') {
      ctx.fillRect(drawX + 11, drawY + 9, 2, 2);
    } else if (direction === 'right') {
      ctx.fillRect(drawX + 19, drawY + 9, 2, 2);
    } else {
      ctx.fillRect(drawX + 12, drawY + 9, 2, 2);
      ctx.fillRect(drawX + 18, drawY + 9, 2, 2);
    }
  }
}

function drawCharacter(name, tileX, tileY, direction, frame, cameraX, cameraY) {
  const image = state.assets.sprites[name];
  const drawX = tileX * TILE - cameraX;
  const drawY = tileY * TILE - cameraY;

  if (USE_IMAGE_ASSETS && image) {
    const row = DIRS[direction].row;
    ctx.drawImage(image, frame * 32, row * 32, 32, 32, drawX, drawY, TILE, TILE);
    return;
  }

  const palette = CHARACTER_STYLES[name] || CHARACTER_STYLES.player;
  if (palette.species === 'owl') {
    drawOwl(drawX, drawY, frame, direction, palette);
    return;
  }
  drawHumanoid(drawX, drawY, direction, frame, palette);
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let rowY = y;
  for (let index = 0; index < words.length; index += 1) {
    const testLine = `${line}${words[index]} `;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, rowY);
      line = `${words[index]} `;
      rowY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line.trim(), x, rowY);
}

function interactionAhead() {
  if (state.mode !== 'play' || state.modal) return null;
  const vector = DIRS[state.player.direction];
  const tx = state.player.x + vector.dx;
  const ty = state.player.y + vector.dy;
  const actor = actorAt(tx, ty);
  if (actor) return { kind: 'actor', x: actor.x, y: actor.y, label: actor.name };
  const sign = currentMap().signs.find((item) => item.x === tx && item.y === ty);
  if (sign) return { kind: 'sign', x: sign.x, y: sign.y, label: 'Sign' };
  return null;
}

function drawInteractionMarker(target, cameraX, cameraY, tick, theme) {
  if (!target) return;
  const bob = Math.sin(tick / 200) * 2;
  const markerX = target.x * TILE - cameraX + 16;
  const markerY = target.y * TILE - cameraY - 8 + bob;
  fillPanel(markerX - 12, markerY - 10, 24, 16, 8, theme.accentSoft, 'rgba(255, 255, 255, 0.55)');
  ctx.fillStyle = theme.hud;
  ctx.font = 'bold 12px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', markerX, markerY - 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawAmbientLife(theme, timestamp) {
  ctx.save();
  if (theme.indoor) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let index = 0; index < 8; index += 1) {
      const x = (timestamp * 0.03 + index * 87) % (canvas.width + 60) - 30;
      const y = 80 + (index * 53) % 240 + Math.sin(timestamp / 700 + index) * 8;
      ctx.fillRect(x, y, 2, 2);
    }
  } else {
    for (let index = 0; index < 10; index += 1) {
      const x = (timestamp * 0.024 + index * 91) % (canvas.width + 80) - 40;
      const y = 50 + (index * 47) % (canvas.height - 160) + Math.sin(timestamp / 600 + index) * 10;
      ctx.fillStyle = index % 3 === 0 ? 'rgba(255, 235, 170, 0.38)' : 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.ellipse(x, y, 2 + (index % 2), 3, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawSigns(cameraX, cameraY) {
  currentMap().signs.forEach((sign) => {
    const sx = sign.x * TILE - cameraX;
    const sy = sign.y * TILE - cameraY;
    ctx.fillStyle = '#9b7653';
    ctx.fillRect(sx + 8, sy + 7, 16, 11);
    ctx.fillRect(sx + 14, sy + 18, 4, 10);
    ctx.fillStyle = '#f7e1a4';
    ctx.fillRect(sx + 10, sy + 9, 12, 7);
  });
}

function drawHud(theme, map, target) {
  fillPanel(16, 14, 262, 58, 20, 'rgba(255, 253, 246, 0.82)', 'rgba(255, 255, 255, 0.6)');
  ctx.fillStyle = theme.hud;
  ctx.font = 'bold 21px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillText(map.name, 28, 38);
  ctx.font = '13px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillStyle = 'rgba(32, 49, 41, 0.76)';
  ctx.fillText(currentTheme().label, 28, 58);

  fillPanel(canvas.width - 222, 14, 206, 58, 20, theme.hudSoft, 'rgba(255, 255, 255, 0.62)');
  ctx.fillStyle = theme.hud;
  ctx.font = 'bold 14px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillText('Stamp Light', canvas.width - 206, 37);
  fillPanel(canvas.width - 206, 44, 140, 12, 999, 'rgba(33, 49, 41, 0.12)');
  const progressWidth = Math.round((state.stamps.length / data.stampOrder.length) * 140);
  if (progressWidth > 0) {
    ctx.fillStyle = theme.accent;
    roundRectPath(canvas.width - 206, 44, progressWidth, 12, 999);
    ctx.fill();
  }
  ctx.fillStyle = theme.hud;
  ctx.font = 'bold 16px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillText(`${state.stamps.length}/${data.stampOrder.length}`, canvas.width - 55, 55);

  if (isRunning()) {
    fillPanel(canvas.width - 92, 78, 76, 28, 14, 'rgba(255, 235, 176, 0.88)', 'rgba(255, 255, 255, 0.58)');
    ctx.fillStyle = '#704b1f';
    ctx.font = 'bold 14px "Avenir Next", "Trebuchet MS", sans-serif';
    ctx.fillText('RUN', canvas.width - 69, 97);
  }

  fillPanel(16, canvas.height - 108, canvas.width - 32, 92, 24, 'rgba(17, 28, 23, 0.66)', 'rgba(255, 255, 255, 0.15)');
  ctx.fillStyle = '#f7f3e7';
  ctx.font = '17px "Avenir Next", "Trebuchet MS", sans-serif';
  drawWrappedText(state.message, 30, canvas.height - 74, canvas.width - 60, 21);
  ctx.font = '13px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillStyle = 'rgba(247, 243, 231, 0.82)';
  const prompt = target
    ? `Facing ${target.label}. Press E, Enter, or tap Talk.`
    : 'Walk with WASD or arrows. Use Shift or Run Toggle to move faster.';
  ctx.fillText(prompt, 30, canvas.height - 26);
}

function renderWorld(timestamp) {
  const map = currentMap();
  const theme = currentTheme();
  const progress = state.player.moving ? Math.min(state.player.progress, 1) : 0;
  const px = (state.player.fromX + (state.player.toX - state.player.fromX) * progress) * TILE;
  const py = (state.player.fromY + (state.player.toY - state.player.fromY) * progress) * TILE;
  const cameraX = Math.max(0, Math.min(px - canvas.width / 2 + TILE / 2, map.width * TILE - canvas.width));
  const cameraY = Math.max(0, Math.min(py - canvas.height / 2 + TILE / 2, map.height * TILE - canvas.height));
  const startX = Math.floor(cameraX / TILE);
  const startY = Math.floor(cameraY / TILE);
  const endX = Math.min(map.width, startX + VIEW_W + 2);
  const endY = Math.min(map.height, startY + VIEW_H + 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = theme.indoor ? '#0f161c' : '#b7e6f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      drawTile(map.tiles[y][x], x, y, x * TILE - cameraX, y * TILE - cameraY, timestamp, theme, map);
    }
  }

  drawAmbientLife(theme, timestamp);

  map.decorations
    .slice()
    .sort((left, right) => left.y - right.y)
    .forEach((item) => drawDecoration(item, item.x * TILE - cameraX, item.y * TILE - cameraY, timestamp));

  drawSigns(cameraX, cameraY);
  map.buildings.forEach((building) => drawBuilding(building, cameraX, cameraY, timestamp));

  const drawables = actorList().map((actor) => ({
    key: actor.id,
    x: actor.x,
    y: actor.y,
    direction: actor.direction,
    frame: 1,
    sprite: actor.sprite
  }));

  drawables.push({
    key: 'player',
    x: state.player.fromX + (state.player.toX - state.player.fromX) * progress,
    y: state.player.fromY + (state.player.toY - state.player.fromY) * progress,
    direction: state.player.direction,
    frame: state.player.frame,
    sprite: 'player'
  });

  drawables
    .sort((left, right) => left.y - right.y)
    .forEach((item) => drawCharacter(item.sprite, item.x, item.y, item.direction, item.frame, cameraX, cameraY));

  const target = interactionAhead();
  drawInteractionMarker(target, cameraX, cameraY, timestamp, theme);
  drawHud(theme, map, target);
}

function updatePanels() {
  const map = currentMap();
  const quest = activeQuest();
  const qa = state.qaReport || { storyQuestions: 0, practiceQuestions: 0, areaCount: 0, warpCount: 0, errors: [] };

  areaNameEl.textContent = map.name;
  storySummaryEl.textContent = `${MAP_BLURBS[map.id]} ${state.message}`;
  questTitleEl.textContent = quest.title;
  questBodyEl.textContent = `${quest.summary} Location: ${quest.location}.`;

  stampListEl.innerHTML = data.stampOrder.map((stamp) => {
    const earned = state.stamps.includes(stamp);
    return `<div class="stamp-chip ${earned ? 'earned' : ''}">${earned ? 'Lit' : '...'} ${escapeHtml(stamp)}</div>`;
  }).join('');

  statsEl.innerHTML = [
    `Correct answers: ${state.stats.correct}`,
    `Attempts: ${state.stats.attempted}`,
    `Practice ribbons: ${state.ribbons.length}`,
    `Areas visited: ${state.visitedMaps.length}`,
    `Saves: ${state.stats.saves}`,
    `Run mode: ${input.runLock ? 'Toggle on' : 'Tap or hold Shift'}`
  ].map((line) => `<div class="stat-chip">${escapeHtml(line)}</div>`).join('');

  questLogEl.innerHTML = data.questLine.map((questItem) => {
    const done = hasFlag(questItem.flag);
    const current = !done && questItem.id === quest.id;
    return `<div class="quest-item ${done ? 'done' : ''} ${current ? 'current' : ''}"><strong>${escapeHtml(questItem.title)}</strong><br>${escapeHtml(questItem.location)}</div>`;
  }).join('');

  qaPanelEl.innerHTML = [
    `Story questions: ${qa.storyQuestions}`,
    `Practice questions: ${qa.practiceQuestions}`,
    `Areas built: ${qa.areaCount}`,
    `Travel links checked: ${qa.warpCount}`,
    qa.errors.length === 0 ? 'Automated content checks look clean.' : `Needs fixes: ${qa.errors[0]}`
  ].map((line) => `<div class="qa-item">${escapeHtml(line)}</div>`).join('');
}

function renderDialogue() {
  const page = state.modal.pages[state.modal.index];
  modalKickerEl.textContent = state.modal.kicker;
  modalTitleEl.textContent = state.modal.title;
  modalBodyEl.innerHTML = `<div class="feedback-box">${escapeHtml(page.text)}</div>`;
  const last = state.modal.index === state.modal.pages.length - 1;
  modalChoicesEl.innerHTML = `<button class="choice-btn" data-action="${last ? 'finish-dialogue' : 'next-dialogue'}">${last ? state.modal.finalLabel : 'Next'}</button>`;
  modalFooterEl.textContent = `Page ${state.modal.index + 1} of ${state.modal.pages.length}`;
}

function renderPack() {
  const { pack, index, feedback } = state.modal;
  const question = pack.questions[index];
  modalKickerEl.textContent = pack.kicker;
  modalTitleEl.textContent = pack.title;
  const passageHtml = question.passageLines
    ? `<div class="passage-card"><strong>${escapeHtml(question.passageTitle)}</strong><br>${question.passageLines.map(escapeHtml).join('<br>')}</div>`
    : '';
  const feedbackHtml = feedback ? `<div class="feedback-box">${escapeHtml(feedback)}</div>` : '';
  modalBodyEl.innerHTML = `${passageHtml}<p>${escapeHtml(question.prompt)}</p>${feedbackHtml}`;
  if (feedback && feedback.startsWith('Correct')) {
    modalChoicesEl.innerHTML = '<button class="choice-btn correct" data-action="next-question">Next</button>';
  } else {
    modalChoicesEl.innerHTML = question.choices
      .map((choice, choiceIndex) => `<button class="choice-btn" data-choice="${choiceIndex}">${choiceIndex + 1}. ${escapeHtml(choice)}</button>`)
      .join('');
  }
  modalFooterEl.textContent = `Question ${index + 1} of ${pack.questions.length}`;
}

function renderModal() {
  if (!state.modal) {
    modalEl.classList.add('hidden');
    return;
  }
  modalEl.classList.remove('hidden');
  if (state.modal.type === 'dialogue') renderDialogue();
  if (state.modal.type === 'pack') renderPack();
}

function openDialogue(kicker, title, pages, finalLabel, onFinish) {
  state.mode = 'modal';
  state.modal = {
    type: 'dialogue',
    kicker,
    title,
    pages: pages.map((page) => ({ text: page })),
    index: 0,
    finalLabel: finalLabel || 'Close',
    onFinish
  };
  renderModal();
}

function startPack(factoryKey, completionFlag, rewardType) {
  const source = rewardType === 'ribbon' ? data.practicePackFactories : data.mainPackFactories;
  const pack = source[factoryKey]();
  state.mode = 'modal';
  state.modal = { type: 'pack', pack, index: 0, completionFlag, rewardType, feedback: null };
  renderModal();
}

function finishDialogue() {
  const modal = state.modal;
  if (!modal || modal.type !== 'dialogue') return;
  if (modal.index < modal.pages.length - 1) {
    modal.index += 1;
    renderModal();
    return;
  }
  state.modal = null;
  state.mode = 'play';
  renderModal();
  if (modal.onFinish) modal.onFinish();
}

function finishPack() {
  const { pack, completionFlag, rewardType } = state.modal;
  if (rewardType === 'stamp' && completionFlag && !hasFlag(completionFlag)) state.flags[completionFlag] = true;
  if (rewardType === 'stamp' && !state.stamps.includes(pack.reward)) state.stamps.push(pack.reward);
  if (rewardType === 'ribbon' && !state.ribbons.includes(pack.reward)) state.ribbons.push(pack.reward);
  state.modal = null;
  quickSave(false);
  openDialogue(pack.kicker, pack.title, pack.outro, 'Back to the path', () => {
    state.message = `${pack.reward} earned.`;
    state.mode = 'play';
    updatePanels();
  });
}

function answerQuestion(choiceIndex) {
  const modal = state.modal;
  if (!modal || modal.type !== 'pack') return;
  const question = modal.pack.questions[modal.index];
  state.stats.attempted += 1;
  if (choiceIndex === question.answer) {
    state.stats.correct += 1;
    modal.feedback = `Correct! ${question.celebrate}`;
  } else {
    modal.feedback = `Not yet. ${question.hint}`;
  }
  renderModal();
  updatePanels();
}

function nextQuestion() {
  const modal = state.modal;
  if (!modal || modal.type !== 'pack') return;
  modal.index += 1;
  modal.feedback = null;
  if (modal.index >= modal.pack.questions.length) {
    finishPack();
    return;
  }
  renderModal();
}

function requirementMessage(name, location) {
  openDialogue(name, location, ['You are nearly ready for this lesson. Follow your current journal goal first, then come back.'], 'Back', null);
}

function handlePractice(actor) {
  const neededFlag = PRACTICE_REQUIREMENTS[actor.id];
  if (neededFlag && !hasFlag(neededFlag)) {
    requirementMessage(actor.name, 'Friendly Practice');
    return;
  }
  const reward = data.practicePackFactories[actor.practice]().reward;
  if (state.ribbons.includes(reward)) {
    openDialogue(actor.name, 'Friendly Practice', ['You already won this practice ribbon. Thanks for stopping by again!'], 'Back', null);
    return;
  }
  const intro = data.practicePackFactories[actor.practice]().intro;
  openDialogue(actor.name, 'Friendly Practice', intro, 'Start Practice', () => startPack(actor.practice, null, 'ribbon'));
}

function interactActor(actor) {
  switch (actor.id) {
    case 'mayorClover':
      if (!hasFlag('metMayor')) {
        openDialogue('Mayor Clover', 'Festival Welcome', [
          'The Great Reading Lantern has gone dim, and Redleaf Valley needs a brave helper.',
          'Travel across town, route, library, market, woods, workshop, and observatory to collect every learning stamp.',
          'Start by visiting Ms. Maple inside Redleaf Academy.'
        ], 'Start Adventure', () => {
          state.flags.metMayor = true;
          state.message = 'Adventure started. Visit Ms. Maple in Redleaf Academy.';
          quickSave(false);
          updatePanels();
        });
        return;
      }
      openDialogue('Mayor Clover', 'Festival Update', [hasFlag('festivalComplete') ? 'You lit the Great Reading Lantern. Redleaf Valley will remember your brave learning.' : 'Keep gathering stamps. The festival lantern is almost ready.'], 'Back', null);
      return;
    case 'msMaple':
      if (!hasFlag('metMayor')) return requirementMessage('Ms. Maple', 'Redleaf Academy');
      if (!hasFlag('academyComplete')) return openDialogue('Ms. Maple', 'Sun Stamp Lesson', data.mainPackFactories.academyPack().intro, 'Start Lesson', () => startPack('academyPack', 'academyComplete', 'stamp'));
      return openDialogue('Ms. Maple', 'Redleaf Academy', ['You already earned the Sun Stamp. Ranger Reed is waiting on Sunny Route.'], 'Back', null);
    case 'rangerReed':
      if (!hasFlag('academyComplete')) return requirementMessage('Ranger Reed', 'Sunny Route');
      if (!hasFlag('routeComplete')) return openDialogue('Ranger Reed', 'Trail Stamp Lesson', data.mainPackFactories.routePack().intro, 'Cross the Bridge', () => startPack('routePack', 'routeComplete', 'stamp'));
      return openDialogue('Ranger Reed', 'Sunny Route', ['Great job. The bridge is safe because you subtract so carefully.'], 'Back', null);
    case 'librarianIris':
      if (!hasFlag('routeComplete')) return requirementMessage('Librarian Iris', 'River Library');
      if (!hasFlag('libraryComplete')) return openDialogue('Librarian Iris', 'Book Stamp Lesson', data.mainPackFactories.libraryPack().intro, 'Open the Stories', () => startPack('libraryPack', 'libraryComplete', 'stamp'));
      return openDialogue('Librarian Iris', 'River Library', ['You read like a clue finder. Merchant Milo will love that careful thinking.'], 'Back', null);
    case 'merchantMilo':
      if (!hasFlag('libraryComplete')) return requirementMessage('Merchant Milo', 'Market Meadow');
      if (!hasFlag('marketComplete')) return openDialogue('Merchant Milo', 'Market Stamp Lesson', data.mainPackFactories.marketPack().intro, 'Count the Groups', () => startPack('marketPack', 'marketComplete', 'stamp'));
      return openDialogue('Merchant Milo', 'Market Meadow', ['The market is running smoothly thanks to your group counting.'], 'Back', null);
    case 'gardenerFern':
      if (!hasFlag('marketComplete')) return requirementMessage('Gardener Fern', 'Greenhouse Path');
      if (!hasFlag('gardenComplete')) return openDialogue('Gardener Fern', 'Garden Stamp Lesson', data.mainPackFactories.gardenPack().intro, 'Help the Garden', () => startPack('gardenPack', 'gardenComplete', 'stamp'));
      return openDialogue('Gardener Fern', 'Greenhouse Path', ['The greenhouse is glowing. Owl Ollie can use your sharp reading next.'], 'Back', null);
    case 'owlOllie':
      if (!hasFlag('gardenComplete')) return requirementMessage('Owl Ollie', 'Storybook Woods');
      if (!hasFlag('woodsComplete')) return openDialogue('Owl Ollie', 'Lantern Stamp Lesson', data.mainPackFactories.woodsPack().intro, 'Follow the Clues', () => startPack('woodsPack', 'woodsComplete', 'stamp'));
      return openDialogue('Owl Ollie', 'Storybook Woods', ['Every lantern here is bright because you followed the story clues.'], 'Back', null);
    case 'inventorNova':
      if (!hasFlag('woodsComplete')) return requirementMessage('Inventor Nova', 'Moonrise Workshop');
      if (!hasFlag('workshopComplete')) return openDialogue('Inventor Nova', 'Gear Stamp Lesson', data.mainPackFactories.workshopPack().intro, 'Repair the Train', () => startPack('workshopPack', 'workshopComplete', 'stamp'));
      return openDialogue('Inventor Nova', 'Moonrise Workshop', ['The lantern train can roll tonight because you solved every repair puzzle.'], 'Back', null);
    case 'headmasterGlow':
      if (!hasFlag('workshopComplete')) return requirementMessage('Headmaster Glow', 'Star Observatory');
      if (!hasFlag('observatoryComplete')) return openDialogue('Headmaster Glow', 'Star Stamp Final', data.mainPackFactories.observatoryPack().intro, 'Begin Final Test', () => startPack('observatoryPack', 'observatoryComplete', 'stamp'));
      return openDialogue('Headmaster Glow', 'Star Observatory', ['You passed the final test. Mayor Clover is waiting outside for the celebration.'], 'Back', null);
    case 'festivalMayor':
      if (!hasFlag('observatoryComplete')) return openDialogue('Mayor Clover', 'Festival Square', ['The lantern frame is ready, but it needs every stamp before we can light it.'], 'Back', null);
      if (!hasFlag('festivalComplete')) {
        openDialogue('Mayor Clover', 'Great Reading Lantern', [
          'You gathered every learning stamp from Redleaf Valley.',
          'The lantern rises above the square and glows with every careful answer you gave.',
          'Redleaf Learning Quest is complete. You can keep exploring and replaying practice challenges.'
        ], 'Celebrate', () => {
          state.flags.festivalComplete = true;
          state.message = 'Festival complete. You lit the Great Reading Lantern!';
          quickSave(false);
          updatePanels();
        });
        return;
      }
      return openDialogue('Mayor Clover', 'Festival Square', ['The lantern still shines because you helped the whole valley learn together.'], 'Back', null);
    default:
      if (actor.practice) return handlePractice(actor);
  }
}

function interact() {
  if (state.mode === 'title') return;
  if (state.modal) {
    if (state.modal.type === 'dialogue') {
      finishDialogue();
      return;
    }
    if (state.modal.type === 'pack' && state.modal.feedback && state.modal.feedback.startsWith('Correct')) {
      nextQuestion();
    }
    return;
  }

  const vector = DIRS[state.player.direction];
  const tx = state.player.x + vector.dx;
  const ty = state.player.y + vector.dy;
  const actor = actorAt(tx, ty);
  if (actor) {
    interactActor(actor);
    return;
  }
  const sign = currentMap().signs.find((item) => item.x === tx && item.y === ty);
  if (sign) {
    openDialogue(currentMap().name, 'Sign', [sign.text], 'Back', null);
    return;
  }
  state.message = 'Nothing to do here. Try talking to a guide or walking to a new area.';
  updatePanels();
}

function runQaChecks() {
  const errors = [];
  const storyQuestions = Object.values(data.mainPackFactories).reduce((sum, factory) => sum + factory().questions.length, 0);
  const practiceQuestions = Object.values(data.practicePackFactories).reduce((sum, factory) => sum + factory().questions.length, 0);

  Object.values(data.maps).forEach((map) => {
    map.warps.forEach((warp) => {
      if (!data.maps[warp.targetMap]) errors.push(`Warp from ${map.id} points to missing map ${warp.targetMap}.`);
    });
    map.buildings.forEach((building) => {
      if (building.door && !data.maps[building.door.targetMap]) {
        errors.push(`Door from ${map.id} points to missing map ${building.door.targetMap}.`);
      }
      if (!BUILDING_STYLES[building.sprite] && !data.assets.buildings[building.sprite]) {
        errors.push(`Building sprite ${building.sprite} on ${map.id} has no renderer.`);
      }
    });
  });

  Object.values(data.actors).forEach((actor) => {
    if (!data.maps[actor.mapId]) errors.push(`Actor ${actor.id} points to missing map ${actor.mapId}.`);
    if (!CHARACTER_STYLES[actor.sprite] && actor.sprite !== 'player' && !data.assets.sprites[actor.sprite]) {
      errors.push(`Actor sprite ${actor.sprite} has no renderer.`);
    }
  });

  if (storyQuestions < data.qaTargets.storyQuestionGoal) errors.push('Story question count is below the target.');
  if (practiceQuestions < data.qaTargets.practiceQuestionGoal) errors.push('Practice question count is below the target.');

  return {
    storyQuestions,
    practiceQuestions,
    areaCount: Object.keys(data.maps).length,
    warpCount: Object.values(data.maps).reduce((sum, map) => sum + map.warps.length + map.buildings.filter((building) => !!building.door).length, 0),
    errors
  };
}

function handleModalClick(event) {
  const choiceBtn = event.target.closest('[data-choice]');
  if (choiceBtn) {
    answerQuestion(Number(choiceBtn.dataset.choice));
    return;
  }

  const actionBtn = event.target.closest('[data-action]');
  if (!actionBtn) return;
  if (actionBtn.dataset.action === 'next-dialogue' || actionBtn.dataset.action === 'finish-dialogue') finishDialogue();
  if (actionBtn.dataset.action === 'next-question') nextQuestion();
}

function handleKey(event, down) {
  const key = event.key.toLowerCase();
  const movementMap = {
    w: 'up',
    arrowup: 'up',
    s: 'down',
    arrowdown: 'down',
    a: 'left',
    arrowleft: 'left',
    d: 'right',
    arrowright: 'right'
  };

  if (movementMap[key]) {
    input.held[movementMap[key]] = down;
    event.preventDefault();
  }

  if (key === 'shift') {
    input.run = down;
    updateRunButton();
    event.preventDefault();
  }

  if (!down) return;

  if (key === 'r') {
    event.preventDefault();
    toggleRunLock();
    return;
  }

  if (['e', 'enter', ' '].includes(key)) {
    event.preventDefault();
    interact();
  }

  if (key === 'k') {
    event.preventDefault();
    quickSave();
  }

  if (state.modal && state.modal.type === 'pack' && /^[1-4]$/.test(key) && !(state.modal.feedback && state.modal.feedback.startsWith('Correct'))) {
    answerQuestion(Number(key) - 1);
  }
}

function addHoldButton(button) {
  const key = button.dataset.hold;
  const setActive = (active) => {
    input.held[key] = active;
    button.classList.toggle('active', active);
  };

  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (button.setPointerCapture) button.setPointerCapture(event.pointerId);
    setActive(true);
  });

  ['pointerup', 'pointerleave', 'pointercancel', 'lostpointercapture'].forEach((name) => {
    button.addEventListener(name, () => setActive(false));
  });
}

function step(timestamp) {
  if (!state.ready) return;
  if (!step.lastTime) step.lastTime = timestamp;
  const delta = timestamp - step.lastTime;
  step.lastTime = timestamp;

  if (state.mode === 'play') updateMovement(delta);
  renderWorld(timestamp);
  requestAnimationFrame(step);
}

async function init() {
  state.qaReport = runQaChecks();
  updatePanels();
  updateRunButton();
  syncContinueAvailability();

  try {
    await loadAssets();
    state.ready = true;
    requestAnimationFrame(step);
  } catch (error) {
    console.error(error);
    state.ready = true;
    state.message = 'Some optional art assets failed to load, so the built-in placeholder art is being used.';
    updatePanels();
    requestAnimationFrame(step);
  }
}

newGameBtn.addEventListener('click', () => {
  newGame();
  titleOverlay.style.display = 'none';
});

continueBtn.addEventListener('click', () => {
  if (!loadSavedGame()) return;
  state.mode = 'play';
  titleOverlay.style.display = 'none';
  renderModal();
  updateRunButton();
  updatePanels();
});

modalChoicesEl.addEventListener('click', handleModalClick);
talkBtn.addEventListener('click', interact);
runBtn.addEventListener('click', () => toggleRunLock());
saveBtn.addEventListener('click', () => quickSave());
document.querySelectorAll('[data-hold]').forEach(addHoldButton);
window.addEventListener('keydown', (event) => handleKey(event, true));
window.addEventListener('keyup', (event) => handleKey(event, false));
window.addEventListener('blur', clearHeldInputs);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearHeldInputs();
});

init();
