"use strict";

//TODO: key info when a user starts

angular
    .module("app")
    .component("gameSuperMonkey", {
        templateUrl: "game/super-monkey/game-super-monkey.html",
        controllerAs: "ctrl",
        controller: SuperMonkeyController
    });

function SuperMonkeyController() {

    var ctrl = this;
    var _interface = new Interface();
    var _stage = new Stage(_interface);
    var _shop = new Shop(_interface);

    var init = function() {

        stage = document.querySelector("#stage");
        stage.style.width = STAGE_WIDTH;
        stage.style.height = STAGE_HEIGHT;

        _interface.setBtnResumeEvent(function() {
            _interface.hideMenu();
            _stage.resume();
        });

        _interface.setBtnExitEvent(function() {

            // show a dialog to confirm
            _interface.showDialog("Are you sure?", [{
                    label: "Yes",
                    event: function() {
                        _interface.hideMenu();
                        _stage.clear();
                        _shop.show();
                    }
                }, {
                    label: "No",
                    event: function() {}
                }
            ]);
        });

        _shop.show();
    };

    init();
}