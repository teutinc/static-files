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

    /**
     * Service to load static files.
     */
    staticFiles.provider('staticFileProxy', {
        $get: function ($http, $location) {
            var provider = this;
            return {
                load: function (filename) {
                    return $http.get(provider.baseURL + filename).catch(function () {
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
                filename: '=',
                syntax: '='
            },
            link: function postLink(scope, element) {
                element.addClass('static-editor');

                // create an ace editor, in read only mode, to display the file content
                var editor = window.ace.edit(element[0]);
                editor.setTheme("ace/theme/monokai");
                editor.setReadOnly(true);
                editor.setShowPrintMargin(false);
                if (scope.syntax) {
                    editor.getSession().setMode("ace/mode/" + scope.syntax);
                }

                // load the file (asynchronously)
                staticFileProxy.load(scope.filename).then(function (response) {
                    editor.setValue(response.data);
                    editor.clearSelection(); // avoid text set as value, to be fully selected
                });
            }
        };
    });

})();
