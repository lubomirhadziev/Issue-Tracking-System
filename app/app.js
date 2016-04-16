var app = angular.module('issueTrackingSystem', [
        'ngRoute',
        'ui.router',
        'oitozero.ngSweetAlert',
        'angular-loading-bar',
        'angularUtils.directives.dirPagination'
    ])

    .constant('API_URL', 'http://softuni-issue-tracker.azurewebsites.net/')

    .config(['$stateProvider', '$urlRouterProvider', 'paginationTemplateProvider', function ($stateProvider, $urlRouterProvider, paginationTemplateProvider) {

        // pagination config
        paginationTemplateProvider.setPath('components/views/dirPagination.tpl.html');

        // routes config
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('root', {
                abstract: true,
                template: '<ui-view/>',
                controller: "RootCtrl",
                data: {
                    requireUserLoggedIn: false,
                    requireUserNotLoggedIn: true
                }
            })

            .state('root.login', {
                url: "/login",
                controller: 'AuthLoginCtrl',
                templateUrl: "modules/auth/login.html"
            })

            .state('root.register', {
                url: "/register",
                controller: 'AuthRegisterCtrl',
                templateUrl: "modules/auth/register.html"
            })

            /**
             * Authenticated routes
             */

            .state('authenticated', {
                abstract: true,
                template: '<ui-view/>',
                controller: "AuthenticatedCtrl",
                data: {
                    requireUserLoggedIn: true,
                    requireUserNotLoggedIn: false
                }
            })

            .state('authenticated.logout', {
                url: "/logout",
                controller: 'AuthLogoutCtrl'
            })

            .state('authenticated.dashboard', {
                url: "/dashboard",
                controller: 'DashboardCtrl',
                templateUrl: "modules/dashboard/dashboard.html",
                resolve: {
                    projects: ['httpRequests', function (httpRequests) {
                        return httpRequests.get('projects');
                    }]
                }
            })

            .state('authenticated.single_project', {
                url: "/projects/:id",
                controller: 'SingleProjectCtrl',
                templateUrl: "modules/projects/single_project.html",
                resolve: {
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

            .state('authenticated.single_project_add_issue', {
                url: "/projects/:id/add-issue",
                controller: 'AddIssueCtrl',
                templateUrl: "modules/issues/add_issue.html",
                resolve: {
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
        ;
    }])

    .run(['$rootScope', '$state', 'user', function ($rootScope, $state, user) {

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
        });

    }]);