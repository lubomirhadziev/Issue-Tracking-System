app.service('authentication', ['$q', 'httpRequests', function ($q, httpRequests) {

    var authentication = {

        'USER_TOKEN_NAME': 'user_token',

        '_saveToken': function (token) {
            window.sessionStorage.setItem(this.USER_TOKEN_NAME, token);
        },

        'getToken': function () {
            return window.sessionStorage.getItem(this.USER_TOKEN_NAME);
        },

        'removeToken': function () {
            window.sessionStorage.removeItem(this.USER_TOKEN_NAME);
        },

        "_fetchAuthToken": function (email, password) {
            var deferred = $q.defer();

            httpRequests.post('auth_token', {
                    Username:   email,
                    Password:   password,
                    grant_type: "password"
                })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        '_saveCurrentUserData': function (userData) {
            window.sessionStorage.setItem('user_data', JSON.stringify(userData));
        },

        'signInUser': function (email, password) {
            var deferred = $q.defer();
            var _this    = this;

            _this._fetchAuthToken(email, password)
                .then(function (response) {
                    // save user access token
                    _this._saveToken(response.access_token);

                    // save current logged user data in session storage
                    httpRequests.get('current_user_data')
                        .then(function (currentUserResponse) {
                            _this._saveCurrentUserData(currentUserResponse);

                            // return resolve
                            deferred.resolve(currentUserResponse);
                        }, function (err) {
                            deferred.reject(err);
                        });

                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    };

    return authentication;
}]);