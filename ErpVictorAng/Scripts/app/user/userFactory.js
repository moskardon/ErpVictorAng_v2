(function () {
    'use strict';
    var serviceId = 'userFactory';

    erpApp.factory(serviceId, ['$http', userFactory]);

    function userFactory($http) {
        var url = 'api/user/';
        var us = [];

        us.getUsers = function () {
            return $http({
                method: 'get',
                url: url + 'GetAll'
            })
        };

        us.updateUser = function (user) {
            return $http({
                method: 'PUT',
                url: url + 'Update',
                data: user
            })
        };

        us.addUser = function (user) {
            //var cli = JSON.stringify(cliente);
            return $http({
                method: 'POST',
                url: url + 'Add',
                data: user
            })
        };

        us.deleteUser = function (IdUsuario) {
            return $http({
                method: 'delete',
                url: url + 'Delete?id=' + IdUsuario,
                data: IdUsuario
            })
        };

        return us;

        var service = {
            getUsers: getUsers,
            updateUser: updateUser,
            addUser: addUser,
            deleteUser: deleteUser
        };

        return service;
    };
})();