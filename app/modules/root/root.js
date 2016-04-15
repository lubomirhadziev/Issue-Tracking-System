app.controller('RootCtrl', ['$rootScope', function ($rootScope) {
    $rootScope.authenticatedState = false;
    $rootScope.loggedUserData = {};

}]);