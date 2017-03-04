(function () {

    'use strict';
    //declaramos un servicio
    var serviceId = 'subFamiliaFactory';
    //declaro el constructor
    erpApp.factory(serviceId, ['$http', subFamiliaFactory]);
    //funcion que implementa el servicio este xD
    function subFamiliaFactory($http) {
        var url = 'api/subfamiliaapi/';
        var subFam = [];

        //get sub familias
        subFam.getSubFamilias = function () {
            return $http.get(url + 'GetAll')
        };
        //get familias
        subFam.fillFamilias = function () {
            return $http.get('api/familiaapi/' + 'GetAll')
        };
        //get divisiones
        subFam.fillDivisiones = function () {
            return $http.get('api/divisionapi/' + 'GetAll')
        };

        //update subfamilia
        subFam.updateSubFamilia = function (subFamilia) {
            return $http({
                method: 'PUT',
                url: url + 'Update',
                data: subFamilia
            })
        };
        //add subfamilia
        subFam.addSubFamilia = function (subFamilia) {
            return $http({
                method: 'POST',
                url: url + 'Add',
                data: subFamilia
            })
        };
        //delete subfamilia
        subFam.deleteSubFamilia = function (subFamilia) {
            return $http({
                method: 'DELETE',
                url: url + 'delete?id=' + subFamilia.IdSubFamilia,
                dara: subFamilia
            })
        };

        return subFam;
        //generamos un array de servicios con los creados arriba
        var service = {
            getSubFamilias:getSubFamilias,
            fillFamilias: fillFamilias,
            fillDivisiones: fillDivisiones,
            updateSubFamilia: updateSubFamilia,
            addSubFamilia: addSubFamilia,
            deleteSubFamilia: deleteSubFamilia
        };

        return service;
    };
})();