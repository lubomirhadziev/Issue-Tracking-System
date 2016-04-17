app
    .controller('AddIssueCtrl', ['$scope', '$stateParams', 'user', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, user, projectData, allUsers, allProjects) {

        $scope.projectId = $stateParams.id;

        $scope.allUsers = allUsers;
        $scope.allProjects = allProjects;
        $scope.priorities = projectData.Priorities;

        console.log(projectData);

        $scope.issue = {
            Title: null,
            Description: null,
            DueDate: null,
            ProjectId: $scope.projectId,
            AssigneeId: projectData.Lead.Id,
            PriorityId: null,
            Labels: projectData.Labels
        };

    }])

;