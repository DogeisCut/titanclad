const { polygonSideBase, basePolygonDamageValue, basePolygonHealthValue } = require('../constants.js');

function getPolygonLabelFromSideCount(polygonSideCount) {
    const polygonNameMap = {
        1: "Monogon",
        2: "Duogon",
        3: "Triangle",
        4: "Square",
        5: "Pentagon",
        6: "Hexagon",
        7: "Heptagon",
        8: "Octagon",
        9: "Nonagon",
        10: "Decagon",
        11: "Hendecagon",
        12: "Dodecagon",
        13: "Triskaidecagon",
        14: "Tetrakaidecagon",
        15: "Pentadecagon",
        16: "Hexadecagon",
        17: "Heptadecagon",
        18: "Octadecagon",
        19: "Enneadecagon",
        20: "Icosagon",
        21: "Henicosagon",
        22: "Docosagon",
        23: "Tricosagon",
        24: "Tetracosagon",
        25: "Pentacosagon",
        26: "Hexacosagon",
        27: "Heptacosagon",
        28: "Octacosagon",
        29: "Enneacosagon",
        30: "Triacontagon",
        31: "Hentriacontagon",
        32: "Dotriacontagon",
        33: "Tritriacontagon",
        34: "Tetratriacontagon",
        35: "Pentatriacontagon",
        36: "Hexatriacontagon",
        37: "Heptatriacontagon",
        38: "Octatriacontagon",
        39: "Enneatriacontagon",
        40: "Tetracontagon",
        41: "Hentetracontagon",
        42: "Dotetracontagon",
        43: "Tritetracontagon",
        44: "Tetratetracontagon",
        45: "Pentatetracontagon",
        46: "Hexatetracontagon",
        47: "Heptatetracontagon",
        48: "Octatetracontagon",
        49: "Enneatetracontagon",
        50: "Pentacontagon",
        51: "Henpentacontagon",
        52: "Dopentacontagon",
        53: "Tripentacontagon",
        54: "Tetrapentacontagon",
        55: "Pentapentacontagon",
        56: "Hexapentacontagon",
        57: "Heptapentacontagon",
        58: "Octapentacontagon",
        59: "Enneapentacontagon",
        60: "Hexacontagon",
        90: "Enenecontagon",
        100: "Centagon",
        1000: "Chiliagon"
    }

	if (polygonNameMap[polygonSideCount]) {
		return polygonNameMap[polygonSideCount]
	}

	return `Pratically a Circle`
}

function generatePolygonFoodClassDefinition(polygonSideCount, polygonColor, shapeOverride = polygonSideCount) {
    const absolutePolygonSideCount = Math.abs(polygonSideCount)
    const offsetPolygonSideCount = absolutePolygonSideCount - polygonSideBase

	const polygonLabel = getPolygonLabelFromSideCount(absolutePolygonSideCount)

	const polygonDamageMultiplier = Math.pow(offsetPolygonSideCount - 1, 2)
	const polygonHealthMultiplier = Math.pow(offsetPolygonSideCount, 2)

	const polygonDamageValue = polygonDamageMultiplier * basePolygonDamageValue
	const polygonHealthValue = polygonHealthMultiplier * basePolygonHealthValue

	const polygonValue = Math.floor(Math.pow(absolutePolygonSideCount - polygonSideBase, 5) * 5)
	const polygonSize = Math.pow(absolutePolygonSideCount - 1, 2.5) + polygonSideCount
	const polygonDensity = 2 + offsetPolygonSideCount
	const polygonResist = 1 + offsetPolygonSideCount * 0.05
	const polygonPenetration = 2.5 / Math.sqrt(offsetPolygonSideCount)
	const polygonAcceleration = 0.01 / Math.sqrt(offsetPolygonSideCount)

	return {
		PARENT: "food",
		LABEL: polygonLabel,
		VALUE: polygonValue,
		SHAPE: shapeOverride,
		SIZE: polygonSize,
		COLOR: polygonColor,
		BODY: {
			DAMAGE: polygonDamageValue,
			DENSITY: polygonDensity,
			HEALTH: polygonHealthValue,
			RESIST: polygonResist,
			PENETRATION: polygonPenetration,
			ACCELERATION: polygonAcceleration
		},
        DRAW_HEALTH: true,
	}
}

//Class.monogon = generatePolygonFoodClassDefinition(1, "#ffffff", [[0,0],[0,0]])
//Class.duogon = generatePolygonFoodClassDefinition(2, "yellow", [[-1,0],[1,0]])
Class.triangle = generatePolygonFoodClassDefinition(3, "gold")
Class.square = generatePolygonFoodClassDefinition(4, "red")
Class.pentagon = generatePolygonFoodClassDefinition(5, "blue")
Class.pentagon.GIVE_KILL_MESSAGE = true
Class.hexagon = generatePolygonFoodClassDefinition(6, "orange")
Class.hexagon.GIVE_KILL_MESSAGE = true
Class.heptagon = generatePolygonFoodClassDefinition(7, "green")
Class.heptagon.GIVE_KILL_MESSAGE = true
Class.octogon = generatePolygonFoodClassDefinition(8, "lavender")
Class.octogon.GIVE_KILL_MESSAGE = true
Class.nonagon = generatePolygonFoodClassDefinition(9, "pink")
Class.nonagon.GIVE_KILL_MESSAGE = true
Class.decagon = generatePolygonFoodClassDefinition(10, "white")
Class.decagon.GIVE_KILL_MESSAGE = true
Class.hendecagon = generatePolygonFoodClassDefinition(11, "grey")
Class.hendecagon.GIVE_KILL_MESSAGE = true
Class.dodecagon = generatePolygonFoodClassDefinition(12, "black")
Class.dodecagon.GIVE_KILL_MESSAGE = true

exports.requestPolygon = function (sides) {
    function getPolygonColorFromSideCount(polygonSideCount) {
        const polygonColorMap = {
            1: "#ffffff",
            2: "yellow",
            3: "gold",
            4: "red",
            5: "blue",
            6: "orange",
            7: "green",
            8: "lavender",
            9: "pink",
            10: "white",
            11: "grey",
        }

        if (polygonColorMap[polygonSideCount]) {
            return polygonColorMap[polygonSideCount]
        }

        return 'black'
    }
    const className = getPolygonLabelFromSideCount(sides).toLowerCase()
    
    Class[className] = generatePolygonFoodClassDefinition(sides, getPolygonColorFromSideCount(sides))
    if (sides >= 5) Class[className].GIVE_KILL_MESSAGE = true

    const rarity = 0.5 ** (sides - (polygonSideBase + 2))

    return { className, rarity }
}

Config.food_types = [[1,[]]]
for (let i = 3; i <= 50; i++) {
    const poly = exports.requestPolygon(i)
    console.log(poly)
    Config.food_types[0][1].push([poly.rarity, poly.className])
}


/*
Class.triangle = {
    PARENT: "food",
    LABEL: "Triangle",
    VALUE: 30,
    SHAPE: 3,
    SIZE: 8,
    COLOR: "gold",
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 4,
        HEALTH: basePolygonHealth,
        PENETRATION: 2,
        ACCELERATION: 0.0075
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
};

Class.square = {
    PARENT: "food",
    LABEL: "Square",
    VALUE: 120,
    SHAPE: 4,
    SIZE: 12,
    COLOR: "orange",
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 6,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1.15,
        PENETRATION: 1.5,
        ACCELERATION: 0.005
    },
    DRAW_HEALTH: true,
};

Class.pentagon = {
    PARENT: "food",
    LABEL: "Pentagon",
    VALUE: 400,
    SHAPE: 5,
    SIZE: 21,
    COLOR: "lavender",
    BODY: {
        DAMAGE: 1.5 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 10 * basePolygonHealth,
        RESIST: 1.25,
        PENETRATION: 1.1,
        ACCELERATION: 0.0035
    },
    DRAW_HEALTH: true,
};

Class.hexagon = {
    PARENT: "food",
    LABEL: "Hexagon",
    VALUE: 500,
    SHAPE: 6,
    SIZE: 25,
    COLOR: "hexagon",
    BODY: {
        DAMAGE: 3 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 20 * basePolygonHealth,
        RESIST: 1.3,
        
        PENETRATION: 1.1,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true,
};
*/