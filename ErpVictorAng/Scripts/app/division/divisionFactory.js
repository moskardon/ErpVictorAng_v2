(function () {

    'use strict';
    //declaramos un servicio
    var serviceId = 'divisionFactory';
    //declaro el constructor
    erpApp.factory(serviceId, ['$http', divisionFactory]);
    //funcion que implementa el servicio este xD
    function divisionFactory($http) {
        var url = 'api/divisionapi/';
        var div = [];
        //fuincion que llama al controlador para recoger todas las divisiones
        //div.getDivisiones = function () {
        //    return $http.get(url+'GetAll')
        //};
        div.getDivisiones = function () {
            return $http({
                method: 'get',
                url: url + 'GetAll'
            })
        };
        //funcion que le envia al controlador los datos a actualizar
        div.updateDivision = function (division) {
            return $http({
                method: 'PUT',
                url: url + 'Update',
                data: division
            })
        };
        //funcion que envia al controllador un nuevo objeto division para introducirlo
        div.addDivision = function (division) {
            return $http({
                method: 'POST',
                url: url + 'Add',
                data: division
            })
        };

        div.deleteDivision = function (IdDivision) {
            return $http({
                method: 'delete',
                url: url + 'Delete?id=' + IdDivision,
                data: IdDivision
            })
        };
        //div.deleteDivision = function (division) {
        //    return $http({
        //        method: 'DELETE',
        //        url: url + 'delete?id='+division.IdDivision,
        //        dara: division
        //    })
        //};


        //devolvemos el objeto div ( division ) con la implementacion anterior
        return div;
        //generamos un array de servicios con los creados arriba
        var service = {
            getDivisiones: getDivisiones,
            updateDivision: updateDivision,
            addDivision: addDivision,
            deleteDivision: deleteDivision
        };

        return service;
    };
})();