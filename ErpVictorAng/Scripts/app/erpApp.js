//Arrancamos el entorno

//var erpApp;
//(function () {
//    'use strict';
//    //erpApp = angular.module('erpApp', [])
//    erpApp = angular.module('erpApp', ['ngDialog', 'ngRoute']);

var erpApp;
(function () {
    'use strict';
    erpApp = angular.module('erpApp', ['ngDialog', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'ngResource']);

    erpApp.config(function ($stateProvider, $urlRouterProvider) {
        });

})();