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
        $routeProvider.when('/:filePath*', {
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
        $scope.filePath = $routeParams.filePath;

        $scope.setTitle($scope.filePath);
    });

    /**
     * Service to load static files.
     */
    staticFiles.provider('staticFileProxy', {
        $get: function ($http, $location) {
            var provider = this;
            return {
                load: function (filePath) {
                    return $http.get(provider.baseURL + filePath).catch(function () {
                        $location.url('error/404');
                    });
                }
            };
        },
        baseURL: 'static/'
    });

    /**
     * Directive to manage the ace editor, and load the file content, using the staticFileProxy service.
     */
    staticFiles.directive('aceEditor', function factory(staticFileProxy) {
        return {
            restrict: 'AE',
            scope: {
                filePath: '='
            },
            link: function postLink(scope, element) {
                element.addClass('static-editor');

                // create an ace editor, in read only mode, to display the file content
                var editor = window.ace.edit(element[0]);
                editor.setTheme("ace/theme/monokai");
                editor.setReadOnly(true);
                editor.setShowPrintMargin(false);
                // get the module to manage modes by files extensions
                var modelist = window.ace.require("ace/ext/modelist");

                // load the file (asynchronously)
                staticFileProxy.load(scope.filePath).then(function (response) {
                    var mode = modelist.getModeForPath(scope.filePath).mode;
                    editor.setValue(response.data);
                    editor.clearSelection(); // avoid text set as value, to be fully selected
                    editor.getSession().setMode(mode);
                });
            }
        };
    });

})();
