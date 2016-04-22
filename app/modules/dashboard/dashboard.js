angular.module('issueTrackingSystem.dashboardModule', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('authenticated.dashboard', {
                url:         "/dashboard",
                controller:  'DashboardCtrl',
                templateUrl: "modules/dashboard/dashboard.html",
                resolve:     {
                    projects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            });
    }])

    .controller('DashboardCtrl', ['$scope', 'httpRequests', 'errorsHandler', 'user', 'projects', function ($scope, httpRequests, errorsHandler, user, projects) {

        // get current user data
        var currentUserData = user.getLoggedUserData();

        $scope.isLoggedUserIsAdmin = currentUserData.isAdmin;

        // filter affiliated projects
        $scope.affiliatedProjects = _.filter(projects, function (project) {
            return (project.Lead.Id === currentUserData.Id);
        });

        // user's issues
        $scope.userIssuesPaginationData = {
            itemsPerPage:         10,
            totalItemsCount:      -1,
            currentPage:          1,
            isPaginationDisabled: true
        };
        $scope.userIssues               = [];

        $scope.loadUserIssues = function (newPage) {
            httpRequests.get('issues_me_filter', {
                    pageSize:   $scope.userIssuesPaginationData.itemsPerPage,
                    pageNumber: newPage,
                    orderBy:    'DueDate asc'
                })
                .then(function (response) {
                    $scope.userIssues = response.Issues;
                    $scope.userIssuesPaginationData.currentPage = newPage;

                    if ($scope.userIssuesPaginationData.totalItemsCount === -1) {
                        $scope.userIssuesPaginationData.totalItemsCount = $scope.userIssuesPaginationData.itemsPerPage * response.TotalPages;
                    }
                }, function (err) {
                    errorsHandler.handle(err);
                });
        };

        // load user issues for first time
        $scope.loadUserIssues($scope.userIssuesPaginationData.currentPage);

    }]);