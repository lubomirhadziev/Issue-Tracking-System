app

    .controller('AllProjectsCtrl', ['$scope', 'projects', function ($scope, projects) {
        $scope.allProjects = _.chain(projects).sortBy('Id').reverse().value();

        console.log($scope.allProjects);

    }])

    .controller('SingleProjectCtrl', ['$scope', 'user', 'projectData', 'projectIssues', function ($scope, user, projectData, projectIssues) {
        $scope.isCurrentUserLead = (user.getLoggedUserData().Id === projectData.Lead.Id);
        $scope.projectData       = projectData;
        $scope.projectIssues     = projectIssues;

    }])

    .controller('AddProjectCtrl', ['$scope', '$state', 'httpRequests', 'errorsHandler', 'user', 'allUsers', function ($scope, $state, httpRequests, errorsHandler, user, allUsers) {

        $scope.title               = "Add Project";
        $scope.isSubmitBtnDisabled = false;

        $scope.allUsers = allUsers;

        $scope.project = {
            Name:        null,
            Description: null,
            ProjectKey:  null,
            LeadId:      {
                Id: null
            },
            Labels:      null,
            Priorities:  null
        };

        $scope.selectConfig = {
            create:      true,
            delimiter:   ',',
            placeholder: 'Write something here (separated by comma) ...'
        };

        $scope.projectNameChanged = function () {
            if ($scope.project.Name !== null && typeof $scope.project.Name !== "undefined" && $scope.project.Name.length > 0) {

                $scope.project.ProjectKey = $scope.project.Name.split(' ')
                    .map(function (item) {
                        return item[0];
                    }).join('');

            } else {
                $scope.project.ProjectKey = null;
            }
        };

        $scope.doProject = function () {
            $scope.isSubmitBtnDisabled = true;

            var projectData = {
                Name:        $scope.project.Name,
                Description: $scope.project.Description,
                ProjectKey:  $scope.project.ProjectKey,
                LeadId:      $scope.project.LeadId.Id,
                Labels:      _.map($scope.project.Labels, function (label) {
                    label = {
                        Name: label
                    };
                    return label;
                }),
                Priorities:  _.map($scope.project.Priorities, function (priority) {
                    priority = {
                        Name: priority
                    };
                    return priority;
                })
            };

            httpRequests.post('projects', projectData)
                .then(function (response) {
                    $scope.projectForm.$setPristine();

                    console.log(response);
                }, function (err) {
                    errorsHandler.handle(err);
                });
        };
    }])

;