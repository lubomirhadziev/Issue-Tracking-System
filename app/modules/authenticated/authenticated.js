app.controller('AuthenticatedCtrl', ['$rootScope', 'user', function ($rootScope, user) {
    $rootScope.authenticatedState = true;

    // fetch current logged user data
    $rootScope.loggedUserData = user.getLoggedUserData();

}]);