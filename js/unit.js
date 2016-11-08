"use strict";

function Unit(frame, x, y) {

    var self = this;
    var _dom = document.createElement("div"); // element
    var _frame = frame;
    var _x = x ? x : 0;             // dom x
    var _y = y ? y : 0;             // dom y
    var _radius; // unit radius to check collision
    var _scale;  // image scale
    var _deg = 0;        // image degree
    var _totalFrame;
    var _frameCount = 0; // sprite sheet frame count
    var _hp = 1;         // hp
    var _alive = true;   // unit must be alive before running

    self.getFrame = function() {
        return _frame;
    };

    self.setFrame = function(frame) {
        _dom.classList.remove(_frame.CLASS);
        _frame = frame;
        init();
    };

    self.getX = function() {
        return _x;
    };

    self.setX = function(x) {
        _x = x;
        _dom.style.left = (_x - _frame.WIDTH / 2) + "px";
    };

    self.getY = function() {
        return _y;
    };

    self.setY = function(y) {
        _y = y;
        _dom.style.top = (_y - _frame.HEIGHT / 2) + "px";
    };

    self.getDom = function() {
        return _dom;
    };

    self.setDom = function(dom) {
        _dom = dom;
    };

    self.getRadius = function() {
        return _radius;
    };

    self.setRadius = function(radius) {
        _radius = radius * 0.8;
        _scale = radius * 2 / _frame.WIDTH;
        _dom.style.transform = "scale(" + _scale + ")";
    };

    self.getDeg = function() {
        return _deg;
    };

    self.setDeg = function(deg) {
        _deg = deg;
    };

    self.getHp = function() {
        return _hp;
    };

    self.setHp = function(hp) {
        _hp = hp;
    };

    self.isAlive = function() {
        return _alive;
    };

    self.setAlive = function(alive) {
        _alive = alive;
    };

    self.getTotalFrame = function() {
        return _totalFrame;
    };

    self.appendDom = function() {
        stage.appendChild(_dom);
    };

    self.removeDom = function() {
        _dom.remove();
    };

    // scale and degree are applied when the next frame
    self.nextFrame = function() {

        _dom.style.backgroundPositionX = -(frame.START_WIDTH + _frame.WIDTH *
            (_frameCount % _frame.COLUMN)) + "px";
        _dom.style.backgroundPositionY = -(frame.START_HEIGHT + _frame.HEIGHT *
            Math.floor(_frameCount / frame.ROW)) + "px";
        _dom.style.transform = "scale(" + _scale + ") rotate(" + _deg + "deg)";

        if (_frameCount < _totalFrame)
            _frameCount++;
        else
            _frameCount = 0;
    };

    // check the unit collide with the other unit
    self.isCollision = function(unit) {
        return distance(_x, _y, unit.getX(), unit.getY()) <= _radius + unit.getRadius();
    };

    // check the unit in the area (left, right, top, bottom)
    self.isInArea = function(left, right, top, bottom) {

        return !(
            _x + _radius < left  || // target < left
            _x - _radius > right || // target > right
            _y + _radius < top   || // target < top
            _y - _radius > bottom   // target > bottom
        );
    };

    var init = function() {

        if (_frame) {
            _totalFrame = _frame.ROW * _frame.COLUMN;
            _dom.classList.add(_frame.CLASS, "unit");
            _dom.style.width = _frame.WIDTH + "px";
            _dom.style.height = _frame.HEIGHT + "px";
            _dom.style.left = (_x - _frame.WIDTH / 2) + "px";
            _dom.style.top = (_y - _frame.HEIGHT / 2) + "px";
            self.setRadius(_frame.RADIUS);
        }
    };

    init();
}

function Player(frame, x, y, type) {

    Unit.call(this, frame, x, y);

    var self = this;

    var _type = type;   // player type: ninja , super...
    var _weapon;        // player's weapon
    var _chargeSkill;
    var _skill;

    var _hp = 5;
    var _sp = 0;        // skill point
    var _money = 0;     // money
    var _speed = 5;     // unit speed
    var _gauge = 0;     // for charge skill
    var _pause;

    var _immuneTimer;          // timer to reduce counter
    var _immuneCounter;        // immune from collision

    var _chargeAnimationUnit = new Unit(CHARGING, x, y);  // charging animation
    var _chargeAnimationTimer;      // timeout
    var _interface;

    self.getType = function() {
        return _type;
    };

    self.setType = function(type) {
        _type = type;
    };

    self.getWeapon = function() {
        return _weapon;
    };

    self.setWeapon = function(weapon) {
        _weapon = weapon;

        if (_interface)
            _interface.setWeapon(_weapon);
    };

    self.getWeaponLevel = function() {
        return _weapon.getLevel();
    };

    self.setWeaponLevel = function(level) {
        _weapon.setLevel(level);

        if (_interface)
            _interface.setWeaponLevel(level);
    };

    self.getChargeSkill = function() {
        return _chargeSkill;
    };

    self.setChargeSkill = function(chargeSkill) {
        _chargeSkill = chargeSkill;
    };

    self.getChargeSkillLevel = function() {
        return _chargeSkill.getLevel();
    };

    self.setChargeSkillLevel = function(level) {
        _chargeSkill.setLevel(level);
    };

    self.getSkill = function() {
        return _skill;
    };

    self.setSkill = function(skill) {

        _skill = skill;

        if (_interface)
            _interface.setSkill(_skill);
    };

    self.getSkillLevel = function() {
        return _skill.getLevel();
    };

    self.setSkillLevel = function(level) {
        _skill.setLevel(level);
        if (_interface)
            _interface.setSkillLevel(level);
    };

    self.useWeapon = function() {

        _weapon.fire(self.getX(), 0);

        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.useWeapon();
        }
    };

    self.useChargeSkill = function() {
        _chargeSkill.fire();

        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.useChargeSkill();
        }
    };

    self.useSkill = function() {
        if (_sp == PLAYER.MAX_SP) {
            self.setSp(0);
            _skill.fire();
        }
    };

    self.getHp = function() {
        return _hp;
    };

    self.setHp = function(hp) {
        _hp = hp > PLAYER.MAX_HP ? PLAYER.MAX_HP : hp < 0 ? 0 : hp;
        if (_interface)
            _interface.setHp(_hp);
    };

    self.getSp = function() {
        return _sp;
    };

    self.setSp = function(sp) {
        _sp = sp > PLAYER.MAX_SP ? PLAYER.MAX_SP : sp < 0 ? 0 : sp;
        if (_interface)
            _interface.setSp(_sp);
    };

    self.getMoney = function() {
        return _money;
    };

    self.setMoney = function(money) {
        _money = money;
        if (_interface)
            _interface.setMoney(money);
    };

    self.getSpeed = function() {
        return _speed;
    };

    self.setSpeed = function(speed) {
        _speed = speed;
    };

    self.die = function() {
        if (self.isAlive()) {
            self.getDom().remove();
            self.setAlive(false);
        }
    };

    self.moveLeft = function() {
        _chargeAnimationUnit.setX(_chargeAnimationUnit.getX() - _speed);

        // check the player in the stage
        if (self.getX() - _speed < 0)
            self.setX(0);
        else
            self.setX(self.getX() - _speed);

        self.nextFrame();

        // when mirror image skill is running
        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.moveLeft(_speed);
        }
    };

    self.moveRight = function() {
        _chargeAnimationUnit.setX(_chargeAnimationUnit.getX() + _speed);

        if (self.getX() + _speed > STAGE_WIDTH)
            self.setX(STAGE_WIDTH);
        else
            self.setX(self.getX() + _speed);

        self.nextFrame();

        // when mirror image skill is running
        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.moveRight(_speed);
        }
    };

    self.moveUp = function() {

        _chargeAnimationUnit.setY(_chargeAnimationUnit.getY() - _speed);

        if (self.getY() - _speed < 0)
            self.setY(0);
        else
            self.setY(self.getY() - _speed);

        self.nextFrame();

        // when mirror image skill is running
        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.moveUp(_speed);
        }
    };

    self.moveDown = function() {
        _chargeAnimationUnit.setY(_chargeAnimationUnit.getY() + _speed);

        if (self.getY() + _speed > STAGE_HEIGHT)
            self.setY(STAGE_HEIGHT);
        else
            self.setY(self.getY() + _speed);

        self.nextFrame();


        // when mirror image skill is running
        if (_skill instanceof MirrorImage && _skill.isRunning()) {
            _skill.moveDown(_speed);
        }
    };

    // start charging
    self.startCharging = function() {
        _gauge = 0;              // reset the gauge
        _chargeAnimationUnit.setFrame(CHARGING);  // change frame frame
        _chargeAnimationUnit.appendDom();
        animateCharging();
    };

    // stop charging and return gauge
    self.stopCharging = function() {
        clearTimeout(_chargeAnimationTimer);
        _chargeAnimationUnit.removeDom();

        // check the gauge
        if (_gauge >= PLAYER.MAX_GAUGE)
            self.useChargeSkill();
    };

    self.pause = function() {

        _pause = true;
        _skill.pause();
        _chargeSkill.pause();
        clearTimeout(_chargeAnimationTimer);
        clearTimeout(_immuneCounter);
    };

    self.resume = function() {

        _pause = false;
        _skill.resume();
        _chargeSkill.resume();
        runImmuneTimer();
    };

    self.isImmune = function() {
        return _immuneCounter > 0;
    };

    // start or stop immune timer
    self.setImmune = function(isImmune) {

        _immuneCounter = PLAYER.IMMUNE_COUNT;
        // run immune timer
        if (isImmune)
            runImmuneTimer();
        // clear immune timer
        else {
            clearTimeout(_immuneTimer);
        }
    };

    // run timer to reduce count every delay while the counter > 0
    var runImmuneTimer = function() {
        _immuneTimer = setTimeout(function() {

            // reduce count
            _immuneCounter--;

            if (_immuneCounter > 0)
                runImmuneTimer();

        }, PLAYER.IMMUNE_TIMER_DELAY);
    };

    self.getInterface = function() {
        return _interface;
    };

    self.setInterface = function(iFace) {
        _interface = iFace;
    };

    // when charging, the gauge increases every 100ms
    var animateCharging = function() {

        if (_gauge++ == PLAYER.MAX_GAUGE)
            _chargeAnimationUnit.setFrame(CHARGED);

        _chargeAnimationUnit.nextFrame();
        _chargeAnimationTimer = setTimeout(function() {
            animateCharging();
        }, 100);
    };

    // make and append img source
    var init = function() {
        self.getDom().classList.add("player");
    };
    init();
}

Player.prototype = new Unit();
Player.prototype.constructor = Player;
