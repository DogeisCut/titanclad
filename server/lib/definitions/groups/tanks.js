const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, weaponMirror, makeTurret } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
const { gunGenerators } = require('../gungenerators.js')
require('./generics.js')
const g = require('../gunvals.js')

Class.tank = {
    PARENT: "genericTank",
    SIZE: 16,
    LABEL: "Tank",
    DANGER: 4,
}

tier0: {
    Class.shooter = {
        PARENT: "genericTank",
        LABEL: "Shooter",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon()
        ],
    }
    Class.commander = {
        PARENT: "genericTank",
        LABEL: "Commander",
        DANGER: 5,
        GUNS: [
            ...gunGenerators.droneSpawner()
        ],
    }
    Class.blocker = {
        PARENT: "genericTank",
        LABEL: "Blocker",
        DANGER: 6,
        GUNS: [
            ...gunGenerators.trapLauncher()
        ],
    }
}

tier1: {
    Class.double = {
        PARENT: "genericTier1Tank",
        LABEL: "Double",
        DANGER: 4,
        GUNS: [
            ...weaponMirror(gunGenerators.bulletCannon({ length: 18, width: 8, y: -5}), 0.5)
        ],
    }

    Class.sniper = {
        PARENT: "genericTier1Tank",
        LABEL: "Sniper",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({length: 20}, [g.sniper]),
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: -1.8,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
            },
        ],
    }

    Class.captain = {
        PARENT: "genericTier1Tank",
        LABEL: "Captain",
        DANGER: 5,
        GUNS: [
            ...weaponMirror(gunGenerators.droneSpawner({ angle: 45 }), 0.5)
        ],
    }

    Class.clonk = {
        PARENT: "genericTier1Tank",
        LABEL: "Clonk",
        DANGER: 4,
        GUNS: [
            ...weaponArray(gunGenerators.trapLauncher(), 2, 0.5)
        ],
    }

    Class.crusher = {
        PARENT: "genericTier1Tank",
        LABEL: "Crusher",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({width: 12.25}, [g.heavy])
        ],
    }

    Class.zerg = {
        PARENT: "genericTier1Tank",
        LABEL: "Zerg",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher(),
            ...gunGenerators.droneSpawner({ angle: 180 })
        ],
    }

    Class.warden = {
        PARENT: "genericTier1Tank",
        LABEL: "Warden",
        DANGER: 6,
        GUNS: [
            ...gunGenerators.trapLauncher({width: 12.25}, [g.heavy])
        ],
    }

    Class.pinion = {
        PARENT: "genericTank",
        LABEL: "Pinion",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({length: 22, width: 8}),
            ...gunGenerators.trapLauncher(),
        ],
    }
}

tier2: {
    Class.stack = {
        PARENT: "genericTier2Tank",
        LABEL: "Stack",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon(),
            ...gunGenerators.bulletCannon({ length: 15, delay: 0.5 })
        ],
    }
    
    Class.major = {
        PARENT: "genericTier2Tank",
        LABEL: "Major",
        DANGER: 5,
        GUNS: [
            ...weaponArray(gunGenerators.droneSpawner(), 3)
        ],
    }

    Class.dam = {
        PARENT: "genericTier2Tank",
        LABEL: "Dam",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher(),
            ...gunGenerators.trapLauncher({ length: 15, delay: 0.5 })
        ],
    },
        
    Class.bullseye = {
        PARENT: "genericTier2Tank",
        LABEL: "Bullseye",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({length: 25}, [g.sniper, g.sniper]),
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: -1.8,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
            },
        ],
    },
        
    Class.pounder = {
        PARENT: "genericTier2Tank",
        LABEL: "Pounder",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({width: 15.5}, [g.heavy, g.heavy])
        ],
    }
    
    Class.zalg = {
        PARENT: "genericTier2Tank",
        LABEL: "Zalg",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher(),
            ...weaponMirror(gunGenerators.droneSpawner({ angle: 90 + 45 }), 0.5)
        ],
    }

    Class.triple = {
        PARENT: "genericTier2Tank",
        LABEL: "Triple",
        DANGER: 4,
        GUNS: [
            ...weaponMirror(gunGenerators.bulletCannon({ length: 16, width: 8, y: -5, delay: 0.5, angle: -8 }), 0),
            ...gunGenerators.bulletCannon({ length: 18, width: 8}),
        ],
    }
}

tier3: {
    Class.colonel = {
        PARENT: "genericTier3Tank",
        LABEL: "Colonel",
        DANGER: 5,
        GUNS: [
            ...weaponArray(gunGenerators.droneSpawner(), 4)
        ],
    }

    Class.stream = {
        PARENT: "genericTier3Tank",
        LABEL: "Stream",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({ length: 25 }),
            ...gunGenerators.bulletCannon({ delay: 1 / 3 }),
            ...gunGenerators.bulletCannon({ length: 15, delay: 2 / 3 })
        ],
    }

    Class.barricade = {
        PARENT: "genericTier3Tank",
        LABEL: "Barricade",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher({ length: 25 }),
            ...gunGenerators.trapLauncher({ delay: 1 / 3 }),
            ...gunGenerators.trapLauncher({ length: 15, delay: 2 / 3 })
        ],
    },
        
    Class.deadeye = {
        PARENT: "genericTier3Tank",
        LABEL: "Deadeye",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({length: 30}, [g.sniper, g.sniper, g.sniper]),
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: -1.8,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
            },
        ],
    }
    
    Class.mauler = {
        PARENT: "genericTier3Tank",
        LABEL: "Mauler",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({width: 18}, [g.heavy, g.heavy, g.heavy])
        ],
    }

    Class.zilthrone = {
        PARENT: "genericTier3Tank",
        LABEL: "Zilthrone",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher(),
            ...weaponMirror(gunGenerators.droneSpawner({ angle: 90 + 30 }), 0.5),
            ...gunGenerators.droneSpawner({ angle: 180 })
        ],
    }
    Class.zilch = {
        PARENT: "genericTier3Tank",
        LABEL: "Zilch",
        DANGER: 4,
        GUNS: [
            ...weaponMirror(gunGenerators.trapLauncher({ length: 18, width: 8, y: -5}), 0.5),
            ...weaponMirror(gunGenerators.droneSpawner({ angle: 90 + 45 }), 0.5),
        ],
    }
}

tier4: {
    Class.general = {
        PARENT: "genericTier4Tank",
        LABEL: "General",
        DANGER: 5,
        GUNS: [
            ...weaponArray(gunGenerators.droneSpawner(), 5)
        ],
    }

    Class.river = {
        PARENT: "genericTier4Tank",
        LABEL: "River",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({ length: 30 }),
            ...gunGenerators.bulletCannon({ length: 25, delay: 0.25 }),
            ...gunGenerators.bulletCannon({ delay: 0.5 }),
            ...gunGenerators.bulletCannon({ length: 15, delay: 0.75 })
        ],
    }

    Class.clogger = {
        PARENT: "genericTier4Tank",
        LABEL: "Clogger",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.trapLauncher({ length: 30 }),
            ...gunGenerators.trapLauncher({ length: 25, delay: 0.25 }),
            ...gunGenerators.trapLauncher({ delay: 0.5 }),
            ...gunGenerators.trapLauncher({ length: 15, delay: 0.75 })
        ],
    }

    Class.slip = {
        PARENT: "genericTier4Tank",
        LABEL: "Slip",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({ length: 30 }, [g.sniper]),
            ...gunGenerators.bulletCannon({ length: 25, delay: 1 / 32 }, [g.sniper]),
            ...gunGenerators.bulletCannon({ delay: 2 / 32 }, [g.sniper]),
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: -1.8,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
            },
        ],
    },
        
    Class.enforcer = {
        PARENT: "genericTier4Tank",
        LABEL: "Enforcer",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({length: 35}, [g.sniper, g.sniper, g.sniper, g.sniper]),
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: -1.8,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
            },
        ],
    },
        
    Class.pulverizer = {
        PARENT: "genericTier4Tank",
        LABEL: "Pulverizer",
        DANGER: 4,
        GUNS: [
            ...gunGenerators.bulletCannon({width: 20}, [g.heavy, g.heavy, g.heavy, g.heavy])
        ],
    }
}

Class.tank.UPGRADES_TIER_0 = ["shooter", "commander", "blocker"]
    Class.shooter.UPGRADES_TIER_1 = ["double", "sniper", "crusher", "pinion"]
        Class.double.UPGRADES_TIER_2 = ["triple", "stack", "dam"]
            Class.stack.UPGRADES_TIER_3 = ["stream", "barricade"]
                Class.stream.UPGRADES_TIER_4 = ["river", "slip", "clogger"]
        Class.sniper.UPGRADES_TIER_2 = ["bullseye"]
            Class.bullseye.UPGRADES_TIER_3 = ["deadeye"]
                Class.deadeye.UPGRADES_TIER_4 = ["enforcer", "slip"]
        Class.crusher.UPGRADES_TIER_2 = ["pounder"]
            Class.pounder.UPGRADES_TIER_3 = ["mauler"]
                Class.mauler.UPGRADES_TIER_4 = ["pulverizer"]
    Class.commander.UPGRADES_TIER_1 = ["captain", "zerg"]
        Class.captain.UPGRADES_TIER_2 = ["major", "zalg"]
            Class.major.UPGRADES_TIER_3 = ["colonel", "zilthrone"]
                Class.colonel.UPGRADES_TIER_4 = ["general"]
    Class.blocker.UPGRADES_TIER_1 = ["clonk", "zerg", "warden", "pinion"]
        Class.clonk.UPGRADES_TIER_2 = ["dam"]
            Class.dam.UPGRADES_TIER_3 = ["barricade", "zilch"]
                Class.barricade.UPGRADES_TIER_4 = ["clogger"]
        Class.zerg.UPGRADES_TIER_2 = ["zalg"]
            Class.zalg.UPGRADES_TIER_3 = ["zilthrone", "zilch"]