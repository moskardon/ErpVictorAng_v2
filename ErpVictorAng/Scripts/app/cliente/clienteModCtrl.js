(function () {
    'use strict';

    erpApp.controller('clienteModCtrl', ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', clienteModCtrl]);

    function clienteModCtrl(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {
        $scope.dataLoading = false;
        $scope.dataLoaded = false;
        $scope.ddlDescuentos = null;
        $scope.ddlUsuarios = null;
        $scope.descuentos = [];
        $scope.usuarios = [];
       
        $scope.getTitle = getTitle;
        $scope.confirm = confirm;
        $scope.changedDescuentoValue = changedDescuentoValue;
        $scope.changedUsuarioValue = changedUsuarioValue;

        //apiServiceFailed
        function apiServiceFailed(response) {
            console.log(response.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
            return 'KO';
        };

        //getTitle
        //recogemos del ambito el contenido de showmode donde verificamos si contiene edit o no para ponerle un titulo a la pantalla modal
        function getTitle() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                return 'Edicion: ' + $scope.WorkCliente.Nombre;
            }
            else {
                //alert($scope.WorkCliente.Nombre + " - " + $scope.WorkCliente.IdDescuento + " - " + $scope.WorkCliente.IdUsuario);
                return 'Nuevo Cliente';
            }
        }

        //****Gestión Descuentos*****

        //getAllDescuentosCompleted
        //si  el workcliente contiene un idDescuento fijamos este como seleccionado
        function getAllDescuentosCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.descuentos = result.data;
            if ($scope.WorkCliente.IdDescuento != null) {
                setDescuentoSelected($scope.WorkCliente.IdDescuento);
            }
            //fillDescuentos();
        };

        //fillDescuentos
        function fillDescuentos() {
            $scope.dataLoading = true;
            apiService.get('api/descuento/' + 'GetAll', null, getAllDescuentosCompleted, apiServiceFailed);
        };

        //getDescuento
        function getDescuento(descuento) {
            return descuento.IdDescuento === $scope.ddlDescuentos;
        };

        //setDescuentoSelected
        function setDescuentoSelected(idDescuento) {
            //console.trace('$scope.divisiones.len: '+$scope.divisiones.len);
            $scope.ddlDescuentos = idDescuento;
            var descSelect = $scope.descuentos.find(getDescuento);
            $scope.ddlDescuentos = descSelect;
        };
        
        //****Gestión Usuarios*****

        //getAllUsuariosCompleted
        //si el workcliente contiene un idUsuario fijamos este como seleccionado
        function getAllUsuariosCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.usuarios = result.data;
            if ($scope.WorkCliente.IdUsuario != null) {
                setUsuarioSelected($scope.WorkCliente.IdUsuario);
            }
            //De momento no relleno los usuarios
            //fill LO QUE SEA();
        };

        //fillUsuarios--> no funcina, no existe
        function fillUsuarios() {
            $scope.dataLoading = true;
            apiService.get('api/user/' + 'GetAll', null, getAllUsuariosCompleted, apiServiceFailed);
        };

        //getUsuario
        function getUsuario(usuario) {
            return usuario.IdUsuario === $scope.ddlUsuarios;
        };

        //setUsuarioSelected
        function setUsuarioSelected(idUsuario) {
            //console.trace('$scope.divisiones.len: '+$scope.divisiones.len);
            $scope.ddlUsuarios = idUsuario;
            var usSelect = $scope.usuarios.find(getUsuario);
            $scope.ddlUsuarios = usSelect;
        };

        
        //****Gestión Clientes*****

        //initialize
        function initialize() {
            fillDescuentos();
        }
        initialize();

        //updateCliente
        function updateCliente() {
            $scope.dataLoading = true;
            apiService.put('api/cliente/Update', $scope.WorkCliente, updateClienteCompleted, apiServiceFailed);
        };

        //updateClienteCompleted
        function updateClienteCompleted(cliente) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Cliente actualizado.');
            return 'OK';
        };

        //addCliente
        function addCliente() {
            $scope.dataLoading = true;            
            //alert($scope.WorkCliente.Nombre + " - " + $scope.WorkCliente.IdDescuento + " - " + $scope.WorkCliente.IdUsuario);

            return apiService.post('api/cliente/Add', $scope.WorkCliente, addClienteCompleted, apiServiceFailed);
        };

        //addClienteCompleted
        function addClienteCompleted(cliente) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Cliente creado.');
        }

        //function sleep(ms) {
        //    return new Promise(resolve => setTimeout(resolve, ms));
        //}
        //confirm
        function confirm() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                updateCliente()
            } else {
                addCliente()
            }
            return 'ok';
        }

        //Sincroniza valor del SelectList de descuentos
        function changedDescuentoValue(item) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            //cliente.IdDescuento = item.IdDescuento;
            $scope.WorkCliente.IdDescuento = item.IdDescuento;
            //alert($scope.WorkCliente.Nombre + " - " + $scope.WorkCliente.IdDescuento + " - " + $scope.WorkCliente.IdUsuario);
        }

        //Sincroniza valor del SelectList Usuarios
        function changedUsuarioValue(item) {
            //alert(item.Nombre + " - " + item.IdDivision + " ->Fam.IdDiv: " + familia.IdDivision);
            //cliente.IdDescuento = item.IdDescuento;
            $scope.WorkCliente.IdUsuario = item.IdUsuario;
        }
    }
})();