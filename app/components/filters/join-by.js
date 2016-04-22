angular.module('issueTrackingSystem.filters.joinBy', [])

    .filter('joinBy', function () {
        return function (input, delimiter, objectColumnName) {
            if (objectColumnName) {
                input = _.map(input, function (data) {
                    return data[objectColumnName];
                });
            }

            return (input || []).join(delimiter || ',');
        };
    });