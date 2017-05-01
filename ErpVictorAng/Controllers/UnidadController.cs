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
    [Authorize(Roles = "Admin,Adtivo")]
    [RoutePrefix("api/Unidad")]
    public class UnidadController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<UnidadViewModel> GetAll()
        {
            var unidades = _DBErpCris.Unidad.ToList<Unidad>();
            List<UnidadViewModel> lstUnidades = new List<UnidadViewModel>();
            foreach (Unidad unidad in unidades)
            {
                UnidadViewModel unidadVM = new UnidadViewModel();
                unidadVM.IdUnidad = unidad.IdUnidad;
                unidadVM.IdTipoUnidad = unidad.IdTipoUnidad;
                unidadVM.Nombre = unidad.Nombre;
                unidadVM.Descripcion = unidad.Descripcion;
                unidadVM.NumeroMedida = unidad.NumeroMedida;
                unidadVM.TipoUnidadName = unidad.TipoUnidad.Nombre;
                lstUnidades.Add(unidadVM);
            }

            return lstUnidades.AsEnumerable();
        }

        [Route("GetUnidadById")]
        public UnidadViewModel GetUnidadById(long id)
        {
            var unidad = _DBErpCris.Unidad.Single(f => f.IdUnidad == id);
            UnidadViewModel unidadVm = new UnidadViewModel()
            {
                IdUnidad = unidad.IdUnidad,
                Nombre = unidad.Nombre,
                Descripcion = unidad.Descripcion,
                NumeroMedida = unidad.NumeroMedida,
                IdTipoUnidad = unidad.IdTipoUnidad
            };

            return unidadVm;
        }


        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, UnidadViewModel unidad)
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
                    var unidadDb = _DBErpCris.Unidad.Single(c => c.IdUnidad == unidad.IdUnidad);
                    if (unidadDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Unidad");
                    }
                    else
                    {
                        this.UnidadMapper(unidad, ref unidadDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<UnidadViewModel>(HttpStatusCode.OK, unidad);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, UnidadViewModel unidad)
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
                    Unidad newUnidad = new Unidad();
                    this.UnidadMapper(unidad, ref newUnidad);
                    _DBErpCris.Unidad.Add(newUnidad);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<UnidadViewModel>(HttpStatusCode.OK, unidad);

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
                        Unidad unidad = _DBErpCris.Unidad.Single(c => c.IdUnidad == id);
                        _DBErpCris.Unidad.Remove(unidad);
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

        private void UnidadMapper(UnidadViewModel source, ref Unidad destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
            destino.IdTipoUnidad = source.IdTipoUnidad;
            destino.NumeroMedida = source.NumeroMedida;
        }
    }
}

