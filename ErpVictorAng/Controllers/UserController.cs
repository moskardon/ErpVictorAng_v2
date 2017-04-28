using ErpVictorAng.Infraestructura.Core;
using ErpVictorAng.Models;
using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ErpVictorAng.Controllers
{
    public class UserController : APIControllerBase
    {

        public IEnumerable<UserViewModel> GetAll()
        {
            var users = _DBErpCris.User.ToList<User>();
            List<UserViewModel> lstUsers = new List<UserViewModel>();
            foreach (User user in users)
            {
                UserViewModel userVM = new UserViewModel();
                userVM.IdUsuario = user.IdUsuario;
                userVM.Nombre = user.Nombre;
                userVM.HashedPassword = user.HashedPassword;
                userVM.Salt = user.Salt;
                userVM.IsLocked = user.IsLocked;
                userVM.FechaCreacion = user.FechaCreacion;
                lstUsers.Add(userVM);
            }

            return lstUsers.AsEnumerable();
        }

        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, UserViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var userDb = _DBErpCris.User.Single(c => c.IdUsuario == user.IdUsuario);
                    if (userDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid user");
                    }
                    else
                    {
                        this.UserMapper(user, ref userDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<UserViewModel>(HttpStatusCode.OK, user);
                    }
                }
                return response;
            });
        }

        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, UserViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    User newUser = new User();
                    this.UserMapper(user, ref newUser);
                    _DBErpCris.User.Add(newUser);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<UserViewModel>(HttpStatusCode.OK, user);

                }
                return response;
            });
        }

        /*recibo una peticion http y un id
         * devuelvo una respuesta conforme se ha realizado OK o ha habido un error y en tal caso, envio el mismo
         * 
         * 
         */
        public HttpResponseMessage Delete(HttpRequestMessage request, long id)
        {
            HttpResponseMessage response = null;
            try
            {
                return CreateHttpResponse(request, () =>
                {
                    if (!ModelState.IsValid)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                    }
                    else
                    {
                        User user = _DBErpCris.User.Single(c => c.IdUsuario == id);
                        _DBErpCris.User.Remove(user);
                        _DBErpCris.SaveChanges();

                        response = request.CreateResponse(HttpStatusCode.OK);

                    }
                    return response;
                });
            }
            catch (DataException ex)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest, ex);
                return response;
            }
            //return response;
        }

        private void UserMapper(UserViewModel source, ref User destino)
        {
            destino.Nombre = source.Nombre;
            destino.HashedPassword = source.HashedPassword;
            destino.Salt = source.Salt;
            destino.IsLocked = source.IsLocked;
            destino.FechaCreacion = source.FechaCreacion;
        }
    }
}
