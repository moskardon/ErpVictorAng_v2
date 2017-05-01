(function () {
    'use strict';
    var controllerId = 'presupuestoController';

    erpApp.controller(controllerId, ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', presupuestoController]);

    function presupuestoController(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {

        $scope.presupuestos = [];
        $scope.showEdit = false;


        $scope.dataLoading = true;
        $scope.dataLoaded = false;
        $scope.getAll = getAll;

        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;

        $scope.deletePresupuesto = deletePresupuesto;
        $scope.openEditDialog = openEditDialog;


        //apiServiceFailed
        function apiServiceFailed(reponse) {
            //console.log(resonse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
        };

        //Rellenar presupuesto
        function fillPresupuesto() {
            $scope.dataLoading = true;
            apiService.get('/api/presupuesto/GetAll', null, getAllPresupuestosCompleted, apiServiceFailed);
        };
        //getAllPresupuestosCompleted
        function getAllPresupuestosCompleted(result) {
            //console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.dataLoaded = true;
            $scope.presupuestos = result.data;
        };
        
        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.presupuestos, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //getAll
        function getAll() {
            $scope.dataLoading = true;
            apiService.get('/api/presupuesto/GetAll', null, getAllCompleted, apiServiceFailed);
        };

        //getAllCompleted
        function getAllCompleted(result) {
            //console.log(JSON.stringify(result))
            $scope.dataLoading = false;
            $scope.presupuestos = result.data;
            $scope.dataLoaded = true;
            initialize();
        };

        getAll();

        //toggleEdit
        function toggleEdit(presupuesto) {
            openEditDialog(presupuesto, 'edit')
        };

        //************************
        //abrimos un ng-dialog o pantalla modal pasandole a su controlador el cliente seleccionado O un cliente nuevo, en funcion de lo que decidamos hacer
        //indicamos la vista ".html" y el controlador que va a usar
        //le pasamos le ambito de nuestro controlador para que pueda acceder a las propiedades u objetos como WorkPresupuesto el cual es el presupuesto que enviamos.
        //openEditDialog
        function openEditDialog(presupuesto, showMode) {
            $scope.WorkPresupuesto = presupuesto;
            $scope.ShowMode = showMode;

            var promiseCount = 0;
            var thisPromiseCount = ++promiseCount;

            var dialog = ngDialog.open({
                template: 'Scripts/app/presupuesto/presupuestoMod.html',
                width: '90%',
                controller: 'presupuestoModCtrl',
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
                NumeroPresupuesto: '',
                FechaCreacion: '',
                FechaAceptacion: '',
                Observaciones: '',
                IdCliente: null
            }, 'new');
        };

        //delete Presupuesto
        function deletePresupuesto(presupuesto) {
            var deleteItem = function () {
                $scope.dataLoading = true;

                //
                //
                // antes de eliminar el presupuesto se han de eliminar las lineas asciadas lo cual resta por hacer...
                //
                //

                apiService.eliminar('api/presupuesto/Delete?id=' + presupuesto.IdPresupuesto, presupuesto.IdPresupuesto, deletePresupuestoCompleted, apiServiceFailed);
            };

            var title = "Se eliminará el Presupuesto: '" + presupuesto.NumeroPresupuesto + "' y sus líneas asociadas";
            var msg = "¿Confirma eliminación de este Presupuesto?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };
        //deleteClienteCompleted
        function deletePresupuestoCompleted(presupuesto) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Presupuesto eliminado.');
            getAll();
        };
    }
})();