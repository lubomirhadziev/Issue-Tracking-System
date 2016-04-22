app.factory('httpRequests', ['$q', '$http', '$log', 'api', 'cfpLoadingBar', function ($q, $http, $log, api, cfpLoadingBar) {
    var request = {

        "_headers": {},

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
            var url      = this.formatUrl(api.getUrl(urlName), urlParams);
            var headers  = this._headers;

            //cfpLoadingBar.start();

            // append user authorization access token if user is logged in
            var currentUserAccessToken = this._getCurrentUserAccessToken();

            if (currentUserAccessToken) {
                headers.Authorization = 'Bearer ' + currentUserAccessToken;
            }

            // prepare and make request
            $http({
                url:     url,
                method:  requestType,
                headers: headers,
                data:    (typeof postParams === "undefined" ? {} : postParams),
                cache:   false
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

            // clear headers
            this._headers = {};

            return deferred.promise;
        },

        'get': function (urlName, urlParams) {
            urlParams = urlParams || {};

            return this.performRequest(urlName, 'get', urlParams, {});
        },

        'post': function (urlName, postParams, urlParams) {
            postParams = postParams || {};
            urlParams  = urlParams || {};

            return this.performRequest(urlName, 'post', urlParams, postParams);
        },

        'put': function (urlName, putParams, urlParams) {
            putParams = putParams || {};
            urlParams = urlParams || {};

            return this.performRequest(urlName, 'put', urlParams, putParams);
        },

        'methodFromString': function (urlName, method, urlParams, postParams, headers) {
            this._headers = headers || {};

            switch (method) {
                case "GET":
                    return this.get(urlName, urlParams);
                    break;

                case "POST":
                    return this.post(urlName, postParams);
                    break;

                case "PUT":
                    return this.put(urlName, postParams, urlParams);
                    break;

                default:
                    throw new Error('Invalid method name! Valid methods are: GET, POST, PUT');
                    break;
            }
        }

    };

    return request;
}]);