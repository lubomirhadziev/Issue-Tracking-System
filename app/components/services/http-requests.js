app.service('httpRequests', ['$q', '$http', 'api', '$log', 'cfpLoadingBar', function ($q, $http, api, $log, cfpLoadingBar) {
    var request = {

        'formatUrl': function (url, urlParams) {
            _.each(urlParams, function (param, key) {
                url = url.replace('{' + key + '}', param);
            });

            return url;
        },

        'performRequest': function (urlName, requestType, urlParams, postParams) {
            var deferred = $q.defer();
            var url = this.formatUrl(api.getUrl(urlName), urlParams);

            cfpLoadingBar.start();

            $http({
                url: url,
                method: requestType,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: (typeof postParams === "undefined" ? {} : $.param(postParams)),
                cache: false
            })
                .success(function (data) {
                    cfpLoadingBar.complete();

                    deferred.resolve(data);
                }).error(function (msg, code) {
                cfpLoadingBar.complete();

                deferred.reject(msg);
                $log.error(msg, code);
            });

            return deferred.promise;
        },

        'get': function (urlName, urlParams, postParams) {
            return this.performRequest(urlName, 'get', urlParams, postParams);
        },

        'post': function (urlName, urlParams, postParams) {
            return this.performRequest(urlName, 'post', urlParams, postParams);
        }

    };

    return request;
}]);