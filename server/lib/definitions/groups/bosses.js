const { combineStats, skillSet, makeAuto, makeAura, LayeredBoss, makeDeco, weaponArray, weaponMirror, setTurretProjectileRecoil } = require('../facilitators.js');
const { base, statnames, smshskl } = require('../constants.js');
const g = require('../gunvals.js');
require('./generics.js');
require('./tanks.js');
require('./turrets.js');
const { makeTurret, addDevAura } = require("../facilitators");

Class.miniboss = {
    PARENT: "genericBoss",
    RENDER_ON_LEADERBOARD: true,
    CONTROLLERS: ["nearestDifferentMaster", ["minion", {turnwiserange: 360}], "canRepel"],
    AI: { NO_LEAD: true },
}
Class.ramMiniboss = {
    PARENT: "genericBoss",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal"],
}

Class.dogeiscutBody = {
    PARENT: "genericTank",
    COLOR: "grey",
    SHAPE: [[1,0],[-0.7,0.7],[-0.35,0],[-0.7,-0.7]]
}
Class.dogeiscutTurret = {
    PARENT: "genericTank",
    COLOR: "grey",
    GUNS: [ {
            POSITION: [ 50, 5, 2.5, 0, 0, 0, 0, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.assassin, g.minigun, {reload: 0.1}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [ 18, 8, -2, 0, 0, 0, 0, ],
        }, 
    ],
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ["genericTank",  { MIRROR_MASTER_ANGLE: true, COLOR: "#f6c6a2"}],
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ["genericTank",  { MIRROR_MASTER_ANGLE: true, COLOR: "pink"}],
        },
    ]
}
function createDogeiscutMissileTurret(color) {
    return {
        PARENT: "genericTank",
        COLOR: "grey",
        GUNS: [ {
                POSITION: [ 15, 8, 2.5, 0, 0, 180, 0, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.single,
                        g.skimmer,
                        { reload: 0.5 },
                        g.lowPower,
                        { recoil: 1.35 },
                        { speed: 1.3, maxSpeed: 1.3 },
                        { speed: 1.3, maxSpeed: 1.3 },
                        {reload: 0.15, recoil: 1, range: 0.1}]),
                    TYPE: ["bullet", 
                        {
                        PERSISTS_AFTER_DEATH: true,
                        COLOR: color
                        },
                    ],
                    AUTOFIRE: true,
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
}
function createDogeiscutMissile(color) {
    return {
        PARENT: "bullet",
        LABEL: color + " Missile",
        COLOR: color,
        GUNS: [...Array(11).fill().map((_, i)=>({
            POSITION: [0, 8, 0, 0, 0, ((360) / 11)*i, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.single, g.machineGun, g.shotgun, g.noSpread, { recoil: 0, range: 0.4, damage: 2.5, density: 30 }]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true, COLOR: color }],
                SHOOT_ON_DEATH: true,
            },
        }))],
        TURRETS: [
            {
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: ["dogeiscutMissileTurret_" + color],
            },
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: ["genericTank", {COLOR: "grey"}],
            }
        ]
    }
}
Class.dogeiscutMissileTurret_red = createDogeiscutMissileTurret('red')
Class.dogeiscutMissile_red = createDogeiscutMissile('red')
Class.dogeiscutMissileTurret_orange = createDogeiscutMissileTurret('orange')
Class.dogeiscutMissile_orange = createDogeiscutMissile('orange')
Class.dogeiscutMissileTurret_yellow = createDogeiscutMissileTurret('yellow')
Class.dogeiscutMissile_yellow = createDogeiscutMissile('yellow')
Class.dogeiscutMissileTurret_green = createDogeiscutMissileTurret('green')
Class.dogeiscutMissile_green = createDogeiscutMissile('green')
Class.dogeiscutMissileTurret_cyan = createDogeiscutMissileTurret('cyan')
Class.dogeiscutMissile_cyan = createDogeiscutMissile('cyan')
Class.dogeiscutMissileTurret_blue = createDogeiscutMissileTurret('blue')
Class.dogeiscutMissile_blue = createDogeiscutMissile('blue')
Class.dogeiscutMissileTurret_purple = createDogeiscutMissileTurret('purple')
Class.dogeiscutMissile_purple = createDogeiscutMissile('purple')
Class.dogeiscutBomb = {
        PARENT: "trap",
        LABEL: "Bomb",
        SHAPE: 0,
        GUNS: [...Array(32).fill().map((_, i)=>({
            POSITION: [0, 8, 0, 0, 0, ((360) / 32)*i, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.single, g.machineGun, g.shotgun, g.noSpread, { recoil: 0, range: 0.4, damage: 2.5, size: 0.5}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true,
            },
        })),...Array(10).fill().map((_,i)=>({
            POSITION: [12, 3.5, 1, 0, 0, (360/10)*i, (i%3)/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.single,
                    g.twin,
                    g.gunner,
                    g.cyclone,
                    {reload: 3}
                ]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            }))
        ],
        TURRETS: [
            {
                POSITION: [8, 0, 0, 0, 360, 1],
                TYPE: ["genericTank", {COLOR: "grey"}],
            }
        ]
    }
Class.dogeiscutBoss = {
    PARENT: "miniboss",
    LABEL: "DOG",
    NAME: "DogeisCut",
    DANGER: 10,
    FACING_TYPE: "smoothToTarget",
    UPGRADE_TOOLTIP: "Huh? You want a cool and edgy boss tooltip? Too bad!",
    SYNC_WITH_TANK: true,
    SHAPE: [[1, 0], [-0.7, 0.7], [-0.35, 0], [-0.7, -0.7]],
    COLOR: "yellow",
    UPGRADE_COLOR: "yellow",
    SIZE: 50,
    NO_SIZE_ANIMATION: true,
    VALUE: 5e6,
    BODY: {
        FOV: 0.75,
        SPEED: 0.25 * base.SPEED,
        HEALTH: 14 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    GUNS: [{
        POSITION: [6, 8, 1.5, 3, 0, 180, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.pounder, g.destroyer, g.annihilator, { size: 1, reload: 3, recoil: 5 }]),
            TYPE: ["dogeiscutBomb"],
            STAT_CALCULATOR: "sustained",
        }
    }, {
        POSITION: [4, 4, 1.5, 3, 0, 180, 0,],
        PROPERTIES: {
            COLOR: "black"
        }
    },
        
    {
        POSITION: [1, 2, 1, 4, -8, 68, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_red"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'red'
        }
    }, {
        POSITION: [1, 2, 1, 4, -5.333, 68, 1 / 7,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_orange"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'orange'
        }
    }, {
        POSITION: [1, 2, 1, 4, -2.666, 68, (1 / 7) * 2,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_yellow"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'yellow'
        }
    }, {
        POSITION: [1, 2, 1, 4, 0, 68, (1 / 7) * 3,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_green"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'green'
        }
    }, {
        POSITION: [1, 2, 1, 4, 2.666, 68, (1 / 7) * 4,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_cyan"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'cyan'
        }
    }, {
        POSITION: [1, 2, 1, 4, 5.333, 68, (1 / 7) * 5,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_blue"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'blue'
        }
    }, {
        POSITION: [1, 2, 1, 4, 8, 68, (1 / 7) * 6,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_purple"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'purple'
        }
    },
        
        
    {
        POSITION: [1, 2, 1, 4, 8, -68, 0,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_red"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'red'
        }
    }, {
        POSITION: [1, 2, 1, 4, 5.333, -68, 1 / 7,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_orange"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'orange'
        }
    }, {
        POSITION: [1, 2, 1, 4, 2.666, -68, (1 / 7) * 2,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_yellow"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'yellow'
        }
    }, {
        POSITION: [1, 2, 1, 4, 0, -68, (1 / 7) * 3,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_green"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'green'
        }
    }, {
        POSITION: [1, 2, 1, 4, -2.666, -68, (1 / 7) * 4,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_cyan"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'cyan'
        }
    }, {
        POSITION: [1, 2, 1, 4, -5.333, -68, (1 / 7) * 5,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_blue"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'blue'
        }
    }, {
        POSITION: [1, 2, 1, 4, -8, -68, (1 / 7) * 6,],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.single, g.sniper, g.hunter, g.sidewinder, { speed: 3, range: 0.8, reload: 4 }]),
            TYPE: ["dogeiscutMissile_purple"],
            STAT_CALCULATOR: "sustained",
            COLOR: 'purple'
        }
    },
    ],
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutBody", { MIRROR_MASTER_ANGLE: true, COLOR: "#f6c6a2" }],
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutBody", { MIRROR_MASTER_ANGLE: true, COLOR: "pink" }],
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutTurret", { INDEPENDENT: true, CONTROLLERS: ["nearestDifferentMaster"], COLOR: "yellow" }],
        },
        {
            POSITION: [1, 10.5, 0, 0, 360, 0],
            TYPE: ["genericTank", { COLOR: "black" }],
        },
    ]
}