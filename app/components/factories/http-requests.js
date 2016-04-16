app.factory('httpRequests', ['$q', '$http', '$log', 'api', 'cfpLoadingBar', function ($q, $http, $log, api, cfpLoadingBar) {
    var request = {

        "_getCurrentUserAccessToken": function () {
            return window.sessionStorage.getItem('user_token');
        },

        'formatUrl': function (url, urlParams) {
            _.each(urlParams, function (param, key) {
                url = url.replace('{' + key + '}', param);
            });

            return url;
        },

        'performRequest': function (urlName, requestType, urlParams, postParams) {
            var deferred = $q.defer();
            var url = this.formatUrl(api.getUrl(urlName), urlParams);
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            //cfpLoadingBar.start();

            // append user authorization access token if user is logged in
            var currentUserAccessToken = this._getCurrentUserAccessToken();

            if (currentUserAccessToken) {
                headers.Authorization = 'Bearer ' + currentUserAccessToken;
            }

            // prepare and make request
            $http({
                url: url,
                method: requestType,
                headers: headers,
                data: (typeof postParams === "undefined" ? {} : $.param(postParams)),
                cache: false
            })
                .success(function (data) {
                    //cfpLoadingBar.complete();

                    deferred.resolve(data);
                })
                .error(function (msg, code) {
                    //cfpLoadingBar.complete();

                    deferred.reject(msg);
                    $log.error(msg, code);
                });

            return deferred.promise;
        },

        'get': function (urlName, urlParams) {
            urlParams = urlParams || {};

            return this.performRequest(urlName, 'get', urlParams, {});
        },

        'post': function (urlName, postParams) {
            postParams = postParams || {};

            return this.performRequest(urlName, 'post', {}, postParams);
        },

        'put': function (urlName, putParams) {
            putParams = putParams || {};

            return this.performRequest(urlName, 'put', {}, putParams);
        }

    };

    return request;
}]);