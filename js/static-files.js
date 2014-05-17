"use strict";

(function () {

    /**
     * static-files module.
     */
    var staticFiles = angular.module('static-files', []);

    /**
     * The Main controller.
     */
    staticFiles.controller('MainCtrl', function ($scope) {
        $scope.title = 'Static files';
    });
})();
