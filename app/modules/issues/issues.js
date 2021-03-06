angular.module('issueTrackingSystem.issuesModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('authenticated.single_issue', {
                url:         "/issues/:id",
                controller:  'SingleIssueCtrl',
                templateUrl: "modules/issues/single_issue.html",
                resolve:     {
                    issueData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_issue', {
                            id: $stateParams.id
                        });
                    }],

                    commentsData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_issue_comments', {
                            id: $stateParams.id
                        });
                    }]
                }
            })

            .state('authenticated.single_project_add_issue', {
                url:         "/projects/:id/add-issue",
                controller:  'AddIssueCtrl',
                templateUrl: "modules/issues/form.html",
                resolve:     {
                    projectData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_project', {
                            id: $stateParams.id
                        });
                    }],

                    allUsers: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('users');
                    }],

                    allProjects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            })

            .state('authenticated.single_project_edit_issue', {
                url:         "/issues/:id/edit",
                controller:  'EditIssueCtrl',
                templateUrl: "modules/issues/form.html",
                resolve:     {
                    issueData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_issue', {
                            id: $stateParams.id
                        });
                    }],

                    projectData: ['issueData', 'httpRequests', function (issueData, httpRequests) {
                        return httpRequests.get('single_project', {
                            id: issueData.Project.Id
                        });
                    }],

                    allUsers: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('users');
                    }],

                    allProjects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            });
    }])

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

    .controller('AddIssueCtrl', ['$scope', '$state', '$stateParams', 'httpRequests', 'errorsHandler', 'user', 'issueService', 'projectData', 'allUsers', 'allProjects', function ($scope, $state, $stateParams, httpRequests, errorsHandler, user, issueService, projectData, allUsers, allProjects) {

        // check user permissions
        if (!user.getLoggedUserData().isAdmin && user.getLoggedUserData().Id !== projectData.Lead.Id) {
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

            issueService.saveIssue({
                    Title:       $scope.issue.Title,
                    Description: $scope.issue.Description,
                    DueDate:     $scope.issue.DueDate,
                    ProjectId:   $scope.projectId,
                    AssigneeId:  $scope.issue.AssigneeId.Id,
                    PriorityId:  $scope.issue.PriorityId,
                    Labels:      $scope.issue.Labels
                }, 'issues', 'POST')
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
        if (!user.getLoggedUserData().isAdmin && user.getLoggedUserData().Id !== projectData.Lead.Id && user.getLoggedUserData().Id !== issueData.Author.Id) {
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
            AssigneeId:  {
                Id: issueData.Assignee.Id
            },
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

            var updatedIssueData = {
                Title:       $scope.issue.Title,
                Description: $scope.issue.Description,
                DueDate:     $scope.issue.DueDate,
                ProjectId:   $scope.issue.ProjectId,
                AssigneeId:  $scope.issue.AssigneeId.Id,
                PriorityId:  $scope.issue.PriorityId,
                Labels:      $scope.issue.Labels
            };

            issueService.saveIssue(updatedIssueData, 'single_issue', 'PUT', {
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