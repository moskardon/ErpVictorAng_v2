(function () {
    'use strict';
    var controllerId = 'familiaController';

    erpApp.controller(controllerId, ['$scope', 'ngDialog', 'familiaFactory', familiaController]);

    function familiaController($scope, ngDialog, familiaFactory) {
        $scope.familias = [];
        $scope.divisiones = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newIdDivision = '';
        $scope.newNombreDivision = '';
        $scope.newFamilia = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion, IdDivision: $scope.newIdDivision, NombreDivision: $scope.newNombreDivision };
        $scope.dataLoaded = false;


        function changeIdDivisionToName() {
            for(var i=0;i<$scope.familias.length;i++)
            {
                for(var x=0;x<$scope.divisiones.length;x++)
                {
                    if ($scope.familias[i].IdDivision == $scope.divisiones[x].IdDivision)
                    {
                        $scope.familias[i].NombreDivision = $scope.divisiones[x].Nombre;
                        //alert($scope.divisiones[x].Nombre);
                    }
                }
            }
        };

        function fillDivisiones() {
            familiaFactory.fillDivisiones().then(function (data) {
                //alert(data);
                //JSON.stringify(data.data);
                $scope.divisiones = data.data;
                //angular.forEach($scope.divisiones, function (obj) {
                //    obj["showEdit"] = true;
                //})
                //$scope.dataLoaded = true;
                //$('#divWrapper').css('display', 'block');
                changeIdDivisionToName();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Fill Divisiones ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        //getAll
        function getAll() {
            familiaFactory.getFamilias().then(function (data) {
                //alert(data);
                //JSON.stringify(data.data);
                $scope.familias = data.data;
                angular.forEach($scope.familias, function (obj) {
                    obj["showEdit"] = true;
                })
                $scope.dataLoaded = true;
                $('#divWrapper').css('display', 'block');
                //relleno las divisiones
                fillDivisiones();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Get All ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };
        //changeIdDivisionToName();
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

        $scope.toggleEdit = function (familia, refresh) {
            familia.showEdit = familia.showEdit ? false : true;
            if (refresh) {
                getAll();
            }
        };

        $scope.showNew = function () {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.showAdd = $scope.showAdd ? false : true;
        };

        //updateFamilia
        $scope.updateFamilia = function (familia) {
            familiaFactory.updateFamilia(familia).then(function (data) {
                familia.showEdit = familia.showEdit ? false : true;
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    alert("Update ERROR: " + error);
                    //$scope.Clientes = error;
                }
            });
        };

        //Add
        $scope.addFamilia = function () {
            $scope.showAdd = false;
            $scope.newFamilia.Nombre = $scope.newNombre;
            $scope.newFamilia.Descripcion = $scope.newDescripcion;
            $scope.newFamilia.IdDivision = $scope.newIdDivision;
            $scope.newFamilia.NombreDivision = $scope.newNombreDivision;
            //alert(JSON.stringify($scope.newFamilia));
            familiaFactory.addFamilia($scope.newFamilia).then(function (data) {
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
        $scope.showModalDialog = function showModalDialog(familia, idModal) {
            ngDialog.openConfirm({
                scope: $scope,
                template: '<div class="ngdialog-message">' +
                              '  <h2 class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i> Confirmar Borrado</h2>' +
                              '  <br><span>Se borrará la Familia: ' + familia.Nombre + '</span>' +
                              '    <div class="ngdialog-buttons"><br>' +
                              '      <button type="button" class="ngdialog-button" ng-click="confirm(' + familia.IdFamilia + ')">Aceptar</button>' +
                              '      <button type="button" class="ngdialog-button" ng-click="closeThisDialog()">Cancelar</button>' +
                              '    </div>' +
                              '</div>',
                plain: true
            }).then(function (confirm) {
                //alert('IdFamilia: ' + failia.IdFamilia + 'IdFamilia: ' + confirm);
                familiaFactory.deleteFamilia(familia).then(function (data) {
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