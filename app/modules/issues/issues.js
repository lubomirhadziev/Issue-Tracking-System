app

    .controller('SingleIssueCtrl', ['$scope', '$state', 'httpRequests', 'errorsHandler', 'SweetAlert', 'user', 'issueData', 'commentsData', function ($scope, $state, httpRequests, errorsHandler, SweetAlert, user, issueData, commentsData) {

        $scope.isCurrentUserAuthor   = (user.getLoggedUserData().Id === issueData.Author.Id);
        $scope.isCurrentUserAssigned = (user.getLoggedUserData().Id === issueData.Assignee.Id);
        $scope.issueData             = issueData;

        $scope.changeIssueStatus = function (status) {
            if (!$scope.isCurrentUserAssigned) {
                SweetAlert.error('You need to be author or assigned to this issue!');
                return false;
            }

            httpRequests.put('single_issue_change_status', {}, {
                    id:       issueData.Id,
                    statusId: status.Id
                })
                .then(function (response) {
                    $scope.issueData.Status = status;
                    $scope.issueData.AvailableStatuses = response;
                }, function (err) {
                    errorsHandler.handle(err);
                });
        };

        /**
         * Comments
         */
        $scope.commentsData = commentsData;
        $scope.newCommentText = null;

        $scope.addComment = function () {
            if (!($scope.isCurrentUserAuthor || $scope.isCurrentUserAssigned)) {
                SweetAlert.error('You need to be author or assigned to this issue!');
                return false;
            }

            httpRequests.post('single_issue_comments', {
                    Text: $scope.newCommentText
                }, {
                    id: issueData.Id
                })
                .then(function (response) {
                    $scope.newCommentText = null;
                    $scope.commentsData   = response;

                    // clear form data
                    $scope.chatForm.$setPristine();
                }, function (err) {
                    errorsHandler.handle(err);
                });
        };

    }])

    .controller('AddIssueCtrl', ['$scope', '$stateParams', '$state', 'httpRequests', 'errorsHandler', 'user', 'issueService', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, $state, httpRequests, errorsHandler, user, issueService, projectData, allUsers, allProjects) {

        // check user permissions
        if (user.getLoggedUserData().Id !== projectData.Lead.Id) {
            $state.go('authenticated.single_project', {
                id: $stateParams.id
            });

            return false;
        }

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

    .controller('EditIssueCtrl', ['$scope', '$stateParams', '$state', 'httpRequests', 'errorsHandler', 'user', 'issueService', 'SweetAlert', 'issueData', 'projectData', 'allUsers', 'allProjects', function ($scope, $stateParams, $state, httpRequests, errorsHandler, user, issueService, SweetAlert, issueData, projectData, allUsers, allProjects) {

        // check user permissions
        if (user.getLoggedUserData().Id !== projectData.Lead.Id) {
            $state.go('authenticated.single_issue', {
                id: $stateParams.id
            });

            return false;
        }

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