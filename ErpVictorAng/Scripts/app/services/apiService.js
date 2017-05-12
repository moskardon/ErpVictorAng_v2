(function () {
    'use strict';
    var serviceId = 'apiService';

    erpApp.factory(serviceId, ['$http', '$state', 'notificationService', '$rootScope', apiService]);

    //$http parte de angular con la gestion del protocolo http, $state estado a nivel del enrutamiento, $rootScope ambito de ruta que maneja el navegador ( navegar adelante y atras por ejemplo )
    function apiService($http, $state, notificationService, $rootScope) {

        function get(url, config, success, failure) {// el config se puede pasar a null por lo visto, y funciona....
            //alert("apiService - get");
            //console.log(url);
            return $http.get(url, config)
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Autenticación requerida.');
                            //establezco la que sera la ruta anterior a la actual
                            $rootScope.previousState = $state.current;
                            //nos movemos a login
                            $state.go('login');
                        }
                        else if (failure != null) {
                            failure(error);
                        }
                    });
        };

        function post(url, data, success, failure) {
            return $http.post(url, data)
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Autenticación requerida.');
                            $rootScope.previousState = $state.path();
                            $state.go('login');
                        }
                        else if (failure != null) {
                            failure(error);
                        }
                    });
        };

        function put(url, data, success, failure) {
            return $http.put(url, data)
            .then(function (result) {
                //alert("result: " + result);
                success(data);
            }, function (error) {
                if (error.status == '401') {
                    notificationService.displayError('Autenticación requerida.');
                    $rootScope.previousState = $state.path();
                    $state.go('login');
                }
                else if (failure != null) {
                    failure(error);
                }
            });
        };

        function eliminar(url, data, success, failure) {
            //alert("eliminar");
            return $http.delete(url, data)
            .then(function (result) {
                //alert("result: " + result);
                success(result);
            }, function (error) {
                if (error.status == '401') {
                    notificationService.displayError('Autenticación requerida.');
                    $rootScope.previousState = $state.path();
                    $state.go('login');
                }
                else if (failure != null) {
                    failure(error);
                }
            });
        };

        var service = {
            get: get,
            put: put,
            post: post,
            eliminar: eliminar
        };

        return service;
    };
})();