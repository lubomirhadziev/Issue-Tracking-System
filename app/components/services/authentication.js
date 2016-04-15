app.service('authentication', ['$q', 'httpRequests', 'errorsHandler', function ($q, httpRequests, errorsHandler) {
    var authentication = {

        'signInUser': function (email, password) {
            var deferred = $q.defer();

            httpRequests.post('auth_token', {}, {
                    Username: email,
                    Password: password,
                    grant_type: "password"
                })
                .then(function (response) {

                    console.log(response);

                    deferred.resolve(response);
                }, function (err) {
                    errorsHandler.handle(err);
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    };

    return authentication;
}]);