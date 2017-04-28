(function () {
    'use strict';

    erpApp.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$state', 'membershipService', '$rootScope'];
    function rootCtrl($scope, $state, membershipService, $rootScope) {

        $scope.userData = {};

        $scope.userData.isUserLoggedIn = false;
        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;


        function displayUserInfo() {
            $scope.userData.isUserLoggedIn = membershipService.isUserLoggedIn();

            if ($scope.userData.isUserLoggedIn) {
                $scope.username = $rootScope.repository.loggedUser.username;
            }
        }

        function logout() {
            membershipService.removeCredentials();
            $state.go('home');
            $scope.userData.displayUserInfo();
        }

        $scope.userData.displayUserInfo();
    }

})();