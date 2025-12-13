const { combineStats } = require('./facilitators.js')
const g = require('./gunvals.js')

exports.gunGenerators = {
    bulletCannon: ({ length = 20, width = 10, hasBase = false, angle = 0, x = 0, y = 0, delay = 0 } = {}, extraStats = []) => {
        return [

        ]
    },
    droneSpawner: ({ length = 16, width = 8, droneTier = 0, angle = 0, x = 0, y = 0, delay = 0 } = {}, extraStats = []) => {
        return [
            {
                POSITION: {
                    LENGTH: length,
                    WIDTH: width,
                    ASPECT: 1.8,
                    X: x,
                    Y: y,
                    ANGLE: angle,
                    DELAY: delay
                },
                PROPERTIES: {
                    MAX_CHILDREN: 4,
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.drone, ...extraStats]),
                    TYPE: "drone",
                }
            }
        ]
    },
    trapLauncher: ({ length = 20, width = 10, trapTier = 0, angle = 0, x = 0, y = 0, delay = 0 } = {}, extraStats = []) => {
        return [
            {
                POSITION: {
                    LENGTH: length-4,
                    WIDTH: width,
                    ASPECT: 1,
                    X: x,
                    Y: y,
                    ANGLE: angle,
                    DELAY: delay
                },
            },
            {
                POSITION: {
                    LENGTH: 4,
                    WIDTH: width,
                    ASPECT: 1.5,
                    X: x+length-4,
                    Y: y,
                    ANGLE: angle,
                    DELAY: delay
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, ...extraStats]),
                    TYPE: "trap",
                }
            },
        ]
    },
}