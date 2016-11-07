"use strict";

angular
    .module("app")
    .component("gameSuperMonkey", {
        templateUrl: "game-super-monkey.html",
        controllerAs: "ctrl",
        controller: SuperMonkeyController
    });

function SuperMonkeyController() {

    var ctrl = this;
    var _interface = new Interface();
    var _stage = new Stage(_interface);
    var _shop = new Shop(_interface);

    ctrl.pause = function() {
        _stage.pause();
        _interface.showMenu();
    };

    ctrl.resume = function() {
        _interface.hideMenu();
        _stage.resume();
    };


    var init = function() {

        stage = document.querySelector("#stage");
        stage.style.width = STAGE_WIDTH;
        stage.style.height = STAGE_HEIGHT;

        _shop.show();


        _interface.setBtnResumeEvent(function() {
            ctrl.resume();
        });

        _interface.setBtnExitEvent(function() {

            // show a dialog to confirm
            _interface.showDialog("Are you sure?", [{

                    label: "Yes",
                    event: function() {
                        console.log("Yes");
                    }
                }, {
                    label: "No",
                    event: function() {
                        console.log("No");
                    }
                }
            ]);
        });
    };

    init();
}