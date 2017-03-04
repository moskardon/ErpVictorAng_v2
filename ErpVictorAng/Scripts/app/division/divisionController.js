(function(){
    'use strict';
    var controllerId = 'divisionController';

    erpApp.controller(controllerId, ['$scope', 'ngDialog', 'divisionFactory', 'modalWindowFactory', 'notificationService', divisionController]);

    function divisionController($scope, ngDialog, divisionFactory, modalWindowFactory, notificationService) {
        $scope.divisiones = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDescripcion = '';
        $scope.newDivision = { Nombre: $scope.newNombre, Desripcion: $scope.newDescripcion };
        $scope.dataLoaded = false;
        $scope.dataLoading = true;
        $scope.template = '';
        $scope.orderByColumn = '';
        $scope.columnsDefinition = [];

        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateDivision = updateDivision;
        $scope.addDivision = addDivision;
        $scope.deleteDivision = deleteDivision;

        //GET ALL
        function getAll() {
            divisionFactory.getDivisiones().then(function (data) {
                //data.data ya que JSON lo encapsula en un objeto data superior
                $scope.dataLoading = false;
                $scope.divisiones = data.data;
                angular.forEach($scope.divisiones, function (obj) {
                    obj["showEdit"] = true;
                })
                $scope.dataLoaded = true;
                //indicamos que a la capa con el id divWrapper que se muestre bloqueada
                $('#divWrapper').css('display','block');
            }).then(function (error) {
                if (error != undefined) {
                    alert("Get All ERROR: " + error);
                    //esta linea es probisional
                    //$scope.Clientes = error;
                    $scope.dataLoading = false;
                    notificationService.displayError('Error: ' + error.data);
                    $scope.Clientes = error;
                }
            });
        };
        getAll();

        //UPDATE
        function updateDivision(division) {
            divisionFactory.updateDivision(division).then(function (data) {
                //division.showEdit = division.showEdit ? false : true;
                division.showEdit = !division.showEdit;
                notificationService.displaySuccess('División actualizada.');
                getAll();

            }).then(function (error) {
                if (error != undefined) {
                    alert("Update ERROR: " + error);
                    //esta linea es probisional
                    //$scope.Clientes = error;
                    notificationService.displayError('Error: ' + error.data);
                }
            });
        };


        //nuevo toggleEdit,
        function toggleEdit(division, refresh) {
            division.showEdit = !division.showEdit;
            if (refresh) {
                getAll();
            }
        };
        //$scope.toggleEdit = function (division, refresh) {
        //    division.showEdit = division.showEdit ? false : true;
        //    if (refresh) {
        //        getAll();
        //    }
        //};

        /*$scope.toggleEdit = function (division) {
            division.showEdit = division.showEdit ? false : true;
            if (division.showEdit)
            {
                divisionFactory.updateDivision(division).then(function (data) {
                    getAll();
                }).then(function (error) { });
            }
        };*/
        //mostrar controles
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.showAdd = $scope.showAdd ? false : true;
        };
        //$scope.showNew = function () {
        //    $scope.newNombre = '';
        //    $scope.newDescripcion = '';
        //    $scope.showAdd = $scope.showAdd ? false : true;
        //};

        //add Division
        function addDivision() {
            $scope.showAdd = false;
            $scope.newDivision.Nombre = $scope.newNombre;
            $scope.newDivision.Descripcion = $scope.newDescripcion;
            //alert(JSON.stringify($scope.newDivision));
            divisionFactory.addDivision($scope.newDivision).then(function (data) {
                notificationService.displaySuccess('División creada.');
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    notificationService.displayError('Error: ' + error.data);
                }
            });
        };
        //$scope.addDivision = function () {
        //    $scope.showAdd = false;
        //    $scope.newDivision.Nombre = $scope.newNombre;
        //    $scope.newDivision.Descripcion = $scope.newDescripcion;
        //    divisionFactory.addDivision($scope.newDivision).then(function (data) {
        //        getAll();
        //    }).then(function (error) {
        //        if (error != undefined) {
        //            alert("Add ERROR: " + error);
        //            //esta linea es probisional
        //            //$scope.Clientes = error;
        //        }
        //    });
        //};

        //$scope.deleteDivision = function (division) {
        //    divisionFactory.deleteDivision(division).then(function (data) {
        //        getAll();
        //    }).then(function (error) {
        //        if (error != undefined) {
        //            alert("Delete ERROR: " + error);
        //            //esta linea es probisional
        //            //$scope.Clientes = error;
        //        }
        //    });
        //};

        //Delete
        function deleteDivision(division) {
            var deleteItem = function () {
                divisionFactory.deleteDivision(division.IdDivision).then(function (data) {
                    notificationService.displaySuccess('División eliminada.');
                    getAll();
                }).then(function (error) {
                    if (error != undefined) {
                        notificationService.displayError('Error: ' + error.data);
                    }
                });
            };

            var title = "Se eliminará la División: '" + division.Nombre + "'";
            var msg = "¿Confirma eliminación de esta División?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);

        };
        //$scope.showModalDialog = function showModalDialog(division, idModal) {
        //    ngDialog.openConfirm({
        //        scope: $scope,
        //        template: '<div class="ngdialog-message">' +
        //                      '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Confirmar Borrado</h2>' +
        //                      '  <br><span>Se borrará la División: ' + division.Nombre + '</span>' +
        //                      '    <div class="ngdialog-buttons"><br>' +
        //                      '      <button type="button" class="ngdialog-button" ng-click="confirm(' + division.IdDivision + ')">Aceptar</button>' +
        //                      '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancelar</button>' +
        //                      '    </div>' +
        //                      '</div>',
        //        plain: true
        //    }).then(function (confirm) {
        //        //alert('IdDivision: ' + division.IdDivision + 'IdDivision: ' + confirm);
        //        divisionFactory.deleteDivision(division).then(function (data) {
        //            getAll();
        //        }).then(function (error) {
        //            if (error != undefined) {
        //                alert("Update ERROR: " + error);
        //                $scope.Clientes = error;
        //            }
        //        });
        //    }, function (reject) {
        //        //alert('Rejected')
        //    });
        //};

        //Ordenacion
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