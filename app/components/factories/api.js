app
    .factory('api', ['API_URL', function (API_URL) {
        var availableApiUrls = {
            "auth_register": API_URL + 'api/Account/Register',
            "auth_token": API_URL + 'api/Token',
            "current_user_data": API_URL + 'Users/me',
            "projects": API_URL + 'Projects',
            "single_project": API_URL + 'Projects/{id}',
            "single_project_issues": API_URL + 'Projects/{id}/Issues',
            "users": API_URL + 'Users'
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