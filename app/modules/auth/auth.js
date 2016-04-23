angular.module('issueTrackingSystem.authModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.login', {
                url:         "/login",
                controller:  'AuthLoginCtrl',
                templateUrl: "modules/auth/login.html"
            })

            .state('root.register', {
                url:         "/register",
                controller:  'AuthRegisterCtrl',
                templateUrl: "modules/auth/register.html"
            })

            .state('authenticated.logout', {
                url:        "/logout",
                controller: 'AuthLogoutCtrl'
            });
    }])

    .controller('AuthLoginCtrl', ['$scope', '$state', 'authentication', 'errorsHandler', function ($scope, $state, authentication, errorsHandler) {
        $scope.userData            = {
            Email:    null,
            Password: null
        };
        $scope.isSubmitBtnDisabled = false;

        $scope.doLogin = function () {
            $scope.isSubmitBtnDisabled = true;

            authentication.signInUser($scope.userData.Email, $scope.userData.Password)
                .then(function (response) {
                    $state.go('authenticated.dashboard');
                }, function (err) {
                    $scope.isSubmitBtnDisabled = false;
                    errorsHandler.handle(err);
                });

        };
    }])

    .controller('AuthRegisterCtrl', ['$scope', '$state', 'httpRequests', 'authentication', 'errorsHandler', function ($scope, $state, httpRequests, authentication, errorsHandler) {
        $scope.userData            = {
            Email:           null,
            Password:        null,
            ConfirmPassword: null
        };
        $scope.isSubmitBtnDisabled = false;

        $scope.doRegister = function () {

            if ($scope.passwordData.Password === null || $scope.passwordData.Password != $scope.passwordData.ConfirmPassword) {
                SweetAlert.error('Password and confirm password does not match!');
            } else {
                $scope.isSubmitBtnDisabled = true;

                // make request to sign up user
                httpRequests.post('auth_register', $scope.userData)
                    .then(function (response) {

                        // auto sign in user
                        authentication.signInUser($scope.userData.Email, $scope.userData.Password)
                            .then(function (response) {
                                $state.go('authenticated.dashboard');
                            }, function (err) {
                                $scope.isSubmitBtnDisabled = false;
                                errorsHandler.handle(err);
                            });

                    }, function (err) {
                        $scope.isSubmitBtnDisabled = false;
                        errorsHandler.handle(err);
                    });
            }
        };
    }])

    .controller('AuthLogoutCtrl', ['$state', 'authentication', 'SweetAlert', 'user', function ($state, authentication, SweetAlert, user) {
        authentication.removeToken();
        user.clearLoggedUserData();

        SweetAlert.success('You have been successfully logged out!');
        $state.go('root.login');
    }])
;