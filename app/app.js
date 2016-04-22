angular.module('issueTrackingSystem', [
        'ngRoute',
        'ui.router',
        'oitozero.ngSweetAlert',
        'angular-loading-bar',
        'angularUtils.directives.dirPagination',
        'ngSanitize',
        'selectize',
        'issueTrackingSystem.rootModule',
        'issueTrackingSystem.projectsModule',
        'issueTrackingSystem.issuesModule',
        'issueTrackingSystem.dashboardModule',
        'issueTrackingSystem.authenticatedModule',
        'issueTrackingSystem.authModule',
        'issueTrackingSystem.profileModule',
        'issueTrackingSystem.directives.sideMenu',
        'issueTrackingSystem.factories.api',
        'issueTrackingSystem.factories.errorsHandler',
        'issueTrackingSystem.factories.httpRequests',
        'issueTrackingSystem.factories.user',
        'issueTrackingSystem.filters.joinBy',
        'issueTrackingSystem.services.authentication',
        'issueTrackingSystem.services.issue'
    ])

    .constant('API_URL', 'http://softuni-issue-tracker.azurewebsites.net/')

    .config(['$urlRouterProvider', 'paginationTemplateProvider', function ($urlRouterProvider, paginationTemplateProvider) {
        // pagination config
        paginationTemplateProvider.setPath('components/views/dirPagination.tpl.html');

        // routes config
        $urlRouterProvider.otherwise('/login');
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