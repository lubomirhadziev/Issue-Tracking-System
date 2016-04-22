angular.module('issueTrackingSystem.rootModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root', {
                abstract:   true,
                template:   '<ui-view/>',
                controller: "RootCtrl",
                data:       {
                    requireUserNotLoggedIn: true
                }
            });
    }])

    .controller('RootCtrl', ['$rootScope', function ($rootScope) {
        $rootScope.authenticatedState = false;
        $rootScope.loggedUserData     = {};

    }]);