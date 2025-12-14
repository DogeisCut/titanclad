let compressMovementOffsets = [
        { x: 1, y: 0},
        { x: 1, y: 1},
        { x: 0, y: 1},
        { x:-1, y: 1},
        { x:-1, y: 0},
        { x:-1, y:-1},
        { x: 0, y:-1},
        { x: 1, y:-1}
    ],
    compressMovement = (current, goal) => {
        let offset = compressMovementOffsets[Math.round(( Math.atan2(current.y - goal.y, current.x - goal.x) / (Math.PI * 2) ) * 8 + 4) % 8];
        return {
            x: current.x + offset.x,
            y: current.y + offset.y
        }
    },
    CLLonSegment = (p0, p1, q0, q1, r0, r1) => {
        return q0 <= Math.max(p0, r0) && q0 >= Math.min(p0, r0) && q1 <= Math.max(p1, r1) && q1 >= Math.min(p1, r1);
    },
    CLLorientation = (p0, p1, q0, q1, r0, r1) => {
        let v = (q1 - p1) * (r0 - q0) - (q0 - p0) * (r1 - q1);
        return !v ? 0 : v > 0 ? 1 : 2; // clock or counterclock wise
    },
    collisionLineLine = (p10, p11, q10, q11, p20, p21, q20, q21) => {
        // Find the four orientations needed for general and special cases
        let o1 = CLLorientation(p10, p11, q10, q11, p20, p21),
            o2 = CLLorientation(p10, p11, q10, q11, q20, q21),
            o3 = CLLorientation(p20, p21, q20, q21, p10, p11),
            o4 = CLLorientation(p20, p21, q20, q21, q10, q11);

        return (
            (o1 == 0 && CLLonSegment(p10, p11, p20, p21, q10, q11)) ||
            (o2 == 0 && CLLonSegment(p10, p11, q20, q21, q10, q11)) ||
            (o3 == 0 && CLLonSegment(p20, p21, p10, p11, q20, q21)) ||
            (o4 == 0 && CLLonSegment(p20, p21, q10, q11, q20, q21)) ||
            (o1 != o2 && o3 != o4)
        );
    },
    // me: { ...Vector }
    // enemy: data to calculte where it is gonna be soon
    // walls: Array<{ ...Vector, hitboxRadius, hitbox: Array<[Vector, Vector]> }>
    wouldHitWall = (me, enemy, directWallCheck = false) => {
        if (directWallCheck) {
            if (!me.justHittedAWallTimeout) me.justHittedAWallTimeout = "ready";
            if (me.justHittedAWall && me.justHittedAWallTimeout === "ready") {
                me.justHittedAWall = false;
                me.justHittedAWallTimeout = "null";
                setTimeout(() => {
                    me.justHittedAWallTimeout = "ready";
                    me.justHittedAWall = false;
                }, 300);
                return true;
            }
            return false;
        }
        // thing for culling off walls where theres no point of checking
        let inclusionCircle = {
            x: (me.x + enemy.x) / 2,
            y: (me.y + enemy.y) / 2,
            radius: util.getDistance(me, enemy) / 2
        };

        for (let i = 0; i < walls.length; i++) {
            let crate = walls[i];

            //avoid calculating collisions if it would just be a waste
            if (util.getDistanceSquared(inclusionCircle, crate) > (inclusionCircle.radius + crate.hitboxRadius) ** 2) continue;

            //if the crate intersects with the line, add them to the list of walls that have been hit
            //works by checking if the line from the gun end to the enemy position collides with any line from the crate hitbox
            for (let j = 0; j < crate.hitbox.length; j++) {
                let hitboxLine = crate.hitbox[j];
                if (collisionLineLine(
                    me.x, me.y,
                    enemy.x, enemy.y,
                    crate.x + hitboxLine[0].x, crate.y + hitboxLine[0].y,
                    crate.x + hitboxLine[1].x, crate.y + hitboxLine[1].y
                )) return true;
            }
        }
        return false;
    };

// Define IOs (AI)
class IO {
    constructor(body) {
        this.body = body
        this.acceptsFromTop = true
    }
    think() {
        return {
            target: null,
            goal: null,
            fire: null,
            main: null,
            alt: null,
            power: null,
        }
    }
}
class io_bossRushAI extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.enabled = true;
        this.goalDefault = gameManager.room.center;
    }
    think(input) {
        let tile = global.gameManager.room.getAt(this.body);
        if (tile && tile.name == "stopAI") {
            this.enabled = false;
        }
        if (this.enabled) {
            return {
                goal: this.goalDefault
            }
        }
    }
}
class io_doNothing extends IO {
    constructor(body) {
        super(body)
        this.acceptsFromTop = false
    }
    think() {
        return {
            goal: {
                x: this.body.x,
                y: this.body.y,
            },
            main: false,
            alt: false,
            fire: false,
        }
    }
}
class io_moveInCircles extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.acceptsFromTop = false
        this.timer = ran.irandom(5) + 3
        this.pathAngle = ran.random(2 * Math.PI);
        this.goal = {
            x: this.body.x + 10 * Math.cos(this.pathAngle),
            y: this.body.y + 10 * Math.sin(this.pathAngle)
        }
    }
    think() {
        if (!this.timer--) {
            this.timer = 5
            this.goal = {
                x: this.body.x + 10 * Math.cos(this.pathAngle),
                y: this.body.y + 10 * Math.sin(this.pathAngle)
            }
            // turnWithSpeed turn speed (but condensed over 5 ticks)
            this.pathAngle -= ((this.body.velocity.length / 90) * Math.PI) / global.gameManager.runSpeed * 5;
        }
        return {
            goal: this.goal,
            power: this.body.ACCELERATION > 0.1 ? 0.2 : 1
        }
    }
}
class io_listenToPlayer extends IO {
    constructor(b, opts = { static: false }) {
        super(b);
        if ("object" != typeof opts.player) throw new Error('Required IO Option "player" is not an object');
        this.player = opts.player;
        this.static = opts.static;
        this.acceptsFromTop = false;
    }
    // THE PLAYER MUST HAVE A VALID COMMAND AND TARGET OBJECT
    think() {
        let fire = this.player.command.autofire || this.player.command.lmb,
            alt = this.player.command.autoalt || this.player.command.rmb,
            target = {
                x: this.player.target.x,
                y: this.player.target.y,
            };
        if (this.body.reverseTargetWithTank) {
            target.x *= this.body.reverseTank;
            target.y *= this.body.reverseTank;
        }
        this.body.facingLocked = this.player.command.spinlock;
        if (this.player.command.autospin && !this.player.body.settings.braindamagemode) {
            let kk = Math.atan2(this.body.control.target.y, this.body.control.target.x) + 0.04;
            if (this.body.autospinBoost) {
                let thing = 0.05 * 1 * this.body.autospinBoost;
                if (this.player.command.lmb) thing = thing * 1.5;
                if (this.player.command.rmb) thing = thing * -1;
                kk += thing;
            }
            target = {
                x: 100 * Math.cos(kk),
                y: 100 * Math.sin(kk),
            };
        }
        if (this.body.invuln) {
            if (this.player.command.right || this.player.command.left || this.player.command.up || this.player.command.down || this.player.command.lmb) {
                this.body.invuln = false;
            }
        }
        this.body.autoOverride = this.player.command.override;
        return {
            target,
            fire,
            alt,
            goal: this.static ? null : {
                x: this.body.x + this.player.command.right - this.player.command.left,
                y: this.body.y + this.player.command.down - this.player.command.up,
            },
            main: fire || this.player.command.autospin
        };
    }
}
class io_mapTargetToGoal extends IO {
    constructor(b) {
        super(b)
    }
    think(input) {
        if (input.main || input.alt) {
            return {
                goal: {
                    x: input.target.x + this.body.x,
                    y: input.target.y + this.body.y,
                },
                power: 1,
            }
        }
    }
}
class io_boomerang extends IO {
    constructor(b) {
        super(b)
        this.r = 0
        this.b = b
        this.m = b.master
        this.turnover = false
        let len = 10 * util.getDistance({
            x: 0,
            y: 0
        }, b.master.control.target)
        this.myGoal = {
            x: 3 * b.master.control.target.x + b.master.x,
            y: 3 * b.master.control.target.y + b.master.y,
        }
    }
    think(input) {
        if (this.b.range > this.r) this.r = this.b.range
        let t = 1; //1 - Math.sin(2 * Math.PI * this.b.range / this.r) || 1
        if (!this.turnover) {
            if (this.r && this.b.range < this.r * 0.5) {
                this.turnover = true;
            }
            return {
                goal: this.myGoal,
                power: t,
            }
        } else {
            return {
                goal: {
                    x: this.m.x,
                    y: this.m.y,
                },
                power: t,
            }
        }
    }
}
class io_goToMasterTarget extends IO {
    constructor(body) {
        super(body)

        const master = body.master

        // Start with the raw mouse/input offset
        let offsetX = master.control.target.x
        let offsetY = master.control.target.y

        // Match how facing/turrets handle reverse:
        // reverse = 1 if reverseTargetWithTank is true,
        // otherwise use reverseTank (usually 1 or -1)
        const reverseTank = master.reverseTank != null ? master.reverseTank : 1
        const reverseTargetWithTank = !!master.reverseTargetWithTank
        const reverse = reverseTargetWithTank ? 1 : reverseTank

        // If reverseTank is -1 (and reverseTargetWithTank is false),
        // this flips the offset across the tank
        offsetX *= reverse
        offsetY *= reverse

        this.myGoal = {
            x: master.x + offsetX,
            y: master.y + offsetY,
        }
        this.countdown = 5;
    }
    think() {
        if (this.countdown) {
            if (util.getDistance(this.body, this.myGoal) < 5) {
                this.countdown--;
            }
            return {
                goal: {
                    x: this.myGoal.x,
                    y: this.myGoal.y,
                },
            }
        }
    }
}
class io_canRepel extends IO {
    constructor(b) {
        super(b)
    }
    think(input) {
        if (input.alt && input.target) {
            let x = this.body.master.master.x - this.body.x
            let y = this.body.master.master.y - this.body.y
            // if (x * x + y * y < 2250000) // (50 * 30) ^ 2
            return {
                target: {
                    x: -input.target.x,
                    y: -input.target.y,
                },
                main: true,
            }
        }
    }
}
class io_alwaysFire extends IO {
    constructor(body) {
        super(body)
    }
    think() {
        return {
            fire: true,
        }
    }
}
class io_targetSelf extends IO {
    constructor(body) {
        super(body)
    }
    think() {
        return {
            main: true,
            target: {
                x: 0,
                y: 0,
            },
        }
    }
}
class io_mapAltToFire extends IO {
    constructor(body) {
        super(body)
    }
    think(input) {
        if (input.alt) {
            return {
                fire: true,
            }
        }
    }
}
class io_mapFireToAlt extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.onlyIfHasAltFireGun = opts.onlyIfHasAltFireGun;
    }
    think(input) {
        if (input.fire) for (let i = 0; i < this.body.guns.length; i++) if (!this.onlyIfHasAltFireGun || this.body.guns[i].altFire) return { alt: true }
    }
}
class io_onlyAcceptInArc extends IO {
    constructor(body) {
        super(body)
    }
    think(input) {
        if (input.target && this.body.firingArc != null) {
            if (Math.abs(util.angleDifference(Math.atan2(input.target.y, input.target.x), this.body.firingArc[0])) >= this.body.firingArc[1]) {
                return {
                    fire: false,
                    alt: false,
                    main: false
                }
            }
        }
    }
}
class io_stackGuns extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.timeUntilFire = opts.timeUntilFire || 0;
    }
    think ({ target }) {

        //why even bother?
        if (!target) {
            return;
        }

        //find gun that is about to shoot
        let lowestReadiness = Infinity,
            readiestGun;
        for (let i = 0; i < this.body.guns.length; i++) {
            let gun = this.body.guns[i];
            if (!gun.canShoot || !gun.stack) continue;
            let reloadStat = (gun.calculator == "necro" || gun.calculator == "fixed reload") ? 1 : (gun.bulletStats === "master" ? this.body.skill : gun.bulletStats).rld,
                readiness = (1 - gun.cycle) / (gun.settings.reload * reloadStat);
            if (lowestReadiness > readiness) {
                lowestReadiness = readiness;
                readiestGun = gun;
            }
        }

        //if we aren't ready, don't spin yet
        if (!readiestGun || (this.timeUntilFire && this.timeUntilFire > lowestReadiness)) {
            return;
        }

        //rotate the target vector based on the gun
        let targetAngle = Math.atan2(target.y, target.x) - readiestGun.angle,
            targetLength = Math.sqrt(target.x ** 2 + target.y ** 2);
        return {
            target: {
                x: targetLength * Math.cos(targetAngle),
                y: targetLength * Math.sin(targetAngle)
            }
        };
    }
}
class io_nearestDifferentMaster extends IO {
    static validEntityTypes = new Set(["tank", "miniboss", "crasher"]);
    constructor(body, opts = {}) {
        super(body);
        this.targetLock = undefined;
        this.tick = ran.irandom(30);
        this.lead = 0;
        this.timeout = opts.timeout || 90;
        this.lockThroughWalls = opts.lockThroughWalls;
        this.mapGoal = opts.mapGoal;
        this.validTargets = [];
    }
    validate(e, m, mm, sqrRange, sqrRangeMaster) {
        const myMaster = this.body.master.master;
        const aiSettings = this.body.aiSettings;
        const theirMaster = e.master.master;
        if (e.health.amount <= 0) return false;
        if (theirMaster.team === myMaster.team || theirMaster.team === TEAM_ROOM) return false;
        if (theirMaster.ignoredByAi) return false;
        if (e.bond) return false;
        if (e.invuln || e.godmode || theirMaster.godmode || theirMaster.passive || myMaster.passive) return false;
        if (isNaN(e.dangerValue)) return false;
        if (!(aiSettings.seeInvisible || this.body.isArenaCloser || e.alpha > 0.5)) return false;
        if (!io_nearestDifferentMaster.validEntityTypes.has(e.type)) {
            if ((aiSettings.IGNORE_SHAPES || myMaster.aiSettings.IGNORE_SHAPES) && e.type === "food") return false;
        }
        if (!aiSettings.BLIND) {
            if ((e.x - m.x) * (e.x - m.x) >= sqrRange) return false;
            if ((e.y - m.y) * (e.y - m.y) >= sqrRange) return false;
        }
        if (!aiSettings.SKYNET) {
            if ((e.x - mm.x) * (e.x - mm.x) >= sqrRangeMaster) return false;
            if ((e.y - mm.y) * (e.y - mm.y) >= sqrRangeMaster) return false;
        }
        return true;
    }
    wouldHitWall(entity) {
        if (!this.lockThroughWalls) return wouldHitWall(this.body, entity);
        else return false;
    }
    buildList(range) {
        const sqrRange = range * range;
        const sqrRangeMaster = sqrRange * 4 / 3;
        const validCandidates = [];
        for (const e of targetableEntities.values()) {
            if (this.validate(e, this.body, this.body.master.master, sqrRange, sqrRangeMaster) && !this.wouldHitWall(e)) {
                if (this.body.aiSettings.view360 || Math.abs(util.angleDifference(util.getDirection(this.body, e), this.body.firingArc[0])) < this.body.firingArc[1]) {
                    validCandidates.push(e);
                }
            }
        }
        if (!validCandidates.length) {
            this.targetLock = undefined;
            return [];
        }
        let mostDangerous = 0;
        for (const e of validCandidates) {
            mostDangerous = Math.max(e.dangerValue, mostDangerous);
        }
        let keepTarget = false;
        const finalTargets = validCandidates.filter((e) => {
            // Even more expensive
            return !this.wouldHitWall(e);
        }).filter(e => {
            if (this.body.aiSettings.farm || e.dangerValue === mostDangerous) {
                if (this.targetLock && e.id === this.targetLock.id) {
                    keepTarget = true;
                }
                return true;
            }
            return false;
        });
        // Reset target if it's not in there
        if (!keepTarget) {
            this.targetLock = undefined;
        }
        return finalTargets;
    }
    think(input) {
        if (input.main || input.alt || this.body.master.autoOverride) {
            this.targetLock = undefined;
            return {};
        }
        let tracking = this.body.topSpeed,
            range = this.body.fov;
        // Use whether we have functional guns to decide
        for (let i = 0; i < this.body.guns.length; i++) {
            if (this.body.guns[i].canShoot && !this.body.aiSettings.SKYNET) {
                let v = this.body.guns[i].getTracking();
                if (v.speed == 0 || v.range == 0) continue;
                tracking = v.speed;
                range = Math.min(range, (v.speed || 1.5) * (v.range < (this.body.size * 2) ? this.body.fov : v.range));
                break;
            }
        }
        if (!Number.isFinite(tracking)) {
            tracking = this.body.topSpeed + .01;
        }
        if (!Number.isFinite(range)) {
            range = 640 * this.body.FOV;
        }
        // Lets see if the entity still lives
        if (this.targetLock && (
            !this.validate(this.targetLock, this.body, this.body.master.master, range * range, range * range * 4 / 3) ||
            this.wouldHitWall(this.body, this.targetLock) // Very expensive
        )) {
            this.targetLock = undefined;
            this.tick = 100;
        }
        // OK, now let's try reprocessing the targets!
        this.tick++;
        if (this.tick > 2) {
            this.tick = 0;
            this.validTargets = this.buildList(range);
            if (this.targetLock && this.validTargets.indexOf(this.targetLock) === -1) {
                this.targetLock = undefined;
            }
            if (this.targetLock == null && this.validTargets.length) {
                this.targetLock = (this.validTargets.length === 1) ? this.validTargets[0] : nearest(this.validTargets, {
                    x: this.body.x,
                    y: this.body.y
                });
                this.tick = -5;
            }
        }
        if (this.targetLock != null) {
            let radial = this.targetLock.velocity,
                diff = {
                    x: this.targetLock.x - this.body.x,
                    y: this.targetLock.y - this.body.y,
                };
            if (this.tick % 2 === 0) {
                this.lead = 0;
                if (!this.body.aiSettings.CHASE) {
                    let toi = timeOfImpact(diff, radial, tracking);
                    this.lead = toi;
                }
            }
            if (!Number.isFinite(this.lead)) {
                this.lead = 0;
            }
            return {
                target: {
                    x: diff.x + this.lead * radial.x,
                    y: diff.y + this.lead * radial.y,
                },
                goal: this.mapGoal ? {
                    x: this.targetLock.x,
                    y: this.targetLock.y,
                } : undefined,
                fire: true,
                main: true
            };
        }
        return {};
    }
}
class io_healTeamMasters extends IO {
    constructor(body) {
        super(body);
        this.targetLock = undefined;
        this.tick = ran.irandom(30);
        this.lead = 0;
        this.validTargets = [];
    }
    validate(e) {
        const myMaster = this.body.master.master;
        const theirMaster = e.master.master;
        let fear = e.fear ?? 0.7;
        if (e.health.amount <= 0) return false;
        if (theirMaster.team !== myMaster.team) return false;
        if (theirMaster.ignoredByAi) return false;
        if (e.bond) return false;
        if (e.type !== "tank") return false;
        if (e.isDominator) return false;
        if (e.health.amount > e.health.max * fear) return false;
        if (e.invuln || e.godmode || theirMaster.godmode || theirMaster.passive || myMaster.passive) return false;
        if (isNaN(e.dangerValue)) return false;
        return true;
    }
    wouldHitWall(entity) {
        if (!this.lockThroughWalls) return wouldHitWall(this.body, entity);
        else return false;
    }
    buildList(range) {
        const sqrRange = range * range;
        const sqrRangeMaster = sqrRange * 4 / 3;
        const validCandidates = [];
        for (const e of targetableEntities.values()) {
            if (this.validate(e, this.body, this.body.master.master, sqrRange, sqrRangeMaster) && !this.wouldHitWall(e)) {
                if (this.body.aiSettings.view360 || Math.abs(util.angleDifference(util.getDirection(this.body, e), this.body.firingArc[0])) < this.body.firingArc[1]) {
                    validCandidates.push(e);
                }
            }
        }
        if (!validCandidates.length) {
            this.targetLock = undefined;
            return [];
        }
        let mostDangerous = 0;
        for (const e of validCandidates) {
            mostDangerous = Math.max(e.dangerValue, mostDangerous);
        }
        let keepTarget = false;
        const finalTargets = validCandidates.filter((e) => {
            // Even more expensive
            return !this.wouldHitWall(e);
        }).filter(e => {
            if (this.body.aiSettings.farm || e.dangerValue === mostDangerous) {
                if (this.targetLock && e.id === this.targetLock.id) {
                    keepTarget = true;
                }
                return true;
            }
            return false;
        });
        // Reset target if it's not in there
        if (!keepTarget) {
            this.targetLock = undefined;
        }
        return finalTargets;
    }
    think(input) {
        if (input.main || input.alt || this.body.master.autoOverride) {
            this.targetLock = undefined;
            return {};
        }
        let tracking = this.body.topSpeed,
            range = this.body.fov;
        // Use whether we have functional guns to decide
        for (let i = 0; i < this.body.guns.length; i++) {
            if (this.body.guns[i].canShoot && !this.body.aiSettings.SKYNET) {
                let v = this.body.guns[i].getTracking();
                if (v.speed == 0 || v.range == 0) continue;
                tracking = v.speed;
                range = Math.min(range, (v.speed || 1.5) * (v.range < (this.body.size * 2) ? this.body.fov : v.range));
                break;
            }
        }
        if (!Number.isFinite(tracking)) {
            tracking = this.body.topSpeed + .01;
        }
        if (!Number.isFinite(range)) {
            range = 340 * this.body.FOV;
        }
        // Lets see if the entity still lives
        if (this.targetLock && (
            !this.validate(this.targetLock, this.body, this.body.master.master, range * range, range * range * 4 / 3) ||
            this.wouldHitWall(this.body, this.targetLock) // Very expensive
        )) {
            this.targetLock = undefined;
            this.tick = 100;
        }
        // OK, now let's try reprocessing the targets!
        this.tick++;
        if (this.tick > 2) {
            this.tick = 0;
            this.validTargets = this.buildList(range);
            if (this.targetLock && this.validTargets.indexOf(this.targetLock) === -1) {
                this.targetLock = undefined;
            }
            if (this.targetLock == null && this.validTargets.length) {
                this.targetLock = (this.validTargets.length === 1) ? this.validTargets[0] : nearest(this.validTargets, {
                    x: this.body.x,
                    y: this.body.y
                });
                this.tick = -5;
            }
        }
        if (this.targetLock != null) {
            let radial = this.targetLock.velocity,
                diff = {
                    x: this.targetLock.x - this.body.x,
                    y: this.targetLock.y - this.body.y,
                };
            if (this.tick % 2 === 0) {
                this.lead = 0;
            }
            if (!Number.isFinite(this.lead)) {
                this.lead = 0;
            }
            return {
                target: {
                    x: diff.x + this.lead * radial.x,
                    y: diff.y + this.lead * radial.y,
                },
                goal: undefined,
                fire: true,
                main: true
            };
        }
        return {};
    }
}
class io_avoid extends IO {
    constructor(body) {
        super(body)
    }
    think(input) {
        let masterId = this.body.master.id
        let range = this.body.size * this.body.size * 100
        this.avoid = nearest(entities, {
            x: this.body.x,
            y: this.body.y
        }, function (test, sqrdst) {
            return (test.master.id !== masterId && (test.type === 'bullet' || test.type === 'drone' || test.type === 'swarm' || test.type === 'trap' || test.type === 'block') && sqrdst < range);
        })
        // Aim at that target
        if (this.avoid != null) {
            // Consider how fast it's moving.
            let delt = new Vector(this.body.velocity.x - this.avoid.velocity.x, this.body.velocity.y - this.avoid.velocity.y)
            let diff = new Vector(this.avoid.x - this.body.x, this.avoid.y - this.body.y);
            let comp = (delt.x * diff.x + delt.y * diff.y) / delt.length / diff.length
            let goal = {}
            if (comp > 0) {
                if (input.goal) {
                    let goalDist = Math.sqrt(range / (input.goal.x * input.goal.x + input.goal.y * input.goal.y))
                    goal = {
                        x: input.goal.x * goalDist - diff.x * comp,
                        y: input.goal.y * goalDist - diff.y * comp,
                    }
                } else {
                    goal = {
                        x: -diff.x * comp,
                        y: -diff.y * comp,
                    }
                }
                return goal
            }
        }
    }
}
class io_minion extends IO {
    constructor(body, opts = {}) {
        super(body)
        this.turnwise = 1
        this.opts = opts;
    }
    think(input) {
        if (this.body.aiSettings.reverseDirection && ran.chance(0.005)) {
            this.turnwise = -1 * this.turnwise;
        }
        if (input.target != null && (input.alt || input.main)) {
            let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE)
            let leash = 82 * sizeFactor
            let orbit = this.opts.turnwiserange ?? 140 * sizeFactor
            let repel = 142 * sizeFactor
            let goal
            let power = 1
            let target = new Vector(input.target.x, input.target.y)
            if (input.alt) {
                // Leash
                if (target.length < leash) {
                    goal = {
                        x: this.body.x + target.x,
                        y: this.body.y + target.y,
                    }
                    // Spiral repel
                } else if (target.length < repel) {
                    let dir = -this.turnwise * target.direction + Math.PI / 5
                    goal = {
                        x: this.body.x + Math.cos(dir),
                        y: this.body.y + Math.sin(dir),
                    }
                    // Free repel
                } else {
                    goal = {
                        x: this.body.x - target.x,
                        y: this.body.y - target.y,
                    }
                }
            } else if (input.main) {
                // Orbit point
                let dir = this.turnwise * target.direction + 0.01
                goal = {
                    x: this.body.x + target.x - orbit * Math.cos(dir),
                    y: this.body.y + target.y - orbit * Math.sin(dir),
                }
                if (Math.abs(target.length - orbit) < this.body.size * 2) {
                    power = 0.7
                }
            }
            return {
                goal: goal,
                power: power,
            }
        }
    }
}
class io_hangOutNearMaster extends IO {
    constructor(body) {
        super(body)
        this.acceptsFromTop = false
        this.orbit = 30
        this.currentGoal = {
            x: this.body.source.x,
            y: this.body.source.y,
        }
        this.timer = 0
    }
    think(input) {
        if (this.body.invisible[1]) return {}
        if (this.body.source !== this.body) {
            let bound1 = this.orbit * 0.8 + this.body.source.size + this.body.size
            let bound2 = this.orbit * 1.5 + this.body.source.size + this.body.size
            let dist = util.getDistance(this.body, this.body.source) + Math.PI / 8;
            let output = {
                target: {
                    x: this.body.velocity.x,
                    y: this.body.velocity.y,
                },
                goal: this.currentGoal,
                power: undefined,
            };
            // Set a goal
            if (dist > bound2 || this.timer > 30) {
                this.timer = 0
                let dir = util.getDirection(this.body, this.body.source) + Math.PI * ran.random(0.5);
                let len = ran.randomRange(bound1, bound2)
                let x = this.body.source.x - len * Math.cos(dir)
                let y = this.body.source.y - len * Math.sin(dir)
                this.currentGoal = { x: x, y: y };
            }
            if (dist < bound2) {
                output.power = 0.15
                if (ran.chance(0.3)) {
                    this.timer++;
                }
            }
            return output
        }
    }
}
class io_spin extends IO {
    constructor(b, opts = {}) {
        super(b)
        this.a = opts.startAngle || 0;
        this.speed = opts.speed ?? 0.04;
        this.onlyWhenIdle = opts.onlyWhenIdle;
        this.independent = opts.independent;
    }
    think(input) {
        if (this.onlyWhenIdle && input.target) {
            this.a = Math.atan2(input.target.y, input.target.x);
            return input;
        }
        this.a += this.speed;
        let offset = (this.independent && this.body.bond != null) ? this.body.bound.angle : 0;
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset),
            },
            main: true,
        };
    }
}
class io_spin2 extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.speed = opts.speed ?? 0.04;
        this.reverseOnAlt = opts.reverseOnAlt ?? true;
        this.lastAlt = -1;
        this.reverseOnTheFly = opts.reverseOnTheFly ?? false;

        // On spawn logic
        let alt = this.body.master.control.alt;
        let reverse = (this.reverseOnAlt && alt) ? -1 : 1;
        this.body.facingType = "spin";
        this.body.facingTypeArgs = {speed: this.speed * reverse};
    }
    think(input) {
        if (!this.reverseOnTheFly || !this.reverseOnAlt) return;

        // Live logic
        let alt = this.body.master.control.alt;
        if (this.lastAlt != alt) {
            let reverse = alt ? -1 : 1;
            this.body.facingType = "spin";
            this.body.facingTypeArgs = {speed: this.speed * reverse};
            this.lastAlt = alt;
        }
    }
}
class io_fleeAtLowHealth extends IO {
    constructor(b) {
        super(b)
        this.fear = util.clamp(ran.gauss(0.7, 0.15), 0.1, 0.9);
        b.fear = this.fear;
    }
    think(input) {
        if (input.fire && input.target != null && this.body.health.amount < this.body.health.max * this.fear) {
            return {
                goal: {
                    x: this.body.x - input.target.x,
                    y: this.body.y - input.target.y,
                },
            }
        }
    }
}

class io_zoom extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.distance = opts.distance || 225;
        this.dynamic = opts.dynamic;
        this.permanent = opts.permanent;
    }

    think(input) {
        if (this.permanent || (input.alt && input.target)) {
            if (this.dynamic || this.body.cameraOverrideX === null) {
                let direction = Math.atan2(input.target.y, input.target.x);
                this.body.cameraOverrideX = this.body.x + this.distance * Math.cos(direction);
                this.body.cameraOverrideY = this.body.y + this.distance * Math.sin(direction);
            }
        } else {
            this.body.cameraOverrideX = null;
            this.body.cameraOverrideY = null;
        }
    }
}
class io_wanderAroundMap extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.lookAtGoal = opts.lookAtGoal;
        this.immitatePlayerMovement = opts.immitatePlayerMovement;
        this.spot = ran.choose(global.gameManager.room.spawnableDefault).randomInside();

        this.bossWander = opts.diepBossWander;
        this.howFarAwayFromEdgeOfMap = 15;
        this.tick = 0;
        this.currentGoal = {x:0,y:0};
        this.i = 0;
        this.enabled = true;
        this.botMoveEnabled = true;
    }
    think(input) {
        if (Config.BOT_MOVE && this.botMoveEnabled) {
            this.enabled = false;
            for (let e of Config.BOT_MOVE) {
                if ((e.TEAM === "any" || this.body.team == e.TEAM) && e.MOVEMENT && !input.fire) {
                    if (!this.moveArray) this.botMove_active = true, this.moveArray = 0, this.arrayLength = e.MOVEMENT.length - 1; // Set flags
                    let i = e.MOVEMENT[this.moveArray];
                    let [locX, locY] = i;
                    if (new Vector( this.body.x - locX * 30, this.body.y - locY * 30 ).isShorterThan(e.RANGE ?? 50)) {
                        if (this.moveArray == this.arrayLength) this.botMoveEnabled = false, this.enabled = true;
                        this.moveArray++;
                    }
                    if (input.goal == null && !this.body.autoOverride) {
                        let loc = compressMovement(this.body, { x: locX * 30, y: locY * 30 });
                        return {
                            target: (this.lookAtGoal && input.target == null) ? {
                                x: locX * 30 - this.body.x,
                                y: locY * 30 - this.body.y
                            } : null,
                            goal: loc,
                        };
                    }
                }
            }
            if (!this.botMove_active) this.botMoveEnabled = false, this.enabled = true;
        }
        if (this.enabled) {
            if (this.bossWander) {
                let points = [{
                    x: global.gameManager.room.width / this.howFarAwayFromEdgeOfMap, // top left
                    y: global.gameManager.room.height / this.howFarAwayFromEdgeOfMap
                }, {
                    x: global.gameManager.room.width - (global.gameManager.room.width / this.howFarAwayFromEdgeOfMap), // top right
                    y: global.gameManager.room.height / this.howFarAwayFromEdgeOfMap
                }, {
                    x: global.gameManager.room.width - (global.gameManager.room.width / this.howFarAwayFromEdgeOfMap), // bottom right
                    y: global.gameManager.room.height - (global.gameManager.room.height / this.howFarAwayFromEdgeOfMap)
                }, {
                    x: global.gameManager.room.width / this.howFarAwayFromEdgeOfMap, // bottom left
                    y: global.gameManager.room.height - (global.gameManager.room.height / this.howFarAwayFromEdgeOfMap)
                }]
                this.tick++
                this.currentGoal = points[this.i]
                let distanceFromPoint = util.getDistance(this.body, this.currentGoal)
                if (this.tick >= 100 + distanceFromPoint + (this.body.SPEED < 5 ? 1000 : 0)) {
                    this.tick = 0
                    if (this.i >= points.length - 1) {
                        this.i = 0
                    } else {
                        this.i++
                    }
                    this.currentGoal = points[this.i]
                }
                return {
                    goal: {
                        x: this.currentGoal.x,
                        y: this.currentGoal.y
                    },
                    target: this.lookAtGoal ? {
                        x: this.currentGoal.x,
                        y: this.currentGoal.y
                    } : null
                }
            }
            if (new Vector( this.body.x - this.spot.x, this.body.y - this.spot.y ).isShorterThan(50) || wouldHitWall(this.body, this.spot, true)) {
                this.spot = ran.choose(global.gameManager.room.spawnableDefault).randomInside();
            }
            if (input.goal == null && !this.body.autoOverride) {
                let goal = this.spot;
                if (this.immitatePlayerMovement) {
                    goal = compressMovement(this.body, goal);
                }
                return {
                    target: (this.lookAtGoal && input.target == null) ? {
                        x: this.spot.x - this.body.x,
                        y: this.spot.y - this.body.y
                    } : null,
                    goal
                };
            }
        }
    }
}
// returns deviation from origin angle in radians
let io_formulaTarget_sineDefault = (frame, body) => Math.sin(frame / 30);
class io_formulaTarget extends IO {
    constructor (b, opts = {}) {
        super(b);
        this.masterAngle = opts.masterAngle;
        this.formula = opts.formula || io_formulaTarget_sineDefault;
        //this.updateOriginAngle = opts.updateOriginAngle;
        this.originAngle = this.masterAngle ? b.master.facing : b.facing;
        this.frame = 0;
    }
    think () {
        // if (this.updateOriginAngle) {
        //     this.originAngle = this.masterAngle ? b.master.facing : getTheGunThatSpawnedMe("how do i do that????").angle;
        // }

        let angle = this.originAngle + this.formula(this.frame += 1 / global.gameManager.runSpeed, this.body);
        return {
            goal: {
                x: this.body.x + Math.sin(angle),
                y: this.body.y + Math.cos(angle)
            }
        };
    }
}
class io_whirlwind extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.body.useOwnMaster = opts.useOwnMaster;
        this.body.angle = 0;
        this.minDistance = opts.minDistance ?? 3.5;
        this.maxDistance = opts.maxDistance ?? 10;
        this.body.dist = opts.initialDist || this.minDistance * this.body.size;
        this.body.inverseDist = this.maxDistance * this.body.size - this.body.dist + this.minDistance * this.body.size;
        this.radiusScalingSpeed = opts.radiusScalingSpeed || 10;
    }
    
    think(input) {
        this.body.angle += (this.body.skill.spd * 2 + this.body.aiSettings.SPEED) * Math.PI / 180;
        let trueMaxDistance = this.maxDistance * this.body.size;
        let trueMinDistance = this.minDistance * this.body.size;
        if(input.fire){
            if(this.body.dist <= trueMaxDistance) {
                this.body.dist += this.radiusScalingSpeed;
                this.body.inverseDist -= this.radiusScalingSpeed;
            }
        }
        else if(input.alt){
            if(this.body.dist >= trueMinDistance) {
                this.body.dist -= this.radiusScalingSpeed;
                this.body.inverseDist += this.radiusScalingSpeed;
            }
        }
        this.body.dist = Math.min(trueMaxDistance, Math.max(trueMinDistance, this.body.dist));
        this.body.inverseDist = Math.min(trueMaxDistance, Math.max(trueMinDistance, this.body.inverseDist));
    }
}
class io_orbit extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.realDist = 0;
        this.invert = opts.invert ?? false;
    }
  
    think(input) {
        let invertFactor = this.invert ? -1 : 1,
            master = this.body.master.useOwnMaster ? this.body.master : this.body.master.master,
            dist = this.invert ? master.inverseDist : master.dist,
            angle = (this.body.angle * Math.PI / 180 + master.angle) * invertFactor;
        
        if(this.realDist > dist){
            this.realDist -= Math.min(10, Math.abs(this.realDist - dist));
        }
        else if(this.realDist < dist){
            this.realDist += Math.min(10, Math.abs(dist - this.realDist));
        }
        this.body.x = master.x + Math.cos(angle) * this.realDist;
        this.body.y = master.y + Math.sin(angle) * this.realDist;
        
        this.body.facing = angle;
    }
}
class io_snake extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.waveInvert = opts.invert ? -1 : 1;
        this.wavePeriod = opts.period ?? 5;
        this.waveAmplitude = opts.amplitude ?? 150;
        this.yOffset = opts.yOffset ?? 0;

        this.reverseWave = this.body.master.control.alt ? -1 : 1;
        this.velocityMagnitude = 0;
        this.body.damp = 0;
        this.waveAngle = this.body.master.facing + (opts.angle ?? 0);
        this.startX = this.body.x;
        this.startY = this.body.y;
        this.body.x += Math.cos(this.body.velocity.direction) * this.body.size * Config.bullet_spawn_offset + 0;
        this.body.y += Math.sin(this.body.velocity.direction) * this.body.size * Config.bullet_spawn_offset + 0;
        // Clamp scale to [45, 75]
        // Attempts to get the bullets to intersect with the cursor
        this.waveHorizontalScale = util.clamp(util.getDistance(this.body.master.master.control.target, {x: 0, y: 0}) / Math.PI, 45, 75);
    }
    think(input) {
        // Define a sin wave for the bullet to follow
        let waveX = this.waveHorizontalScale * (this.body.RANGE - this.body.range) / this.wavePeriod;
        let waveY = this.waveAmplitude * Math.sin(waveX / this.waveHorizontalScale) * this.waveInvert * this.reverseWave + this.yOffset;
        // Rotate the sin wave
        let trueWaveX = Math.cos(this.waveAngle) * waveX - Math.sin(this.waveAngle) * waveY;
        let trueWaveY = Math.sin(this.waveAngle) * waveX + Math.cos(this.waveAngle) * waveY;
        // Follow the sin wave
        this.body.x = util.lerp(this.body.x, this.startX + trueWaveX, this.velocityMagnitude);
        this.body.y = util.lerp(this.body.y, this.startY + trueWaveY, this.velocityMagnitude);
        // Accelerate after spawning
        this.velocityMagnitude = Math.min(0.1, this.velocityMagnitude + 0.01 / global.gameManager.runSpeed)
    }
}

class io_disableOnOverride extends IO {
    constructor(body) {
        super(body);
        this.pacify = false;
        this.lastPacify = false;
        this.savedDamage = 0;
    }

    think(input) {
        if (!this.initialAlpha) {
            this.initialAlpha = this.body.alpha;
            this.targetAlpha = this.initialAlpha;
        }
        
        this.pacify = (this.body.parent.master.autoOverride || this.body.parent.master.master.autoOverride);
        if (this.pacify && !this.lastPacify) {
            this.targetAlpha = 0;
            this.savedDamage = this.body.DAMAGE;
            this.body.DAMAGE = 0;
            this.body.refreshBodyAttributes();
        } else if (!this.pacify && this.lastPacify) {
            this.targetAlpha = this.initialAlpha;
            this.body.DAMAGE = this.savedDamage;
            this.body.refreshBodyAttributes();
        }
        this.lastPacify = this.pacify;

        if (this.body.alpha != this.targetAlpha) {
            this.body.alpha += util.clamp(this.targetAlpha - this.body.alpha, -0.05, 0.05);
            if (this.body.flattenedPhoto) this.body.flattenedPhoto.alpha = this.body.alpha;
        }
    }
}

class io_scaleWithMaster extends IO {
    constructor(body) {
        super(body);
        this.storedSize = 0;
    }
    think(input) {
        let masterSize = this.body.master.size;
        if (masterSize != this.storedSize) {
            this.storedSize = masterSize;
            this.body.SIZE = masterSize * this.body.size / this.body.master.size;
        }
    }
}
// ##################################################
// Everything below here is for advanced bot AI stuff
// ##################################################

/*
better bot AI suggestions:
- Bots sidestep unpredictably when firing at a player rather than orbiting. The distance they do this is calculated from their stats, body stats, and cannon stats.
- Bots get as close as they can when firing at polygons (anything without cannons), they will start sidestepping when near enemy attacks/bullets.
- Bots avoid bullets, drones, and traps. 
- Bots pick a class first before choosing a build (or at least calculate the tank they are picking in advance). The build is influenced by the stats of the tank they chose. A few build "presets" also influence which stats are chosen most to upgrade. (Glass cannon, rammer, balanced, etc). Bots have a chance to follow the preset exactly
- Bot movement is restricted to 45 degree angle movements (as if they were using movement keys.)
- Bots may occasionally face their highest recoil barrels backwards to boost their movement when not being attacked.
- (Would likely be rather difficult, unless some sort of "wall" grid is made) Bots navigate mazes better.
- (Would likely be rather difficult, unless some sort of "wall" grid is made) Bots at low health retreat to spawn, hide behind rocks, or take cover behind walls.
- Bots look around and shoot at shapes when headed to a certain location with no enemies or projectiles in sight, also recoil boosting.
- Bots agro onto different entities based on damage taken rather than locking onto one specific one. Bots prioritize lower health players.
- Bots look around realistically (perhaps a simulated "mouse cursor" for aiming). Bots do not instantly snap to their angle, and have a randomize accuracy (the simulated mouse cursor would glide to that position with velocity and accuracy determines how close to its target position it considers it to actually be aiming)
- Some bots can visibly be seen ""clicking"" on upgrades as they turn around strangley after spawning.
- Bots move around more realistically (Some players when headed to a specific point tend to hold a single movement key for long periods at a time, only occasionally hitting other ones to adjust to the axis of the desired goal, may need variants for best realism)
- Bots have different personalities (which influences the chances of presets, tanks, and even build stats. as well as targeting aggression, health flee amount, delay for avoiding and fleeing, sidestepping/dodging skill and patterns, maze navigation, etc.)
- Bots sometimes do silly things like staring at players or "dancing" (rare though.)
- Bots have a short ""memory"" based on damage taken from a player, projectile type, who the player was, etc. which influences behaviors such as when to charge in, who to avoid, etc.
- And based on personality, most of these behaviors can briefly randomly turn off to simulate mistakes or player quirks
*/

// You know, it'd be really cool to implement "A* pathfinding", and store an array of list of goal locations.
// We'd get more natrual movement that way and it'd be easier to make them avoid shapes n stuff
// Problem is ive never implemented such an algorithm before, we'd need to make some sort of internal grid for bots

class ControllerState {
    constructor(stateMachine) {
        this.stateMachine = stateMachine
        this.controller = stateMachine.controller
        this.body = this.controller.body
    }
    loop() {}
    exit() {}
    enter() {}
}
class ControllerStateMachine {
    constructor(controller) {
        this.states = {}
        this.currentState = undefined // DO NOT MODIFY THIS DIRECTLY, USE `transition()`
        this.controller = controller
    }
    loop() {
        if (this.currentState)
            this.states[this.currentState].loop()
    }
    transition(to) {
        if (typeof to !== "string") throw "Invalid state transition!"
        const nextState = this.states[to]
        if (!nextState) throw `State ${to} not found!`
        if (this.currentState === to) return
        if (this.currentState)
            this.states[this.currentState].exit()
        this.currentState = to
        nextState.enter()
    }
}

class FarmingControllerState extends ControllerState {
    // TODO:
    // - sweep behavior
    //  Higher level tanks tend to be able to destory clusters of low level shapes efficently. These tanks will often swipe their drones or bullets through a large cluster for a score boost.
    //  Not all bots should do this, as some bots would be considerate to lower level tanks
    // - Desprate Ram
    //  Often times, if multiple low level players are attacking a high level shape, and its at low health, players will attempt to ram it to get the kill
    // - Commitment
    //  The longer a bot has been trying to kill a specific shape, the higher it scores in its target calculation, meaning its less likely to switch targets
    constructor(stateMachine) {
        super(stateMachine)
    }
    loop() {
        this.controller.io = {
            goal: {
                x: this.body.x,
                y: this.body.y
            },
            main: false,
            alt: false,
            fire: false,
            power: 0,
        }

        const maxTimeWasted = 20*this.controller.personality.patience*this.controller.personality.determination // Max time I should spend attacking a shape (dont waste time on big health shapes I cant kill, more patient bots)
        const sqrRange = this.body.fov * this.body.fov;
        const validCandidates = []
        
        for (const e of targetableEntities.values()) {
            if (io_advancedBotAI.validate(e, this.body, sqrRange, false)) {
                validCandidates.push(e);
            }
        }
        

        const nearbyTanks = validCandidates.filter(entity=>entity.type == "tank") // check for tank colon three
        .filter(entity=>(entity.x - this.body.x)**2+(entity.y - this.body.y)**2>100*this.controller.personality.solitary) //Check if there are too many people nearby
        if (nearbyTanks.length>3) {
            this.stateMachine.transition("wander")
            this.stateMachine.states["wander"].timer = 300*this.controller.personality.solitary // How long we should wander for at most
            this.stateMachine.states["wander"].backState = "farm"
        }

        const validFood = validCandidates/* I just want to note that its funny to remove this filter and watch the bots try to farm enemy bots */.filter(entity=>entity.type == "food")/**/
        /* ################################################ */
        /* ################## HEY WAFFZ ################### */
        /* ################################################ */
        /* Read \/                                          */
            
        // I dont think util.getTimeToKill should be trusted this way, as its very inaccurate
        // Instead of outright filtering shapes (aside from rediciously long ones) we should apply a penalty for the scoring too. 
        .filter(food => util.getTimeToKill(this.body, food) < maxTimeWasted)
        .sort((a,b)=>{   
            const distA = (this.body.x - a.x) ** 2 + (this.body.y - a.y) ** 2;  
            const distB = (this.body.x - b.x) ** 2 + (this.body.y - b.y) ** 2;  
            
            const scoreA = a.skill.score - distA / 100; 
            const scoreB = b.skill.score - distB / 100;  
            
            return scoreB - scoreA;  
        })

        if (validFood.length!=0) {
            const bestFood = validFood[0]
            const distanceToBestFoodSqr = (this.body.x - bestFood.x) ** 2 + (this.body.y - bestFood.y) ** 2
            const minimumDistanceToFood = (bestFood.size + this.body.size + 100) ** 2
            this.controller.io.target = {
                x: bestFood.x - this.body.x,
                y: bestFood.y - this.body.y
            }
            this.controller.io.main = true
            this.controller.io.fire = true
            if (distanceToBestFoodSqr>=minimumDistanceToFood) {
                this.controller.io.goal = {
                    x: bestFood.x,
                    y: bestFood.y
                }
                this.controller.io.power = 1
            }
            
        } else {
            this.stateMachine.transition("wander")
            this.stateMachine.states["wander"].timer = 100
            this.stateMachine.states["wander"].backState = "farm"
        }
    }
}

class WanderControllerState extends ControllerState {
    //If there is nothing to do, wander towards the center of the stage
    // TODO: 
    // - Bots should honestly just pick a random point on the map with a bias towards the center and a smaller bias to the corners
    // - Bots look very stupid wandering around while not changing their angle. Of course, bots shouldnt change their angle all the time
    constructor(stateMachine) {
        super(stateMachine)
        this.centerRadius = Math.min(global.gameManager.room.width,global.gameManager.room.height)
        this.goalCord = {}
    }
    enter() {
        this.goalCord.x = gameManager.room.center.x + ran.irandomRange(this.centerRadius*-1,this.centerRadius)
        this.goalCord.y = gameManager.room.center.y + ran.irandomRange(this.centerRadius*-1,this.centerRadius)
    }
    loop() {
        this.timer--
        const sqrRange = this.body.fov * this.body.fov;
        this.controller.io = {
            goal: {
                x: this.goalCord.x,
                y: this.goalCord.y
            }
        }
        if (this.timer<0 || ((this.body.x - this.goalCord.x)**2 + (this.body.y - this.goalCord.y)**2 < 1)) {
            this.stateMachine.transition(this.backState)
        }
    }
}

//The controller
class io_advancedBotAI extends IO {  
    constructor(body, opts = {}) {  
        super(body);  

        // TODO:
        // - A lot
        // - Simulated Mouse cursor
        // I, dogeiscut, will handle this.
        // - Squads
        // - Helper functions for states
        // - This list
    

        const personalities = {  
            generalist: {
                patience: 1,
                determination: 1,
                solitary: 1
            }
        };  

        this.personality = opts.personality || ran.choose(Object.values(personalities));  

        this.io = {
            goal: {
                x: this.body.x,
                y: this.body.y
            },
            target: {
                x: 0,
                y: 0
            },
            main: false,
            alt: false,
            fire: false,
            power: 0,
        }
    
        this.stateMachine = new ControllerStateMachine(this)

        this.stateMachine.states.farm = new FarmingControllerState(this.stateMachine)
        this.stateMachine.transition("farm")

        this.stateMachine.states.wander = new WanderControllerState(this.stateMachine)
    } 

    /* HELPER FUNCTIONS: intended to be used within or after states */
    avoidRammingIntoStuffLikeShapesWhileMovingAsToNotBeADumbass() {
        // Bots will move a slightly different direction until their movement path doesnt intersect with something damaging... like shapes...
    }
    compressMovementLikeWASD() {
        // Unfortunetly not as simple as just snapping movements to angles of 45 degrees, as they will alternate keys and it will end up looking the same.
        // For best results it may be worth randomly disabling one of the movement keys when the bot is moving diagonally. and how this is done and chosen is based on personality
    }
    //from nearestDifferentMaster (Modified for Advanced Bots)
    static validate(e, m, sqrRange, filterTeam=true) {
        const xRange = sqrRange;  
        const yRange = sqrRange * (9/16) * (9/16) // Simulate the screens of a player.
        // e is the target entity
        // m is myself
        const myMaster = m.master.master;
        const aiSettings = m.aiSettings;
        const theirMaster = e.master.master;
        if (e.health.amount <= 0) return false; // dont target things with 0 or less health (dont target dead things)
        if (filterTeam) //Should we filter out our own team members?
            if (theirMaster.team === myMaster.team) return false; //Dont target my team
        if (theirMaster.team === TEAM_ROOM) return false // Dont target the room (Walls)
        if (theirMaster.ignoredByAi) return false; //If this thing does not want to be seen by me, then fine
        if (e.bond) return false; // dont target tank turrets (auto turrets)
        if (e.invuln || e.godmode || theirMaster.godmode || theirMaster.passive || myMaster.passive) return false; //dont target god mode
        if (isNaN(e.dangerValue)) return false; // Dont target things with fucked Danger values
        if (!(aiSettings.seeInvisible || m.isArenaCloser || e.alpha > 0.5)) return false; //Dont target arena closer or invisible things (arena closer scary :()
        // Check if this thing is in range
        if ((e.x - m.x) * (e.x - m.x) >= xRange) return false;
        if ((e.y - m.y) * (e.y - m.y) >= yRange) return false;
        return true;
    }

    think() {
        this.stateMachine.loop()
        this.avoidRammingIntoStuffLikeShapesWhileMovingAsToNotBeADumbass()
        this.compressMovementLikeWASD()
        //this.body.name = this.stateMachine.currentState
        return this.io
    }

}  
// ##############################################
// AI bot stuff ends here
// ##############################################

let ioTypes = {
    //misc
    zoom: io_zoom,
    doNothing: io_doNothing,
    listenToPlayer: io_listenToPlayer,
    alwaysFire: io_alwaysFire,
    mapAltToFire: io_mapAltToFire,
    mapFireToAlt: io_mapFireToAlt,
    whirlwind: io_whirlwind,
    disableOnOverride: io_disableOnOverride,
    scaleWithMaster: io_scaleWithMaster,

    //aiming related
    stackGuns: io_stackGuns,
    nearestDifferentMaster: io_nearestDifferentMaster,
    healTeamMasters: io_healTeamMasters,
    targetSelf: io_targetSelf,
    onlyAcceptInArc: io_onlyAcceptInArc,
    spin: io_spin,
    spin2: io_spin2,

    //movement related
    canRepel: io_canRepel,
    mapTargetToGoal: io_mapTargetToGoal,
    bossRushAI: io_bossRushAI,
    moveInCircles: io_moveInCircles,
    boomerang: io_boomerang,
    formulaTarget: io_formulaTarget,
    orbit: io_orbit,
    goToMasterTarget: io_goToMasterTarget,
    avoid: io_avoid,
    minion: io_minion,
    snake: io_snake,
    hangOutNearMaster: io_hangOutNearMaster,
    fleeAtLowHealth: io_fleeAtLowHealth,
    wanderAroundMap: io_wanderAroundMap,

    //bots
    advancedBotAI: io_advancedBotAI,
};

module.exports = { ioTypes, IO };
