app.service('authentication', ['$q', 'httpRequests', function ($q, httpRequests) {
    var authentication = {

        'fetchAuthToken': function (email, password) {
            var deferred = $q.defer();

            httpRequests.post('auth_token', {}, {
                    Username: email,
                    Password: password,
                    grant_type: "password"
                })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        '_saveToken': function (token) {
            window.sessionStorage.setItem('user_token', token);
        },

        'getToken': function () {
            return window.sessionStorage.getItem('user_token');
        },

        'signInUser': function (email, password) {
            var deferred = $q.defer();
            var _this = this;

            _this.fetchAuthToken(email, password)
                .then(function (response) {
                    _this._saveToken(response.access_token);
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    };

    return authentication;
}]);