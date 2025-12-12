const { Sandbox } = require("./gamemodes/sandbox.js");
const { Maze } = require("./gamemodes/maze.js");

class gamemodeManager {
    constructor() {
        this.gameSandbox = new Sandbox(global.gameManager);
        this.gameMaze = new Maze(global.gameManager, null);
    }

    request(type) {
        if (type == "start") {
            if (Config.special_boss_spawns) this.gameSiege.start(Config.maze_type ?? false);
            if (Config.ASSAULT) this.gameAssault.start();
            if (Config.tag) Config.tag_data.initAndStart();
            if (Config.domination) this.gameDomination.start();
            if (Config.mothership) this.gameMothership.start();
            if (Config.maze_type !== undefined) this.gameMaze.generate();
            if (Config.OUTBREAK) this.gameOutbreak.start();
        }
        if (type == "loop") {
            global.gameManager.lagLogger.set();
            global.gameManager.lagLogger.mark();
            if (global.gameManager.lagLogger.totalTime > 100) {
                console.log("Gamemode loop is taking a long time!");
                console.log(`Gamemode loop took ${global.gameManager.lagLogger.totalTime}ms to complete!`);
                console.log(`Gamemode loop log history: (Last ${global.gameManager.lagLogger.sum.length} entries)`);
                console.log(global.gameManager.lagLogger.sum.map(entry => `Run at: ${entry.at}. Time: ${entry.time}.`).join("\n"));
            }
        }
        if (type == "quickloop") { // Mainly for sandbox and trainwars only, but you can also put your own gamemode loop here incase the regular loop doesnt fit.
            if (Config.sandbox) this.gameSandbox.update();
        }
    }

    terminate() {
    }

    redefine(it) {
        this.gameSandbox.redefine(it);
        this.gameMaze.redefine(Config.maze_type);
    }
}

module.exports = { gamemodeManager };