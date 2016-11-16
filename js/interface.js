"use strict";
/**
 * Controller for the interface.
 * HP bar, SP bar, weapon, skill and money
 *
 */
function Interface() {

    var self = this;

    var _loadingFrame = new Unit(LOADING, STAGE_WIDTH / 2, STAGE_HEIGHT / 2);
    var _loadingTimer; // loading animation interval
    var _status;       // status DOMs
    var _menu;         // menu DOMs
    var _startInfo;    // start information DOMs
    var _dialog;       // dialog DOMs
    var _dialogBtnContainer;
    var _fog;
    var _weaponIconClass;
    var _skillIconClass;

    var _stage;
    var _shop;

    self.getStage = function() {
        return _stage;
    };

    self.setStage = function(stage) {
        _stage = stage;
    };

    self.getShop = function() {
        return _shop;
    };

    self.setShop = function(shop) {
        _shop = shop;
    };

    // show loading animation
    self.startLoadingAnimation = function() {
        _loadingFrame.appendDom();
        loadingAnimation();
    };

    // remove loading animation
    self.stopLoadingAnimation = function() {
        _loadingFrame.removeDom();
        clearTimeout(_loadingTimer);
    };

    // loading animation timer
    var loadingAnimation = function() {
        _loadingFrame.nextFrame();
        _loadingTimer = setTimeout(function () {
            loadingAnimation();
        }, 60);
    };

    // ##### add _menu and _fog dom objects
    self.showMenu = function() {

        _fog.style.display = "block";
        _menu.style.display = "flex";
    };

    // ##### remove _menu and _fog dom objects
    self.hideMenu = function() {
        _menu.style.display = "none";
        _fog.style.display = "none";
    };

    self.showStartInfo = function() {
        _fog.style.display = "block";
        _startInfo.style.display = "flex";
    };

    self.hideStartInfo = function() {
        _fog.style.display = "none";
        _startInfo.style.display = "none";
    };

    self.showStatus = function() {

        _status.container.style.display = "flex";
    };

    self.hideStatus = function() {

        _status.container.style.display = "none";
    };

    /**
     * @param message A dialog message
     * @param arr array of button objects
     *
     * Button object {
     *
     *     label: button label,
     *     event: when the button is clicked
     * }
     */
    self.showDialog = function(message, arr) {

        document.querySelector("#dialog-message").innerHTML = message;

        _dialogBtnContainer.innerHTML = ""; // reset buttons

        arr.forEach(function(obj) {
            var btn = document.createElement("button");
            btn.classList.add("dialog-btn");
            btn.innerHTML = obj.label;
            btn.onclick = function() {
                _dialog.style.display = "none";
                obj.event();
            };

            _dialogBtnContainer.appendChild(btn);
        });

        _dialog.style.display = "flex"; // show dialog
    };

    self.setHp = function(hp) {
        _status.hpValue.innerHTML = hp + " / " + PLAYER.MAX_HP;
        _status.hpBar.style.width = (hp / PLAYER.MAX_HP * 100) + "%";
    };

    self.setSp = function(sp) {
        _status.spValue.innerHTML = sp + " / " + PLAYER.MAX_SP;
        _status.spBar.style.width = (sp / PLAYER.MAX_SP * 100) + "%";
    };

    self.setWeapon = function(weapon) {
        _status.weaponIcon.classList.remove(_weaponIconClass);
        _status.weaponIcon.classList.add(_weaponIconClass = Interface.ICON_PREFIX + weapon.getName());
        self.setWeaponLevel(weapon.getLevel());
    };

    self.setWeaponLevel = function(level) {
        _status.weaponLevelBar.style.width = (level / PLAYER.MAX_WEAPON_LV * 100) + "%";
        _status.weaponLevelValue.innerHTML = level + " / 4";
    };

    self.setSkill = function(skill) {
        _status.skillIcon.classList.remove(_skillIconClass);
        _status.skillIcon.classList.add(_skillIconClass = Interface.ICON_PREFIX + skill.getName());
        self.setSkillLevel(skill.getLevel());
    };

    self.setSkillLevel = function(level) {
        _status.skillLevelBar.style.width = (level / PLAYER.MAX_SKILL_LV * 100) + "%";
        _status.skillLevelValue.innerHTML = level + " / 4";
    };

    self.setMoney = function(money) {
        _status.money.innerHTML = money;
    };

    self.setBtnStartEvent = function(event) {
        document.querySelector("#btn-start").onclick = event;
    };

    self.setBtnResumeEvent = function(event) {
        document.querySelector("#btn-resume").onclick =  event;
    };

    self.setBtnExitEvent = function(event) {
        document.querySelector("#btn-exit").onclick =  event;
    };

    var init = function() {
        _status = {
            container: document.querySelector("#status"),
            hpBar: document.querySelector(".status-hp-bar"),
            hpValue: document.querySelector(".status-hp-value"),
            spBar: document.querySelector(".status-sp-bar"),
            spValue: document.querySelector(".status-sp-value"),
            weaponIcon: document.querySelector("#status-weapon-icon"),
            weaponLevelValue: document.querySelector(".status-weapon-value"),
            weaponLevelBar: document.querySelector(".status-weapon-level-bar"),
            skillIcon: document.querySelector("#status-skill-icon"),
            skillLevelValue: document.querySelector(".status-skill-value"),
            skillLevelBar: document.querySelector(".status-skill-level-bar"),
            money: document.querySelector(".status-money-value")
        };

        _dialog = document.querySelector("#dialog");
        _dialogBtnContainer = document.querySelector("#dialog-btn-container");
        _menu = document.querySelector("#menu");
        _startInfo = document.querySelector("#start-info");
        _fog = document.querySelector("#fog");


        _dialog.style.display = "none";
        _menu.style.display = "none";
        _startInfo.style.display = "none";
        _fog.style.display = "none";

    };
    init();
}

Interface.ICON_PREFIX = "icon-";
