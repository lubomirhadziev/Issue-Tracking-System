app.service('issueService', ['$q', 'httpRequests', function ($q, httpRequests) {

    var issueService = {

        'saveIssue': function (issue, queryName, queryMethodName, queryUrlParams) {
            var deferred   = $q.defer();
            queryUrlParams = queryUrlParams || {};

            var issueData = {
                Title:       issue.Title,
                Description: issue.Description,
                DueDate:     new Date(issue.DueDate).toJSON(),
                ProjectId:   issue.ProjectId,
                AssigneeId:  issue.AssigneeId,
                PriorityId:  issue.PriorityId,
                Labels:      _.map(issue.Labels, function (label) {
                    label = {
                        Name: label
                    };
                    return label;
                })
            };

            httpRequests.methodFromString(queryName, queryMethodName, queryUrlParams, issueData)
                .then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    };

    return issueService;
}]);