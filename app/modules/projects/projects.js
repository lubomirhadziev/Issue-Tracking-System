app
    .controller('SingleProjectCtrl', ['$scope', 'user', 'projectData', 'projectIssues', function ($scope, user, projectData, projectIssues) {

        $scope.isCurrentUserLead = (user.getLoggedUserData().Id === projectData.Lead.Id);
        $scope.projectData       = projectData;
        $scope.projectIssues     = projectIssues;

    }])

;