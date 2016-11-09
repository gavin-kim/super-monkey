"use strict";

/**
 * Skill exists only one when it's fired
 * Skill checks the collision or timeout itself.
 * but if the skill fires a missile, the missile should be check in the array
 *
 */
function Skill(unit, level) {

    var self = this;
    var _unit = unit;                // a unit who has the skill
    var _level = level ? level : 1;  // skill level
    var _running;                    // skill is running

    self.getUnit = function() {
        return _unit;
    };

    self.setUnit = function(unit) {
        _unit = unit;
    };

    self.getLevel = function() {
        return _level;
    };

    self.setLevel = function(level) {
        _level = level;
    };

    self.isRunning = function() {
        return _running;
    };

    self.setRunning = function(running) {
        _running = running;
    };

    self.pause = function() {};
    self.resume = function() {};
}


// charge skill for super monkey
function Laser(unit, frame, level) {

    Skill.call(this, unit, level);

    var self = this;
    var _power = level * 5;
    var _vy = 50;            // velocity y
    var _frame = frame;
    var _scaleX = self.getLevel() * 50 / frame.WIDTH;  // laser scale x

    var _dom;  // dom
    var _cl; // left to check collision
    var _cr; // right to check collision
    var _top;  // laser top position
    var _height;   // laser height
    var _checked = []; // checked enemies already got collision
    var _timer; // timeout
    var _pause;

    self.pause = function() {
        if (self.isRunning()) {
            _pause = true;
            clearTimeout(_timer);
        }
    };

    self.resume = function() {
        if (self.isRunning()) {
            _pause = false;
            run();
        }
    };

    self.fire = function() {

        if (self.isRunning())
            return;
        else
            self.setRunning(true);

        var x = self.getUnit().getX();
        var y = self.getUnit().getY();

        _cl = x - _frame.RADIUS * _scaleX;
        _cr = x + _frame.RADIUS * _scaleX;
        _top = y - self.getUnit().getRadius();
        _height = 0;
        _checked = [];

        _dom = document.createElement("div");
        _dom.classList.add("skill", _frame.CLASS);
        _dom.style.width = _frame.WIDTH + "px";
        _dom.style.height = _height + "px";
        _dom.style.left = (x - _frame.WIDTH / 2) + "px";
        _dom.style.top = _top + "px";
        _dom.style.transform = "scale(" + _scaleX + ",1)";
        stage.appendChild(_dom);

        run();
    };

    var run = function() {

        if (_pause)
            return;

        _timer = setTimeout(function()
        {
            // check collision
            for (var i = 0; i < enemyIndex; i++) {
                if (enemies[i].isAlive() && !_checked[i] &&
                    enemies[i].isInArea(_cl, _cr, _top < 0 ? 0 : _top, _top + _height)) {

                    _checked[i] = true;
                    enemies[i].setHp(enemies[i].getHp() - _power);

                    if (enemies[i].getHp() < 0) {
                        player.setSp(player.getSp() + enemies[i].getSp());           // get sp
                        player.setMoney(player.getMoney() + enemies[i].getMoney());  // get money
                        enemies[i].die();
                    }
                }
            }

            if (_height < _frame.HEIGHT) {
                _height += _vy;
                _top -= _vy;
                _dom.style.top = _top;
                _dom.style.height = _height + "px";
                run();
            }
            else if (_top + _height > 0) {

                _top -= _vy;
                _dom.style.top = _top + "px";
                run();
            }
            else {
                _dom.remove();
                self.setRunning(false);
            }
        }, DELAY.MISSILE);
    };

    self.clone = function() {
        return new Laser(self.getUnit(), _frame, self.getLevel());
    };

    self.getName = function() {
        return "laser";
    }
}

Laser.prototype = new Skill();
Laser.prototype.constructor = Laser;


// charge skill for ninja monkey
function Tornado(unit, frame, level, speed, power) {

    Skill.call(this, unit, level, 1);

    var self = this;
    var _frame = frame;
    var _speed = speed ? speed : 1;
    var _power = power * 2;

    self.fire = function() {

        var x = self.getUnit().getX();
        var y = self.getUnit().getY();

        var max = 3 * self.getLevel();

        // make objects the number of object depends on level 8, 12, 16, 20
        for (var i = 0; i < max; i++) {
            var curveShot  = new CurveShot(
                _frame, x, y, // frame, x, y
                Math.cos(i / max * 2 * Math.PI), // target x 360 / 180 * PI
                Math.sin(i / max * 2 * Math.PI), // target y
                _speed, _power, false, 100); // dist, speed, power

            pMissiles.push(curveShot);
            curveShot.fire();
        }
    };

    self.clone = function() {
        return new Tornado(self.getUnit(), _frame,
            self.getLevel(), _speed, _power);
    };

    self.getName = function() {
        return "tornado";
    }
}

Tornado.prototype = new Skill();
Tornado.prototype.constructor = Tornado;

// skill for super monkey
function EnergyBall(unit, level, power) {

    Skill.call(this, unit, level);

    var self = this;
    var _speed = 2;
    var _power = power;
    var x, y;
    var deg;
    var radius;
    var maxRadius;
    var dom;
    var _timer;
    var _pause;

    self.pause = function() {
        if (self.isRunning()) {
            _pause = true;
            clearTimeout(_timer);
        }
    };

    self.resume = function() {
        if (self.isRunning()) {
            _pause = false;
            run();
        }
    };

    self.fire = function() {

        if (self.isRunning())
            return;
        else
            self.setRunning(true);

        x = self.getUnit().getX();
        y = self.getUnit().getY();
        deg = 0;
        radius = 10;
        maxRadius = self.getLevel() * 40;
        dom = document.createElement("img");
        dom.src = "img/super/energy_ball.png";
        dom.classList.add("skill", "energy-ball");
        dom.style.left = (x - radius) + "px";
        dom.style.top = (y - radius) + "px";
        dom.style.width = (radius * 2) + "px";
        dom.style.height = (radius * 2) + "px";
        stage.appendChild(dom);
        run();
    };

    var run = function() {
        if (_pause)
            return;

        _timer = setTimeout(function() {

            // check collision every 600 ms
            if (deg % 600 == 0) {
                for (var i = 0; i < enemyIndex; i++) {
                    if (enemies[i].isAlive() &&
                        distance(x, y, enemies[i].getX(), enemies[i].getY()) <= enemies[i].getRadius() + radius) {

                        enemies[i].setHp(enemies[i].getHp() - _power);

                        if (enemies[i].getHp() < 1) {
                            player.setSp(player.getSp() + enemies[i].getSp());           // get sp
                            player.setMoney(player.getMoney() + enemies[i].getMoney());  // get money
                            enemies[i].die();
                        }
                    }
                }
            }

            eMissiles.forEach(function(missile) {
                if (missile.isAlive() &&
                    distance(x, y, missile.getX(), missile.getY()) <= missile.getRadius() + radius)
                    missile.die();
            });

            // rotate velocity for unit
            deg -= 30;
            y -= _speed;

            if (radius < maxRadius)
                radius++;

            dom.style.transform = "rotate(" + deg + "deg)";
            dom.style.width = (radius * 2) + "px";
            dom.style.height = (radius * 2) + "px";
            dom.style.left = (x - radius) + "px";
            dom.style.top = (y - radius) + "px";

            if (y > 0) {
                run();
            } else {
                dom.remove();
                self.setRunning(false);
            }

        }, DELAY.MISSILE);
    };

    self.getName = function() {
        return "energy-ball";
    }
}

EnergyBall.prototype = new Skill();
EnergyBall.prototype.constructor = EnergyBall;



// skill for ninja monkey
function MirrorImage(unit, level) {

    Skill.call(this, unit, level);

    var self = this;

    var mirrorUnits = [];
    var mirrorTimer;      // timer to check duration
    var timePassed = 0;   // from start to current time(ms)

    var smokeTimer;    // smoke animation
    var smokes = [];      // smoke animation units
    var smokeFrameCount = 0; // smoke animation count
    var smokeTotalFrame = MIRROR_IMAGE_SMOKE.COLUMN * MIRROR_IMAGE_SMOKE.ROW;

    var gap = [50, 100, 150, 200];

    var setX = function() {
        mirrorUnits.forEach(function(mu) {
            mu.setX(self.getUnit().getX())
        })
    }

    var createMirrorUnit = function() {

        // mirror unit
        var mirrorUnit = new Player(self.getUnit().getFrame(),
            self.getUnit().getX(), self.getUnit().getY());

        mirrorUnit.getDom().classList.add("clone");
        mirrorUnit.getDom().classList.remove("player");

        // mirror weapon
        var mirrorWeapon = self.getUnit().getWeapon().clone();
        mirrorWeapon.setUnit(mirrorUnit);
        mirrorUnit.setWeapon(mirrorWeapon);

        var mirrorChargeSkill = self.getUnit().getChargeSkill().clone();
        mirrorChargeSkill.setUnit(mirrorUnit);
        mirrorUnit.setChargeSkill(mirrorChargeSkill);

        return mirrorUnit;
    };

    self.fire = function() {

        if (self.isRunning())
            return;
        else
            self.setRunning(true);

        timePassed = 0;
        smokeFrameCount = 0;
        smokes = [];

        // create mirror units
        for (var i = 0; i < self.getLevel() * 2; i++) {
            var mirrorUnit = createMirrorUnit();

            if (i % 2 == 0)
                mirrorUnit.setX(self.getUnit().getX() - (Math.floor(i / 2) + 1) * MirrorImage.GAP_WIDTH);
            else
                mirrorUnit.setX(self.getUnit().getX() + (Math.floor(i / 2) + 1) * MirrorImage.GAP_WIDTH);

            mirrorUnit.setY(self.getUnit().getY());
            mirrorUnits.push(mirrorUnit);

            var smoke = new Unit(MIRROR_IMAGE_SMOKE, mirrorUnit.getX(), mirrorUnit.getY());
            smoke.appendDom();
            smokes.push(smoke);
        }

        animateSmoke();
        checkTime();
    };

    self.resume = function() {
        if (self.isRunning()) {
            animateSmoke();
            checkTime();
        }
    };

    self.pause = function() {
        if (self.isRunning()) {
            clearTimeout(mirrorTimer);
            clearTimeout(smokeTimer);
        }
    };


    // check time while the skill is running
    var checkTime = function() {
        mirrorTimer = setTimeout(function() {
            if (timePassed < DURATION.MIRROR_IMAGE) {
                timePassed += 500;
                checkTime();
            } else {
                // remove mirror images
                while (mirrorUnits.length > 0)
                    mirrorUnits.pop().die();

                self.setRunning(false);
            }
        }, 500);
    };

    var animateSmoke = function() {

        if (smokeFrameCount++ < smokeTotalFrame) {
            smokes.forEach(function (smoke) {
                smoke.nextFrame();
            });

            smokeTimer = setTimeout(function() {
                animateSmoke();
            }, 60);

        } else {
            smokes.forEach(function(smoke) {
                smoke.removeDom();
            });
        }
    };

    // actions for mirror images
    self.moveLeft = function() {
        mirrorUnits.forEach(function(unit) {
            unit.moveLeft();
        });
    };

    self.moveRight = function() {
        mirrorUnits.forEach(function(unit) {
            unit.moveRight();
        });
    };

    self.moveUp = function() {
        mirrorUnits.forEach(function(unit) {
            unit.moveUp();
        });
    };

    self.moveDown = function() {
        mirrorUnits.forEach(function(unit) {
            unit.moveDown();
        });
    };

    self.useWeapon = function() {
        mirrorUnits.forEach(function(unit) {
            unit.useWeapon();
        });
    };

    self.useChargeSkill = function() {
        mirrorUnits.forEach(function(unit) {
            unit.useChargeSkill();
        });
    };

    self.getName = function() {
        return "mirror-image";
    }
}

MirrorImage.prototype = new Skill();
MirrorImage.prototype.constructor = MirrorImage;
MirrorImage.GAP_WIDTH = 50;


/**
 * skill for all character
 *
 * @param unit unit to use the skill
 * @param frame frame frame
 * @param level determine explosion size
 * @param power skill damage
 */
function Blast(unit, frame, level, power) {
    Skill.call(this, unit, level);

    var self = this;
    var _frame = frame;
    var _power = power;
    var _timer;
    var _cx, _cy; // center x , y
    var _x, _y;   // point x, y
    var _dist;   // distance between the center and point
    var _radian; // radian
    var _pause;

    var box = {
        left: - STAGE_WIDTH / 3,
        right: STAGE_WIDTH + STAGE_WIDTH / 3,
        top: - STAGE_HEIGHT / 3,
        bottom: STAGE_HEIGHT + STAGE_HEIGHT / 3
    };


    self.pause = function() {
        if (self.isRunning())
            clearTimeout(_timer);
    };

    self.resume = function() {
        if (self.isRunning())
            run();
    };

    self.fire = function() {

        if (self.isRunning())
            return;
        else
            self.setRunning(true);

        _cx = self.getUnit().getX(); // center x
        _cy = self.getUnit().getY(); // center y
        _x = _cx;      // x
        _y = _cy - 100; // y

        // between unit and missile when setTimeout invokes
        _dist = distance(_cx, _cy, _x, _y);

        // radian missile's and unit's position
        _radian = Math.atan2(_cy - _y, _cx - _x);
        run();
    };

    var run = function() {

        if (_pause)
            return;

        _timer = setTimeout(function() {
            // set limit on object position (e.g. 640 x 480 screen -> 640 x 640)
            if (box.left < _x && box.right > _x && box.top < _y && box.bottom > _y) {

                _x = _cx + _dist * -Math.cos(_radian);
                _y = _cy + _dist * -Math.sin(_radian);

                // radian velocity
                _radian += 0.4;
                // distance velocity
                _dist += 3;

                var explosion = new Explosion(_frame, _x, _y,
                    20 + Blast.RADIUS_INCREMENT * self.getLevel(), _power, true);
                pExplosions.push(explosion);
                explosion.fire();
                run();

            } else {
                self.setRunning(false);
            }

            // finish interval and remove object
        }, DELAY.MISSILE);
    };

    self.getName = function() {
        return "blast";
    }
}

Blast.prototype = new Skill();
Blast.prototype.constructor = Blast;
Blast.RADIUS_INCREMENT = 10;


