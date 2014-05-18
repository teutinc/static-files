"use strict";

(function () {

    /**
     * static-files module.
     */
    var staticFiles = angular.module('static-files', ['ngRoute']);

    /**
     * Routes configuration
     */
    staticFiles.config(function ($routeProvider) {
        $routeProvider.when('/error/404', {
            templateUrl: 'partials/404.html',
        });
        $routeProvider.when('/:file', {
            templateUrl: 'partials/static-file.html',
            controller: 'StaticFileCtrl'
        });
        $routeProvider.when('/:syntax/:file', {
            templateUrl: 'partials/static-file.html',
            controller: 'StaticFileCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/error/404'
        });
    });


    /**
     * The Main controller.
     */
    staticFiles.controller('MainCtrl', function ($scope) {
        $scope.title = 'Static files';

        $scope.setTitle = function(title) {
            $scope.title = title;
        }
    });

    /**
     * The StaticFile controller.
     */
    staticFiles.controller('StaticFileCtrl', function ($scope, $routeParams) {
        $scope.filename = $routeParams.file;
        $scope.syntax = $routeParams.syntax || 'not defined';

        $scope.setTitle($scope.filename);
    });

})();
