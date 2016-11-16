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

    // in case forEach not supported: forEach(function(obj, index, arr){} )
    var checkForEach = function() {

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function(fn, scope) {
                for(var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            }
        }

        if (!NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function(fn, scope) {
                for(var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            }
        }
    };

    var init = function() {

        checkForEach();

        stage = document.querySelector("#stage");
        stage.style.width = STAGE_WIDTH;
        stage.style.height = STAGE_HEIGHT;

        // button start event
        _interface.setBtnStartEvent(function() {
            _interface.hideStartInfo();
            _stage.start();
        });

        // button resume event
        _interface.setBtnResumeEvent(function() {
            _interface.hideMenu();
            _stage.resume();
        });

        // button exit event
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