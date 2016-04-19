app.controller('DashboardCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'user', 'projects', function ($scope, httpRequests, errorsHandler, user, projects) {

    // get current user data
    var currentUserData = user.getLoggedUserData();

    // filter affiliated projects
    $scope.affiliatedPorjects = _.filter(projects, function (project) {
        return (project.Lead.Id === currentUserData.Id);
    });

    // user's issues
    $scope.userIssuesPageData = {
        itemsPerPage: 3,
        totalPages:   0,
        currentPage:  0
    };
    $scope.userIssues         = [];

    $scope.loadUserIssues = function (t1, t2) {

        httpRequests.get('issues_me_filter', {
                pageSize:   t1,
                pageNumber: t2,
                orderBy:    'DueDate desc'
            })
            .then(function (response) {
                $scope.userIssues = _.extend($scope.userIssues, response.Issues);
                console.log(response);
            }, function (err) {
                errorsHandler.handle(err);
            });
    };

    $scope.loadUserIssues(5, 1);
    $scope.loadUserIssues(5, 2);
    $scope.loadUserIssues(5, 3);
    $scope.loadUserIssues(5, 4);
    $scope.loadUserIssues(5, 5);
    $scope.loadUserIssues(5, 6);
    $scope.loadUserIssues(5, 7);


}]);