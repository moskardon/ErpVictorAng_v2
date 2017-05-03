(function () {
    'use strict';
    var controllerId = 'facturaController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', facturaController]);

    function facturaController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.facturas = [];
        $scope.pedidos = [];
        $scope.ddlPedidos = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNumeroFactura = '';
        $scope.newFechaCreacion = '';
        $scope.newIdPedido = null;
        $scope.newObservaciones = '';
        $scope.newIdCliente = null;
        $scope.newFactura = { NumeroFactura: $scope.newNumeroFactura, FechaCreacion: $scope.newFechaCreacion, IdPedido: $scope.newIdPedido, Observaciones: $scope.newObservaciones, IdCliente: $scope.newIdCliente };
        $scope.newNombreCliente = '';
        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateFactura = updateFactura;
        $scope.addFactura = addFactura;
        $scope.deleteFactura = deleteFactura;

        var url = '/api/factura/';

        //****Gestión Pedidos*****

        //getAllCompleted
        function getAllPedidosCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.pedidos = result.data;
        };

        //getAllFailed
        function getAllPedidosFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
            //alert(response.data)
        };

        //fillPedidos
        function fillPedidos() {
            $scope.dataLoading = true;
            apiService.get('api/pedido/' + 'GetAll', null, getAllPedidosCompleted, getAllPedidosFailed);
        };

        //getPedido
        function getPedido(pedido) {
            return pedido.IdPedido === $scope.ddlPedidos;
        };

        //setPedidoSelected
        function setPedidoSelected(idPedido) {
            $scope.ddlPedidos = idPedido;
            var pedSelect = $scope.pedidos.find(getPedido);
            $scope.ddlPedidos = pedSelect;
        };

        //****Gestión Pedidos*****

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.facturas, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
            fillPedidos();
        };

        //getAllCompleted
        function getAllCompleted(result) {
            $scope.dataLoading = false;
            $scope.facturas = result.data;
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
        function toggleEdit(factura) {
            setFacturaSelected(factura.IdPedido);
            angular.forEach($scope.facturas, function (obj) {
                if (obj["IdFactura"] !== factura.IdFactura && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            factura.showEdit = !factura.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNumeroFactura = '';
            $scope.newFechaCreacion = '';
            $scope.newIdPedido = null;
            $scope.newObservaciones = '';
            $scope.newIdCliente = null;


            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.facturas, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //updateFactura
        function updateFactura(factura) {
            $scope.dataLoading = true;
            apiService.put(url + 'Update', factura, updateFacturaCompleted, updateFacturaFailed);
        };

        //updateFacturaCompleted
        function updateFacturaCompleted(factura) {
            $scope.dataLoading = false;
            factura.showEdit = !factura.showEdit;
            notificationService.displaySuccess('Factura actualizada.');
            getAll();
        };

        //updateFacturaFailed
        function updateFacturaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };

        //addFactura
        function addFactura() {
            $scope.dataLoading = true;
            $scope.newFactura.NumeroFactura = $scope.newNumeroFactura;
            $scope.newFactura.FechaCreacion = $scope.newFechaCreacion;
            $scope.newFactura.IdPedido = $scope.newIdPedido;
            $scope.newFactura.Observaciones = $scope.newObservaciones;
            $scope.newFactura.IdCliente = $scope.newIdCliente;
            alert($scope.newFechaCreacion);

            apiService.post(url + 'Add', $scope.newFactura, addFacturaCompleted, addFacturaFailed);
        };

        //addFacturaCompleted
        function addFacturaCompleted(factura) {
            //alert("addDivisionCompleted");
            $scope.dataLoading = false;
            $scope.showAdd = false;
            notificationService.displaySuccess('Factura creada.');
            getAll();
        };

        //addFacturaFailed
        function addFacturaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //deleteFactura
        function deleteFactura(factura) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar(url + 'Delete?id=' + factura.IdFactura, factura.IdFactura, deleteFacturaCompleted, deleteFacturaFailed);
            };

            var title = "Se eliminará la Factura: '" + factura.NumeroFactura + "'";
            var msg = "¿Confirma eliminación de esta Factura?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };

        //deleteFacturaCompleted
        function deleteFacturaCompleted(factura) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Factura eliminada.');
            getAll();
        };

        //deleteFacturaFailed
        function deleteFacturaFailed(response) {
            $scope.dataLoading = false;
            notificationService.displayError("Error: " + response.data);
        };


        //Sincroniza valor del SelectList 
        $scope.changedValue = function changedValue(item, factura) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            //factura.IdPedido = item.IdPedido;
            $scope.newIdPedido = item.IdPedido;
            $scope.newIdCliente = item.IdCliente;
            $scope.newNombreCliente = item.NombreCliente;
        }
    }
})();