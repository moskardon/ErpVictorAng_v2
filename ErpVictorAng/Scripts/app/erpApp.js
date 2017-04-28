
var erpApp;
//funcion anonima para implementar la variable erpApp que pasara a ser mi ambito representado con angular
(function () {
    'use strict';
    //ambito/scope de mi erpcris
    //con angular module indico a la libreria de angular, mi ambito ( erpApp ), que ha de cargar/inyectar las directivas/librerias que se han cargado previamente con
    //los bundles.
    erpApp = angular.module('erpApp', ['ngDialog', 'ngCookies', 'base64', 'angularValidator', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'ngResource']);

    //con esto configuro las cargas de los controladores y templates en funcion de la ruta en la barra de navegacion
    erpApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        //limpia la url
        $locationProvider.hashPrefix('');
        // por defecto, sino hay nada escrito, redirijo a la home "/"
        $urlRouterProvider.otherwise("/");

        //este es el modo en que ui.outer maneja lanavegacion entre vistas mediante el concepto de "estado"
        $stateProvider
            .state('home', {
                url: "/",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/home/index.html",
                        controller: "indexCtrl"
                    }
                }
            })
            .state('login', {
                url: "/login",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/account/login.html",
                        controller: "loginCtrl"
                    }
                }
            })
            .state('register', {
                url: "/register",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/account/register.html",
                        controller: "registerCtrl"
                    }
                }
            })
            .state('divisiones', {
                url: "/divisiones",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/division/divisionList.html",
                        controller: "divisionController"
                    }
                }
            })
            .state('familias', {
                url: "/familias",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/familia/familiaList.html",
                        controller: "familiaController"
                    }
                }
            })
            .state('subFamilias', {
                url: "/subFamilias",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/subFamilia/subFamiliaList.html",
                        controller: "subFamiliaController"
                    }
                }
            })
            .state('tipoUnidad', {
                url: "/tipoUnidad",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/tipoUnidad/tipoUnidadList.html",
                        controller: "tipoUnidadController"
                    }
                }
            })
            .state('unidad', {
                url: "/unidad",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/unidad/unidadList.html",
                        controller: "unidadController"
                    }
                }
            })
            .state('articulo', {
                url: "/articulo",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/articulo/articuloList.html",
                        controller: "articuloController"
                    }
                }
            })
            .state('descuento', {
                url: "/descuento",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/descuento/descuentoList.html",
                        controller: "descuentoController"
                    }
                }
            })
            .state('cliente', {
                url: "/cliente",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/cliente/clienteList.html",
                        controller: "clienteController"
                    }
                }
            })
            .state('presupuesto', {
                url: "/presupuesto",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/presupuesto/presupuestoList.html",
                        controller: "presupuestoController"
                    }
                }
            })
            .state('pedido', {
                url: "/pedido",
                views: {
                    'main': {
                        templateUrl: "Scripts/app/pedido/pedidoList.html",
                        controller: "pedidoController"
                    }
                }
            });

    });

    erpApp.run(function run($rootScope, $state, $cookieStore, $http) {
        // handle page refreshes
        $rootScope.repository = $cookieStore.get('repository') || {};
        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }

        $(document).ready(function () {
            //$(".fancybox").fancybox({
            //    openEffect: 'none',
            //    closeEffect: 'none'
            //});

            //$('.fancybox-media').fancybox({
            //    openEffect: 'none',
            //    closeEffect: 'none',
            //    helpers: {
            //        media: {}
            //    }
            //});

            $('[data-toggle=offcanvas]').click(function () {
                $('.row-offcanvas').toggleClass('active');
            });
        });
    });

    isAuthenticated.$inject = ['membershipService', '$rootScope', '$state'];

    function isAuthenticated(membershipService, $rootScope, $state) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $state.path();
            $state.path('/login');
        }
    }
})();
