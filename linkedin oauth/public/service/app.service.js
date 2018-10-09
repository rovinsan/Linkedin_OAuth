"use strict";

angular.module("app.service", []).factory("AppService", [
    "$http",
    "$q",
    function($http, $q) {
        return {

            // retrieve oauth url from server
            getOAuthUrl: function() {
                var defer = $q.defer();

                $http.get("/api/auth").then(
                    (results) => {
                        defer.resolve(results.data);
                    },
                    (err) => {
                        defer.reject(err);
                    }
                );

                return defer.promise;
            },

            getUser: function() {
                var defer = $q.defer();

                $http.post("/api/user").then(
                    (results) => {
                        defer.resolve(results.data);
                    },
                    (err) => {
                        defer.reject(err);
                    }
                );

                return defer.promise;
            }
        };
    }
]);
