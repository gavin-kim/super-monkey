"use strict";

//TODO: collision animation
//TODO: item
//TODO: player immune time

var STAGE_WIDTH = 800;
var STAGE_HEIGHT = 600;

var PLAYER = {
    TYPE: {
        NINJA: "ninja",
        SUPER: "super"
    },
    MAX_HP:10,
    MAX_SP: 100,
    MAX_WEAPON_LV: 4,
    MAX_SKILL_LV: 4,
    MAX_GAUGE: 25,         // charge skill 2500 ms
    DEFAULT_HP: 5,
    DEFAULT_SP: 0,
    DEFAULT_WEAPON_LV: 1,
    DEFAULT_SKILL_LV: 1,
    DEFAULT_MONEY: 100,
    DEFAULT_SPEED: 5

};
var DURATION = {
    MIRROR_IMAGE: 15000     // for mirror image skill
};

var DELAY = {
    SPAWN_ENEMY: 2000,      // to spawn a new enemy
    CHECK_DEAD_UNIT: 5000,       // to check dead units
    CHECK_MOVE_KEY: 60,     // to check move keys
    CHECK_ACTION_KEY: 100,  // to check action keys
    CHECK_COLLISION: 60,    // to check collision
    IMMUNE: 500,      // not able to hit the player for the delay
    ENEMY_MOVE: 60,         // enemy move delay
    ENEMY_FIRE: 2000,       // enemy attack delay
    MISSILE: 60,            // missile move delay
    MIRROR_IMAGE: 30000     // skill delay
};

var UPGRADE_COST = {
    "basic": {
        1: 100,
        2: 500,
        3: 1000,
        4: 3000,
        5: 0
    },
    "bomb": {
        1: 200,
        2: 600,
        3: 1500,
        4: 4500,
        5: 0
    },
    "launcher": {
        1: 300,
        2: 900,
        3: 3000,
        4: 9000,
        5: 0
    },
    // charge skills
    "laser": {
        1: 100,
        2: 500,
        3: 1000,
        4: 5000,
        5: 0
    },
    "tornado": {
        1: 100,
        2: 500,
        3: 1000,
        4: 5000,
        5: 0
    },
    // skills
    "blast": {
        1: 100,
        2: 500,
        3: 1000,
        4: 5000,
        5: 0
    },
    "mirror-image": {
        1: 100,
        2: 500,
        3: 1000,
        4: 5000,
        5: 0
    },
    "energy-ball": {
        1: 100,
        2: 500,
        3: 1000,
        4: 5000,
        5: 0
    }
};

var ITEM_LIST = {
    "ninja": {
        weapon: [{
            icon: "icon-basic",
            name: "basic",
            cost: UPGRADE_COST["basic"][1]
        }, {
            icon: "icon-bomb",
            name: "bomb",
            cost: UPGRADE_COST["bomb"][1]
        }, {
            icon: "icon-launcher",
            name: "launcher",
            cost: UPGRADE_COST["launcher"][1]
        }],
        chargeSkill: [{
            icon: "icon-tornado",
            name: "tornado",
            cost: UPGRADE_COST["tornado"][1]
        }],
        skill: [{
            icon: "icon-blast",
            name: "blast",
            cost: UPGRADE_COST["blast"][1]
        }, {
            icon: "icon-mirror-image",
            name: "mirror-image",
            cost: UPGRADE_COST["mirror-image"][1]
        }]
    },
    "super": {
        weapon: [{
            icon: "icon-basic",
            name: "basic",
            cost: UPGRADE_COST["basic"][1]
        }, {

            icon: "icon-bomb",
            name: "bomb",
            cost: UPGRADE_COST["bomb"][1]
        }, {
            icon: "icon-launcher",
            name: "launcher",
            cost: UPGRADE_COST["launcher"][1]
        }],
        chargeSkill: [{
            icon: "icon-laser",
            name: "laser",
            cost: UPGRADE_COST["laser"][1]
        }],
        skill: [{
            icon: "icon-blast",
            name: "blast",
            cost: UPGRADE_COST["blast"][1]
        }, {
            icon: "icon-energy-ball",
            name: "energy-ball",
            cost: UPGRADE_COST["energy-ball"][1]
        }]
    }
};


var stage;
var player;
var enemies = [];
var eMissiles = [];   // enemy's missiles   (removed when collision)
var pMissiles = [];   // player's missiles  (removed when collision)
var pExplosions = []; // player's explosion (removed when timeout)
var enemyIndex = 0;

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}

