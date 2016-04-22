var app = angular.module('issueTrackingSystem', [
        'ngRoute',
        'ui.router',
        'oitozero.ngSweetAlert',
        'angular-loading-bar',
        'angularUtils.directives.dirPagination',
        'ngSanitize',
        'selectize'
    ])

    .constant('API_URL', 'http://softuni-issue-tracker.azurewebsites.net/')

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'paginationTemplateProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, paginationTemplateProvider) {

        // pagination config
        paginationTemplateProvider.setPath('components/views/dirPagination.tpl.html');

        // routes config
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('root', {
                abstract:   true,
                template:   '<ui-view/>',
                controller: "RootCtrl",
                data:       {
                    requireUserNotLoggedIn: true
                }
            })

            .state('root.login', {
                url:         "/login",
                controller:  'AuthLoginCtrl',
                templateUrl: "modules/auth/login.html"
            })

            .state('root.register', {
                url:         "/register",
                controller:  'AuthRegisterCtrl',
                templateUrl: "modules/auth/register.html"
            })

            /**
             * Authenticated routes
             */

            .state('authenticated', {
                abstract:   true,
                template:   '<ui-view/>',
                controller: "AuthenticatedCtrl",
                data:       {
                    requireUserLoggedIn: true
                }
            })

            .state('authenticated.logout', {
                url:        "/logout",
                controller: 'AuthLogoutCtrl'
            })

            .state('authenticated.dashboard', {
                url:         "/dashboard",
                controller:  'DashboardCtrl',
                templateUrl: "modules/dashboard/dashboard.html",
                resolve:     {
                    projects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            })

            .state('authenticated.all_projects', {
                url:         "/projects",
                controller:  'AllProjectsCtrl',
                templateUrl: "modules/projects/all_projects.html",
                data:        {
                    requireAdminLoggedIn: true
                },
                resolve:     {
                    projects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            })

            .state('authenticated.add_project', {
                url:         "/projects/add",
                controller:  'AddProjectCtrl',
                templateUrl: "modules/projects/form.html",
                data:        {
                    requireAdminLoggedIn: true
                },
                resolve:     {
                    allUsers: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('users');
                    }]
                }
            })

            .state('authenticated.edit_project', {
                url:         "/projects/:id/edit",
                controller:  'EditProjectCtrl',
                templateUrl: "modules/projects/form.html",
                resolve:     {
                    projectData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_project', {
                            id: $stateParams.id
                        });
                    }],

                    allUsers: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('users');
                    }]
                }
            })

            .state('authenticated.single_project', {
                url:         "/projects/:id",
                controller:  'SingleProjectCtrl',
                templateUrl: "modules/projects/single_project.html",
                resolve:     {
                    projectData: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_project', {
                            id: $stateParams.id
                        });
                    }],

                    projectIssues: ['$stateParams', 'httpRequests', function ($stateParams, httpRequests) {
                        return httpRequests.get('single_project_issues', {
                            id: $stateParams.id
                        });
                    }]
                }
            })

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
            })
        ;
    }])

    .run(['$rootScope', '$state', '$anchorScroll', 'user', function ($rootScope, $state, $anchorScroll, user) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var stateData = toState.data;

            // redirect user to login page if user does not exists
            if (stateData.requireUserLoggedIn) {
                if (!user.isUserLoggedIn()) {
                    event.preventDefault();
                    $state.go('root.login');
                    return false;
                }
            }

            // redirect user to dashboard page if user exists
            if (stateData.requireUserNotLoggedIn) {
                if (user.isUserLoggedIn()) {
                    event.preventDefault();
                    $state.go('authenticated.dashboard');
                    return false;
                }
            }

            // redirect user to dashboard page if is not a admin
            if (stateData.requireAdminLoggedIn) {
                if (!user.getLoggedUserData().isAdmin) {
                    event.preventDefault();
                    $state.go('authenticated.dashboard');
                    return false;
                }
            }
        });

        // fix scroll issue
        $rootScope.$on("$locationChangeSuccess", function () {
            $anchorScroll();
        });

    }]);