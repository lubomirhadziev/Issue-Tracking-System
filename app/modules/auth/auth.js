app
    .controller('AuthLoginCtrl', ['$scope', 'authentication', 'errorsHandler', function ($scope, authentication, errorsHandler) {
        $scope.userData = {
            Email: null,
            Password: null
        };

        $scope.doLogin = function () {
            authentication.signInUser($scope.userData.Email, $scope.userData.Password)
                .then(function (response) {
                    $state.go('authenticated.dashboard');
                });
        };
    }])

    .controller('AuthRegisterCtrl', ['$scope', '$state', 'httpRequests', 'authentication', 'errorsHandler', function ($scope, $state, httpRequests, authentication, errorsHandler) {
        $scope.userData = {
            Email: null,
            Password: null,
            ConfirmPassword: null
        };

        $scope.doRegister = function () {

            httpRequests.post('auth_register', {}, $scope.userData)
                .then(function (response) {

                    authentication.signInUser($scope.userData.Email, $scope.userData.Password)
                        .then(function (response) {
                            $state.go('authenticated.dashboard');
                        });

                }, function (err) {
                    errorsHandler.handle(err);
                });

        };
    }]);