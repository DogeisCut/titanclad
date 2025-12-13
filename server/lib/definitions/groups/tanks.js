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
            ...weaponMirror({
                POSITION: {
                    LENGTH: 18,
                    WIDTH: 8,
                    ASPECT: 1,
                    X: 0,
                    Y: -5,
                    ANGLE: 0,
                    DELAY: 0
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet]),
                    TYPE: "bullet",
                }
            }, 0.5)
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
}

tier2: {
    Class.stack = {
        PARENT: "genericTier2Tank",
        LABEL: "Stack",
        DANGER: 4,
        GUNS: [
           {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 10,
                    ASPECT: 1,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet]),
                    TYPE: "bullet",
                }
            },
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 10,
                    ASPECT: 1,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.bullet]),
                    TYPE: "bullet",
                }
            }
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
}

Class.tank.UPGRADES_TIER_0 = ["shooter", "commander", "blocker"]
    Class.shooter.UPGRADES_TIER_1 = ["double"]
        Class.double.UPGRADES_TIER_2 = ["stack"]
    Class.commander.UPGRADES_TIER_1 = ["captain"]
        Class.captain.UPGRADES_TIER_2 = ["major"]
            Class.major.UPGRADES_TIER_3 = ["colonel"]
                Class.colonel.UPGRADES_TIER_4 = ["general"]