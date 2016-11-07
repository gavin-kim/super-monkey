"use strict";

/**
 * @param unit The owner of the weapon
 * @param frame frame frame for missile' animation
 * @param level The level of the weapon
 * @param speed The speed of the missile
 * @param power The power of the missile
 */
function Weapon(unit, frame, level, speed, power) {

    var self = this;

    var _unit = unit;
    var _frame = frame;
    var _level = level;
    var _speed = speed;
    var _power = power;

    self.getUnit = function() {
        return _unit;
    };

    self.setUnit = function(unit) {
        _unit = unit;
    };

    self.getFrame = function() {
        return _frame;
    };

    self.setFrame = function(frame) {
        _frame = frame;
    };

    self.getLevel = function() {
        return _level;
    };

    self.setLevel = function(level) {
        _level = level;
    };

    self.getSpeed = function() {

        return _speed;
    };

    self.setSpeed = function(speed) {
        _speed = speed;
    };

    self.getPower = function() {
        return _power;
    };

    self.setPower = function(power) {
        _power = power;
    };

    self.createMissile = function(tx, ty, spin) {
        return new Missile(_frame, _unit.getX(), _unit.getY(), tx, ty,
            _speed, _power, spin);
    };
}

function Basic(unit, frame, level, speed, power) {
    Weapon.call(this, unit, frame, level, speed, power);

    var self = this;

    // radian per level for 7.5 degree, radian * 180 / PI = degree
    var rpl = 10 * Math.PI / 180;

    // target's x ,y
    self.fire = function(tx, ty) {

        var missiles = [];

        var x = self.getUnit().getX();
        var y = self.getUnit().getY();
        var radian = Math.atan2(y - ty, x - tx);

        var missile = self.createMissile(tx, ty, true);

        // frame, x, y, tx, ty, speed, power
        missiles.push(missile);

        // create extra missiles depending on the level
        for (var i = 1; i < self.getLevel(); i++) {

            missiles.push(self.createMissile(
                x - Math.cos(radian - rpl * i),
                y - Math.sin(radian - rpl * i), true));

            missiles.push(self.createMissile(
                x - Math.cos(radian + rpl * i),
                y - Math.sin(radian + rpl * i), true));
        }

        // fire missiles
        missiles.forEach(function(missile) {

            if (self.getUnit() instanceof Player)
                pMissiles.push(missile);
            else
                eMissiles.push(missile);

            missile.fire();
        });
    };

    self.clone = function() {
        return new Basic(self.getUnit(), self.getFrame(),
            self.getLevel(), self.getSpeed(), self.getPower());
    };

    self.getName = function() {
        return "basic";
    }
}

Basic.prototype = new Weapon();
Basic.prototype.constructor = Basic;

function Bomb(unit, frame, level, speed, power, bombFrame) {
    Weapon.call(this, unit, frame, level, speed, power);

    var self = this;
    var _bombFrame = bombFrame;

    // fire to target x, y
    self.fire = function(tx, ty) {

        // frame, x, y, tx, ty, speed, power
        var missile = self.createMissile(tx, ty, true);

        // register collision event
        missile.setCollisionEvent({}, function() {
            var explosion = new Explosion(_bombFrame, missile.getX(), missile.getY(),
                self.getLevel() * Bomb.RADIUS_INCREMENT, self.getPower());

            pExplosions.push(explosion);
            explosion.fire();
            console.log("collision event");
        });

        if (self.getUnit() instanceof Player)
            pMissiles.push(missile);
        else
            eMissiles.push(missile);

        missile.fire();
    };

    self.clone = function() {
        return new Bomb(self.getUnit(), self.getFrame(), self.getLevel(),
            self.getSpeed(), self.getPower(), _bombFrame);
    };

    self.getName = function() {
        return "bomb";
    }
}

Bomb.prototype = new Weapon();
Bomb.prototype.constructor = Bomb;
Bomb.RADIUS_INCREMENT = 30; // explosion's radius

function Launcher(unit, frame, level, speed, power, shotFrame) {
    Weapon.call(this, unit, frame, level, speed, power);

    var self = this;
    var _shotFrame = shotFrame;

    // fire to target x, y
    self.fire = function(tx, ty) {

        // frame, x, y, tx, ty, speed, power
        var missile = self.createMissile(tx, ty, true);

        // register collision event
        missile.setCollisionEvent({
            burst: self.burst
        }, function(args) {
            args.burst(missile.getX(), missile.getY());
        });

        // set a time event that occurs after 1500 ms
        missile.setTimeEvent({
            time: 1000
        }, function() {
            missile.die(); // true: check collision

        });

        if (self.getUnit() instanceof Player)
            pMissiles.push(missile);
        else
            eMissiles.push(missile);

        missile.fire();
    };

    // burst a specific point
    self.burst = function(x, y) {

        // the number of object depends on level 8, 12, 16, 20...
        var max = 4 * self.getLevel() + 4;

        for (var i = 0; i < max; i++) {

            // frame, x, y, tx, ty, speed, power
            var missile = new Missile(
                _shotFrame,
                x, y,
                x - Math.cos(i / max * Math.PI * 2),
                y - Math.sin(i / max * Math.PI * 2),
                self.getSpeed(),
                self.getPower(),
                true
            );

            if (self.getUnit() instanceof Player)
                pMissiles.push(missile);
            else
                eMissiles.push(missile);

            missile.fire();
        }
    };

    self.burstSelf = function() {
        self.burst(self.getUnit().getX(), self.getUnit().getY());
    };

    self.clone = function() {
        return new Launcher(self.getUnit(), self.getFrame(), self.getLevel(),
            self.getSpeed(), self.getPower(), _shotFrame);
    };

    self.getName = function() {
        return "launcher";
    }
}

Launcher.prototype = new Weapon();
Launcher.prototype.constructor = Launcher;


function WeaponFactory() {
}

WeaponFactory.getByName = function(player, name) {

    switch (name.toLowerCase()) {
        case "basic":
            return WeaponFactory.getBasic(player);
        case "bomb":
            return WeaponFactory.getBomb(player);
        case "launcher":
            return WeaponFactory.getLauncher(player);
        case "laser":
            return WeaponFactory.getLaser(player);
        case "tornado":
            return WeaponFactory.getTornado(player);
        case "mirror-image":
            return WeaponFactory.getMirrorImage(player);
        case "blast":
            return WeaponFactory.getBlast(player);
        case "energy-ball":
            return WeaponFactory.getEnergyBall(player);
    }
};


WeaponFactory.getBasic = function(player) {

    // player, frameData, level, speed, power
    switch (player.getType()) {
        case PLAYER.TYPE.SUPER:
            return new Basic(player, BASIC_S, 1, 15, 1);
        case PLAYER.TYPE.NINJA:
            return new Basic(player, BASIC_N, 1, 15, 1);
    }
};

WeaponFactory.getBomb = function(player) {

    // player, frame(missile), level, speed, power, frame(explosion)
    switch (player.getType()) {
        case PLAYER.TYPE.SUPER:
            return new Bomb(player, BOMB_MISSILE_S, 1, 15, 1, BOMB_EXPLOSION_S);
        case PLAYER.TYPE.NINJA:
            return new Bomb(player, BOMB_MISSILE_N, 1, 15, 1, BOMB_EXPLOSION_N);
    }
};

WeaponFactory.getLauncher = function(player) {

    // player, frame(missile), level, speed, power, frame(explosion)
    switch (player.getType()) {
        case PLAYER.TYPE.SUPER:
            return new Launcher(player, LAUNCHER_MISSILE_S, 1, 15, 1, LAUNCHER_SHOT_S);
        case PLAYER.TYPE.NINJA:
            return new Launcher(player, LAUNCHER_MISSILE_N, 1, 15, 1, LAUNCHER_SHOT_N);
    }
};

// damage: level * 5
WeaponFactory.getLaser = function(player) {
    return new Laser(player, LASER, 1);
};

WeaponFactory.getTornado = function(player) {
    return new Tornado(player, TORNADO, 1, 10, 5);
};

WeaponFactory.getMirrorImage = function(player) {
    return new MirrorImage(player, 1);
};

WeaponFactory.getBlast = function(player) {
    switch(player.getType()) {
        case PLAYER.TYPE.SUPER:
            return new Blast(player, BLAST_S, 1, 5);
        case PLAYER.TYPE.NINJA:
            return new Blast(player, BLAST_N, 1, 5);
    }
};

// radius: level * 25, damage: power per 100 ms
WeaponFactory.getEnergyBall = function(player) {
    return new EnergyBall(player, 1, 5);
};

