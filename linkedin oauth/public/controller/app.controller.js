"use strict";

angular.module("app.controller", []).controller("AppController", [
    "$scope",
    "$location",
    "AppService",
    function($scope, $location, AppService) {
        $scope.initialize = function() {
            var url = $location.url();

            if(url === "/login"){

                $scope.getOAuthUrl();
            }else if (url === "/home"){
                $scope.getUser();
            }
        };


        // get authorization url from server
        $scope.getOAuthUrl = function() {
            AppService.getOAuthUrl().then(
                (data) => {
                    $scope.authUrl = data.url;
                },
                (err) => {
                    console.error(err);
                }
            );
        };

        $scope.getUser = function() {
            AppService.getUser().then(
                (data) => {
                    console.log(data);
                },
                (err) => {
                    console.error(err);
                }
            );
        };

        $scope.initialize();
    }
]);
