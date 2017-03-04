(function () {

    'use strict';
    //declaramos un servicio
    var serviceId = 'familiaFactory';
    //declaro el constructor
    erpApp.factory(serviceId, ['$http', familiaFactory]);
    //funcion que implementa el servicio este xD
    function familiaFactory($http) {
        var url = 'api/familiaapi/';
        var fam = [];
        //fuincion que llama al controlador para recoger todas las divisiones
        fam.getFamilias = function () {
            return $http.get(url + 'GetAll')
        };

        fam.fillDivisiones = function () {
            //return $http.get(url + 'FillDivisiones')
            return $http.get('api/divisionapi/' + 'GetAll')
        };

        //funcion que le envia al controlador los datos a actualizar
        fam.updateFamilia = function (familia) {
            return $http({
                method: 'PUT',
                url: url + 'Update',
                data: familia
            })
        };
        //funcion que envia al controllador un nuevo objeto division para introducirlo
        fam.addFamilia = function (familia) {
            //alert("focoooo");
            return $http({
                method: 'POST',
                url: url + 'Add',
                data: familia
            })
        };

        fam.deleteFamilia = function (familia) {
            return $http({
                method: 'DELETE',
                url: url + 'delete?id=' + familia.IdFamilia,
                dara: familia
            })
        };


        //devolvemos el objeto div ( division ) con la implementacion anterior
        return fam;
        //generamos un array de servicios con los creados arriba
        var service = {
            getFamilias: getFamilias,
            fillDivisiones: fillDivisiones,
            updateFamilia: updateFamilia,
            addFamilia: addFamilia,
            deleteFamilia: deleteFamilia
        };

        return service;
    };
})();