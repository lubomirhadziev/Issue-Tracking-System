app
    .controller('SingleProjectCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'user', 'projectData', 'projectIssues', function ($scope, httpRequests, errorsHandler, user, projectData, projectIssues) {

        $scope.isCurrentUserLead = (user.getLoggedUserData().Id === projectData.Lead.Id);
        $scope.projectData = projectData;
        $scope.projectIssues = projectIssues;

        console.log($scope.isCurrentUserLead);

    }])

;