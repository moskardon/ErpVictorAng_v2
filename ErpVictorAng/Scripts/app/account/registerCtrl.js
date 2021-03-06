﻿(function () {
    'use strict';
    var controllerId = 'registerCtrl';

    erpApp.controller(controllerId, ['$scope', 'membershipService', 'notificationService', '$rootScope', '$location', registerCtrl]);

    function registerCtrl($scope, membershipService, notificationService, $rootScope, $location) {
        $scope.pageClass = 'page-login';
        $scope.register = register;
        $scope.user = {};

        function register() {
            membershipService.register($scope.user, registerCompleted)
        }

        function registerCompleted(result) {
            if (result.data.success) {
                membershipService.saveCredentials($scope.user);
                notificationService.displaySuccess('Hola ' + $scope.user.username);
                $scope.userData.displayUserInfo();
                $location.path('/');
            }
            else {
                notificationService.displayError('Fallo al registrarse. Vuelva a intentarlo.');
            }
        }
    }

})();