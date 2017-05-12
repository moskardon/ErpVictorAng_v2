using ErpVictorAng.Infraestructura.Core;
using ErpVictorAng.Scripts.app.tipoUnidad;
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
    [RoutePrefix("api/TipoUnidad")]
    public class TipoUnidadController : APIControllerBase
    {
        //Get api/TipoUnidad
        [Route("GetAll")]
        public IEnumerable<TipoUnidadViewModel> GetAll()
        {
            var tUnidades = _DBErpCris.TipoUnidad.ToList<TipoUnidad>();
            List<TipoUnidadViewModel> lstTUnidades = new List<TipoUnidadViewModel>();
            foreach (TipoUnidad tUn in tUnidades)
            {
                TipoUnidadViewModel tipoUnidadVM = new TipoUnidadViewModel();
                tipoUnidadVM.IdTipoUnidad = tUn.IdTipoUnidad;
                tipoUnidadVM.Nombre = tUn.Nombre;
                tipoUnidadVM.Descripcion = tUn.Descripcion;
                lstTUnidades.Add(tipoUnidadVM);
            }

            return lstTUnidades.AsEnumerable();
        }

        [Route("Details")]
        public TipoUnidadViewModel GetTipoUnidad(long id)
        {
            var tUnidadDb = _DBErpCris.TipoUnidad.Single(c => c.IdTipoUnidad == id);
            TipoUnidadViewModel tUnidadVM = new TipoUnidadViewModel();
            tUnidadVM.IdTipoUnidad = tUnidadDb.IdTipoUnidad;
            tUnidadVM.Nombre = tUnidadDb.Nombre;
            tUnidadVM.Descripcion = tUnidadDb.Descripcion;

            return tUnidadVM;

        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, TipoUnidadViewModel tipoUnidad)
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
                    var tUnidadDb = _DBErpCris.TipoUnidad.Single(c => c.IdTipoUnidad == tipoUnidad.IdTipoUnidad);
                    if (tUnidadDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid tipo de Unidad");
                    }
                    else
                    {
                        this.TipoUnidadMapper(tipoUnidad, ref tUnidadDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<TipoUnidadViewModel>(HttpStatusCode.OK, tipoUnidad);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, TipoUnidadViewModel tipoUnidad)
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
                    TipoUnidad newTipoUnidad = new TipoUnidad();
                    this.TipoUnidadMapper(tipoUnidad, ref newTipoUnidad);
                    _DBErpCris.TipoUnidad.Add(newTipoUnidad);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<TipoUnidadViewModel>(HttpStatusCode.OK, tipoUnidad);

                }
                return response;
            });
        }
        
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
                        TipoUnidad tUnidad = _DBErpCris.TipoUnidad.Single(c => c.IdTipoUnidad == id);
                        _DBErpCris.TipoUnidad.Remove(tUnidad);
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
        }

        private void TipoUnidadMapper(TipoUnidadViewModel source, ref TipoUnidad destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
        }
    }
}

