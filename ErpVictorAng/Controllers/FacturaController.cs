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
    [Authorize(Roles = "Admin,Cont")]
    [RoutePrefix("api/Factura")]
    public class FacturaController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<FacturaViewModel> GetAll()
        {
            var facturas = _DBErpCris.Factura.ToList<Factura>();
            List<FacturaViewModel> lstFacs = new List<FacturaViewModel>();
            foreach (Factura fac in facturas)
            {
                FacturaViewModel facturaVM = new FacturaViewModel();
                facturaVM.IdFactura = fac.IdFactura;
                facturaVM.IdPedido = fac.IdPedido;
                facturaVM.IdAlbaran = fac.IdAlbaran;
                facturaVM.FechaCreacion = fac.FechaCreacion;
                facturaVM.NumeroFactura = fac.NumeroFactura;
                facturaVM.Observaciones = fac.Observaciones;
                facturaVM.IdCliente = fac.IdCliente;
                lstFacs.Add(facturaVM);
            }

            return lstFacs.AsEnumerable();
        }

        //extraido de subfamilias
        [Route("GetFacturaById")]
        public FacturaViewModel GetFacturaById(long id)
        {
            var factura = _DBErpCris.Factura.Single(sf => sf.IdFactura == id);
            FacturaViewModel facturaVm = new FacturaViewModel()
            {
                IdFactura = factura.IdFactura,
                IdPedido = factura.IdPedido,
                IdAlbaran = factura.IdAlbaran,
                FechaCreacion = factura.FechaCreacion,
                NumeroFactura = factura.NumeroFactura,
                Observaciones = factura.Observaciones,
                IdCliente = factura.IdCliente
        };
            return facturaVm;
        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, FacturaViewModel factura)
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
                    var facturaDb = _DBErpCris.Factura.Single(c => c.IdFactura == factura.IdFactura);
                    if (facturaDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Factura");
                    }
                    else
                    {
                        this.FacturaMapper(factura, ref facturaDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<FacturaViewModel>(HttpStatusCode.OK, factura);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, FacturaViewModel factura)
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
                    Factura newFactura = new Factura();
                    this.FacturaMapper(factura, ref newFactura);
                    _DBErpCris.Factura.Add(newFactura);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<FacturaViewModel>(HttpStatusCode.OK, factura);

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
                        Factura factura = _DBErpCris.Factura.Single(c => c.IdFactura == id);
                        _DBErpCris.Factura.Remove(factura);
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

        private void FacturaMapper(FacturaViewModel source, ref Factura destino)
        {
            destino.IdPedido = source.IdPedido;
            destino.IdAlbaran = source.IdAlbaran;
            destino.FechaCreacion = source.FechaCreacion;
            destino.NumeroFactura = source.NumeroFactura;
            destino.Observaciones = source.Observaciones;
            destino.IdCliente = source.IdCliente;
        }
    }
}
