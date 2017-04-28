(function () {
    'use strict';
    var controllerId = 'subFamiliaController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', subFamiliaController]);

    function subFamiliaController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.subFamilias = [];
        $scope.showEdit = false;
        $scope.showAdd = false;

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;

        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;

        $scope.deleteSubFamilia = deleteSubFamilia;
        $scope.openEditDialog = openEditDialog;


        //apiServiceFailed
        function apiServiceFailed(reponse) {
            console.log(resonse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
        };

        //Rellenar familias
        function fillFamilias() {
            $scope.dataLoading = true;
            apiService.get('/api/familia/GetAll', null, getAllFamiliasCompleted, apiServiceFailed);
        };
        //getAllFamiliasCompleted
        function getAllFamiliasCompleted(result) {
            console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.dataLoaded = true;
            $scope.familias = result.data;
        };

        //Rellenar divisiones
        function fillDivisiones() {
            $scope.dataLoading = true;
            apiService.get('/api/division/GetAll', null, getAllDivisionesCompleted, apiServiceFailed);
        };
        //getAllDivisionesCompleted
        function getAllDivisionesCompleted(result) {
            console.log(JSON.stringify(result))
            $scope.divisiones = result.data;
        };

        //getFamilia
        function getFamilia(familia) {
            return familia.IdFamilia === $scope.ddlFamilias;
        };

        //getDivision
        function getDivision(division) {
            return division.IdDivision === $scope.ddlDivisiones;
        };

        //setFamiliaSelected
        function setFamiliaSelected(idFamilia) {
            $scope.ddlFamilias = idFamilia;
            var divSelect = $scope.familias.find(getFamilia);
            $scope.ddlFamilias = divSelect;
        };
        //setDivisionSelected
        function setDivisionSelected(idDivision) {
            $scope.ddlDivisiones = idDivision;
            var divSelect = $scope.divisiones.find(getDivision);
            $scope.ddlDivisiones = divSelect;
        };

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.subFamilias, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //getAll
        function getAll() {
            $scope.dataLoading = true;
            apiService.get('/api/subFamilia/GetAll', null, getAllCompleted, apiServiceFailed);
        };

        //getAllCompleted
        function getAllCompleted(result) {
            //console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.subFamilias = result.data;
            $scope.dataLoaded = true;
            initialize();
        };

        getAll();

        //toggleEdit
        function toggleEdit(subFamilia) {
            openEditDialog(subFamilia, 'edit')
        };

        //************************
        //openEditDialog
        function openEditDialog(subFamilia, showMode) {
            $scope.EditedSubFamilia = subFamilia;
            $scope.ShowMode = showMode;

            var promiseCount = 0;
            var thisPromiseCount = ++promiseCount;

            var dialog = ngDialog.open({
                template: 'Scripts/app/subfamilia/subFamiliaMod.html',
                controller: 'subFamiliaModCtrl',
                closeByDocument: true,
                className: 'ngdialog-theme-default custom-width',
                scope: $scope
            });

            dialog.closePromise.then(function (data) {
                console.log('p1data.value: ' + data.value)
                if (data.value != undefined) {
                    //notification.show('success', 'Password was updated.');
                    console.log('data: ' + data)
                    console.log('data.promise: ' + JSON.stringify(data.value))

                    //window.setTimeout(getAll(), 5000);
                    alert('Contenido Actualizado')
                    getAll();
                }
                else {
                    //notification.show('info', 'Password was not updated.');
                    console.log('else')
                }
            });
        }
        //*******************
        //showNew
        function showNew() {
            openEditDialog({ Nombre: '', Descripcion: '', IdFamilia: null, IdDivision: null }, 'new');
        };

        //delete Sub Familia
        function deleteSubFamilia(subFamilia) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar('api/SubFamilia/Delete?id=' + subFamilia.IdSubFamilia, subFamilia.IdSubFamilia, deleteSubFamiliaCompleted, apiServiceFailed);
            };

            var title = "Se eliminará la Sub Familia: '" + subFamilia.Nombre + "'";
            var msg = "¿Confirma eliminación de esta Sub Familia?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };
        //deleteSubFamiliaCompleted
        function deleteSubFamiliaCompleted(subFamilia) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('SubFamilia eliminada.');
            getAll();
        };
    }
})();