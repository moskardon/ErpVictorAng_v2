(function () {
    'use strict';
    var controllerId = 'pedidoController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', pedidoController]);

    function pedidoController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.pedidos = [];
        $scope.showEdit = false;
        $scope.showAdd = false;

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;

        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;

        $scope.deletePedido = deletePedido;
        $scope.openEditDialog = openEditDialog;


        //apiServiceFailed
        function apiServiceFailed(reponse) {
            console.log(resonse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
        };

        

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.pedidos, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //getAll
        function getAll() {
            $scope.dataLoading = true;
            apiService.get('/api/pedido/GetAll', null, getAllCompleted, apiServiceFailed);
        };

        //getAllCompleted
        function getAllCompleted(result) {
            //console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.pedidos = result.data;
            $scope.dataLoaded = true;
            initialize();
        };

        getAll();

        //toggleEdit
        function toggleEdit(pedido) {
            openEditDialog(pedido, 'edit')
        };

        //************************
        //openEditDialog
        function openEditDialog(pedido, showMode) {
            $scope.WorkPedido = pedido;
            $scope.ShowMode = showMode;

            var promiseCount = 0;
            var thisPromiseCount = ++promiseCount;

            var dialog = ngDialog.open({
                template: 'Scripts/app/pedido/pedidoMod.html',
                controller: 'pedidoModCtrl',
                width: '90%',
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
            openEditDialog({ IdCliente: null, IdPresupuesto: null, FechaCreacion: '', NumeroPedido: '', Observaciones: '' }, 'new');//Nombre: '', Descripcion: '', IdFamilia: null, IdDivision: null }, 'new');
        };

        //delete Pedido
        function deletePedido(pedido) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar('api/pedido/Delete?id=' + pedido.IdPedido, pedido.IdPedido, deletePedidoCompleted, apiServiceFailed);
            };

            var title = "Se eliminará el Pedido: '" + pedido.NumeroPedido + "'";
            var msg = "¿Confirma eliminación de este Pedido?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };
        //deletePedidoCompleted
        function deletePedidoCompleted(pedido) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Pedido eliminado.');
            getAll();
        };
    }
})();