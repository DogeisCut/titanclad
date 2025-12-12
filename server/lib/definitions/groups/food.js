const { basePolygonDamage, basePolygonHealth } = require('../constants.js');

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
		12: "Dodecagon"
	}

	if (polygonNameMap[polygonSideCount]) {
		return polygonNameMap[polygonSideCount]
	}

	return `Polygon${polygonSideCount}`
}

function generatePolygonFoodClassDefinition(polygonSideCount, polygonColor, shapeOverride = polygonSideCount) {
	const basePolygonDamageValue = 1
    const basePolygonHealthValue = 2
    
    const absolutePolygonSideCount = Math.abs(polygonSideCount)

	const polygonLabel = getPolygonLabelFromSideCount(absolutePolygonSideCount)

	const polygonDamageMultiplier = Math.pow(absolutePolygonSideCount, 1.2)
	const polygonHealthMultiplier = Math.pow(absolutePolygonSideCount, 2)

	const polygonDamageValue = polygonDamageMultiplier * basePolygonDamageValue
	const polygonHealthValue = polygonHealthMultiplier * basePolygonHealthValue

	const polygonValue = Math.floor(Math.pow(absolutePolygonSideCount, 3) * 5)
	const polygonSize = Math.pow(absolutePolygonSideCount, 1.8)
	const polygonDensity = 2 + absolutePolygonSideCount
	const polygonResist = 1 + absolutePolygonSideCount * 0.05
	const polygonPenetration = 2.5 / Math.sqrt(absolutePolygonSideCount)
	const polygonAcceleration = 0.01 / Math.sqrt(absolutePolygonSideCount)

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
		DRAW_HEALTH: true
	}
}

Class.monogon = generatePolygonFoodClassDefinition(1, "guiwhite", [[0,0],[0,0]])
Class.duogon = generatePolygonFoodClassDefinition(2, "yellow", [[-1,0],[1,0]])
Class.triangle = generatePolygonFoodClassDefinition(3, "gold")
Class.square = generatePolygonFoodClassDefinition(4, "orange")
Class.pentagon = generatePolygonFoodClassDefinition(5, "lavender")
Class.hexagon = generatePolygonFoodClassDefinition(6, "aqua")
Class.heptagon = generatePolygonFoodClassDefinition(7, "teal")
Class.octogon = generatePolygonFoodClassDefinition(8, "pink")
Class.nonagon = generatePolygonFoodClassDefinition(9, "white")
Class.decagon = generatePolygonFoodClassDefinition(10, "grey")
Class.hendecagon = generatePolygonFoodClassDefinition(11, "black")
Class.dodecagon = generatePolygonFoodClassDefinition(11, "guiblack")

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