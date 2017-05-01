(function () {
    'use strict';

    erpApp.controller('presupuestoModCtrl', ['apiService', '$scope', 'ngDialog', 'modalWindowFactory', 'notificationService', presupuestoModCtrl]);

    function presupuestoModCtrl(apiService, $scope, ngDialog, modalWindowFactory, notificationService) {
        $scope.dataLoading = false;
        $scope.dataLoaded = false;
        //$scope.ddlDescuentos = null;
        $scope.ddlClientes = null;
        $scope.IdPresupuesto = null;
        $scope.clientes = [];
        //$scope.descuentos = [];
        $scope.newPresupuesto = null;
        $scope.validar = validar;
        $scope.getTitle = getTitle;
        $scope.confirm = confirm;
        $scope.changedClienteValue = changedClienteValue;
        //$scope.changedDescuentoValue = changedDescuentoValue;

        /*---Parametros de  lineas de presupuesto--*/
        $scope.lineasPresupuesto = [];
        $scope.articulos = [];
        //$scope.newIdPresupuesto = null;
        $scope.newIdArticulo = null;
        $scope.newMedida1 = null;
        $scope.newMedida2 = null;
        $scope.newCantidad = null;
        $scope.newPrecio = null;
        $scope.newDescuento = null;
        $scope.newLineaPresupuesto = {IdPresupuesto: $scope.IdPresupuesto, IdArticulo: $scope.newIdArticulo, Medida1: $scope.newMedida1, Medida2: $scope.newMedida2, Cantidad: $scope.newCantidad, Precio: $scope.newPrecio, Descuento: $scope.newDescuento};
        $scope.ddlDescuentos = null;
        $scope.ddlArticulos = null;
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.showAddLinea = false;
        $scope.showNewLinea = showNewLinea;
        $scope.addLineaPresupuesto = addLineaPresupuesto;
        $scope.changedArticuloValue = changedArticuloValue;
        $scope.changedArticuloValueEdit = changedArticuloValueEdit;
        $scope.toggleEditLinea = toggleEditLinea;
        $scope.deleteLineaPresupuesto = deleteLineaPresupuesto;
        $scope.updateLineaPresupuesto = updateLineaPresupuesto;
        $scope.openDatePicker = openDatePicker;
        
        //apiServiceFailed
        function apiServiceFailed(response) {
            //console.log(response.data)
            $scope.dataLoading = false;
            $scope.dataLoaded = false;
            notificationService.displayError('Error: ' + response.data);
            return 'KO';
        };

        //getTitle
        //recogemos del ambito el contenido de showmode donde verificamos si contiene edit o no para ponerle un titulo a la pantalla modal
        function getTitle() {
            if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                $scope.IdPresupuesto = $scope.WorkPresupuesto.IdPresupuesto;
                return 'Edicion: ' + $scope.WorkPresupuesto.NumeroPresupuesto;
            }
            else {
                return 'Nuevo Presupuesto';
            }
        }


        //****Gestión Clientes*****

        //getAllClientesCompleted
        //si  el workPresupouesto contiene un idCliente fijamos este como seleccionado
        function getAllClientesCompleted(result) {
            //alert(JSON.stringify(result.data));
            $scope.dataLoading = false;
            $scope.clientes = result.data;
            if ($scope.WorkPresupuesto.IdCliente != null) {
                setClienteSelected($scope.WorkPresupuesto.IdCliente);
            }
            fillArticulos();
        };

        //fillClientes
        function fillClientes() {
            $scope.dataLoading = true;
            apiService.get('api/cliente/' + 'GetAll', null, getAllClientesCompleted, apiServiceFailed);
        };

        //getCliente
        function getCliente(cliente) {
            return cliente.IdCliente === $scope.ddlClientes;
        };

        //setClienteSelected
        function setClienteSelected(idCliente) {
            //console.trace('$scope.divisiones.len: '+$scope.divisiones.len);
            $scope.ddlClientes = idCliente;
            var cliSelect = $scope.clientes.find(getCliente);
            $scope.ddlClientes = cliSelect;
        };

        //****Gestión de Articulos****

        //getAllArticulosCompleted
        //si  el workPresupouesto contiene un idCliente fijamos este como seleccionado
        function getAllArticulosCompleted(result) {
            $scope.dataLoading = false;
            $scope.articulos = result.data;
            if ($scope.showAdd) {
                fillLineasPresupuesto();
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


        //****Fin gestión de articulos****

        //*****Gestión Lineas******

        //getAllLineasCompleted
        function getAllLineasCompleted(result) {
            $scope.dataLoading = false;
            $scope.lineasPresupuesto = result.data;
            $scope.dataLoaded = true;
            //console.log(JSON.stringify(result.data));
            if ($scope.dataLoaded) {
                angular.forEach($scope.lineasPresupuesto, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            };
        };

        //fillLineasPresupuesto --> lo llamamos si esta en modo edicion de presupuesto o se se ha de recargar el grid de lineas

        function fillLineasPresupuesto() {
            $scope.dataloading = true;
            //apiService.get('');
            if ($scope.WorkPresupuesto.IdPresupuesto != null) {
                //$scope.IdPresupuesto = $scope.WorkPresupuesto.IdPresupuesto;
                $scope.dataLoading = true;
                apiService.get('/api/lineaPresupuesto/GetLineasByIdPresupuesto/' + $scope.WorkPresupuesto.IdPresupuesto, null, getAllLineasCompleted, apiServiceFailed);
            }
        };

        //toggleEditLinea
        function toggleEditLinea(lineaPresupuesto) {
            setArticuloSelected(lineaPresupuesto.IdArticulo);
            angular.forEach($scope.lineasPresupuesto, function (obj) {
                if (obj["IdLineaPresupuesto"] !== lineaPresupuesto.IdLineaPresupuesto && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            lineaPresupuesto.showEdit = !lineaPresupuesto.showEdit;
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

            //angular.forEach($scope.lineasPresupuesto, function (obj) {
            //    obj["showEdit"] = true;
            //});
        };

        //updateLineaPresupuesto
        function updateLineaPresupuesto(lineaPresupuesto) {
            $scope.dataLoading = true;
            apiService.put('/api/lineaPresupuesto/Update', lineaPresupuesto, updateLineaPresupuestoCompleted, apiServiceFailed);
        };

        //updateLineaPresupuestoCompleted
        function updateLineaPresupuestoCompleted(lineaPresupuesto) {
            $scope.dataLoading = false;
            lineaPresupuesto.showEdit = !lineaPresupuesto.showEdit;
            notificationService.displaySuccess('Linea actualizada.');
            fillLineasPresupuesto();
        };

        //addLineaPresupuesto
        function addLineaPresupuesto() {
            $scope.dataLoading = true;
            $scope.newLineaPresupuesto.IdPresupuesto = $scope.WorkPresupuesto.IdPresupuesto;
            $scope.newLineaPresupuesto.IdArticulo = $scope.newIdArticulo;
            $scope.newLineaPresupuesto.Medida1 = $scope.newMedida1;
            $scope.newLineaPresupuesto.Medida2 = $scope.newMedida2;
            $scope.newLineaPresupuesto.Cantidad = $scope.newCantidad;
            $scope.newLineaPresupuesto.Precio = $scope.newPrecio;
            $scope.newLineaPresupuesto.Descuento = $scope.newDescuento;
            //alert("addlinea presupuesto"+$scope.newLineaPresupuesto.IdArticulo);
            apiService.post('/api/lineaPresupuesto/Add', $scope.newLineaPresupuesto, addLineaPresupuestoCompleted, apiServiceFailed);
        };

        //addLineaPresupuestoCompleted
        function addLineaPresupuestoCompleted(lineaPresupuesto) {
            $scope.dataLoading = false;
            $scope.showAddLinea = false;
            notificationService.displaySuccess('Linea creada.');
            fillLineasPresupuesto();
        };

        //deleteLineaPresupuesto
        function deleteLineaPresupuesto(lineaPresupuesto) {
            //var deleteItem = function () {
                $scope.dataLoading = true;
                apiService.eliminar('/api/lineaPresupuesto/Delete?id=' + lineaPresupuesto.IdLineaPresupuesto, lineaPresupuesto.IdLineaPresupuesto, deleteLineaPresupuestoCompleted, apiServiceFailed);
            //};

            //var title = "Se eliminará la Linea! '";
            //var msg = "¿Confirma eliminación?";
            //modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };

        //deleteLineaPresupuestoCompleted
        function deleteLineaPresupuestoCompleted(lineaPresupuesto) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Linea eliminada.');
            fillLineasPresupuesto();
        };

        //*****Fin gestion Lineas*****

        //****Gestión Descuentos*****

        //getAllDescuentosCompleted
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


        //****Gestión Presupuestos*****

        //initialize
        function initialize() {
            //si se cumple al funcon del parentesis pone true, sino false
            $scope.showAdd = ($scope.ShowMode != null && $scope.ShowMode == 'edit');
            fillClientes();
        }
        initialize();

        //GetPresupuestoByNumberCompleted
        function GetPresupuestoByNumberCompleted(presupuesto) {
            //console.log("para verlo bin" + presupuesto.data.IdPresupuesto);
            $scope.WorkPresupuesto.IdPresupuesto = presupuesto.data.IdPresupuesto;
            //console.log("Siii esta informado joder"+$scope.WorkPresupuesto.IdPresupuesto + "," + $scope.WorkPresupuesto.FechaCreacion);
            $scope.dataLoading = false;
        };

        //GetPresupuestoByNumber
        function GetPresupuestoByNumber(numPres) {
            $scope.dataLoading = true;
            apiService.get('/api/presupuesto/GetPresupuestoByNumber/'+ numPres, null, GetPresupuestoByNumberCompleted, apiServiceFailed);
        };


        //updatePresupuesto
        function updatePresupuesto() {
            $scope.dataLoading = true;
            apiService.put('api/presupuesto/Update', $scope.WorkPresupuesto, updatePresupuestoCompleted, apiServiceFailed);
        };

        //updatePresupuestoCompleted
        function updatePresupuestoCompleted(presupuesto) {
            $scope.dataLoading = false;
            notificationService.displaySuccess('Presupuesto actualizado.');
            return 'OK';
        };

        //addPresupuesto
        function addPresupuesto() {
            $scope.dataLoading = true;
            return apiService.post('api/presupuesto/Add', $scope.WorkPresupuesto, addPresupuestoCompleted, apiServiceFailed);
        };

        //addPresupuestoCompleted
        function addPresupuestoCompleted(presupuesto) {
            notificationService.displaySuccess('Presupuesto creado.');
            //alert("add presupuesto completed " + JSON.stringify(presupuesto));
            //console.log(presupuesto.data.NumeroPresupuesto);
            GetPresupuestoByNumber($scope.WorkPresupuesto.NumeroPresupuesto);
            $scope.dataLoading = false;
        }

        //confirm
        //function confirm() {
        //    if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
        //        //updatePresupuesto()
        //        //updateLineasPresupuesto()
        //    } else {
        //        //addPresupuesto()
        //        //addLineasPresupuesto()
        //    }
        //    return 'ok';
        //}

        function validar() {
            //alert($scope.WorkPresupuesto.IdPresupuesto);
            
            if ($scope.WorkPresupuesto.IdCliente != null && $scope.WorkPresupuesto.FechaCreacion != null) {
                if ($scope.ShowMode != null && $scope.ShowMode == 'edit') {
                    updatePresupuesto();
                } else {
                    addPresupuesto();
                }
                //mostrar panel lineas presupuesto
                $scope.showAdd = true;
            } else {
                notificationService.displayError('Faltan datos');
            }

        }

       
        //Sincroniza valor del SelectList de clientes
        function changedClienteValue(item) {
            $scope.WorkPresupuesto.IdCliente = item.IdCliente;
            //fillDescuentos();
        }

        //Sincroniza valor del SelectList de descuentos
        function changedDescuentoValue(item) {
            $scope.WorkCliente.IdDescuento = item.IdDescuento;
        }
        
        //Sincroniza valor del SelectList 
        function changedArticuloValue(item) {
            $scope.newIdArticulo = item.IdArticulo;
            
            $scope.newPrecio = item.PrecioBase;
            //TODO: elaborar un metodo que recibe el id del cliente y  dl articulo busca el descuento asociado al cliente y lo devuelve
        }
        
        function changedArticuloValueEdit(item, linea) {            
            linea.Precio = item.PrecioBase;//setArticuloPrecio(item.IdArticulo);
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                $scope.datepicker.opened = true;
            });

            $timeout(function () {
                $('ul[datepicker-popup-wrap]').css('z-index', '10000');
            }, 100);


        };

    }
})();