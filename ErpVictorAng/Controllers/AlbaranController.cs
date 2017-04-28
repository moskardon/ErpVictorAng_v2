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
    //[Authorize(Roles = "Admin")]
    [RoutePrefix("api/Albaran")]
    public class AlbaranController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<AlbaranViewModel> GetAll()
        {
            var albaranes = _DBErpCris.Albaran.ToList<Albaran>();
            List<AlbaranViewModel> lstAlbaranes = new List<AlbaranViewModel>();
            foreach (Albaran alb in albaranes)
            {
                AlbaranViewModel albaranVM = new AlbaranViewModel();
                albaranVM.IdAlbaran = alb.IdAlbaran;
                albaranVM.IdPedido = alb.IdPedido;
                albaranVM.IdCliente = alb.IdCliente;
                albaranVM.FechCreacion = alb.FechCreacion;
                albaranVM.NumeroAlbaran = alb.NumeroAlbaran;
                albaranVM.Observaciones = alb.Observaciones;
                lstAlbaranes.Add(albaranVM);
            }

            return lstAlbaranes.AsEnumerable();
        }

        //extraido de subfamilia y modificado
        [Route("GetAlbaranById")]
        public AlbaranViewModel GetAlbaranById(long id)
        {
            var albaran = _DBErpCris.Albaran.Single(sf => sf.IdAlbaran == id);
            AlbaranViewModel albaranVm = new AlbaranViewModel()
            {
                IdAlbaran = albaran.IdAlbaran,
                IdPedido = albaran.IdPedido,
                IdCliente = albaran.IdCliente,
                FechCreacion = albaran.FechCreacion,
                NumeroAlbaran = albaran.NumeroAlbaran,
                Observaciones = albaran.Observaciones
            };
            return albaranVm;
        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, AlbaranViewModel albaran)
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
                    var albaranDb = _DBErpCris.Albaran.Single(c => c.IdAlbaran == albaran.IdAlbaran);
                    if (albaranDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Albaran");
                    }
                    else
                    {
                        this.AlbaranMapper(albaran, ref albaranDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<AlbaranViewModel>(HttpStatusCode.OK, albaran);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, AlbaranViewModel albaran)
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
                    Albaran newAlbaran = new Albaran();
                    this.AlbaranMapper(albaran, ref newAlbaran);
                    _DBErpCris.Albaran.Add(newAlbaran);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<AlbaranViewModel>(HttpStatusCode.OK, albaran);

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
                        Albaran albaran = _DBErpCris.Albaran.Single(c => c.IdAlbaran == id);
                        _DBErpCris.Albaran.Remove(albaran);
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

        private void AlbaranMapper(AlbaranViewModel source, ref Albaran destino)
        {
            destino.IdPedido = source.IdPedido;
            destino.IdCliente = source.IdCliente;
            destino.FechCreacion = source.FechCreacion;
            destino.NumeroAlbaran = source.NumeroAlbaran;
            destino.Observaciones = source.Observaciones;
        }
    }
}

