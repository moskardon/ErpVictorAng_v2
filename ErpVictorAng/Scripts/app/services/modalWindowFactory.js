(function () {
    'use strict';
    var serviceId = 'modalWindowFactory';

    erpApp.factory(serviceId, ['$uibModal', modalWindowFactory]);

    function modalWindowFactory($uibModal) {
        var modal = {};
        var modalWindowController = _modalWindowController;

        modal.show = show;

        return modal;

        // muestra una ventana modal con el titulo y mensage especificado
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


        //Controlador interno usado por el modal window
        function _modalWindowController($scope, $uibModalInstance, title, body) {
            $scope.title = "";
            $scope.body = "";

            //Si se especifica, rellena el titulo y el mensage con parametros
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
