app
    .controller('AddIssueCtrl', ['$scope', '$stateParams', '$state', 'httpRequests', 'errorsHandler', 'issueService', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, $state, httpRequests, errorsHandler, issueService, projectData, allUsers, allProjects) {
        $scope.title               = "Add Issue";
        $scope.isSubmitBtnDisabled = false;

        $scope.projectId   = $stateParams.id;
        $scope.projectData = projectData;

        $scope.allUsers    = allUsers;
        $scope.allProjects = allProjects;
        $scope.priorities  = projectData.Priorities;

        $scope.issue = {
            Title:       null,
            Description: null,
            DueDate:     null,
            ProjectId:   $scope.projectId,
            AssigneeId:  projectData.Lead.Id,
            PriorityId:  null,
            Labels:      _.pluck(projectData.Labels, 'Name')
        };

        $scope.labelsSelectConfig = {
            create:      true,
            valueField:  'Name',
            labelField:  'Name',
            delimiter:   ',',
            placeholder: 'Pick some labels'
        };

        $scope.doIssue = function () {
            $scope.isSubmitBtnDisabled = true;

            issueService.saveIssue($scope.issue, 'issues', 'POST')
                .then(function (response) {
                    $state.go('authenticated.single_project', {
                        id: $scope.projectId
                    });

                }, function (err) {
                    $scope.isSubmitBtnDisabled = false;
                    errorsHandler.handle(err);
                });
        };
    }])

    .controller('EditIssueCtrl', ['$scope', '$stateParams', '$state', 'httpRequests', 'errorsHandler', 'issueService', 'SweetAlert', 'issueData', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, $state, httpRequests, errorsHandler, issueService, SweetAlert, issueData, projectData, allUsers, allProjects) {
        $scope.title               = "Edit Issue";
        $scope.isSubmitBtnDisabled = false;

        $scope.projectId   = issueData.Project.Id;
        $scope.allUsers  = allUsers;
        $scope.allProjects = allProjects;

        $scope.projectData = projectData;
        $scope.priorities  = projectData.Priorities;

        $scope.issue = {
            Title:       issueData.Title,
            Description: issueData.Description,
            DueDate:     new Date(issueData.DueDate),
            ProjectId:   issueData.Project.Id.toString(),
            AssigneeId:  issueData.Assignee.Id.toString(),
            PriorityId:  issueData.Priority.Id.toString(),
            Labels:      _.pluck(issueData.Labels, 'Name')
        };

        $scope.labelsSelectConfig = {
            create:      true,
            valueField:  'Name',
            labelField:  'Name',
            delimiter:   ',',
            placeholder: 'Pick some labels'
        };

        // make update
        $scope.doIssue = function () {
            $scope.isSubmitBtnDisabled = true;

            issueService.saveIssue($scope.issue, 'single_issue', 'PUT', {
                    id: issueData.Id
                })
                .then(function (response) {
                    $scope.isSubmitBtnDisabled = false;
                    SweetAlert.success('Issue data was successfully edited!');

                }, function (err) {
                    $scope.isSubmitBtnDisabled = false;
                    errorsHandler.handle(err);
                });
        };

    }])
;