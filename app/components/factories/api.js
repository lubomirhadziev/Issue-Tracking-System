app
    .factory('api', ['API_URL', function (API_URL) {
        var availableApiUrls = {
            "auth_register": API_URL + 'Account/Register',
            "auth_token": API_URL + 'Token'
        };

        var api = {

            'getUrl': function (apiName) {
                if (typeof availableApiUrls[apiName] !== "undefined") {
                    return availableApiUrls[apiName];
                }

                return null;
            }

        };

        return api;

    }]);