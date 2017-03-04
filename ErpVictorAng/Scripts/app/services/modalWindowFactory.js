(function () {
    'use strict';
    var serviceId = 'modalWindowFactory';

    erpApp.factory(serviceId, ['$uibModal', modalWindowFactory]);

    function modalWindowFactory($uibModal) {
        var modal = {};
        var modalWindowController = _modalWindowController;

        modal.show = show;

        return modal;

        // Show a modal window with the specified title and msg
        function show(title, msg, size, confirmCallback, cancelCallback) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Scripts/app/templates/modalWindowView.html',
                controller: modalWindowController,
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    },
                    body: function () {
                        return msg;
                    }
                }
            });

            // Register confirm and cancel callbacks
            modalInstance.result.then(
                // if any, execute confirm callback
                function () {
                    if (confirmCallback != undefined) {
                        confirmCallback();
                    }
                },
                // if any, execute cancel callback
                function () {
                    if (cancelCallback != undefined) {
                        cancelCallback();
                    }
                });
        };


        // Internal controller used by the modal window
        function _modalWindowController($scope, $uibModalInstance, title, body) {
            $scope.title = "";
            $scope.body = "";

            // If specified, fill window title and message with parameters
            if (title) {
                $scope.title = title;
            }
            if (body) {
                $scope.body = body;
            }

            $scope.confirm = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        };
    };
})();
