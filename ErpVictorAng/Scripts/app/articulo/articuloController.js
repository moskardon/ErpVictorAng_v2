(function () {
    'use strict';
    var controllerId = 'articuloController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', articuloController]);

    function articuloController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.articulos = [];
        $scope.unidades = [];
        $scope.subFamilias = [];
        $scope.ddlUnidades = null;
        $scope.ddlSubFamilias = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newDesripcion = '';
        $scope.newMedida1 = '';
        $scope.newMedida2 = '';
        $scope.newIdUnidad = null;
        $scope.newIdSubFamilia = null;
        $scope.newPrecioBase = null;
        $scope.newArticulo = { Nombre: $scope.newNombre, Descripcion: $scope.newDesripcion, Medida1: $scope.newMedida1, Medida2: $scope.newMedida2, IdUnidad: $scope.newIdUnidad, IdSubFamilia: $scope.newIdSubFamilia , PrecioBase: $scope.newPrecioBase};

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateArticulo = updateArticulo;
        $scope.addArticulo = addArticulo;
        $scope.deleteArticulo = deleteArticulo;
        $scope.changedUnidadValue = changedUnidadValue;
        $scope.changedSubFamiliaValue = changedSubFamiliaValue;

        var url = '/api/articulo/';

        //****Gestión Unidades*****

        //getAllCompleted
        function getAllUnidadesCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.unidades = result.data;
            fillSubFamilias();
        };

        //getAllFailed
        function getAllUnidadesFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //fillUnidades 
        function fillUnidades() {
            $scope.dataLoading = true;
            apiService.get('api/unidad/' + 'GetAll', null, getAllUnidadesCompleted, getAllUnidadesFailed);
        };

        //getUnidad
        function getUnidad(unidad) {
            return unidad.IdUnidad === $scope.ddlUnidades;
        };

        //setUnidadSelected
        function setUnidadSelected(idUnidad) {
            $scope.ddlUnidades = idUnidad;
            var unidadSelect = $scope.unidades.find(getUnidad);
            $scope.ddlUnidades = unidadSelect;
        };

        //****Gestión SubFamilias*****

        //getAllCompleted
        function getAllSubFamiliasCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.subFamilias = result.data;
        };

        //getAllFailed
        function getAllSubFamiliasFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //fillSubFamilias 
        function fillSubFamilias() {
            $scope.dataLoading = true;
            apiService.get('api/subFamilia/' + 'GetAll', null, getAllSubFamiliasCompleted, getAllSubFamiliasFailed);
        };

        //getSubFamilia
        function getSubFamilia(subFamilia) {
            //alert(subFamilia);
            return subFamilia.IdSubFamilia === $scope.ddlSubFamilias;
        };

        //setSubFamiliaSelected
        function setSubFamiliaSelected(idSubFamilia) {
            $scope.ddlSubFamilias = idSubFamilia;
            var subFamiliaSelect = $scope.subFamilias.find(getSubFamilia);
            $scope.ddlSubFamilias = subFamiliaSelect;
        };

        //****Gestión Articulos*****

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.articulos, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
            fillUnidades();
            //fillSubFamilias();
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.articulos = result.data;
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
        function toggleEdit(articulo) {
            setUnidadSelected(articulo.IdUnidad);
            setSubFamiliaSelected(articulo.IdSubFamilia);
            angular.forEach($scope.articulos, function (obj) {
                if (obj["IdArticulo"] != articulo.IdArticulo && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            //alert("showEdit: " + familia.showEdit)
            articulo.showEdit = !articulo.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newDescripcion = '';
            $scope.newMedida1 = '';
            $scope.newMedida2 = '';
            $scope.newIdUnidad = null;
            $scope.newIdSubFamilia = null;
            $scope.newPrecioBase = null;
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.articulos, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateArticulo
        function updateArticulo(articulo) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', articulo, updateArticuloCompleted, updateArticuloFailed);
        };

        //updateArticuloCompleted
        function updateArticuloCompleted(articulo) {
            $scope.dataLoading = false;
            articulo.showEdit = !articulo.showEdit;
            notificationService.displaySuccess('Artículo actualizado.');
            getAll();
        };

        //updateArticuloFailed
        function updateArticuloFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addArticulo
        function addArticulo() {
            $scope.dataLoading = true;
            $scope.newArticulo.Nombre = $scope.newNombre;
            $scope.newArticulo.Descripcion = $scope.newDescripcion;
            $scope.newArticulo.Medida1 = $scope.newMedida1;
            $scope.newArticulo.Medida2 = $scope.newMedida2;
            $scope.newArticulo.IdUnidad = $scope.newIdUnidad;
            $scope.newArticulo.IdSubFamilia = $scope.newIdSubFamilia;
            $scope.newArticulo.PrecioBase = $scope.newPrecioBase;
            apiService.post(url + 'Add', $scope.newArticulo, addArticuloCompleted, addArticuloFailed);
        };

        //addArticuloCompleted
        function addArticuloCompleted(articulo) {
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Articulo creado.');
            getAll();
        };

        //addArticuloFailed
        function addArticuloFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //deleteArticulo
        function deleteArticulo(articulo) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + articulo.IdArticulo, articulo.IdArticulo, deleteArticuloCompleted, deleteArticuloFailed);
            };

            var title = "Se eliminará el Artículo: '" + articulo.Nombre + "'";
            var msg = "¿Confirma eliminación de este Artículo?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);

        };

        //deleteArticuloCompleted
        function deleteArticuloCompleted(articulo) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Artículo eliminado.');
            getAll();
        };

        //deleteArticuloFailed
        function deleteArticuloFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        /*$scope.changedValue = function changedUnidadValue(item, articulo) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            articulo.IdUnidad = item.IdUnidad;
            //articulo.IdSubFamilia = item.IdSubFamilia;
        }*/
        //Sincroniza valor del SelectList 
        //$scope.changedUnidadValue =
        function changedUnidadValue(item, articulo) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            articulo.IdUnidad = item.IdUnidad;
            //alert(item.IdUnidad);
            //articulo.IdSubFamilia = item.IdSubFamilia;
        }

        //$scope.changedSubFamiliaValue =
        function changedSubFamiliaValue(item, articulo) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            //articulo.IdUnidad = item.IdUnidad;
            //alert(item.IdSubFamilia);
            articulo.IdSubFamilia = item.IdSubFamilia;
        }
    }
})();