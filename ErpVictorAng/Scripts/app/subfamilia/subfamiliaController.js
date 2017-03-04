(function () {
    'use strict';
    var controllerId = 'subFamiliaController';

    erpApp.controller(controllerId, ['$scope', 'ngDialog', 'subFamiliaFactory', subFamiliaController]);

    function subFamiliaController($scope, ngDialog, subFamiliaFactory) {
        $scope.subFamilias = [];
        $scope.familias = [];
        $scope.divisiones = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newIdFamilia = '';
        $scope.newIdDivision = '';
        $scope.newSubFamilia = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion, IdFamilia: $scope.newIdFamilia, IdDivision: $scope.newIdDivision };
        $scope.dataLoaded = false;


        function fillFamilias() {
            subFamiliaFactory.fillFamilias().then(function (data) {
                $scope.familias = data.data;
            }).then(function (error) {
                if (error != undefined) {
                    alert("Fill Divisiones ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        function fillDivisiones() {
            subFamiliaFactory.fillDivisiones().then(function (data) {
                $scope.divisiones = data.data;
            }).then(function (error) {
                if (error != undefined) {
                    alert("Fill Divisiones ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        //getAll
        function getAll() {
            subFamiliaFactory.getSubFamilias().then(function (data) {
                //alert(data);
                //JSON.stringify(data.data);
                $scope.subFamilias = data.data;
                angular.forEach($scope.subFamilias, function (obj) {
                    obj["showEdit"] = true;
                })
                $scope.dataLoaded = true;
                $('#divWrapper').css('display', 'block');
                //relleno las familias
                fillFamilias();
                //relleno las divisiones
                fillDivisiones();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Get All ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        getAll();

        //function fillDivisiones() {
        //    familiaFactory.fillDivisiones().then(function (data) {
        //        //alert(data);
        //        //JSON.stringify(data.data);
        //        $scope.divisiones = data.data;
        //        //angular.forEach($scope.divisiones, function (obj) {
        //        //    obj["showEdit"] = true;
        //        //})
        //        //$scope.dataLoaded = true;
        //        //$('#divWrapper').css('display', 'block');
        //    }).then(function (error) {
        //        if (error != undefined) {
        //            alert("Fill Divisiones ERROR: " + error);
        //            //$scope.Clientes = error;
        //        }
        //    });
        //};

        $scope.toggleEdit = function (subFamilia, refresh) {
            subFamilia.showEdit = subFamilia.showEdit ? false : true;
            if (refresh) {
                getAll();
            }
        };

        $scope.showNew = function () {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.showAdd = $scope.showAdd ? false : true;
        };

        //update sub Familia
        $scope.updateSubFamilia = function (subFamilia) {
            subFamiliaFactory.updateSubFamilia(subFamilia).then(function (data) {
                subFamilia.showEdit = subFamilia.showEdit ? false : true;
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Update ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        //Add
        $scope.addSubFamilia = function () {
            $scope.showAdd = false;
            $scope.newSubFamilia.Nombre = $scope.newNombre;
            $scope.newSubFamilia.Descripcion = $scope.newDescripcion;

            $scope.newSubFamilia.IdDivision = $scope.newIdDivision;
            //alert(JSON.stringify($scope.newFamilia));
            subFamiliaFactory.addSubFamilia($scope.newSubFamilia).then(function (data) {
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Add ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        ////Delete
        //$scope.deleteDivision = function (division) {
        //    //showModalDialog();
        //    divisionFactory.deleteDivision(division).then(function (data) {
        //        getAll();
        //    }).then(function (error) {
        //        if (error != undefined) {
        //            alert("Update ERROR: " + error);
        //            $scope.Clientes = error;
        //        }                
        //    });
        //};

        //Delete
        $scope.showModalDialog = function showModalDialog(subFamilia, idModal) {
            ngDialog.openConfirm({
                scope: $scope,
                template: '<div class="ngdialog-message">' +
                              '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Confirmar Borrado</h2>' +
                              '  <br><span>Se borrará la Familia: ' + subFamilia.Nombre + '</span>' +
                              '    <div class="ngdialog-buttons"><br>' +
                              '      <button type="button" class="ngdialog-button" ng-click="confirm(' + subFamilia.IdSubFamilia + ')">Aceptar</button>' +
                              '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancelar</button>' +
                              '    </div>' +
                              '</div>',
                plain: true
            }).then(function (confirm) {
                //alert('IdFamilia: ' + failia.IdFamilia + 'IdFamilia: ' + confirm);
                subFamiliaFactory.deleteSubFamilia(subFamilia).then(function (data) {
                    getAll();
                }).then(function (error) {
                    if (error != undefined) {
                        alert("Update Modal ERROR: " + error);
                        $scope.Clientes = error;
                    }
                });
            }, function (reject) {
                //alert('Rejected')
            });
        };
    }
})();