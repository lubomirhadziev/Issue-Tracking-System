var app = angular.module('portfolio', [
        'ngRoute',
        'ui.router',
        'oitozero.ngSweetAlert',
        'angular-loading-bar'
    ])

    .constant('API_URL', 'http://softuni-issue-tracker.azurewebsites.net/api/')

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        // routes config
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('root', {
                abstract: true,
                template: '<ui-view/>',
                controller: "RootCtrl"
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
                controller: "AuthenticatedCtrl"
            })

            .state('authenticated.dashboard', {
                url: "/dashboard",
                controller: 'DashboardCtrl',
                templateUrl: "modules/dashboard/dashboard.html"
            })

        ;
    }])

    .run(['$rootScope', function ($rootScope) {
    }]);