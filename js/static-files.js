"use strict";

(function () {

    /**
     * static-files module.
     */
    var staticFiles = angular.module('static-files', ['ngRoute']);

    /**
     * Routes configuration
     */
    staticFiles.config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.when('/404', {
            templateUrl: 'partials/404.html',
            controller: '404Ctrl'
        });
        $routeProvider.when('/404/:filePath*', {
            templateUrl: 'partials/404.html',
            controller: '404Ctrl'
        });
        $routeProvider.when('/:filePath*', {
            templateUrl: 'partials/static-file.html',
            controller: 'StaticFileCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/404'
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
     * The StaticFile controller.
     */
    staticFiles.controller('404Ctrl', function ($scope, $routeParams) {
        $scope.filePath = $routeParams.filePath || 'everything';

        $scope.setTitle('404');
    });

    /**
     * Service to load static files.
     */
    staticFiles.provider('staticFileProxy', {
        $get: function ($http, $location) {
            var provider = this;
            return {
                load: function (filePath) {
                    return $http.get(provider.baseURL + filePath).then(
                        function (response) {
                            return response.data;
                        }, function (response) {
                            $location.url('/404/' + filePath);
                            return $q.reject(response.status);
                        });
                }
            };
        },
        baseURL: '/static/'
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
                staticFileProxy.load(scope.filePath).then(function (data) {
                    var mode = modelist.getModeForPath(scope.filePath).mode;
                    editor.setValue(data);
                    editor.clearSelection(); // avoid text set as value, to be fully selected
                    editor.navigateFileStart(); // put the cursor at the beginning instead of the end.
                    editor.getSession().setMode(mode);
                });
            }
        };
    });

})();
