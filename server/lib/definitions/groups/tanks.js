const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, weaponMirror, makeTurret } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
require('./generics.js')
const g = require('../gunvals.js')

tier0: {
    Class.single = {
        PARENT: "genericTank",
        LABEL: "Single",
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
            }
        ],
    }
}

tier1: {
    Class.double = {
        PARENT: "genericTank",
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
        PROPS: [
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
    },
    
    Class.stack = {
        PARENT: "genericTank",
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
        PROPS: [
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
    }
}


Class.single.UPGRADES_TIER_1 = ["double", "stack"]