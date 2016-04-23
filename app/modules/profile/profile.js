angular.module('issueTrackingSystem.profileModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('authenticated.profile_change_password', {
                url:         "/profile/password",
                controller:  'ChangeProfilePasswordCtrl',
                templateUrl: "modules/profile/change_password.html"
            });
    }])

    .controller('ChangeProfilePasswordCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'SweetAlert', function ($scope, httpRequests, errorsHandler, SweetAlert) {

        $scope.isSubmitBtnDisabled = false;

        $scope.passwordData = {
            OldPassword:     null,
            NewPassword:     null,
            ConfirmPassword: null
        };

        $scope.changePassword = function () {
            if ($scope.passwordData.NewPassword === null || $scope.passwordData.NewPassword != $scope.passwordData.ConfirmPassword) {
                SweetAlert.error('New password and confirm password does not match!');
            } else if ($scope.passwordData.NewPassword.length < 6 || $scope.passwordData.OldPassword.length < 6) {
                SweetAlert.error('Passwords must be at least 6 characters!');
            } else {

                httpRequests.post('profile_change_password', $scope.passwordData)
                    .then(function (response) {
                        $scope.userForm.$setPristine();
                        $scope.isSubmitBtnDisabled = false;

                        SweetAlert.success('You successfully change your password!');
                    }, function (err) {
                        errorsHandler.handle(err);
                        $scope.isSubmitBtnDisabled = false;
                    });

            }
        };

    }]);