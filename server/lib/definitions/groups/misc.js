const { combineStats, skillSet, makeAuto, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
require('./generics.js')
require('./tanks.js')
const g = require('../gunvals.js')

// OBSTACLES
Class.rock = {
    TYPE: "wall",
    DAMAGE_CLASS: 1,
    LABEL: "Rock",
    FACING_TYPE: "turnWithSpeed",
    SHAPE: 0,
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 10000,
        
        REGEN: 1000,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1,
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: "lightGray",
    VARIES_IN_SIZE: true,
    ACCEPTS_SCORE: false
}
Class.wall = {
    PARENT: "rock",
    LABEL: "Wall",
    SIZE: 25,
    SHAPE: 4,
    ANGLE: 0,
    FACING_TYPE: ["noFacing", { angle: Math.PI / 2 }],
    WALL_TYPE: 1,
    VARIES_IN_SIZE: false
}

// DOMINATORS
Class.dominator = {
    PARENT: "genericTank",
    LABEL: "Dominator",
    UPGRADE_LABEL: 'Unknown',
    ON_MINIMAP: false,
    DANGER: 7,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1,
    }),
    LEVEL: 45,
    level_cap: 45,
    SIZE: 50,
    SYNC_WITH_TANK: true,
    BODY: {
        RESIST: 100,
        SPEED: 1.32,
        ACCELERATION: 0.8,
        HEALTH: 590,
        DAMAGE: 6,
        PENETRATION: 0.25,
        FOV: 0.5,
        PUSHABILITY: 0,
        HETERO: 0,
        
    },
    CONTROLLERS: ["nearestDifferentMaster", ["spin", { onlyWhenIdle: true }]],
    AI: { IGNORE_SHAPES: true },
    DISPLAY_NAME: true,
    TURRETS: [
        {
            POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: "dominationBody"
        }
    ],
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    HITS_OWN_TYPE: "pushOnlyTeam"
}
Class.destroyerDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Destroyer',
    GUNS: [
        {
            POSITION: [15.25, 6.75, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.destroyerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 6.75, -1.6, 6.75, 0, 0, 0]
        }
    ]
}
Class.gunnerDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Gunner',
    GUNS: [
        {
            POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15.85, 3, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0]
        }
    ]
}
Class.trapperDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Trapper',
    FACING_TYPE: ["spin", {speed: 0.02}],
    GUNS: weaponArray([
        {
            POSITION: [4, 3.75, 1, 8, 0, 0, 0]
        },
        {
            POSITION: [1.25, 3.75, 1.7, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true
            }
        }
    ], 8)
}

// MISCELLANEOUS TANKS
Class.baseProtector = {
    PARENT: "genericTank",
    LABEL: "Defender",
    NAME: "Defender",
    ON_MINIMAP: false,
    SIZE: 128,
    DAMAGE_CLASS: 0,
    ACCEPTS_SCORE: false,
    CAN_BE_ON_LEADERBOARD: false,
    IGNORED_BY_AI: true,
    HITS_OWN_TYPE: "pushOnlyTeam",
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        spd: 1,
        str: 1,
    }),
    MAX_CHILDREN: 8,
    BODY: {
        SPEED: 0,
        HEALTH: 1e4,
        DAMAGE: 10,
        PENETRATION: 0.25,
        
        REGEN: 100,
        FOV: 1,
        PUSHABILITY: 0,
        RESIST: 10000,
        HETERO: 0,
    },
    FACING_TYPE: ["spin", { speed: 0.04 }],
    GUNS: [
        ...weaponArray([
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 4,
                    ASPECT: 1.5,
                    X: 8,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.baseProtector]),
                    TYPE: "bigBaseDrone",
                    AUTOFIRE: true,
                }
            },
            ...weaponMirror({
                POSITION: {
                    LENGTH: 4,
                    WIDTH: 2,
                    ASPECT: 1.5,
                    X: 8,
                    Y: 0,
                    ANGLE: 33,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.baseProtector]),
                    TYPE: "baseDrone",
                    AUTOFIRE: true,
                }
            })
        ], 4)
    ],
    TURRETS: [
        {
            TYPE: ["octogonDecoBlack", {FACING_TYPE: ["noFacing", { angle: Math.PI / 8 }]}],
            POSITION: {
                SIZE: 25,
                X: 0,
                Y: 0,
                ANGLE: 0,
                LAYER: 0,
                ARC: 0
            },
        },
    ],
    PROPS: [
        {
            TYPE: "sides10DecoBlack",
            POSITION: {
                SIZE: 14,
                X: 0,
                Y: 0,
                ANGLE: 0,
                LAYER: 1,
            },
        },
        {
            TYPE: "circleDeco",
            POSITION: {
                SIZE: 10,
                X: 0,
                Y: 0,
                ANGLE: 0,
                LAYER: 1,
            },
        }
    ]
};

Class.mothership = {
    PARENT: "genericTank",
    LABEL: "Mothership",
    NAME: "Mothership",
    DANGER: 10,
    SIZE: Class.genericTank.SIZE * (12 / 3),
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: {
        REGEN: 0.5,
        FOV: 1,
        
        ACCEL: 0.2,
        SPEED: 0.3,
        HEALTH: 4000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 1.5,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    GUNS: 
    weaponArray([
        {
            POSITION: [4.3, 3.1, 1.2, 8, 0, 22.5, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: [4.3, 3.1, 1.2, 8, 0, 45, 1/32],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: ["drone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 8, 1/16)
}
Class.arenaCloser = {
    PARENT: "genericTank",
    LABEL: "Arena Closer",
    NAME: "Arena Closer",
    DISPLAY_NAME: false,
    DANGER: 10,
    SIZE: 34,
    COLOR: "yellow",
    UPGRADE_COLOR: "yellow",
    LAYER: 13,
    BODY: {
        REGEN: 1e5,
        HEALTH: 1e6,
        DENSITY: 30,
        DAMAGE: 1e5,
        FOV: 10,
        SPEED: 6,
    },
    SKILL: skillSet({ rld: 1, dam: 1, pen: 1, str: 1, spd: 1, atk: 1, hlt: 1, rgn: 1, mob: 1 }),
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    UPGRADE_TOOLTIP: "Hackerman",
    GUNS: [{
        POSITION: [14, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, g.arenaCloser]),
            TYPE: [ "bullet", { LAYER: 12 } ]
        }
    }]
};

Class.antiTankMachineGun = {
    PARENT: "dominator",
    LABEL: "Anti-Tank Machine Gun",
    UPGRADE_LABEL: "A.T.M.G.",
    CONTROLLERS: [['spin', {onlyWhenIdle: true}], 'nearestDifferentMaster'],
    LEVEL: 45,
    SIZE: 32,
    BODY: {
        RESIST: 100,
        SPEED: 1.32,
        ACCELERATION: 0.8,
        HEALTH: 1e99,
        DAMAGE: 6,
        PENETRATION: 0.25,
        FOV: 1.35,
        PUSHABILITY: 0,
        HETERO: 0,
        
    },
    SKILL_CAP: Array(9).fill(15),
    SKILL: Array(9).fill(15),
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [1, 2.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [16.5, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, 90, 0],
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, -90, 0],
        },
        {
            POSITION: [5.5, 6.5, -1.8, 6.5, 0, 0, 0]
        }
    ],
    TURRETS: [{
        POSITION: [20, 0, 25, 0, 180, 1],
        TYPE: ["antiTankMachineGunArm"]
    }, {
        POSITION: [20, 0, -25, 0, 180, 1],
        TYPE: ["antiTankMachineGunArm"]
    }, {
        POSITION: [26, 0, 0, 0, 360, 0],
        TYPE: ["dominationBody"]
    }]
}
// SERVER TRAVEL PORTAL
Class.portalAura = {
    PARENT: "bullet",
    MOTION_TYPE: "withMaster",
    CLEAR_ON_MASTER_UPGRADE: true,
    ALPHA: 0.4,
    NO_COLLISIONS: true,
    BODY: {
        HEALTH: base.HEALTH * 1000,
        DAMAGE: 0,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    },
    DIE_AT_RANGE: false,
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                if (body.growing) {
                    body.SIZE += 1.2;
                    if (body.SIZE > 45) body.growing = false;
                } else {
                    body.SIZE -= 1.2;
                    if (body.SIZE < 32) body.growing = true;
                }
            }
        },
    ],
}

Class.serverPortal = {
    PARENT: "genericTank",
    LABEL: "Travel Portal",
    UPGRADE_LABEL: "Portal",
    NAME: "Portal",
    COLOR: "#000000",
    BODY: {
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        
        REGEN: 1e100,
        PUSHABILITY: 0,
        DENSITY: 0,
    },
    FACING_TYPE: "spin",
    ITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IGNORED_BY_AI: true,
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    DISPLAY_NAME: true,
    SIZE: 25,
    GUNS: [],
    ALPHA: 1,
    TURRETS: [
        {
            POSITION: [20.1, 0, 0, 0, 0, 1],
            TYPE: ["egg",{COLOR: "#000000"}],
        },
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                for (let instance of entities.values()) {
                    let diffX = instance.x - body.x,
                        diffY = instance.y - body.y,
                        dist2 = diffX ** 2 + diffY ** 2;
                    if (dist2 <= ((body.size / 12)*250) ** 1.9) {
                        let forceMulti = (0.2 / instance.size);
                        if (instance.isPlayer && instance.socket) {
                            if (dist2 < body.size ** 2.5 + instance.size ** 2.5) forceMulti = (3 / instance.size);
                            instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        } else if (
                            !instance.isDominator && 
                            !instance.isArenaCloser && 
                            !instance.godmode && 
                            !instance.invuln && 
                            instance.id != body.id && 
                            instance.type !== "wall" &&
                            instance.team != body.team && 
                            instance.type === "bullet" ||
                            instance.type === "drone" ||
                            instance.type === "trap" ||
                            instance.type === "minion")
                        {
                            forceMulti = (3 / instance.size);
                            instance.velocity.x -= util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y -= util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        }
                    }
                }
            }
        }
    ]
};
for (let i = 0; i < 60; i++) {
    let spawnDelay = Math.random() * 252;
    if (spawnDelay < 20) spawnDelay = Math.random() * 4;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 8, 1, -150, 0, 360 / 60 * i, spawnDelay],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                g.bullet,
                { shudder: 0, speed: 2.7, spray: 0, reload: 0.8, recoil: 0, range: 0.15 },
            ]),
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            DRAW_FILL: false,
            BORDERLESS: true,
            NO_LIMITATIONS: true,
            TYPE: [
                Class.bullet,
                {
                    NO_COLLISIONS: true,
                    ALPHA: 0,
                    ON: [
                        {
                            event: "tick",
                            handler: ({ body }) => {
                                if (body.alpha < 0.9) body.alpha += 0.06; else body.alpha = 0;
                            }
                        }
                    ]
                },
            ],
        },
    });
}
for (let i = 0; i < 2; i++) {
    if (i & 1) i++;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 14, 1, 2.5, 0, 0, i],
        PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.bullet,{damage: 0, speed: 0, maxSpeed: 0, reload: 0.4, recoil: 0, size: 3}]),
            TYPE: "portalAura",
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            NO_LIMITATIONS: true,
            MAX_CHILDREN: 1,
        },
    });
};

// BOTS
Class.bot = {
    FACING_TYPE: "looseToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "minion", "fleeAtLowHealth", ["mapFireToAlt", { onlyIfHasAltFireGun: true }], ["wanderAroundMap", { immitatePlayerMovement: true, lookAtGoal: true }]],
    AI: { IGNORE_SHAPES: true },
};
Class.advancedBot = {
    PARENT: "bot",  
    CONTROLLERS: [  
        "advancedBotAI",  
        "mapAltToFire",   
        ["mapFireToAlt", { onlyIfHasAltFireGun: true }]  
    ],  
    AI: { IGNORE_SHAPES: false },
};


// SCORE KEEPING
Class.tagMode = {
    SHAPE: "",
    LABEL: "Players"
};
// HP for mothership/your custom gamemodes
Class.hp = {
    SHAPE: [],
    LABEL: "##% HP"
};
