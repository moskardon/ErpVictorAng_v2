(function () {
    'use strict';
    var controllerId = 'descuentoController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', descuentoController]);

    function descuentoController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.descuentos = [];
        $scope.divisiones = [];
        $scope.familias = [];
        $scope.subFamilias = [];
        $scope.articulos = [];
        $scope.ddlDivisiones = null;
        $scope.ddlFamilias = null;
        $scope.ddlSubFamilias = null;
        $scope.ddlArticulos = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newValor = null;
        //$scope.newDesripcion = '';
        $scope.newIdDivision = null;
        $scope.newIdFamilia = null;
        $scope.newIdSubFamilia = null;
        $scope.newIdArticulo = null;
        $scope.newDescuento = { Valor: $scope.newValor, IdDivision: $scope.newIdDivision, IdFamilia: $scope.newIdFamilia, IdSubFamilia: $scope.newIdSubFamilia, IdArticulo: $scope.newIdArticulo };

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateDescuento = updateDescuento;
        $scope.addDescuento = addDescuento;
        $scope.deleteDescuento = deleteDescuento;

        var url = '/api/descuento/';

        //****Gestión Divisiones*****

        //getAllCompleted
        function getAllDivisionesCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.divisiones = result.data;
            fillFamilias();
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

        //****Gestión Familias*****

        //getAllCompleted
        function getAllFamiliasCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.familias = result.data;
            fillSubFamilias();
        };

        //getAllFailed
        function getAllFamiliasFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //fillFamilias
        function fillFamilias() {
            $scope.dataLoading = true;
            apiService.get('api/familia/' + 'GetAll', null, getAllFamiliasCompleted, getAllFamiliasFailed);
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



        //****Gestión Sub Familias*****

        //getAllCompleted
        function getAllSubFamiliasCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.subFamilias = result.data;
            fillArticulos();
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
            return subFamilia.IdSubFamilia === $scope.ddlSubFamilias;
        };

        //setSubFamiliaSelected
        function setSubFamiliaSelected(idSubFamilia) {
            $scope.ddlSubFamilias = idSubFamilia;
            var subFamSelect = $scope.subFamilias.find(getSubFamilia);
            $scope.ddlSubFamilias = subFamSelect;
        };



        //****Gestión Articulos*****

        //getAllCompleted
        function getAllArticulosCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.articulos = result.data;
        };

        //getAllFailed
        function getAllArticulosFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //fillArticulos
        function fillArticulos() {
            $scope.dataLoading = true;
            apiService.get('api/articulo/' + 'GetAll', null, getAllArticulosCompleted, getAllArticulosFailed);
        };

        //getArticulo
        function getArticulo(articulo) {
            return articulo.IdArticulo === $scope.ddlArticulos;
        };

        //setArticuloSelected
        function setArticuloSelected(idArticulo) {
            $scope.ddlArticulos = idArticulo;
            var artSelect = $scope.articulos.find(getArticulo);
            $scope.ddlArticulos = artSelect;
        };

        //****Gestión Descuentos*****

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.descuentos, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
            fillDivisiones();
            //fillFamilias();
            //fillSubFamilias();
            //fillArticulos();
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.descuentos = result.data;
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
        function toggleEdit(descuento) {
            setDivisionSelected(descuento.IdDivision);
            setFamiliaSelected(descuento.IdFamilia);
            setSubFamiliaSelected(descuento.IdSubFamilia);
            setArticuloSelected(descuento.IdArticulo);
            angular.forEach($scope.descuentos, function (obj) {
                if (obj["IdDescuento"] != descuento.IdDescuento && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            //alert("showEdit: " + familia.showEdit)
            descuento.showEdit = !descuento.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newValor = null;
            //$scope.newDescripcion = '';
            $scope.newIdDivision = null;
            $scope.newIdFamilia = null;
            $scope.newIdSubFamilia = null;
            $scope.newIdArticulo = null;
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.descuentos, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateDescuento
        function updateDescuento(descuento) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', descuento, updateDescuentoCompleted, updateDescuentoFailed);
        };

        //updateDescuentoCompleted
        function updateDescuentoCompleted(descuento) {
            $scope.dataLoading = false;
            descuento.showEdit = !descuento.showEdit;
            notificationService.displaySuccess('Descuento actualizado.');
            getAll();
        };

        //updateDescuentoFailed
        function updateDescuentoFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addDescuento
        function addDescuento() {
            $scope.dataLoading = true;
            $scope.newDescuento.Valor = $scope.newValor;
            alert($scope.newValor);
            //$scope.newDescuento.Descripcion = $scope.newDescripcion;
            $scope.newDescuento.IdDivision = $scope.newIdDivision;
            $scope.newDescuento.IdFamilia = $scope.newIdFamilia;
            $scope.newDescuento.IdSubFamilia = $scope.newIdSubFamilia;
            $scope.newDescuento.IdArticulo = $scope.newIdArticulo;
            alert($scope.newDescuento.Valor + " - " + $scope.newDescuento.IdDivision + " - " + $scope.newDescuento.IdFamilia + " - " + $scope.newDescuento.IdSubFamilia + " - " + $scope.newDescuento.IdArticulo);
            apiService.post(url + 'Add', $scope.newDescuento, addDescuentoCompleted, addDescuentoFailed);
        };

        //addDescuentoCompleted
        function addDescuentoCompleted(descuento) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Descuento creado.');
            getAll();
        };

        //addDescuentoFailed
        function addDescuentoFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //deleteDescuento
        function deleteDescuento(descuento) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + descuento.IdDescuento, descuento.IdDescuento, deleteDescuentoCompleted, deleteDescuentoFailed);
            };

            var title = "Se eliminará el Descuento: '" + descuento.Valor + "'";
            var msg = "¿Confirma eliminación de este Descuento?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);

        };

        //deleteDescuentoCompleted
        function deleteDescuentoCompleted(descuento) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Descuento eliminado.');
            getAll();
        };

        //deleteDescuentoFailed
        function deleteDescuentoFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //Sincroniza valor del SelectList 
        $scope.changedValue = function changedValue(item, descuento) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            descuento.IdDivision = item.IdDivision;
            descuento.IdFamilia = item.IdFamilia;
            descuento.IdSubFamilia = item.IdSubFamilia;
            descuento.IdArticulo = item.IdArticulo;
        }
    }
})();