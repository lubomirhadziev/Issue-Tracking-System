app
    .factory('api', ['API_URL', function (API_URL) {
        var availableApiUrls = {
            "auth_register":              API_URL + 'api/Account/Register',
            "auth_token":                 API_URL + 'api/Token',
            "current_user_data":          API_URL + 'Users/me',
            "projects":                   API_URL + 'Projects',
            "single_project":             API_URL + 'Projects/{id}',
            "single_project_issues":      API_URL + 'Projects/{id}/Issues',
            "users":                      API_URL + 'Users',
            "issues":                     API_URL + 'Issues',
            "issues_filter":              API_URL + 'Issues/?pageSize={pageSize}&pageNumber={pageNumber}&{filter}={value}',
            "issues_me_filter":           API_URL + 'Issues/me?pageSize={pageSize}&pageNumber={pageNumber}&orderBy={orderBy}',
            "single_issue":               API_URL + 'Issues/{id}',
            "single_issue_comments":      API_URL + 'Issues/{id}/comments',
            "single_issue_change_status": API_URL + 'Issues/{id}/changestatus?statusid={statusId}'
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