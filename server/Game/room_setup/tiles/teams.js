let spawnPermanentBaseProtector = (loc, team) => {
    let o = new Entity(loc);
    o.define('baseProtector');
    o.team = team;
    o.color.base = getTeamColor(team);
    o.on('dead', () => spawnPermanentBaseProtector(loc, team));
},
teamCheck = (tile, team) => {
    for (let i = 0; i < tile.entities.length; i++) {
        let entity = tile.entities[i];
        if (entity.team !== team && !entity.ac && !entity.master.master.ac && !entity.isArenaCloser && !entity.master.master.isArenaCloser && entity.type !== "food") {
            entity.kill()
        };
    }
},
teamRoomCheck = (tile, team, room) => {
    if (!room.spawnable[team]) room.spawnable[team] = [];
    room.spawnable[team].push(tile);
};

// Team -1 (blue)
tileClass.base1 = new Tile({
    COLOR: 1, //lgreen, for some reason the string doesnt work
    INIT: (tile, room) => teamRoomCheck(tile, TEAM_LIME, room),
    TICK: tile => teamCheck(tile, TEAM_LIME)
})
tileClass.baseprotected1 = new Tile({
    COLOR: 1, //lgreen, for some reason the string doesnt work
    VISIBLE_FROM_BLACKOUT: true,
    INIT: (tile, room) => {
        teamRoomCheck(tile, TEAM_LIME, room),
        spawnPermanentBaseProtector(tile.loc, TEAM_LIME);
    },
    TICK: tile => teamCheck(tile, TEAM_LIME)
})

// Team -2 (Green)
tileClass.base2 = new Tile({
    COLOR: "purple",
    INIT: (tile, room) => teamRoomCheck(tile, TEAM_PURPLE, room),
    TICK: tile => teamCheck(tile, TEAM_PURPLE)
})
tileClass.baseprotected2 = new Tile({
    COLOR: "purple",
    VISIBLE_FROM_BLACKOUT: true,
    INIT: (tile, room) => {
        teamRoomCheck(tile, TEAM_PURPLE, room),
        spawnPermanentBaseProtector(tile.loc, TEAM_PURPLE);
    },
    TICK: tile => teamCheck(tile, TEAM_PURPLE)
})

// Team -3 (Red)
tileClass.base3 = new Tile({
    COLOR: "red",
    INIT: (tile, room) => teamRoomCheck(tile, TEAM_RED, room),
    TICK: tile => teamCheck(tile, TEAM_RED)
})
tileClass.baseprotected3 = new Tile({
    COLOR: "red",
    VISIBLE_FROM_BLACKOUT: true,
    INIT: (tile, room) => {
        teamRoomCheck(tile, TEAM_RED, room),
        spawnPermanentBaseProtector(tile.loc, TEAM_RED);
    },
    TICK: tile => teamCheck(tile, TEAM_RED)
})

// Team -4 (Purple)
tileClass.base4 = new Tile({
    COLOR: "blue",
    INIT: (tile, room) => teamRoomCheck(tile, TEAM_BLUE, room),
    TICK: tile => teamCheck(tile, TEAM_BLUE)
})
tileClass.baseprotected4 = new Tile({
    COLOR: "blue",
    VISIBLE_FROM_BLACKOUT: true,
    INIT: (tile, room) => {
        teamRoomCheck(tile, TEAM_BLUE, room),
        spawnPermanentBaseProtector(tile.loc, TEAM_BLUE);
    },
    TICK: tile => teamCheck(tile, TEAM_BLUE)
})
