(function () {
    'use strict';
    var controllerId = 'clienteController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', clienteController]);

    function clienteController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.clientes = [];
        //$scope.descuentos = [];
        //$scope.ddlDescuentos = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        

        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;

        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;

        $scope.deleteCliente = deleteCliente;
        $scope.openEditDialog = openEditDialog;


        //apiServiceFailed
        function apiServiceFailed(reponse) {
            console.log(resonse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
        };

        //Rellenar clientes
        function fillClientes() {
            $scope.dataLoading = true;
            apiService.get('/api/cliente/GetAll', null, getAllClientesCompleted, apiServiceFailed);
        };
        //getAllClientesCompleted
        function getAllClientesCompleted(result) {
            console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.dataLoaded = true;
            $scope.clientes = result.data;
        };


        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.clientes, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //getAll
        function getAll() {
            $scope.dataLoading = true;
            apiService.get('/api/cliente/GetAll', null, getAllCompleted, apiServiceFailed);
        };

        //getAllCompleted
        function getAllCompleted(result) {
            //console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.clientes = result.data;
            $scope.dataLoaded = true;
            initialize();
        };

        getAll();

        //toggleEdit
        function toggleEdit(cliente) {
            openEditDialog(cliente, 'edit')
        };

        //************************
        //abrimos un ng-dialog o pantalla modal pasandole a su controlador el cliente seleccionado O un cliente nuevo, en funcion de lo que decidamos hacer
        //indicamos la vista ".html" y el controlador que va a usar
        //le pasamos le ambito de nuestro controlador para que pueda acceder a las propiedades u objetos como WorkCliente el cual es el cliente que enviamos.
        //openEditDialog
        function openEditDialog(cliente, showMode) {
            $scope.WorkCliente = cliente;
            $scope.ShowMode = showMode;

            var promiseCount = 0;
            var thisPromiseCount = ++promiseCount;

            var dialog = ngDialog.open({
                template: 'Scripts/app/cliente/clienteMod.html',
                controller: 'clienteModCtrl',
                width: '90%',
                closeByDocument: true,
                className: 'ngdialog-theme-default custom-width',
                scope: $scope
            });
            //El tema del Promise, supuestamente afianza una accion o asegura la finalizacion de la misma para posteriormente hacer lo que queramos, es como un seguro, pero funciona regular...
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
            openEditDialog({
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                FechaNacimiento: '',
                Dni: '',
                Cif: '',
                NombreEmpresa: '',
                DescripcionEmpresa: '',
                Direccion: '',
                Direccion: '',
                NumTelefono1: '',
                NumTelefono2: '',
                Email: '',
                Saldo: '',
                IdUsuario: 2,
                IdDescuento: null
            }, 'new');
        };

        //delete Cliente
        function deleteCliente(cliente) {
            var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar('api/cliente/Delete?id=' + cliente.IdCliente, cliente.IdCliente, deleteClienteCompleted, apiServiceFailed);
            };

            var title = "Se eliminará el Cliente: '" + cliente.Nombre + "'";
            var msg = "¿Confirma eliminación de este Cliente?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };
        //deleteClienteCompleted
        function deleteClienteCompleted(cliente) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Cliente eliminado.');
            getAll();
        };
    }
})();