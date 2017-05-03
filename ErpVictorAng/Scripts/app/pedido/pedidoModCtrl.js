(function () {
    'use strict';

    erpApp.controller('pedidoModCtrl', ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', pedidoModCtrl]);

    function pedidoModCtrl(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {
        $scope.dataLoading = false;
        $scope.dataLoaded = false;
        $scope.ddlClientes = null;
        $scope.ddlPresupuestos = null;
        $scope.clientes = [];
        $scope.presupuestos = [];
        $scope.IdPedido = null;
        //$scope.newNombre = '';
        //$scope.newDesripcion = '';
        //$scope.newIdFamilia = null;
        //$scope.newIdDivision = null;
        //$scope.newSubFamilia = { IdSubFamilia: null, Nombre: '', Descripcion: '', IdFamilia: null, IdDivision: null };

        /*------------METODOS----------*/
        $scope.getTitle = getTitle;
        $scope.confirm = confirm;
        $scope.changedClienteValue = changedClienteValue;
        $scope.changedPresupuestoValue = changedPresupuestoValue;
        $scope.validar = validar;

        /*---------LINEAS DE PEDIDO---------*/
        $scope.lineasPedido = [];
        $scope.articulos = [];
        //$scope.newIdPresupuesto = null;
        $scope.newIdArticulo = null;
        $scope.newMedida1 = null;
        $scope.newMedida2 = null;
        $scope.newCantidad = null;
        $scope.newPrecio = null;
        $scope.newDescuento = null;
        $scope.newLineaPedido = { IdPedido: $scope.IdPedido, IdArticulo: $scope.newIdArticulo, Medida1: $scope.newMedida1, Medida2: $scope.newMedida2, Cantidad: $scope.newCantidad, Precio: $scope.newPrecio, Descuento: $scope.newDescuento };
        $scope.ddlDescuentos = null;
        $scope.ddlArticulos = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.showAddLinea = false;
        $scope.showNewLinea = showNewLinea;
        $scope.addLineaPedido = addLineaPedido;
        $scope.changedArticuloValue = changedArticuloValue;
        $scope.changedArticuloValueEdit = changedArticuloValueEdit;
        $scope.toggleEditLinea = toggleEditLinea;
        $scope.deleteLineaPedido = deleteLineaPedido;
        $scope.updateLineaPedido = updateLineaPedido;

        //apiServiceFailed
        function apiServiceFailed(reponse) {
            console.log(reponse.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
            return 'KO';
        };

        //getTitle
        function getTitle() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                $scope.IdPedido = $scope.WorkPedido.IdPedido;
                return 'Edicion: ' + $scope.WorkPedido.NumeroPedido;
            }
            else { return 'Nuevo Pedido'; }
        }

        //****Gestión Clientes*****
        //getAllClientesCompleted
        function getAllClientesCompleted(result) {
            $scope.dataLoading = false;
            $scope.clientes = result.data;
            //si esta informado...
            if ($scope.WorkPedido.IdCliente != null) {
                setClienteSelected($scope.WorkPedido.IdCliente);
            }
            fillPresupuestos();
        };

        //fillClientes
        function fillClientes() {
            $scope.dataLoading = true;
            apiService.get('api/cliente/' + 'GetAll', null, getAllClientesCompleted, apiServiceFailed);
        };

        //definicion para encontrar el find
        //getCliente
        function getCliente(cliente) {
            return cliente.Idcliente === $scope.ddlclientes;
        };

        //setClienteSelected
        function setClienteSelected(idCliente) {
            $scope.ddlClientes = idCliente;
            var cliSelect = $scope.clientes.find(getCliente);
            $scope.ddlClientes = cliSelect;
        };
        //****Fin Gestión Clientes*****

        //****Gestión Presupuestos*****
        //getAllPresupuestosCompleted
        function getAllPresupuestosCompleted(result) {
            $scope.dataLoading = false;
            $scope.presupuestos = result.data;
            if ($scope.WorkPedido.IdPresupuesto != null) {
                setPresupuestoSelected($scope.WorkPedido.IdPresupuesto);
            }
            fillArticulos();
        };
        //fillPresupuestos
        function fillPresupuestos() {
           // if ($scope.WorkPedido.IdCliente != null) {
                $scope.dataLoading = true;
                apiService.get('/api/presupuesto/GetAll/' , null, getAllPresupuestosCompleted, apiServiceFailed);
           //}
        };

        //getPresupuesto
        function getPresupuesto(presupuesto) {
            return presupuesto.IdPresupuesto === $scope.ddlPresupuestos;
        };

        //setPresupuestoSelected
        function setPresupuestoSelected(idPresupuesto) {
            $scope.ddlPresupuestos = idPresupuesto;
            var presSelect = $scope.presupuestos.find(getPresupuesto);
            $scope.ddlPresupuestos = presSelect;
        };
        //****FIN Gestión Presupuestos*****

        //*****Gestion de Articulos

        //getAllArticulosCompleted
        function getAllArticulosCompleted(result) {
            $scope.dataLoading = false;
            $scope.articulos = result.data;
            if ($scope.showAdd) {
                fillLineasPedido();
            }
        };

        //fillArticulos
        function fillArticulos() {
            $scope.dataLoading = true;
            apiService.get('api/articulo/' + 'GetAll', null, getAllArticulosCompleted, apiServiceFailed);
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

        //*****fin gestion articulos

        //******GESTION LIENEAS PEDIDO

        //getAllLineasCompleted
        function getAllLineasCompleted(result) {
            $scope.dataLoading = false;
            $scope.lineasPedido = result.data;
            $scope.dataLoaded = true;
            if ($scope.dataLoaded) {
                angular.forEach($scope.lineasPedido, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //fillLineasPedido --> lo llamamos si esta en modo edicion de pedido o se se ha de recargar el grid de lineas

        function fillLineasPedido() {
            $scope.dataloading = true;
            //apiService.get('');
            if ($scope.WorkPedido.IdPedido != null) {
                $scope.dataLoading = true;
                apiService.get('/api/lineaPedido/GetLineasByIdPedido/' + $scope.WorkPedido.IdPedido, null, getAllLineasCompleted, apiServiceFailed);
            }
        };

        //toggleEditLinea
        function toggleEditLinea(lineaPedido) {
            setArticuloSelected(lineaPedido.IdArticulo);
            angular.forEach($scope.lineaPedido, function (obj) {
                if (obj["IdLineaPedido"] !== lineaPedido.IdLineaPedido && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            lineaPedido.showEdit = !lineaPedido.showEdit;
        };

        //showNewLinea
        function showNewLinea() {
            $scope.newIdArtiulo = null;
            $scope.newMedida1 = null;
            $scope.newMedida2 = null;
            $scope.newCantidad = null;
            $scope.newPrecio = null;
            $scope.newDescuento = null;
            $scope.showAddLinea = $scope.showAddLinea ? false : true;
        };

        //updateLineaPedido
        function updateLineaPedido(lineaPedido) {
            $scope.dataLoading = true;
            apiService.put('/api/lineaPedido/Update', lineaPedido, updateLineaPedidoCompleted, apiServiceFailed);
        };

        //updateLineaPedidoCompleted
        function updateLineaPedidoCompleted(lineaPedido) {
            $scope.dataLoading = false;
            lineaPedido.showEdit = !lineaPedido.showEdit;
            notificationService.displaySuccess('Linea actualizada.');
            fillLineasPedido();
        };

        //addLineaPedido
        function addLineaPedido() {
            $scope.dataLoading = true;
            $scope.newLineaPedido.IdPedido = $scope.WorkPedido.IdPedido;
            $scope.newLineaPedido.IdArticulo = $scope.newIdArticulo;
            $scope.newLineaPedido.Medida1 = $scope.newMedida1;
            $scope.newLineaPedido.Medida2 = $scope.newMedida2;
            $scope.newLineaPedido.Cantidad = $scope.newCantidad;
            $scope.newLineaPedido.Precio = $scope.newPrecio;
            $scope.newLineaPedido.Descuento = $scope.newDescuento;
            apiService.post('/api/lineaPedido/Add', $scope.newLineaPedido, addLineaPedidoCompleted, apiServiceFailed);
        };

        //addLineaPedidoCompleted
        function addLineaPedidoCompleted(lineaPedido) {
            $scope.dataLoading = false;
            $scope.showAddLinea = false;
            notificationService.displaySuccess('Linea creada.');
            fillLineasPedido();
        };

        //deleteLineaPedido
        function deleteLineaPedido(lineaPedido) {
            //var deleteItem = function () {
            $scope.dataLoading = true;
            apiService.eliminar('/api/lineaPedido/Delete?id=' + lineaPedido.IdLineaPedido, lineaPedido.IdLineaPedido, deleteLineaPedidoCompleted, apiServiceFailed);
            //};

            //var title = "Se eliminará la Linea! '";
            //var msg = "¿Confirma eliminación?";
            //modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };

        //deleteLineaPedidoCompleted
        function deleteLineaPedidoCompleted(lineaPedido) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Linea eliminada.');
            fillLineasPedido();
        };

        //******FIN gestion lineas pedido

        //****Gestión Descuentos*****

        //getAllDescuentosCompleted  --> comprobar funcion
        function getAllDescuentosCompleted(result) {
            $scope.dataLoading = false;
            $scope.descuentos = result.data;
            if ($scope.WorkPedido.IdDescuento != null) {
                setDescuentoSelected($scope.WorkPedido.IdDescuento);
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
            $scope.ddlDescuentos = idDescuento;
            var descSelect = $scope.descuentos.find(getDescuento);
            $scope.ddlDescuentos = descSelect;
        };

        //*************Fin gestion descuentos

        //****** Gestion PEDIDOS****

        //initialize
        function initialize() {
            $scope.showAdd = ($scope.ShowMode != null && $scope.ShowMode == 'edit');
            fillClientes();
        }
        initialize();

        //GetPedidoByNumberCompleted
        function GetPedidoByNumberCompleted(pedido) {
            $scope.WorkPedido.IdPedido = pedido.data.IdPedido;
            $scope.dataLoading = false;
        };

        //GetPedidoByNumber
        function GetPedidoByNumber(numPed) {
            $scope.dataLoading = true;
            apiService.get('/api/pedido/GetPedidoByNumber/' + numPed, null, GetPedidoByNumberCompleted, apiServiceFailed);
        };


        //updatePedido
        function updatePedido() {
            $scope.dataLoading = true;
            apiService.put('api/pedido/Update', $scope.WorkPedido, updatePedidoCompleted, apiServiceFailed);
        };

        //updatePedidoCompleted
        function updatePedidoCompleted(pedido) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Pedido actualizado.');
            return 'OK';
        };

        //addPedido
        function addPedido() {
            $scope.dataLoading = true;
            return apiService.post('api/pedido/Add', $scope.WorkPedido, addPedidoCompleted, apiServiceFailed);
        };

        //addPedidoCompleted
        function addPedidoCompleted(pedido) {
            notificationService.displaySuccess('Pedido creado.');
            console.log(pedido.data.NumeroPedido);
            GetPedidoByNumber($scope.WorkPedido.NumeroPedido);
            $scope.dataLoading = false;
        }

        //******Fin gestion PEdidos
        
        //confirm
        //function confirm() {
        //    if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
        //        updatePedido()
        //    } else {
        //        addPedido()
        //    }
        //    return 'ok';
        //}

        function validar() {
            if ($scope.WorkPedido.IdCliente != null && $scope.WorkPedido.FechaCreacion != null) {
                if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                    updatePedido();
                } else {
                    addPedido();
                }
                //mostrar panel lineas pedido
                $scope.showAdd = true;
            } else {
                notificationService.displayError('Faltan datos');
            }

        }

        //Sincroniza valor del SelectList Clientes 
        function changedClienteValue(item) {
            $scope.WorkPedido.IdCliente = item.IdCliente;
            fillPresupuestos();
        }

        //Sincroniza valor del SelectList Presupuestos 
        function changedPresupuestoValue(item) {
            $scope.WorkPedido.IdPresupuesto = item.IdPresupuesto;
        }

        //Sincroniza valor de SelectList de Articulos
        function changedArticuloValue(item) {
            $scope.newIdArticulo = item.IdArticulo;
            $scope.newPrecio = item.PrecioBase;
        }

        function changedArticuloValueEdit(item, linea) {
            linea.Precio = item.PrecioBase;
        }
    }
})();