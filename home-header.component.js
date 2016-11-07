"use strict";

angular
    .module("app")
    .component("homeHeader", {

        templateUrl: "home-header.html",
        controllerAs: "ctrl",
        controller: ["$scope", "$location",
            HomeHeaderController
        ]
    });

function HomeHeaderController($scope, $location) {

    var ctrl = this;
    var breadcrumb = document.querySelector(".breadcrumb");

    var updateBreadcrumb = function() {

        var breadcrumb = $("#breadcrumb")
            .html("<i class='glyphicon glyphicon-map-marker'></i> ")
            .append(" <a href='#/'>Home</a> ");

        var path = "";
        var lastToken;

        angular.forEach($location.path().split("/"), function(token) {

            if (token) {
                path += "/" + token;
                breadcrumb.append(
                    "/ <a href='" + path + "'>" + token + "</a> ");
                lastToken = token;
            }
        });
    };

    var init = function() {
        updateBreadcrumb();
    };

    init();
}