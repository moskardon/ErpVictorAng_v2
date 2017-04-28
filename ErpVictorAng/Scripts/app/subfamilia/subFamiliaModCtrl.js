(function () {
    'use strict';

    erpApp.controller('subFamiliaModCtrl', ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', subFamiliaModCtrl]);

    function subFamiliaModCtrl(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {
        $scope.dataLoading = false;
        $scope.dataLoaded = false;
        $scope.ddlDivisiones = null;
        $scope.ddlFamilias = null;
        $scope.familias = [];
        $scope.divisiones = [];
        //$scope.newNombre = '';
        //$scope.newDesripcion = '';
        //$scope.newIdFamilia = null;
        //$scope.newIdDivision = null;
        //$scope.newSubFamilia = { IdSubFamilia: null, Nombre: '', Descripcion: '', IdFamilia: null, IdDivision: null };

        $scope.getTitle = getTitle;
        $scope.confirm = confirm;
        $scope.changedDivisionValue = changedDivisionValue;
        $scope.changedFamiliaValue = changedFamiliaValue;

        //apiServiceFailed
        function apiServiceFailed(reponse) {
            console.log(reponse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
            return 'KO';
        };

        //getTitle
        function getTitle() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                return 'Edicion: ' + $scope.EditedSubFamilia.Nombre;
            }
            else { return 'Nueva SubFamilia'; }
        }

        //****Gestión Divisiones*****
        //getAllDivisionesCompleted
        function getAllDivisionesCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.divisiones = result.data;
            //si esta informado...
            if ($scope.EditedSubFamilia.IdDivision != null) {
                setDivisionSelected($scope.EditedSubFamilia.IdDivision);
            }
            fillFamilias();
        };
        //fillDivisiones
        function fillDivisiones() {
            $scope.dataLoading = true;
            apiService.get('api/division/' + 'GetAll', null, getAllDivisionesCompleted, apiServiceFailed);
        };
        //definicion para encontrar el find
        //getDivision
        function getDivision(division) {
            return division.IdDivision === $scope.ddlDivisiones;
        };
        //setDivisionSelected
        function setDivisionSelected(idDivision) {
            //console.trace('$scope.divisiones.len: '+$scope.divisiones.len);
            $scope.ddlDivisiones = idDivision;
            var divSelect = $scope.divisiones.find(getDivision);
            $scope.ddlDivisiones = divSelect;
        };
        //****Gestión Divisiones*****

        //****Gestión Familias*****
        //getAllFamiliasCompleted
        function getAllFamiliasCompleted(result) {
            $scope.dataLoading = false;
            $scope.familias = result.data;
            if ($scope.EditedSubFamilia.IdFamilia != null) {
                setFamiliaSelected($scope.EditedSubFamilia.IdFamilia);
            }
        };
        //fillFamilias
        function fillFamilias() {
            if ($scope.EditedSubFamilia.IdDivision != null) {
                $scope.dataLoading = true;
                apiService.get('/api/familia/GetFamiliaByIdDivision/' + $scope.EditedSubFamilia.IdDivision, null, getAllFamiliasCompleted, apiServiceFailed);
            }
        };
        //getFamilia
        function getFamilia(familia) {
            return familia.IdFamilia === $scope.ddlFamilias;
        };

        //setFamiliaSelected
        function setFamiliaSelected(idFamilia) {
            $scope.ddlFamilias = idFamilia;
            var famSelect = $scope.familias.find(getFamilia);
            $scope.ddlFamilias = famSelect;
        };
        //****Gestión Familias*****

        //initialize
        function initialize() {
            fillDivisiones();
        }
        initialize();

        //updateSubFamilia
        function updateSubFamilia() {
            $scope.dataLoading = true;
            apiService.put('api/subFamilia/Update', $scope.EditedSubFamilia, updateSubFamiliaCompleted, apiServiceFailed);
        };
        //updateSubFamiliaCompleted
        function updateSubFamiliaCompleted(subFamilia) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('SubFamilia actualizada.');
            return 'OK';
        };

        //addSubFamilia
        function addSubFamilia() {
            $scope.dataLoading = true;
            return apiService.post('api/subFamilia/Add', $scope.EditedSubFamilia, addSubFamiliaCompleted, apiServiceFailed);
        };
        //addSubFamiliaCompleted
        function addSubFamiliaCompleted(subFamilia) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('SubFamilia creada.');
        }

        //function sleep(ms) {
        //    return new Promise(resolve => setTimeout(resolve, ms));
        //}
        //confirm
        function confirm() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                updateSubFamilia()
            } else {
                addSubFamilia()
            }
            return 'ok';
        }


        //Sincroniza valor del SelectList Divisiones 
        function changedDivisionValue(item) {
            $scope.EditedSubFamilia.IdDivision = item.IdDivision;
            fillFamilias();
        }

        //Sincroniza valor del SelectList Familias 
        function changedFamiliaValue(item) {
            $scope.EditedSubFamilia.IdFamilia = item.IdFamilia;
        }
    }
})();