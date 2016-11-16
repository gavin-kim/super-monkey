"use strict";

function Shop(iFace) {

    var self = this;
    var _player = player;
    var _interface = iFace;    // interface object;
    var _container;
    var _characters;   // dom objects for character
    var _shopHeader;   // dom objects for shop header
    var _shopFooter;   // dom objects for shop footer
    var _shop;         // dom objects for shop
    var _itemListType; // current type of the item list
    var _currentStep = 0;  // 1: character, 2: item

    // set player's a new weapon and refresh upgrade information
    var setWeapon = function(weapon) {

        _player.setWeapon(weapon);
        _shop.weaponIcon.className = "";
        _shop.weaponIcon.classList.add(Interface.ICON_PREFIX + weapon.getName(), "icon-clickable");
        updateWeapon();
    };

    // set player's a new charge skill and refresh upgrade information
    var setChargeSkill = function(charge) {

        _player.setChargeSkill(charge);
        _shop.chargeIcon.className = "";
        _shop.chargeIcon.classList.add(Interface.ICON_PREFIX + charge.getName(), "icon-clickable");
        updateChargeSkill();
    };

    // set player's a new skill and refresh upgrade information
    var setSkill = function(skill) {

        console.log(skill);
        _player.setSkill(skill);
        _shop.skillIcon.className = "";
        _shop.skillIcon.classList.add(Interface.ICON_PREFIX + skill.getName(), "icon-clickable");
        updateSkill();
    };

    // upgrade player's weapon
    var upgradeWeapon = function() {

        if (_player.getWeaponLevel() < PLAYER.MAX_WEAPON_LV &&
            _player.getMoney() >= _shop.weaponCost.innerHTML) {

            _player.setMoney(_player.getMoney() - _shop.weaponCost.innerHTML);
            _shopFooter.playerMoney.innerHTML = _player.getMoney();

            _player.setWeaponLevel(_player.getWeaponLevel() + 1);
            updateWeapon();
        }
    };

    // upgrade player's charge skill
    var upgradeChargeSkill = function() {


        if (_player.getChargeSkillLevel() < PLAYER.MAX_SKILL_LV &&
            _player.getMoney() >= _shop.chargeCost.innerHTML) {

            _player.setMoney(_player.getMoney() - _shop.chargeCost.innerHTML);
            _shopFooter.playerMoney.innerHTML = _player.getMoney();

            _player.setChargeSkillLevel(_player.getChargeSkillLevel() + 1);
            updateChargeSkill();
        }
    };

    // upgrade player's skill
    var upgradeSkill = function() {

        if (_player.getSkillLevel() < PLAYER.MAX_SKILL_LV &&
            _player.getMoney() >= _shop.skillCost.innerHTML) {

            _player.setMoney(_player.getMoney() - _shop.skillCost.innerHTML);
            _shopFooter.playerMoney.innerHTML = _player.getMoney();

            _player.setSkillLevel(_player.getSkillLevel() + 1);
            updateSkill();
        }
    };

    var updateWeapon = function() {

        var weapon = _player.getWeapon();

        _shop.weaponCost.innerHTML =
            UPGRADE_COST[weapon.getName()][weapon.getLevel() + 1];
        _shop.weaponLevelBar.style.width =
            (weapon.getLevel() / PLAYER.MAX_WEAPON_LV * 100) + "%";
        _shop.weaponLevelValue.innerHTML =
            weapon.getLevel() + " / 4";
    };

    var updateChargeSkill = function() {

        var charge = _player.getChargeSkill();

        _shop.chargeCost.innerHTML =
            UPGRADE_COST[charge.getName()][charge.getLevel() + 1];
        _shop.chargeLevelBar.style.width =
            (charge.getLevel() / PLAYER.MAX_SKILL_LV * 100) + "%";
        _shop.chargeLevelValue.innerHTML =
            charge.getLevel() + " / 4";
    };

    var updateSkill = function() {

        var skill = _player.getSkill();

        _shop.skillCost.innerHTML =
            UPGRADE_COST[skill.getName()][skill.getLevel() + 1];
        _shop.skillLevelBar.style.width =
            (skill.getLevel() / PLAYER.MAX_SKILL_LV * 100) + "%";
        _shop.skillLevelValue.innerHTML =
            skill.getLevel() + " / 4";
    };

    // get refund
    var getRefund = function(item) {

        var refund = 0;

        for (var i = 1; i < item.getLevel() + 1; i++) {
            refund += UPGRADE_COST[item.getName()][i];
        }

        console.log(refund, item.getLevel());

        return refund;
    };

    // equip item
    var btnEquipEvent = function() {

        var selectedItem = _shop.itemList.querySelector(".item-selected");

        // check if a selected item exists
        if (selectedItem) {
            var name = selectedItem.querySelector(".shop-item-name").innerHTML;
            var cost = selectedItem.querySelector(".shop-item-cost").innerHTML;


            switch (_itemListType) {
                case "weapon":

                    var weapon = _player.getWeapon();

                    // update money
                    _player.setMoney(_player.getMoney() - cost + getRefund(weapon));

                    // switch weapon
                    setWeapon(WeaponFactory.getByName(_player, name));
                    createWeaponList();
                    break;
                case "chargeSkill":

                    var chargeSkill = _player.getChargeSkill();

                    // update money
                    _player.setMoney(_player.getMoney() - cost + getRefund(chargeSkill));

                    // switch weapon
                    setChargeSkill(WeaponFactory.getByName(_player, name));
                    createChargeSkillList();
                    break;
                case "skill":

                    var skill = _player.getSkill();

                    // update money
                    _player.setMoney(_player.getMoney() - cost + getRefund(skill));

                    // switch weapon
                    setSkill(WeaponFactory.getByName(_player, name));
                    createSkillList();
                    break;
            }
            // refresh item list
            _shopFooter.playerMoney.innerHTML = _player.getMoney();
            _shop.btnEquip.disabled = true;
        }
    };

    var createWeaponList = function() {

        _shop.itemList.innerHTML = "";
        _itemListType = "weapon";
        _shop.btnEquip.disabled = true;

        ITEM_LIST[_player.getType()]["weapon"].forEach(function(obj) {
            // find equipped items
            if (_player.getWeapon().getName() == obj.name ||
                _player.getMoney() < obj.cost)
                _shop.itemList.appendChild(createItem(obj, false));
            else
                _shop.itemList.appendChild(createItem(obj, true));
        });
    };

    var createChargeSkillList = function() {
        _shop.itemList.innerHTML = "";
        _itemListType = "chargeSkill";
        _shop.btnEquip.disabled = true;

        ITEM_LIST[_player.getType()]["chargeSkill"].forEach(function(obj) {
            // find equipped items
            if (_player.getChargeSkill().getName() == obj.name ||
                _player.getMoney() < obj.cost)
                _shop.itemList.appendChild(createItem(obj, false));
            else
                _shop.itemList.appendChild(createItem(obj, true));
        });
    };

    var createSkillList = function() {
        _shop.itemList.innerHTML = "";
        _itemListType = "skill";
        _shop.btnEquip.disabled = true;

        ITEM_LIST[_player.getType()]["skill"].forEach(function(obj) {
            // find equipped items
            if (_player.getSkill().getName() == obj.name ||
                _player.getMoney() < obj.cost)
                _shop.itemList.appendChild(createItem(obj, false));
            else
                _shop.itemList.appendChild(createItem(obj, true));
        });
    };

    // create a new item
    var createItem = function(obj, enabled) {

        var item = document.createElement("div");
        item.classList.add("shop-item");
        item.innerHTML =
            "<div class='shop-icon " + obj.icon + "'></div>" +
            "<div class='shop-item-name'>" + obj.name.toUpperCase() + "</div>" +
            "<div class='shop-item-cost'>" + obj.cost + "</div>";

        // item can be purchased
        if (enabled) {
            item.classList.add("item-enabled");

            // set click event
            item.onclick = function() {
                var oldSelection = _shop.itemList.querySelector(".item-selected");

                if (oldSelection)
                    oldSelection.classList.remove("item-selected");

                item.classList.add("item-selected");
                _shop.btnEquip.disabled = false;
            };

        } else {
            item.classList.add("item-disabled");
        }

        return item;
    };

    var createDefaultCharacter = function(type) {

        switch (type) {
            case PLAYER.TYPE.SUPER:
                _player = new Player(SUPER_MONKEY, STAGE_WIDTH / 2,
                    STAGE_HEIGHT / 4 * 3, PLAYER.TYPE.SUPER);
                _player.setChargeSkill(WeaponFactory.getLaser(_player));
                break;
            case PLAYER.TYPE.NINJA:
                _player = new Player(NINJA_MONKEY, STAGE_WIDTH / 2,
                    STAGE_HEIGHT / 4 * 3, PLAYER.TYPE.NINJA);
                _player.setChargeSkill(WeaponFactory.getTornado(_player));
                break;
        }

        _player.setInterface(_interface);
        _player.setWeapon(WeaponFactory.getBasic(_player));
        _player.setSkill(WeaponFactory.getBlast(_player));
        _player.setHp(PLAYER.DEFAULT_HP);
        _player.setSp(PLAYER.DEFAULT_SP);
        _player.setSpeed(PLAYER.DEFAULT_SPEED);
        _player.setMoney(PLAYER.DEFAULT_MONEY);

        _shopFooter.playerMoney.innerHTML = _player.getMoney(); // show player money

        _shop.itemList.innerHTML = "";   // reset item list
        _itemListType = null;

        setWeapon(_player.getWeapon());
        setChargeSkill(_player.getChargeSkill());
        setSkill(_player.getSkill());
    };

    // clear
    var clearSelectedCharacter = function() {
        document.querySelectorAll(".character").forEach(function(character) {
            character.classList.remove("character-selected");
        });
        _shopFooter.btnNext.disabled = true;
    };

    var onClickCharacter = function(ev) {

        clearSelectedCharacter();

        switch (ev.target.id) {
            case "character-super":
                _characters.super.classList.add("character-selected");
                createDefaultCharacter(PLAYER.TYPE.SUPER);
                break;
            case "character-ninja":
                _characters.ninja.classList.add("character-selected");
                createDefaultCharacter(PLAYER.TYPE.NINJA);
                break;
        }

        _shopFooter.btnNext.disabled = false; // enable next button
    };

    // go to the next step
    var next = function() {
        switch (_currentStep) {
            // choose a character
            case 0:
                _shopHeader.title.innerHTML = "Choose a character";
                _characters.container.style.display = "flex";
                _shop.container.style.display = "none";
                _shopFooter.playerMoney.style.display = "none";
                _currentStep++;
                break;
            // choose a weapon and skills
            case 1:
                _shopHeader.title.innerHTML = "Shop";
                _characters.container.style.display = "none";
                _shop.container.style.display = "flex";
                _shopFooter.playerMoney.style.display = "";
                _currentStep++;
                break;

            // finish
            case 2:
                _interface.showDialog("Do you want to start the game?", [{

                    label: "Yes",
                    event: function() {
                        _currentStep = 0;
                        self.hide();
                        player = _player; // set player object
                        player.appendDom();
                        _interface.showStatus();
                        _interface.showStartInfo();
                    }
                }, {
                    label: "No",
                    event: function() {}
                }]);

                break;
        }
    };

    // show the shop if a player is inserted, skip the first step
    self.show = function(player) {

        _container.style.display = "flex";
        _interface.hideStatus();
        clearSelectedCharacter();

        // check if a player exists
        if (_player = player) {
            setWeapon(_player.getWeapon());
            setChargeSkill(_player.getChargeSkill());
            setSkill(_player.getSkill());

            _currentStep = 1;
            next();
        } else {

            _currentStep = 0;
            next();
        }
    };

    self.hide = function() {
        _container.style.display = "none";
    };

    var init = function() {

        _container = document.querySelector("#shop");

        _characters = {
            container: document.querySelector("#character-container"),
            "super": document.querySelector("#character-super"),
            "ninja": document.querySelector("#character-ninja")
        };

        _shop = {
            container: document.querySelector("#shop-container"),
            weaponIcon: document.querySelector("#upgrade-weapon-icon"),
            weaponCost: document.querySelector("#upgrade-weapon-cost"),
            weaponLevelValue: document.querySelector("#upgrade-weapon-level-value"),
            weaponLevelBar: document.querySelector("#upgrade-weapon-level-bar"),
            weaponBtnLevelUp: document.querySelector("#upgrade-weapon-level-up"),
            chargeIcon: document.querySelector("#upgrade-charge-icon"),
            chargeCost: document.querySelector("#upgrade-charge-cost"),
            chargeLevelValue: document.querySelector("#upgrade-charge-level-value"),
            chargeLevelBar: document.querySelector("#upgrade-charge-level-bar"),
            chargeBtnLevelUp: document.querySelector("#upgrade-charge-level-up"),
            skillIcon: document.querySelector("#upgrade-skill-icon"),
            skillCost: document.querySelector("#upgrade-skill-cost"),
            skillLevelValue: document.querySelector("#upgrade-skill-level-value"),
            skillLevelBar: document.querySelector("#upgrade-skill-level-bar"),
            skillBtnLevelUp: document.querySelector("#upgrade-skill-level-up"),
            itemList: document.querySelector("#shop-item-list"),
            btnEquip: document.querySelector("#shop-btn-equip")
        };

        _shopHeader = {
            container: document.querySelector("#shop-header"),
            icon: document.querySelector("#shop-header-icon"),
            title: document.querySelector("#shop-header-title")
        };

        _shopFooter = {
            container: document.querySelector("#shop-footer"),
            btnNext: document.querySelector("#shop-btn-next"),
            playerMoney: document.querySelector("#shop-player-money")
        };

        // create a default character
        _characters.super.onclick = onClickCharacter;
        _characters.ninja.onclick = onClickCharacter;

        _shop.weaponIcon.onclick = createWeaponList;
        _shop.chargeIcon.onclick = createChargeSkillList;
        _shop.skillIcon.onclick = createSkillList;

        _shop.weaponBtnLevelUp.onclick = upgradeWeapon;
        _shop.chargeBtnLevelUp.onclick = upgradeChargeSkill;
        _shop.skillBtnLevelUp.onclick = upgradeSkill;

        _shop.btnEquip.onclick = btnEquipEvent;
        _shopFooter.btnNext.onclick = next;

        _interface.setShop(self);
    };

    init();
}