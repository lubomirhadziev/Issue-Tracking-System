angular.module('issueTrackingSystem.factories.user', [])

    .factory('user', ['$q', 'httpRequests', 'authentication', function ($q, httpRequests, authentication) {

    var user = {

        'loggedUserData': {},

        'isUserLoggedIn': function () {
            return (authentication.getToken() !== null);
        },

        'clearLoggedUserData': function () {
            this.loggedUserData = {};
        },

        'getLoggedUserData': function () {
            if (_.isEmpty(this.loggedUserData)) {
                this.loggedUserData = JSON.parse(window.sessionStorage.getItem('user_data'));
            }

            return this.loggedUserData;
        }

    };

    return user;
}]);