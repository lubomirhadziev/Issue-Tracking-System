app
    .factory('errorsHandler', ['SweetAlert', function (SweetAlert) {

        var errorsHandler = {

            'handle': function (errors) {
                if (typeof errors.ModelState !== "undefined") {

                    _.each(errors.ModelState, function (subErrors) {
                        _.each(subErrors, function (subError) {
                            SweetAlert.error(subError);
                        });
                    });

                } else if (typeof errors.error_description !== "undefined") {
                    SweetAlert.error(errors.error_description);
                } else {
                    SweetAlert.error('Server error! Please try again.');
                }
            }

        };

        return errorsHandler;

    }]);