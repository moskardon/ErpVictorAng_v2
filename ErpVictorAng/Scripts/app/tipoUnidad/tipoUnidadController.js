(function () {
    'use strict';
    var controllerId = 'tipoUnidadController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', tipoUnidadController]);

    function tipoUnidadController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.tipoUnidades = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newTipoUnidad = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion };
        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        //$scope.divisionUpdating = null;
        $scope.tipoUnidadUpdating = null;

        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        /*$scope.updateDivision = updateDivision;
        $scope.addDivision = addDivision;
        $scope.deleteDivision = deleteDivision;*/
        $scope.updateTipoUnidad = updateTipoUnidad;
        $scope.addTipoUnidad = addTipoUnidad;
        $scope.deleteTipoUnidad = deleteTipoUnidad;

        var url = '/api/tipoUnidad/';
        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.tipoUnidades, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            }
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.tipoUnidades = result.data;
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
        function toggleEdit(tipoUnidad) {
            angular.forEach($scope.tipoUnidades, function (obj) {
                if (obj["IdTipoUnidad"] !== tipoUnidad.IdTipoUnidad && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            tipoUnidad.showEdit = !tipoUnidad.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.tipoUnidades, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateTipoUnidad
        function updateTipoUnidad(tipoUnidad) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', tipoUnidad, updateTipoUnidadCompleted, updateTipoUnidadFailed);
        };

        //updateTipoUnidadCompleted
        function updateTipoUnidadCompleted(tipoUnidad) {
            $scope.dataLoading = false;
            tipoUnidad.showEdit = !tipoUnidad.showEdit;
            notificationService.displaySuccess('Tipo de Unidad actualizada.');
            getAll();
        };

        //updateTipoUnidadFailed
        function updateTipoUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addTipoUnidad
        function addTipoUnidad() {
            $scope.dataLoading = true;
            $scope.newTipoUnidad.Nombre = $scope.newNombre;
            $scope.newTipoUnidad.Descripcion = $scope.newDescripcion;
            apiService.post(url + 'Add', $scope.newTipoUnidad, addTipoUnidadCompleted, addTipoUnidadFailed);
        };

        //addTipoUnidadCompleted
        function addTipoUnidadCompleted(tipoUnidad) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Tipo de Unidad creado.');
            getAll();
        };

        //addTipoUnidadFailed
        function addTipoUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //deleteTipoUnidad
        function deleteTipoUnidad(tipoUnidad) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + tipoUnidad.IdTipoUnidad, tipoUnidad.IdTipoUnidad, deleteTipoUnidadCompleted, deleteTipoUnidadFailed);
            };

            var title = "Se eliminará el tipo de unidad: '" + tipoUnidad.Nombre + "'";
            var msg = "¿Confirma eliminación de este tipo de unidad?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);

        };

        //deleteTipoUnidadCompleted
        function deleteTipoUnidadCompleted(tipoUnidad) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Tipo de Unidad eliminado.');
            getAll();
        };

        //deleteTipoUnidadFailed
        function deleteTipoUnidadFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        function _setOrderByColumn(column) {
            if (self.orderByColumn == column) {
                // change order
                self.orderByReverse = !self.orderByReverse;
            } else {
                // order using new column
                self.orderByColumn = column;
                self.orderByReverse = false;
            }

            _applyOrder();
        }

        function _applyOrder() {
            $scope.tipoUnidades.sort(function (a, b) {
                var comparisonResult = 0;

                var aField = a[self.orderByColumn];
                var bField = b[self.orderByColumn];

                if (aField === null) aField = "";
                if (bField === null) bField = "";


                if (aField < bField) comparisonResult = -1;
                if (aField > bField) comparisonResult = 1;

                if (self.orderByReverse) {
                    comparisonResult = comparisonResult * (-1);
                }

                return comparisonResult;
            });
        }
    }
})();