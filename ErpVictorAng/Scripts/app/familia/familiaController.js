(function () {
    'use strict';
    var controllerId = 'familiaController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', familiaController]);

    function familiaController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.familias = [];
        $scope.divisiones = [];
        $scope.ddlDivisiones = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newIdDivision = null;
        $scope.newFamilia = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion, IdDivision: $scope.newIdDivision };

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateFamilia = updateFamilia;
        $scope.addFamilia = addFamilia;
        $scope.deleteFamilia = deleteFamilia;

        var url = '/api/familia/';

        //****Gestión Divisiones*****

        //getAllCompleted
        function getAllDivisionesCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.divisiones = result.data;
        };

        //getAllFailed
        function getAllDivisionesFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //fillDivisiones
        function fillDivisiones() {
            $scope.dataLoading = true;
            apiService.get('api/division/' + 'GetAll', null, getAllDivisionesCompleted, getAllDivisionesFailed);
        };

        //getDivision
        function getDivision(division) {
            return division.IdDivision === $scope.ddlDivisiones;
        };

        //setDivisionSelected
        function setDivisionSelected(idDivision) {
            $scope.ddlDivisiones = idDivision;
            var divSelect = $scope.divisiones.find(getDivision);
            $scope.ddlDivisiones = divSelect;
        };

        //****Gestión Divisiones*****

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.familias, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
            fillDivisiones();
        };
        
        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.familias = result.data;
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

        ////getAll
        //function getAll() {
        //    familiaFactory.getFamilias().then(function (data) {
        //        $scope.dataLoading = false;
        //        $scope.familias = data.data;
        //        $scope.dataLoaded = true;
        //        initialize();
        //    }).then(function (error) {
        //        if (error != undefined) {
        //            $scope.dataLoading = false;
        //            $scope.dataLoaded = false;
        //            notificationService.displayError('Error: ' + error.data);
        //            $scope.Clientes = error;
        //        }
        //    });
        //};

        getAll();

        //toggleEdit
        function toggleEdit(familia) {
            setDivisionSelected(familia.IdDivision);
            angular.forEach($scope.familias, function (obj) {
                if (obj["IdFamilia"] !== familia.IdFamilia && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            //alert("showEdit: " + familia.showEdit)
            familia.showEdit = !familia.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.newIdDivision = null;
            $scope.showAdd = $scope.showAdd ? false : true;
            
            angular.forEach($scope.familias, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateFamilia
        function updateFamilia(familia) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', familia, updateFamiliaCompleted, updateFamiliaFailed);
        };

        //updateFamiliaCompleted
        function updateFamiliaCompleted(familia) {
            $scope.dataLoading = false;
            familia.showEdit = !familia.showEdit;
            notificationService.displaySuccess('Familia actualizada.');
            getAll();
        };

        //updateFamiliaFailed
        function updateFamiliaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addFamilia
        function addFamilia() {
            $scope.dataLoading = true;
            $scope.newFamilia.Nombre = $scope.newNombre;
            $scope.newFamilia.Descripcion = $scope.newDescripcion;
            $scope.newFamilia.IdDivision = $scope.newIdDivision;
            apiService.post(url + 'Add', $scope.newFamilia, addFamiliaCompleted, addFamiliaFailed);
        };

        //addFamiliaCompleted
        function addFamiliaCompleted(familia) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Familia creada.');
            getAll();
        };

        //addFamiliaFailed
        function addFamiliaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //deleteFamilia
        function deleteFamilia(familia) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + familia.IdFamilia, familia.IdFamilia, deleteFamiliaCompleted, deleteFamiliaFailed);
            };

            var title = "Se eliminará la Familia: '" + familia.Nombre + "'";
            var msg = "¿Confirma eliminación de esta Familia?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };

        //deleteFamiliaCompleted
        function deleteFamiliaCompleted(familia) {
            //alert(JSON.stringify(familia));
            $scope.dataLoading = false;
            notificationService.displaySuccess('Familia eliminada.');
            getAll();
        };

        //deleteFamiliaFailed
        function deleteFamiliaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };
        
      
        //Sincroniza valor del SelectList 
        $scope.changedValue = function changedValue(item, familia) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            familia.IdDivision = item.IdDivision;
        }
    }
})();