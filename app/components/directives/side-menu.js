app.directive('sideMenu', function () {
    return {
        restrict: 'A',
        link:     function (scope, ele) {
            scope.$watch(ele, function () {
                setTimeout(function () {
                    $(ele).metisMenu();
                }, 0);
            });
        }
    };
});