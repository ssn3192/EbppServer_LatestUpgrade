(function () {
    'use strict';

    ///////////////////
    //Security Section
    ///////////////////

    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        logoutFailed: 'auth-logout-failed',
        registrationSuccess: 'auth-registration-success',
        registrationFailed: 'auth-registration-failed',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    });

    app.factory('AuthService', function (localStorageService, $http, Session, config, usSpinnerService, $q) {
        return {
            login: function (credentials) {
                var user = { grant_type: 'password', username: credentials.username, password: credentials.password, scope: 'openid publicApi' };

                //required for Idsrv V3 call (required bys spec)
                var urlEncodedUrl = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic SWRlbnRpdHlXZWJVSTpzZWNyZXQ='
                };
                usSpinnerService.spin('spinner-1');

                var url = config.api.connect;

                return $http({
                    method: 'POST', url: config.api.connect, headers: urlEncodedUrl, data: user, transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            if (obj.hasOwnProperty(p)) str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        return str.join('&');
                    }
                }).success(function (data, status, headers, config) {
                    Session.create(data.access_token, credentials.username, 'admin');
                    localStorageService.set('bearerToken', data.access_token);
                    usSpinnerService.stop('spinner-1');
                }).error(function (data, status, headers, config) {
                    Session.destroy();
                    usSpinnerService.stop('spinner-1');
                });
            },

            logout: function () {
                Session.destroy();

                var localStorageKeys = localStorageService.keys();

                angular.forEach(localStorageKeys, function (key, value) {
                    localStorageService.remove(key);
                });


                //localStorageService.remove('bearerToken');
                console.log('session destroyed');
            },

            register: function (credentials) {
                var deferred = $q.defer();
                $http.post(config.api.account + 'create',
                    {
                        Username: credentials.username,
                        Password: credentials.password,
                        Email: credentials.email
                    })
                .then(
                function (data, status, headers, config) {
                    //success
                    deferred.resolve(data);
                },
                function (data, status, headers, config) {
                    //failure
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            isAuthenticated: function () {
                console.log(Session);

                var userId = !!Session.userId;

                return userId;
            }
        };
    });

    app.service('Session', function (localStorageService) {
        this.create = function (sessionId, userId, userRole) {
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
            localStorageService.set('sessionObject', this);
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
            localStorageService.remove('sessionObject');
        };
        return this;
    });

    app.controller('ApplicationController',
            function ($scope,
                $location,
                localStorageService,
                    AUTH_EVENTS,
                    USER_ROLES,
                    AuthService) {

                //retrieve the sessionObject at start time
                $scope.currentUser = localStorageService.get('sessionObject');
                $scope.userRoles = USER_ROLES;
                $scope.isAuthorized = AuthService.isAuthorized;
                $scope.isAuthenticated = AuthService.isAuthenticated;

                //refresh the user
                $scope.$on(AUTH_EVENTS.loginSuccess, function (scope, email) {
                    $scope.currentUser = localStorageService.get('sessionObject');
                });

                $scope.$on(AUTH_EVENTS.logoutSuccess, function (scope, email) {
                    $scope.currentUser = null;
                });

                $scope.$on(AUTH_EVENTS.logoutFailed, function (scope, email) {
                    $scope.currentUser = null;
                });

                $scope.$on(AUTH_EVENTS.sessionTimeout, function (scope, email) {
                    $scope.currentUser = null;
                    goToLoginPage();
                });

                $scope.$on(AUTH_EVENTS.notAuthenticated, function (scope, email) {
                    $scope.currentUser = null;
                    goToLoginPage();
                });

                function goToLoginPage() {
                    $location.path('/account');
                };
            });

    app.factory('authInterceptor', function ($rootScope, $q, localStorageService, AUTH_EVENTS) {
        return {
            request: function (config) {
                //console.log('bearer : ');
                //console.log(localStorageService.get('bearerToken'));
                config.headers = config.headers || {};
                if (localStorageService.get('bearerToken')) {
                    config.headers.Authorization = 'Bearer ' + localStorageService.get('bearerToken');
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response.status === 401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,
                                          response);
                }
                if (response.status === 403) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,
                                          response);
                }
                if (response.status === 419 || response.status === 440) {
                    $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,
                                          response);
                }
                return $q.reject(response);
            }

        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });


})();