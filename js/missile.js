"use strict";

/**
 * Missile is fired from skills or weapon.
 * Missiles should be checked in missile array.
 *
 * A basic missile object
 *
 * @param frame animation frame data
 * @param x starting point x
 * @param y starting point y
 * @param tx target's center x
 * @param ty target's center y
 * @param speed A speed of the missile
 * @param power A power of the missile
 * @param spin rotate missile when moving
 */

function Missile(frame, x, y, tx, ty, speed, power, spin)
{
    Unit.call(this, frame, x, y);

    var self = this;

    var _tx = tx; // target's center x
    var _ty = ty; // target's center y

    var _speed = speed;
    var _power = power; // power
    var _spin = spin;

    // velocity x
    var _vx;

    // velocity y
    var _vy;

    // event for a specific time after fire
    var _timeEvent;

    // running time
    var _runningTime = 0;

    // event for a collision
    var _collisionEvent;

    var _timer;

    var _pause;


    self.getTx = function() {
        return _tx;
    };

    self.setTx = function(tx) {
        _tx = tx;
    };

    self.getTy = function() {
        return _ty;
    };

    self.setTy = function(ty) {
        _ty = ty;
    };

    self.getVx = function() {
        return _vx;
    };

    self.setVx = function(vx) {
        _vx = vx;
    };

    self.getVy = function() {
        return _vy;
    };

    self.setVy = function(vy) {
        _vy = vy;
    };

    // change target point
    self.changeTarget = function(tx, ty) {
        if (arguments.length > 1) {
            _tx = tx;
            _ty = ty;
            calcVelocity(); // update velocity
        }
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

    self.getSpin = function() {
        return _spin;
    };

    self.setSpin = function(spin) {
        _spin = spin;
    };

    self.getTimeEvent = function() {
        return _timeEvent;
    };

    self.setTimeEvent = function(args, func) {
        func.args = args;
        _timeEvent = func;
    };

    self.getCollisionEvent = function() {
        return _collisionEvent;
    };

    self.setCollisionEvent = function(args, func) {
        func.args = args;
        _collisionEvent = func;
    };


    // stop interval and remove dome
    self.die = function() {

        // check It's collision an collision event exists
        if (_collisionEvent) {
            _collisionEvent(_collisionEvent.args);
        }

        self.setAlive(false);
        clearTimeout(_timer);
        self.removeDom();
    };

    // overridden
    self.pause = function() {
        _pause = true;
        clearTimeout(_timer);
    };

    self.resume = function() {
        _pause = false;
        run();
    };

    self.fire = function() {

        self.getDom().classList.add("missile");
        self.appendDom();
        self.calcVelocity();
        run();
    };

    var run = function() {

        if (_pause)
            return;

        _timer = setTimeout(function() {

            if (self.getX() > 0 && self.getX() < STAGE_WIDTH &&
                self.getY() > 0 && self.getY() < STAGE_HEIGHT) {

                self.setX(self.getX() + _vx * _speed);
                self.setY(self.getY() + _vy * _speed);

                if (_spin)
                    self.setDeg(self.getDeg() + 50);

                // trigger the time event when running time > specific time
                if (_timeEvent && _timeEvent.args.time < _runningTime) {
                    _timeEvent(_timeEvent.args);
                    _timeEvent = null;
                }

                _runningTime += DELAY.MISSILE;
                self.nextFrame();
                run();
            }
            else {
                self.removeDom();
                self.setAlive(false);
            }
        }, DELAY.MISSILE);
    };

    self.calcVelocity = function() {
        // calculate velocity x and y
        var radian = Math.atan2(self.getY() - _ty, self.getX() - _tx);
        _vx = -Math.cos(radian);
        _vy = -Math.sin(radian);
    };

    self.clone = function() {
        return new self.constructor(self.getFrame(), self.getX(), self.getY(),
            _tx, _ty, _speed, _power, _spin);
    };
}

Missile.prototype = new Unit();
Missile.prototype.constructor = Missile;


/**
 * Non-target missile type, make a missile object at specific point
 *
 * @param x point x to explode
 * @param y point y to explode
 * @param frame animation frame
 * @param radius determine the size of the explosion (x1, x2, x3...)
 * @param power determine the damage to enemies
 * @param remover able to remove enemy's missile when collision
 */
function Explosion(frame, x, y, radius, power, remover) {

    Unit.call(this, frame, x, y);

    var DURATION = 1000;

    var self = this;

    self.setRadius(radius);
    var _power = power;
    var _remover = remover;
    var _checked = [];     // check if enemies are already damaged
    var _timer;            // timeout
    var _frameCounter = 0; // count frame
    var _totalFrame = frame.COLUMN * frame.ROW;  // total frame
    var _timerDelay = Math.floor(DURATION / _totalFrame);
    var _pause;


    self.isChecked = function(enemyId) {
        return _checked[enemyId];
    };

    self.setChecked = function(enemyId) {
        _checked[enemyId] = true;
    };

    self.getPower = function() {
        return _power;
    };

    self.setPower = function(power) {
        _power = power;
    };

    // stop interval and remove dom
    self.die = function() {

        self.setAlive(false);
        clearTimeout(_timer);
        self.removeDom();
    };

    self.pause = function() {
        _pause = true;
        clearTimeout(_timer);
    };

    self.resume = function() {
        _pause = false;
        run();
    };

    self.fire = function() {

        self.getDom().classList.add("explosion");
        self.appendDom();
        run();
    };

    var run = function() {

        if (_pause)
            return;

        _timer = setTimeout(function() {

            // skill remove damage other missiles
            if (_remover)
                eMissiles.forEach(function (missile) {
                    if (missile.isAlive() && self.isCollision(missile))
                        missile.die();
                });

            if (_frameCounter++ < _totalFrame) {
                self.nextFrame();
                run();
            }
            else {
                self.removeDom();
                self.setAlive(false);
            }

        }, _timerDelay);
    };

    self.clone = function() {
        return new self.constructor(self.getFrame(), self.getX(), self.getY(),
            self.getRadius(), _power, _remover);
    };
}

Explosion.prototype = new Unit();
Explosion.prototype.constructor = Explosion;


function CurveShot(frame, x, y, tx, ty, speed, power, spin, dist) {
    Missile.call(this, frame, x, y, tx, ty, speed, power, spin);

    var self = this;

    var _startX = x;
    var _startY = y;

    // distance from starting point
    var _distToCurve = dist;
    var _dist = 0;

    // radian missile's and unit's position
    var _radian = Math.atan2(ty, tx);
    var _pause;
    var _timer;

    // overridden
    self.pause = function() {
        _pause = true;
        clearTimeout(_timer);
    };

    self.resume = function() {
        _pause = false;
        run();
    };

    self.fire = function() {

        self.getDom().classList.add("missile");
        self.setAlive(true);
        self.appendDom();
        self.calcVelocity();
        run();
    };

    var run = function() {

        if (self.pause())
            return;

        _timer = setTimeout(function() {

            if (CurveShot.LIMIT.LEFT < self.getX() && CurveShot.LIMIT.RIGHT > self.getX() &&
                CurveShot.LIMIT.TOP < self.getY() && CurveShot.LIMIT.BOTTOM > self.getY()) {

                if (_dist < _distToCurve) {

                    self.setX(self.getX() + self.getTx() * self.getSpeed());
                    self.setY(self.getY() + self.getTy() * self.getSpeed());
                    _dist = distance(_startX, _startY, self.getX(), self.getY());

                } else {
                    // set limit on object position (e.g. 640 x 480 screen -> 640 x 640)
                    self.setX(_startX + _dist * -Math.cos(_radian));
                    self.setY(_startY + _dist * -Math.sin(_radian));

                    // radian velocity
                    _radian += 0.2;
                    // distance velocity
                    _dist += 2;
                }

                if (self.getSpin())
                    self.setDeg(self.getDeg() + 50);

                self.nextFrame();
                run();

            } else {
                self.removeDom();
                self.setAlive(false);
            }
        }, DELAY.MISSILE);
    };

    self.clone = function() {
        return new self.constructor(self.getUnit(), self.getFrame(),
            self.getLevel(), self.getSpeed(), self.getPower());
    };
}
CurveShot.prototype = new Missile();
CurveShot.prototype.constructor = CurveShot;

CurveShot.LIMIT = {
    LEFT: - STAGE_WIDTH / 3,
    RIGHT: STAGE_WIDTH + STAGE_WIDTH / 3,
    TOP: - STAGE_HEIGHT / 3,
    BOTTOM: STAGE_HEIGHT + STAGE_HEIGHT / 3
};