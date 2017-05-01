
(function () {
    'use strict';
    var serviceId = 'membershipService';

    erpApp.factory(serviceId, ['apiService', 'notificationService', '$http', '$base64', '$cookieStore', '$rootScope', membershipService]);

    function membershipService(apiService, notificationService, $http, $base64, $cookieStore, $rootScope) {

        var service = {
            login: login,
            register: register,
            saveCredentials: saveCredentials,
            removeCredentials: removeCredentials,
            isUserLoggedIn: isUserLoggedIn
        }

        function login(user, completed) {
            apiService.post('/api/account/authenticate', user,
            completed,
            loginFailed);
        }

        function register(user, completed) {
            apiService.post('/api/account/register', user,
            completed,
            registrationFailed);
        }

        function saveCredentials(user) {
            console.log("save credentials");
            var membershipData = $base64.encode(user.username + ':' + user.password);
            console.log("membershipData" + membershipData);
            $rootScope.repository = {
                loggedUser: {
                    username: user.username,
                    authdata: membershipData
                }
            };
            alert($rootScope.repository.loggedUser);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + membershipData;
            $cookieStore.put('repository', $rootScope.repository);
            console.log("cookieStore.put");
        }

        function removeCredentials() {
            $rootScope.repository = {};
            $cookieStore.remove('repository');
            $http.defaults.headers.common.Authorization = '';
        };

        function loginFailed(response) {
            notificationService.displayError(response.data);
        }

        function registrationFailed(response) {

            notificationService.displayError('Registration failed. Try again.');
        }

        function isUserLoggedIn() {
            
            return $rootScope.repository.loggedUser != null;
            alert($rootScope.repository);
            //return false;
        }

        return service;
    }



})();