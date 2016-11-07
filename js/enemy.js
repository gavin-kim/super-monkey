"use strict";

function Enemy(frame, x, y) {

    Unit.call(this, frame, x, y);
    var self = this;

    var _actions;  // enemy actions
    var _action;     // current running action
    var _weapon;
    var _money = 0;
    var _speed = 1;
    var _sp = 0;
    var _timer; // interval

    self.getActions = function() {
        return _actions;
    };

    self.setActions = function(actions) {
        _actions = actions
    };

    self.getWeapon = function() {
        return _weapon;
    };

    self.setWeapon = function(weapon) {
        _weapon = weapon;
    };

    self.getMoney = function() {
        return _money;
    };

    self.setMoney = function(money) {
        _money = money;
    };

    self.getSpeed = function() {
        return _speed;
    };

    self.setSpeed = function(speed) {
        _speed = speed;
    };

    self.getSp = function() {
        return _sp;
    };

    self.setSp = function(sp) {
        _sp = sp;
    };

    self.init = function() {

        self.isAlive(true);
        self.appendDom();
        take(_actions.shift());
    };

    self.die = function() {
        if (self.isAlive()) {
            clearTimeout(_timer);
            self.setAlive(false);
            self.removeDom();
        }
    };

    self.pause = function() {
        clearTimeout(_timer);
    };

    self.resume = function() {
        if (self.isAlive() && _action.func)
            _action.func();
    };

    var take = function(action) {

        if (!action) {
            self.die();
            return;
        }

        _action = action;

        switch (_action.type) {
            case "move":
                move();
                break;
            case "fire":
                fire();
                break;
            case "patrol":
                patrol();
                break;
            case "rush":
                rush();
                break;
            case "die":
                self.die();
                break;
        }
    };


    var move = function() {

        // switch invalid x,y to current x,y
        _action.point.x = _action.point.x ? _action.point.x : self.getX();
        _action.point.y = _action.point.y ? _action.point.y : self.getY();

        var radian = Math.atan2(self.getY() - _action.point.y, self.getX() - _action.point.x);

        _action.vx = -Math.cos(radian) * _speed;
        _action.vy = -Math.sin(radian) * _speed;

        _action.func = _move;
        _move();
    };

    var _move = function() {

        _timer = setTimeout(function(){
            // check the unit reaches the point
            if (_action.point.y > self.getY()) {
                self.setX(self.getX() + _action.vx);
                self.setY(self.getY() + _action.vy);
                self.nextFrame();
                _move();

            } else {
                // go to the next action
                take(_actions.shift());
            }

        }, DELAY.ENEMY_MOVE)
    };

    var fire = function() {

        _action.count = 0;
        _action.func = _fire;
        _fire();
    };

    var _fire = function() {


        _timer = setTimeout(function() {

            // check fire count
            if (self.isAlive() && _action.count++ < _action.max) {

                var point = getPlayerPoint();
                _weapon.fire(point.x, point.y);
                self.nextFrame();
                _fire();

            } else {
                take(_actions.shift());
            }
        }, _action.delay);
    };

    var patrol = function() {

        // set patrol point x1, x2 and velocity
        if (self.getX() < STAGE_WIDTH / 2) {
            _action.ax = self.getX();
            _action.bx = self.getX() + _action.length.x;
            _action.vx = _speed;
        } else {
            _action.ax = self.getX() - _action.length.x;
            _action.bx = self.getX();
            _action.vx = -_speed;
        }
        _action.total = 0;

        _action.func = _patrol;
        _patrol();
    };

    var _patrol = function() {

        _timer = setTimeout(function() {

            if (_action.delay < _action.total) {
                var target = getPlayerPoint();
                _weapon.fire(target.x, target.y);
                _action.total = 0;
            }

            // ax ~ bx
            if (self.getX() < _action.ax || _action.bx < self.getX() ) {
                _action.vx *= -1;
            }

            self.setX(self.getX() + _action.vx);
            _action.total += DELAY.ENEMY_MOVE;
            self.nextFrame();
            _patrol();

        }, DELAY.ENEMY_MOVE);
    };

    var rush = function() {

        var target = getPlayerPoint();
        var radian = Math.atan2(self.getY() - target.y, self.getX() - target.x);

        _action.vx = -Math.cos(radian) * _speed;
        _action.vy = -Math.sin(radian) * _speed;

        _action.func = _rush;
        _rush();
    };

    var _rush = function() {


        _timer = setTimeout(function() {

            // check the unit reaches the point
            if (STAGE_HEIGHT > self.getY()) {
                self.setX(self.getX() + _action.vx);
                self.setY(self.getY() + _action.vy);
                self.nextFrame();

                _action.vx *= _action.increment;
                _action.vy *= _action.increment;
                _rush();

            } else {
                self.die();
            }
        }, DELAY.ENEMY_MOVE);
    };


    var getPlayerPoint = function() {
        return {
            x: player.getX(),
            y: player.getY()
        }
    };
}

Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;


function EnemyFactory() {

    var self = this;

    var normal = function() {

        var actions = [];

        actions.push({
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT / 3
            }
        }, {
            type: "fire",
            target: "player",
            max: 3,
            delay: 2000
        }, {
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT / 3 * 2
            }
        }, {
            type: "fire",
            target: "player",
            max: 3,
            delay: 2000
        }, {
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT
            }
        }, {
            type: "die"
        });

        return actions;
    };

    var rush = function() {
        var actions = [];

        actions.push({
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT / 4
            }
        }, {
            type: "rush",
            target: "player",
            increment: 1.1
        });

        return actions;
    };

    var chase = function() {

    };

    var patrol = function() {
        var actions = [];

        actions.push({
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT / 2 * Math.random()
            }
        }, {
            type: "patrol",
            target: "player",
            length: {
                x: Math.random() * STAGE_WIDTH / 2,
                y: 0
            },
            delay: 2000
        });

        return actions;
    };

    var hold = function() {
        var actions = [];

        actions.push({
            type: "move",
            target: "point",
            point: {
                y: STAGE_HEIGHT / 2 * Math.random()
            }
        }, {
            type: "fire",
            target: "player",
            max: Infinity,
            delay: 2000
        });

        return actions;
    };

    var createEnemyData = function(pattern) {

        var x = Math.random() * (STAGE_WIDTH - 50 * 2) + 50;
        var y = 0;

        switch (pattern) {
            case "normal":
                return {
                    unit: {
                        name: "normal",
                        frame: SLIME_BLUE,
                        x: x,
                        y: y,
                        hp: 2,
                        money: 10,
                        sp: 2,
                        speed: 7
                    },
                    weapon: {
                        name: "basic",
                        frame: ENEMY_MISSILE,
                        level: 2,
                        speed: 6,
                        power: 1
                    },
                    actions: normal()

                };
            case "patrol":
                return {
                    unit: {
                        name: "patrol",
                        frame: SLIME_BLACK,
                        x: x,
                        y: y,
                        hp: 3,
                        money: 20,
                        sp: 2,
                        speed: 10
                    },
                    weapon: {
                        name: "basic",
                        frame: ENEMY_MISSILE,
                        level: 1,
                        speed: 6,
                        power: 1
                    },
                    actions: patrol()

                };
            case "hold":
                return {
                    unit: {
                        name: "hold",
                        frame: SLIME_RED,
                        x: x,
                        y: y,
                        hp: 5,
                        money: 20,
                        sp: 2,
                        speed: 12
                    },
                    weapon: {
                        name: "basic",
                        frame: ENEMY_MISSILE,
                        level: 3,
                        speed: 6,
                        power: 1
                    },
                    actions: patrol()
                };
            case "rush":
                return {
                    unit: {
                        name: "rush",
                        frame: SLIME_PINK,
                        x: x,
                        y: y,
                        hp: 1,
                        money: 10,
                        sp: 3,
                        speed: 15
                    },
                    weapon: {
                        name: "basic",
                        frame: ENEMY_MISSILE,
                        speed: 6,
                        power: 1
                    },
                    actions: rush()
                }
        }
    };

    self.createEnemy = function(pattern) {

        var data =  createEnemyData(pattern);

        // Enemy(data, x, y)
        var enemy = new Enemy(data.unit.frame, data.unit.x, data.unit.y);

        enemy.setWeapon(getWeapon(enemy, data.weapon));
        enemy.setHp(data.unit.hp);
        enemy.setMoney(data.unit.money);
        enemy.setSpeed(data.unit.speed);
        enemy.setSp(data.unit.sp);
        enemy.setActions(data.actions);

        return enemy;
    };

    var getWeapon = function(enemy, args) {

        switch (args.name) {
            case "basic":
                return new Basic(enemy, args.frame, args.level, args.speed, args.power);
        }
    };

};



