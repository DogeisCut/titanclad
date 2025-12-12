const { combineStats, skillSet, makeAura, makeDeco, makeAuto, makeOver, makeMulti } = require('../facilitators.js');
const { base, gunCalcNames, basePolygonDamage, basePolygonHealth, dfltskl, smshskl, statnames } = require('../constants.js');
const g = require('../gunvals.js');

// Generators

const shapeGeneratorUpgrades = [
]

const bossGeneratorUpgrades = [
]

Class.genBody = {
	PARENT: "spectator",
	BODY: {
		SPEED: 25,
		FOV: 1,
	},
	SKILL_CAP: [15, 0, 0, 0, 0, 0, 0, 0, 0, 15],
	LAYER: 1e99,
	ON: [],
	RESET_EVENTS: true,
};

const makeGenerator = (entity, entityLabel, shortEntityLabel, displayEntity, displayEntitySize, shape, color, entitySize, maxChildren = 100, launchSpeed = 1) => {
	const config = {
		PARENT: "genBody",
		LABEL: `${entityLabel} Generator`,
		UPGRADE_LABEL: `${shortEntityLabel} Gen.`,
		SHAPE: shape,
		COLOR: color,
		MAX_CHILDREN: maxChildren,
		UPGRADES_TIER_0: [],

		TURRETS: [{
			POSITION: [displayEntitySize, 0, 0, 0, 0, 1],
			TYPE: [displayEntity, { INDEPENDENT: true }]
		}],

		GUNS: [
			{
				POSITION: [2, 10.5, 1, 15, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([{
						shudder: 0.1,
						speed: launchSpeed,
						recoil: 0.1,
						reload: 6,
						size: entitySize / 13
					}]),
					NO_LIMITATIONS: true,
					SPAWN_OFFSET: 0,
					TYPE: [entity, { INDEPENDENT: true }]
				}
			},
			{
				POSITION: [11, 10.5, 1.4, 4, 0, 0, 0]
			}
		]
	};

	return config;
};

// GENERATOR UPGRADES
/**
 * An identifier that represents a pointer to a `Definition` inside `Class`.
 * @typedef {string} DefinitionReference
 */

/**
 * Assuming a rectangular grid of `DefinitionReference`'s to Generators without upgrades,
 * this function, also assuming the edges are connected (akin to pacman), gives each Generator
 * a "menu" of upgrades, which allows the user to directly "navigate" to a generator's
 * 4 direct neighbors.
 * This function throws an `Error` if the given 2d array is not rectangular.
 * @param {DefinitionReference[][]} matrix 
 * @param {DefinitionReference} previous 
 * @param {DefinitionReference} next 
 */
function generatorMatrix(matrix, previous, next) {
	const height = matrix.length,
		width = matrix[0].length;

	for (let y = 0; y < height; y++) {
		if (matrix[y].length !== width) {
			throw new Error(`The given grid is not rectangular!\nThe row at Y coordinate ${y} has ${matrix[y].length} items instead of the first row which has ${width}!`);
		}

		for (let x = 0; x < width; x++) {
			let top = (y + height - 1) % height,
				bottom = (y + height + 1) % height,
				left = (x + width - 1) % width,
				right = (x + width + 1) % width,

				center = matrix[y][x];
			top = matrix[top][x];
			bottom = matrix[bottom][x];
			left = matrix[y][left];
			right = matrix[y][right];

			let gen = Class[matrix[y][x]];
			if (!gen) {
				throw new Error(`The given grid has an invalid Definition Reference at indexes [${y}][${x}] named "${matrix[y][x]}"`);
			}

			gen.UPGRADES_TIER_0.push(
				Config.spawn_class, top, previous,
				left, center, right,
				"spectator", bottom, next
			);
		}
	}
}

// // SHAPE UPGRADES
// generatorMatrix(shapeGeneratorUpgrades, "roguePalisadeGen", "crasherGen");

// // HOSTILE UPGRADES
// generatorMatrix(bossGeneratorUpgrades, "eggGen", "eliteDestroyerGen");
