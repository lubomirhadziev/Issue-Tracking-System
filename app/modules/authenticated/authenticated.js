angular.module('issueTrackingSystem.authenticatedModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('authenticated', {
                abstract:   true,
                template:   '<ui-view/>',
                controller: "AuthenticatedCtrl",
                data:       {
                    requireUserLoggedIn: true
                }
            });
    }])

    .controller('AuthenticatedCtrl', ['$rootScope', 'user', function ($rootScope, user) {
        $rootScope.authenticatedState = true;

        // fetch current logged user data
        $rootScope.loggedUserData = user.getLoggedUserData();

    }]);