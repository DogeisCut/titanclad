const shapes = [
    -2,
    2,
    0,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    16
]
const shapeNames = [
    "football",
    "line",
    "circle",
    "triangle",
    "square",
    "pentagon",
    "hexagon",
    "heptagon",
    "octogon",
    "sides9",
    "sides10",
    "sides11",
    "sides12",
    "sides13"
]

const colors = [
    -1,
    9,
    16
]
const colorNames = [
    "",
    "Black",
    "Grey"
]

Class.basicDeco = {
    LABEL: "Deco",
    INDEPENDENT: true
}

for (let shapeIndex = 0; shapeIndex < shapes.length; shapeIndex++) {
	const shapeValue = shapes[shapeIndex]
	const shapeName = shapeNames[shapeIndex]

	for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
		const colorValue = colors[colorIndex]
		const colorName = colorNames[colorIndex]

		let generatedClassName = shapeName + 'Deco'
		if (colorName !== '') {
			generatedClassName = generatedClassName + colorName
		}

        Class[generatedClassName] = {
            PARENT: "basicDeco",
			SHAPE: shapeValue,
			COLOR: colorValue
		}
	}
}