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
    [AllowAnonymous]
    [RoutePrefix("api/Estado")]
    public class EstadoController : APIControllerBase
    {
        //Get 
        [Route("GetAll")]
        public IEnumerable<EstadoViewModel> GetAll()
        {
            var estados = _DBErpCris.Estado.ToList<Estado>();
            List<EstadoViewModel> lstEsts = new List<EstadoViewModel>();
            foreach (Estado est in estados)
            {
                EstadoViewModel estadoVM = new EstadoViewModel();
                estadoVM.IdEstado = est.IdEstado;
                estadoVM.Nombre = est.Nombre;
                estadoVM.Descripcion = est.Descripcion;
                estadoVM.Entidad = est.Entidad;
                lstEsts.Add(estadoVM);
            }

            return lstEsts.AsEnumerable();
        }

        [Route("Details")]
        public EstadoViewModel GetEstado(long id)
        {
            var estadoDb = _DBErpCris.Estado.Single(c => c.IdEstado == id);
            EstadoViewModel estadoVM = new EstadoViewModel();
            estadoVM.IdEstado = estadoDb.IdEstado;
            estadoVM.Nombre = estadoDb.Nombre;
            estadoVM.Descripcion = estadoDb.Descripcion;
            estadoVM.Entidad = estadoDb.Entidad;

            return estadoVM;

        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, EstadoViewModel estado)
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
                    var estadoDb = _DBErpCris.Estado.Single(c => c.IdEstado == estado.IdEstado);
                    if (estadoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid estado");
                    }
                    else
                    {
                        this.EstadoMapper(estado, ref estadoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<EstadoViewModel>(HttpStatusCode.OK, estado);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, EstadoViewModel estado)
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
                    Estado newEstado= new Estado();
                    this.EstadoMapper(estado, ref newEstado);
                    _DBErpCris.Estado.Add(newEstado);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<EstadoViewModel>(HttpStatusCode.OK, estado);

                }
                return response;
            });
        }

        /*recibo una peticion http y un id
         * devuelvo una respuesta conforme se ha realizado OK o ha habido un error y en tal caso, envio el mismo
         * 
         * 
         */
        [Route("Delete")]
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
                        Division division = _DBErpCris.Division.Single(c => c.IdDivision == id);
                        _DBErpCris.Division.Remove(division);
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

        private void EstadoMapper(EstadoViewModel source, ref Estado destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
            destino.Entidad = source.Entidad;
        }
    }
}
