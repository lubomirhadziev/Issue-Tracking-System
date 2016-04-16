app
    .controller('AddIssueCtrl', ['$scope', '$stateParams', 'user', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, user, projectData, allUsers, allProjects) {

        $scope.projectId = $stateParams.id;

        console.log(allUsers);

    }])

;