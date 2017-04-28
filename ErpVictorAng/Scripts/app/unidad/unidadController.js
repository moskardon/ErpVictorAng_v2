(function () {
    'use strict';
    var controllerId = 'unidadController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', unidadController]);

    function unidadController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.unidades = [];
        $scope.tipoUnidades = [];
        $scope.ddlTipoUnidades = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDescripcion = '';
        $scope.newNumeroMedida = '';
        $scope.newIdTipoUnidad= null;
        $scope.newUnidad = { Nombre: $scope.newNombre, Descripcion: $scope.newDescripcion, NumeroMedida: $scope.newNumeroMedida, IdTipoUnidad: $scope.newIdTipoUnidad };

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateUnidad= updateUnidad;
        $scope.addUnidad = addUnidad;
        $scope.deleteUnidad= deleteUnidad;

        var url = '/api/unidad/';

        //****Gestión Tipos de UNidad*****

        //getAllCompleted
        function getAllTipoUnidadCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.tipoUnidades = result.data;
        };

        //getAllFailed
        function getAllTipoUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //fillTipoUnidades
        function fillTipoUnidades() {
            $scope.dataLoading = true;
            apiService.get('api/tipoUnidad/' + 'GetAll', null, getAllTipoUnidadCompleted, getAllTipoUnidadFailed);
        };

        //getTipoUnidad
        function getTipoUnidad(tipoUnidad) {
            return tipoUnidad.IdTipoUnidad === $scope.ddlTipoUnidades;
        };

        //setTipoUnidadSelected
        function setTipoUnidadSelected(idTipoUnidad) {
            $scope.ddlTipoUnidades = idTipoUnidad;
            var tUniSelect = $scope.tipoUnidades.find(getTipoUnidad);
            $scope.ddlTipoUnidades = tUniSelect;
        };

        //****Gestión unidades*****

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.unidades, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
            fillTipoUnidades();
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.unidades = result.data;
            $scope.dataLoaded = true;
            initialize();
        };

        //getAllFailed
        function getAllFailed(response) {
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //getAll
        function getAll() {
            $scope.dataLoading = true;
            apiService.get(url + 'GetAll', null, getAllCompleted, getAllFailed);
        };
        
        getAll();

        //toggleEdit
        function toggleEdit(unidad) {
            setTipoUnidadSelected(unidad.IdTipoUnidad);
            angular.forEach($scope.unidades, function (obj) {
                if (obj["IdUnidad"] != unidad.IdUnidad && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            //alert("showEdit: " + familia.showEdit)
            unidad.showEdit = !unidad.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.newNumeroMedida = '';
            $scope.newIdTipoUnidad = null;
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.unidades, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateUnidad
        function updateUnidad(unidad) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', unidad, updateUnidadCompleted, updateUnidadFailed);
        };

        //updateUnidadCompleted
        function updateUnidadCompleted(unidad) {
            $scope.dataLoading = false;
            unidad.showEdit = !unidad.showEdit;
            notificationService.displaySuccess('Unidad actualizada.');
            getAll();
        };

        //updateUnidadFailed
        function updateUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addUnidad
        function addUnidad() {
            $scope.dataLoading = true;
            $scope.newUnidad.Nombre = $scope.newNombre;
            $scope.newUnidad.Descripcion = $scope.newDescripcion;
            $scope.newUnidad.NumeroMedida = $scope.newNumeroMedida;
            $scope.newUnidad.IdTipoUnidad = $scope.newIdTipoUnidad;            
            apiService.post(url + 'Add', $scope.newUnidad, addUnidadCompleted, addUnidadFailed);
        };

        //addUnidadCompleted
        function addUnidadCompleted(unidad) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Unidad creada.');
            getAll();
        };

        //addUnidadFailed
        function addUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //deleteUnidad
        function deleteUnidad(unidad) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + unidad.IdUnidad, unidad.IdUnidad, deleteUnidadCompleted, deletUnidadFailed);
            };

            var title = "Se eliminará la Unidad: '" + unidad.Nombre + "'";
            var msg = "¿Confirma eliminación de esta Unidad?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);

        };

        //deleteUnidadCompleted
        function deleteUnidadCompleted(unidad) {
            //alert(JSON.stringify(familia));
            $scope.dataLoading = false;
            notificationService.displaySuccess('Unidad eliminada.');
            getAll();
        };

        //deletUnidadFailed
        function deletUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //Sincroniza valor del SelectList 
        $scope.changedValue = function changedValue(item, unidad) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            unidad.IdTipoUnidad = item.IdTipoUnidad;
        }
    }
})();