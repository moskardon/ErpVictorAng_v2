(function () {
    'use strict';
    var controllerId = 'userController';

    erpApp.controller(controllerId, ['$scope', 'ngDialog', 'userFactory', 'modalWindowFactory', 'notificationService', userController]);

    function userController($scope, ngDialog, userFactory, modalWindowFactory, notificationService) {

        $scope.users = [];
        $scope.showEdit = false;
        $scope.showAdd = false;
        $scope.newNombre = '';
        $scope.newHashedPassword = '';
        $scope.newSalt = '';
        $scope.newIsLocked = '';
        $scope.newFechaCreacion = '';
        $scope.newUser = { Nombre: $scope.newNombre, HashedPassword: $scope.newHashedPassword, Salt: $scope.newSalt, IsLocked: $scope.newIsLocked, FechaCreacion: $scope.newFechaCreacion, };
        $scope.dataLoading = true;
        $scope.dataLoaded = false;

        $scope.getAll = getAll;
        $scope.toggleEdit = toggleEdit;
        $scope.showNew = showNew;
        $scope.updateUser = updateUser;
        $scope.addUser = addUser;
        $scope.deleteUser = deleteUser;

        //initialize
        function initialize() {
            if ($scope.dataLoaded) {
                angular.forEach($scope.users, function (obj) {
                    obj["showEdit"] = true;
                });
                $('#divWrapper').css('display', 'block');
            }
        };

        //getAll
        function getAll() {
            userFactory.getUsers().then(function (data) {
                $scope.dataLoading = false;
                $scope.users = data.data;
                $scope.dataLoaded = true;
                initialize();
            }).then(function (error) {
                if (error != undefined) {
                    $scope.dataLoading = false;
                    $scope.dataLoaded = false;
                    notificationService.displayError('Error: ' + error.data);
                    $scope.Clientes = error;
                }
            });
        };

        getAll();
        //funcion para formatear fecha
        function getISODateTime(d) {
            // padding function
            var s = function (p) {
                return ('' + p).length < 2 ? '0' + p : '' + p;
            };

            // default parameter
            if (typeof d === 'undefined') {
                var d = new Date();
            };

            // return ISO datetime
            return d.getFullYear() + '-' +
                s(d.getMonth() + 1) + '-' +
                s(d.getDate()) + ' ' +
                s(d.getHours()) + ':' +
                s(d.getMinutes()) + ':' +
                s(d.getSeconds());
        }

        //toggleEdit
        function toggleEdit(user) {
            angular.forEach($scope.users, function (obj) {
                if (obj["IdUsuario"] !== user.IdUsuario && obj["showEdit"] == false) {
                    obj["showEdit"] = true;
                }
            });
            user.showEdit = !user.showEdit;
        };

        //showNew
        function showNew() {
            $scope.newNombre = '';
            $scope.newHashedPassword = '';
            $scope.newSalt = '';
            $scope.newIsLocked = '';
            $scope.newFechaCreacion = '';
            $scope.showAdd = $scope.showAdd ? false : true;

            angular.forEach($scope.users, function (obj) {
                obj["showEdit"] = true;
            });
        };

        //update user
        function updateUser(user) {
            userFactory.updateUser(user).then(function (data) {
                user.showEdit = !user.showEdit;
                notificationService.displaySuccess('Usuario actualizado.');
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    notificationService.displayError('Error: ' + error.data);
                }
            });
        };

        //add usuario
        function addUser() {
            $scope.showAdd = false;
            $scope.newUser.Nombre = $scope.newNombre;
            $scope.newUser.HashedPassword = $scope.newHashedPassword;
            $scope.newUser.Salt = $scope.newSalt;
            $scope.newUser.IsLocked = 0;
            $scope.newUser.FechaCreacion = getISODateTime(new Date());
            
            //DATETIME - format: YYYY-MM-DD HH:MI:SS
            alert(JSON.stringify($scope.newUser));
            userFactory.addUser($scope.newUser).then(function (data) {
                notificationService.displaySuccess('Usuario creado.');
                getAll();
            }).then(function (error) {
                if (error != undefined) {
                    notificationService.displayError('Error: ' + error.data);
                }
            });
        };

        //delete usuario
        function deleteUser(user) {
            var deleteItem = function () {
                userFactory.deleteUser(user.IdUsuario).then(function (data) {
                    notificationService.displaySuccess('Usuario eliminado.');
                    getAll();
                }).then(function (error) {
                    if (error != undefined) {
                        notificationService.displayError('Error: ' + error.data);
                    }
                });
            };

            var title = "Se eliminará el Usuario: '" + user.Nombre + "'";
            var msg = "¿Confirma eliminación de este Usurio?";
            modalWindowFactory.show(title, msg, 'xl', deleteItem);
        };


        //function _setOrderByColumn(column) {
        //    if (self.orderByColumn == column) {
        //        // change order
        //        self.orderByReverse = !self.orderByReverse;
        //    } else {
        //        // order using new column
        //        self.orderByColumn = column;
        //        self.orderByReverse = false;
        //    }

        //    _applyOrder();
        //}

        //function _applyOrder() {
        //    $scope.users.sort(function (a, b) {
        //        var comparisonResult = 0;

        //        var aField = a[self.orderByColumn];
        //        var bField = b[self.orderByColumn];

        //        if (aField === null) aField = "";
        //        if (bField === null) bField = "";


        //        if (aField < bField) comparisonResult = -1;
        //        if (aField > bField) comparisonResult = 1;

        //        if (self.orderByReverse) {
        //            comparisonResult = comparisonResult * (-1);
        //        }

        //        return comparisonResult;
        //    });
        //}
    }
})();