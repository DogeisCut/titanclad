const { combineStats, makeMenu, makeAura, makeDeco, LayeredBoss, weaponArray, makeRadialAuto, makeTurret, makeAuto } = require('../facilitators.js')
const { base, basePolygonDamage, basePolygonHealth, dfltskl, statnames } = require('../constants.js')
const g = require('../gunvals.js')
require('./tanks.js')
require('./food.js')

// Main Developer Tank
Class.developer = {
    PARENT: "genericTank",
    LABEL: "Developer",
    BODY: {
        
        REGEN: 10,
        HEALTH: 100,
        DAMAGE: 10,
        DENSITY: 20,
        FOV: 2,
    },
    //COLOR: "mirror", // todo: make sure mirror colour doesnt grey out your leaderboard
    SKILL_CAP: Array(9).fill(dfltskl),
    IGNORED_BY_AI: true,
    RESET_CHILDREN: true,
    ACCEPTS_SCORE: true,
    CAN_BE_ON_LEADERBOARD: true,
    CAN_GO_OUTSIDE_ROOM: false,
    IS_IMMUNE_TO_TILES: false,
    DRAW_HEALTH: true,
    ARENA_CLOSER: true,
    INVISIBLE: [0, 0],
    ALPHA: [0, 1],
    HITS_OWN_TYPE: "hardOnlyTanks",
    NECRO: false,
    SHAPE: "M 0.2657 -0.9845 C 0.1365 -0.9781 0.0118 -0.9439 -0.0899 -0.8907 C -0.1825 -0.8429 -0.228 -0.769 -0.2305 -0.6681 C -0.233 -0.5751 -0.199 -0.4947 -0.1289 -0.4336 C -0.0463 -0.3593 0.0469 -0.353 0.1445 -0.4141 C 0.2816 -0.4878 0.3807 -0.4823 0.4297 -0.4376 C 0.4429 -0.4234 0.4522 -0.4038 0.4571 -0.3829 C 0.4796 -0.2899 0.4024 -0.1941 0.2422 -0.1914 C 0.0495 -0.1888 0.0487 0.1435 0.2539 0.1992 C 0.3871 0.247 0.4582 0.3031 0.4688 0.3555 C 0.4695 0.3624 0.4702 0.3759 0.4688 0.3829 C 0.466 0.3923 0.4598 0.4045 0.4532 0.4141 C 0.4131 0.4805 0.297 0.4913 0.1367 0.4063 C -0.1462 0.2257 -0.404 0.6842 -0.1211 0.8595 C 0.0216 0.9525 0.1789 0.9925 0.3516 0.9845 C 0.4968 0.9792 0.6243 0.9365 0.7345 0.8595 C 0.8446 0.7798 0.9185 0.6857 0.9611 0.5821 C 1.0036 0.4785 1.0025 0.3669 0.965 0.25 C 0.9274 0.1332 0.8479 0.0392 0.7227 -0.0352 C 0.8629 -0.1255 0.9424 -0.2357 0.965 -0.3711 C 0.99 -0.5066 0.9588 -0.6307 0.8712 -0.7423 C 0.7836 -0.8565 0.6628 -0.9304 0.5001 -0.965 C 0.425 -0.9809 0.3432 -0.9884 0.2657 -0.9845 z M -0.7696 -0.6055 C -0.8954 -0.5919 -0.9962 -0.4769 -0.9962 -0.3399 C -0.9962 -0.1911 -0.8839 -0.0742 -0.7462 -0.0742 L -0.7423 -0.0742 C -0.6046 -0.0742 -0.4922 -0.1911 -0.4922 -0.3399 C -0.4922 -0.486 -0.6046 -0.6055 -0.7423 -0.6055 L -0.7462 -0.6055 C -0.7548 -0.6055 -0.7612 -0.6065 -0.7696 -0.6055 z M -0.7696 0.1094 C -0.8954 0.1231 -0.9962 0.2381 -0.9962 0.375 C -0.9962 0.5238 -0.8839 0.6407 -0.7462 0.6407 L -0.7423 0.6407 C -0.6046 0.6407 -0.4922 0.5238 -0.4922 0.375 C -0.4922 0.2289 -0.6046 0.1094 -0.7423 0.1094 L -0.7462 0.1094 C -0.7548 0.1094 -0.7612 0.1085 -0.7696 0.1094 z",
    GUNS: [
        {
            POSITION: [18, 10, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.bullet, g.op]),
                TYPE: "bullet"
            }
        }
    ],
    /*
    UPGRADES_TIER_0: [
        "menu_tanks",
        "menu_bosses",
        "spectator",
        "menu_addons",
        "menu_testing",
        "eggGen",
    ]
    */
}

// Spectator
Class.spectator = {
    PARENT: "genericTank",
    LABEL: "Spectator",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Left click to teleport, Right click above or below the screen to change FOV",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        
        REGEN: 1e100,
    },
    GUNS: [{
        POSITION: [0,0,0,0,0,0,0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, {reload: 0.2}, g.fake]),
            TYPE: "bullet",
            ALPHA: 0
        }
    }, {
        POSITION: [0, 0, 0, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.bullet, { reload: 0.25 }, g.fake]),
            TYPE: "bullet",
            ALPHA: 0,
            ALT_FIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    }, {
        event: "altFire",
        handler: ({ body }) => body.FOV = body.y + body.control.target.y < body.y ? body.FOV + 0.5 : Math.max(body.FOV - 0.5, 0.2)
    }]
}

// Guillotine + Ban Hammer
Class.guillotine = {
    PARENT: "spectator",
    LABEL: "Guillotine",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to kill the selected entity.",
    GUNS: [ {
        POSITION: [5, 13, 1, 8.5, 2, -15, 0], }, {
        POSITION: [8, 10, 1, 30, 0, 0, 0], }, {
        POSITION: [40, 2, 1, 0, 7, 0, 0], }, {
        POSITION: [40, 2, 1, 0, -7, 0, 0], }, 
    ],
    TURRETS: [
        {
            POSITION: [2, 34, 0, 0, 0, 1],
            TYPE: "genericEntity"
        }
    ],
    ON: [
        {
            event: "mousedown",
            handler: ({ body, button }) => {
                if (body == null) return;
                switch (button) {
                    case "left":
                        let target = {
                            x: body.x + body.control.target.x,
                            y: body.y + body.control.target.y
                        };
                        let selected = null;
                        for (let entity of entities) {
                            if (((entity.x - target.x) ** 2 + (entity.y - target.y) ** 2) < entity.size ** 2) {
                                selected = entity;
                                break;
                            }
                        }
                        if (selected) {
                            body.store.guillotineSelection = selected;
                            body.socket.talk("m", `Selected ${selected.name ? `${selected.name}'s` : "an unnamed"} ${selected.label} (ID #${selected.id}). Score: ${Math.floor(selected.skill.score)}; Build: ${selected.skill.raw.join("/")};`);
                        } else {
                            delete body.store.guillotineSelection;
                            body.socket.talk("m", "Cleared selection.");
                        }
                        break;
                    case "right":
                        body.x += body.control.target.x;
                        body.y += body.control.target.y;
                        break;
                }
            }
        },
        {
            event: "action",
            handler: ({ body }) => {
                if (body == null) return;
                    if (body.store.guillotineSelection && !body.store.guillotineSelection.isDead()) {
                    body.store.guillotineSelection.kill();
                    body.socket.talk("m", "Killed selection!");
                } else body.socket.talk("m", "Nothing was selected!");
            }
        }
    ]
}
Class.banHammer = {
    PARENT: "spectator",
    LABEL: "Ban Hammer",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
    ]
}