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

                } else {
                    SweetAlert.error('Сървърна грешка! Моля, опитайте по-късно.');
                }
            }

        };

        return errorsHandler;

    }]);