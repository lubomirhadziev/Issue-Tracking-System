app
    .controller('AuthLoginCtrl', ['$scope', '$state', 'authentication', 'errorsHandler', function ($scope, $state, authentication, errorsHandler) {
        $scope.userData = {
            Email: null,
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
        $scope.userData = {
            Email: null,
            Password: null,
            ConfirmPassword: null
        };
        $scope.isSubmitBtnDisabled = false;

        $scope.doRegister = function () {
            $scope.isSubmitBtnDisabled = true;

            httpRequests.post('auth_register', {}, $scope.userData)
                .then(function (response) {

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

        };
    }]);