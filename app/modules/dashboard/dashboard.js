app.controller('DashboardCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'user', 'projects', function ($scope, httpRequests, errorsHandler, user, projects) {

    // get current user data
    var currentUserData = user.getLoggedUserData();

    // filter affiliated projects
    $scope.affiliatedPorjects = _.filter(projects, function (project) {
        return (project.Lead.Id === currentUserData.Id);
    });

}]);