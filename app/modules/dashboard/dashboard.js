app.controller('DashboardCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'user', function ($scope, httpRequests, errorsHandler, user) {

    // get current user data
    var currentUserData = user.getLoggedUserData();

    // fetch affiliated projects
    $scope.affiliatedPorjects = [];

    httpRequests.get('projects')
        .then(function (response) {

            $scope.affiliatedPorjects = _.filter(response, function (project) {
                return (project.Lead.Id === currentUserData.Id);
            });

        }, function (err) {
            errorsHandler.handle(err);
        });

}]);