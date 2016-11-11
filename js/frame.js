var NINJA_MONKEY = {
    CLASS: "ninja-monkey",
    WIDTH: 32,
    HEIGHT: 32,
    RADIUS: 16,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var SUPER_MONKEY = {
    CLASS: "super-monkey",
    WIDTH: 32,
    HEIGHT: 32,
    RADIUS: 16,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var DUMMY = {
    CLASS: "dummy",
    WIDTH: 1,
    HEIGHT: 1,
    RADIUS: 1,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var CHARGING = {
    CLASS: "charging",
    WIDTH: 64,
    HEIGHT: 64,
    RADIUS: 32,
    COLUMN: 5,
    ROW: 3,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var CHARGED = {
    CLASS: "charged",
    WIDTH: 64,
    HEIGHT: 64,
    RADIUS: 32,
    COLUMN: 5,
    ROW: 4,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var BASIC_S = {
    CLASS: "basic-s",
    WIDTH: 24,
    HEIGHT: 24,
    RADIUS: 12,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var BASIC_N = {
    CLASS: "basic-n",
    WIDTH: 24,
    HEIGHT: 24,
    RADIUS: 12,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var BOMB_MISSILE_S = {
    CLASS: "bomb-missile-s",
    WIDTH: 32,
    HEIGHT: 32,
    RADIUS: 16,
    COLUMN: 4,
    ROW: 2,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

// for super monkey
var BOMB_EXPLOSION_S = {
    CLASS: "bomb-explosion-s",
    WIDTH: 192,
    HEIGHT: 192,
    RADIUS: 40,
    COLUMN: 5,
    ROW: 2,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var BOMB_MISSILE_N = {
    CLASS: "bomb-missile-n",
    WIDTH: 32,
    HEIGHT: 32,
    RADIUS: 16,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var BOMB_EXPLOSION_N = {
    CLASS: "bomb-explosion-n",
    WIDTH: 192,
    HEIGHT: 192,
    RADIUS: 40,
    COLUMN: 5,
    ROW: 4,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var LAUNCHER_MISSILE_S = {
    CLASS: "launcher-missile-s",
    WIDTH: 40,
    HEIGHT: 40,
    RADIUS: 20,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var LAUNCHER_SHOT_S = {
    CLASS: "launcher-shot-s",
    WIDTH: 192,
    HEIGHT: 192,
    RADIUS: 15,
    COLUMN: 3,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var LAUNCHER_MISSILE_N = {
    CLASS: "launcher-missile-n",
    WIDTH: 40,
    HEIGHT: 40,
    RADIUS: 20,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var LAUNCHER_SHOT_N = {
    CLASS: "launcher-shot-n",
    WIDTH: 64,
    HEIGHT: 64,
    RADIUS: 15,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

// Super's charge skill
var LASER = {
    CLASS: "laser",
    WIDTH: 112,
    HEIGHT: 500,
    RADIUS: 56,
    COLUMN: 1,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

// Ninja's charge skill
var TORNADO = {
    CLASS: "tornado",
    WIDTH: 64,
    HEIGHT: 64,
    RADIUS: 32,
    COLUMN: 5,
    ROW: 4,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var MIRROR_IMAGE_SMOKE = {
    CLASS: "mirror-image-smoke",
    WIDTH: 64,
    HEIGHT: 64,
    RADIUS: 32,
    COLUMN: 10,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

// Super's Dragon skill
var BLAST_S = {
    CLASS: "blast-s",
    WIDTH: 192,
    HEIGHT: 192,
    RADIUS: 80,
    COLUMN: 5,
    ROW: 6,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

// Super's Dragon skill
var BLAST_N = {
    CLASS: "blast-n",
    WIDTH: 192,
    HEIGHT: 192,
    RADIUS: 80,
    COLUMN: 5,
    ROW: 3,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var SLIME_BLUE = {
    CLASS: "slime-blue",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 48 / 2,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 0,
    START_HEIGHT: 0
};

var SLIME_RED = {
    CLASS: "slime-red",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 3,
    START_HEIGHT: 0
};

var SLIME_GREEN = {
    CLASS: "slime-green",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 6,
    START_HEIGHT: 0
};

var SLIME_YELLOW = {
    CLASS: "slime-yellow",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 9,
    START_HEIGHT: 0
};

var SLIME_BLACK = {
    CLASS: "slime-black",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 0,
    START_HEIGHT: 48 * 4
};

var SLIME_PINK = {
    CLASS: "slime-pink",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 3,
    START_HEIGHT: 48 * 4
};

var SLIME_PURPLE = {
    CLASS: "slime-blue",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 48 / 2,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 6,
    START_HEIGHT: 48 * 4
};

var SLIME_ORANGE = {
    CLASS: "slime-blue",
    WIDTH: 48,
    HEIGHT: 48,
    RADIUS: 24,
    COLUMN: 3,
    ROW: 4,
    START_WIDTH: 48 * 9,
    START_HEIGHT: 48 * 4
};

var ENEMY_MISSILE = {
    CLASS: "enemy-missile",
    WIDTH: 32,
    HEIGHT: 32,
    RADIUS: 10,
    COLUMN: 6,
    ROW: 2,
    START_WIDTH: 0,
    START_HEIGHT: 32 * 4
};

var LOADING = {
    CLASS: "loading",
    WIDTH: 128,
    HEIGHT: 128,
    RADIUS: 64,
    COLUMN: 8,
    ROW: 1,
    START_WIDTH: 0,
    START_HEIGHT: 0
};