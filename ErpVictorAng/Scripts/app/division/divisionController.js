(function () {
    'use strict';
    var controllerId = 'divisionController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', divisionController]);

    function divisionController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.divisiones = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newDivision = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion };
        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.divisionUpdating = null;

        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateDivision = updateDivision;
        $scope.addDivision = addDivision;
        $scope.deleteDivision = deleteDivision;
                
        var url = '/api/division/';
        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.divisiones, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            }
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.divisiones = result.data;
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
        function toggleEdit(division) {
            angular.forEach($scope.divisiones, function (obj) {
                if (obj["IdDivision"] !== division.IdDivision && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            division.showEdit = !division.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.divisiones, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateDivision
        function updateDivision(division) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', division, updateDivisionCompleted, updateDivisionFailed);
        };

        //updateDivisionCompleted
        function updateDivisionCompleted(division) {
            $scope.dataLoading = false;
            division.showEdit = !division.showEdit;
            notificationService.displaySuccess('División actualizada.');
            getAll();
        };

        //updateDivisionFailed
        function updateDivisionFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addDivision
        function addDivision() {
            $scope.dataLoading = true;
            $scope.newDivision.Nombre = $scope.newNombre;
            $scope.newDivision.Descripcion = $scope.newDescripcion;
            apiService.post(url + 'Add', $scope.newDivision, addDivisionCompleted, addDivisionFailed);
        };

        //addDivisionCompleted
        function addDivisionCompleted(division) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('División creada.');
            getAll();
        };

        //addDivisionFailed
        function addDivisionFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //deleteDivision
        function deleteDivision(division) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + division.IdDivision, division.IdDivision, deleteDivisionCompleted, deleteDivisionFailed);
            };

            var title = "Se eliminará la División: '" + division.Nombre + "'";
            var msg = "¿Confirma eliminación de esta División?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);


            //ngDialog.openConfirm({
            //    scope: $scope,
            //    //templateUrl: 'Scripts/app/division/partials/modalView.html'
            //    templateUrl: 'Scripts/app/templates/modal-window.view.html'
            //    //template: '<div class="ngdialog-message">' +
            //    //              '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Confirmar Borrado</h2>' +
            //    //              '  <br><span>Se borrará la División: ' + division.Nombre + '</span>' +
            //    //              '    <div class="ngdialog-buttons"><br>' +
            //    //              '      <button type="button" class="ngdialog-button" ng-click="confirm(' + division.IdDivision + ')">Aceptar</button>' +
            //    //              '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancelar</button>' +
            //    //              '    </div>' +
            //    //              '</div>',
            //    //plain: true
            //}).then(function (confirm) {
            //    alert('IdDivision: ' + division.IdDivision)
            //    divisionFactory.deleteDivision(division.IdDivision).then(function (data) {
            //        getAll();
            //    }).then(function (error) {
            //        if (error != undefined) {
            //            alert("Update ERROR: " + error);
            //            $scope.Clientes = error;
            //        }
            //    });
            //}, function (reject) {
            //    //alert('Rejected: ' + reject);
            //});
        };

        //deleteDivisionCompleted
        function deleteDivisionCompleted(division) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('División eliminada.');
            getAll();
        };

        //deleteDivisionFailed
        function deleteDivisionFailed(response) {
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
            $scope.divisiones.sort(function (a, b) {
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