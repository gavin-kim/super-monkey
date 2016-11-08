"use strict";

function Stage(iFace) {

    var self = this;
    var keyOn = [];
    var _charge;
    var types = ["normal", "patrol", "rush", "hold"];
    var enemyFactory = new EnemyFactory();
    var _interface = iFace;
    var _pause = false;
    var _timers = {};

    self.pause = function() {

        // pause all running enemy
        for (var i = 0; i < enemyIndex; i++) {
            enemies[i].pause();
        }

        // pause all missile from player
        pMissiles.forEach(function(missile) {
            missile.pause();
        });

        // pause all explosion from player
        pExplosions.forEach(function(explosion) {
           explosion.pause();
        });

        // pause all missile from enemy
        eMissiles.forEach(function(missile) {
            missile.pause();
        });

        player.getChargeSkill().pause();
        player.getSkill().pause();

        clearTimers();
        _pause = true;
    };

    self.resume = function() {

        // resume all running enemy
        for (var i = 0; i < enemyIndex; i++) {
            enemies[i].resume();
        }

        // resume all missile from player
        pMissiles.forEach(function(missile) {
            missile.resume();
        });

        // resume all explosion from player
        pExplosions.forEach(function(explosion) {
            explosion.resume();
        });

        // resume all missile from enemy
        eMissiles.forEach(function(missile) {
            missile.resume();
        });

        // resume player's skill and _charge skill
        player.getChargeSkill().resume();
        player.getSkill().resume();

        startTimers();
        _pause = false;
    };

    self.isPaused = function() {
        return _pause;
    };

    self.start = function() {
        setKeyEvents();
        startTimers();

        _charge = 0;
        enemies = [];
        eMissiles = [];
        pMissiles = [];
        pExplosions = [];
        initEnemies(500);
    };

    self.clear = function() {
        if (_pause) {
            removeKeyEvents();
        } else {
            self.pause();
            removeKeyEvents();
        }
    };

    self.getInterface = function() {
        return _interface;
    };

    self.setInterface = function(iFace) {
        _interface = iFace;
    };

    // interval invoke the function consistently to move smoothly
    var setKeyEvents = function() {

        // when key down event appears, set variable = true;
        document.onkeydown = function(ev)
        {
            var keyCode = (window.event) ? event.keyCode : ev.keyCode;
            keyOn[keyCode] = true;

            switch (ev.keyCode) {
                // esc key
                case 27:
                    if (_pause) {
                        self.resume();
                        _interface.hideMenu();
                    } else {
                        self.pause();
                        _interface.showMenu();
                    }
                    break;
            }

        };

        // when key up event appears, set variable = false;
        document.onkeyup = function(ev)
        {
            var keyCode = (window.event) ? event.keyCode : ev.keyCode;
            keyOn[keyCode] = false;

            // use gauge attack and reset
            switch (keyCode) {
                case 74:
                    if (_charge > 1)
                        player.stopCharging();
                    _charge = 0;
                    break;
            }
        };
    };

    var startTimers = function() {
        spawnEnemy();
        checkMoveKey();
        checkActionKey();
        checkCollision();
    };


    var clearTimers = function() {
        clearTimeout(_timers.spawnEnemy);
        clearTimeout(_timers.checkMoveKey);
        clearTimeout(_timers.checkActionKey);
        clearTimeout(_timers.checkCollision);
    };

    var removeKeyEvents = function() {
        document.onkeydown = null;
        document.onkeyup = null;
    };

    var spawnEnemy = function() {

        if (enemyIndex < 500) {

            _timers.spawnEnemy = setTimeout(function () {

                enemies[enemyIndex++].init();
                spawnEnemy();

            }, DELAY.SPAWN_ENEMY);
        }
    };

    var checkDeadUnit= function() {

        _timers.checkDeadUnit = setTimeout(function () {


            // splice remove item and join 2 parts,
            // delete arr[i] remains undefined value in the array
            for (var i = 0; i < pMissiles.length; i++) {
                if (!pMissiles[i].isAlive())
                    pMissiles.splice(i, 1);
            }
            for (i = 0; i < eMissiles.length; i++) {
                if (!eMissiles[i].isAlive())
                    eMissiles.splice(i, 1);
            }

            checkDeadUnit();

        }, DELAY.CHECK_DEAD_UNIT);
    };

    var checkMoveKey = function() {

        _timers.checkMoveKey = setTimeout(function () {

            // a: 65
            if (keyOn[65])
                player.moveLeft();
            // w: 87
            if (keyOn[87])
                player.moveUp();
            // d: 68
            if (keyOn[68])
                player.moveRight();
            // s: 83
            if (keyOn[83])
                player.moveDown();

            checkMoveKey();

        }, DELAY.CHECK_MOVE_KEY);
    };

    var checkActionKey = function() {

        _timers.checkActionKey = setTimeout(function() {

            // key j
            if (keyOn[74]) {
                if (_charge == 0)
                    player.useWeapon();
                else if (_charge == 1) {
                    player.startCharging();
                }
                _charge++;
            }
            // key k
            if (keyOn[75]) {
                player.useSkill();
            }

            checkActionKey();

        }, DELAY.CHECK_ACTION_KEY);
    };

    var checkCollision = function() {

        _timers.checkCollision = setTimeout(function() {

            // missiles from player
            pMissiles.forEach(function(pm) {
                for (var i = 0; i < enemyIndex; i++) {
                    if (enemies[i].isAlive() && pm.isCollision(enemies[i])) {

                        pm.die(); // kill missile
                        enemies[i].setHp(enemies[i].getHp() - pm.getPower());

                        if (enemies[i].getHp() < 1) {
                            enemies[i].die();
                            player.setSp(player.getSp() + enemies[i].getSp());
                            player.setMoney(player.getMoney() + enemies[i].getMoney());
                        }
                    }
                }
            });

            // explosion from player (explosion damage only one time)
            pExplosions.forEach(function(ex) {
                for (var i = 0; i < enemyIndex; i++) {
                    if (!ex.isChecked(i) && enemies[i].isAlive() &&
                        ex.isCollision(enemies[i])) {

                        enemies[i].setHp(enemies[i].getHp() - ex.getPower());
                        ex.setChecked(i); // check enemy is damaged

                        if (enemies[i].getHp() < 1) {
                            enemies[i].die();
                            player.setSp(player.getSp() + enemies[i].getSp());
                            player.setMoney(player.getMoney() + enemies[i].getMoney());
                        }
                    }
                }
            });

            // enemy's missiles vs player
            eMissiles.forEach(function(em) {

                // check player is immune, missile is alive and collision
                if (!player.isImmune() && em.isAlive() && em.isCollision(player)) {

                    em.die();

                    player.setHp(player.getHp() - em.getPower());
                    player.setImmune(true); // set immune for a while

                    if (player.isAlive() && player.getHp() < 1) {
                        player.die();
                        self.pause();
                        gameover();
                    }
                }
            });


            // player vs enemies
            for (var i = 0; i < enemyIndex; i++) {

                if (enemies[i].isAlive() && enemies[i].isCollision(player)) {

                    player.setHp(player.getHp() - 2);

                    if (player.isAlive() && player.getHp() < 1) {
                        player.die();
                        self.pause();
                        gameover();
                    }

                }
            }

            removeDeadUnit();
            checkCollision(); // loop

        }, DELAY.CHECK_COLLISION);
    };

    var gameover = function() {

        _interface.showDialog("Game Over", [{

            label: "OK",
            event: function() {
                reset();
                _interface.getShop().show();
            }
        }]);
    };

    var reset = function() {
        enemies.forEach(function(enemy) {
            enemy.die();
        });
        pMissiles.forEach(function(pm) {
            pm.die();
        });
        eMissiles.forEach(function(em) {
            em.die();
        });
        pExplosions.forEach(function(pe) {
            pe.die();
        });
    };


    var removeDeadUnit= function() {

        // splice remove item and join 2 parts,
        // delete arr[i] remains undefined value in the array
        for (var i = 0; i < pMissiles.length; i++) {
            if (!pMissiles[i].isAlive())
                pMissiles.splice(i, 1);
        }
        for (i = 0; i < eMissiles.length; i++) {
            if (!eMissiles[i].isAlive())
                eMissiles.splice(i, 1);
        }
        for (i = 0; i < pExplosions.length; i++) {
            if (!pExplosions[i].isAlive())
                pExplosions.splice(i, 1);
        }
    };

    var initEnemies = function(num) {
        enemies = [];
        for (var i = 0; i < num; i++) {
            enemies.push(enemyFactory.createEnemy(types[Math.floor(Math.random() * 4)]));
        }
    };

    var init = function() {

        _interface.setStage(self);
    };

    init();
}

