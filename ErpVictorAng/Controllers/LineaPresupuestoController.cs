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
    [RoutePrefix("api/LineaPresupuesto")]
    public class LineaPresupuestoController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<LineaPresupuestoViewModel> GetAll()
        {
            var lineasPresupuesto = _DBErpCris.LineaPresupuesto.ToList<LineaPresupuesto>();
            List<LineaPresupuestoViewModel> lstLineas = new List<LineaPresupuestoViewModel>();
            foreach (LineaPresupuesto lin in lineasPresupuesto)
            {
                LineaPresupuestoViewModel lineasPresupuestoVM = new LineaPresupuestoViewModel();
                lineasPresupuestoVM.IdLineaPresupuesto = lin.IdLineaPresupuesto;
                lineasPresupuestoVM.IdPresupuesto = lin.IdPresupuesto;
                lineasPresupuestoVM.IdArticulo = lin.IdArticulo;
                lineasPresupuestoVM.Medida1 = lin.Medida1;
                lineasPresupuestoVM.Medida2 = lin.Medida2;
                lineasPresupuestoVM.Cantidad = lin.Cantidad;
                lineasPresupuestoVM.Precio = lin.Precio;
                lineasPresupuestoVM.Descuento = lin.Descuento;
                lstLineas.Add(lineasPresupuestoVM);
            }

            return lstLineas.AsEnumerable();
        }
        

        [Route("GetLineasByIdPresupuesto/{idPresupuesto:int}")]
        public IEnumerable<LineaPresupuestoViewModel> GetLineasByIdPresupuesto(long idPresupuesto)
        {
            var lineas = _DBErpCris.LineaPresupuesto.Where(f => f.IdPresupuesto == idPresupuesto);
            List<LineaPresupuestoViewModel> lstLineas = new List<LineaPresupuestoViewModel>();
            foreach (LineaPresupuesto lin in lineas)
            {
                LineaPresupuestoViewModel lineaPresupuestoVM = new LineaPresupuestoViewModel();
                lineaPresupuestoVM.IdLineaPresupuesto = lin.IdLineaPresupuesto;
                lineaPresupuestoVM.IdPresupuesto = lin.IdPresupuesto;
                lineaPresupuestoVM.IdArticulo = lin.IdArticulo;
                lineaPresupuestoVM.NombreArticulo = lin.Articulo.Nombre;
                lineaPresupuestoVM.Medida1 = lin.Medida1;
                lineaPresupuestoVM.Medida2 = lin.Medida2;
                lineaPresupuestoVM.Precio = lin.Precio;
                lineaPresupuestoVM.Cantidad = lin.Cantidad;
                lineaPresupuestoVM.Descuento = lin.Descuento;
                lstLineas.Add(lineaPresupuestoVM);
            }

            return lstLineas.AsEnumerable();
        }
        
        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, LineaPresupuestoViewModel lineaPresupuesto)
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
                    var lineaPresupuestoDb = _DBErpCris.LineaPresupuesto.Single(c => c.IdLineaPresupuesto == lineaPresupuesto.IdLineaPresupuesto);
                    if (lineaPresupuestoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid linea de presupuesto");
                    }
                    else
                    {
                        this.LineaPedidoMapper(lineaPresupuesto, ref lineaPresupuestoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<LineaPresupuestoViewModel>(HttpStatusCode.OK, lineaPresupuesto);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, LineaPresupuestoViewModel lineaPresupuesto)
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
                    LineaPresupuesto newLineaPresupuesto = new LineaPresupuesto();
                    this.LineaPedidoMapper(lineaPresupuesto, ref newLineaPresupuesto);
                    _DBErpCris.LineaPresupuesto.Add(newLineaPresupuesto);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<LineaPresupuestoViewModel>(HttpStatusCode.OK, lineaPresupuesto);

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
                        LineaPresupuesto lineaPresupuesto = _DBErpCris.LineaPresupuesto.Single(c => c.IdLineaPresupuesto == id);
                        _DBErpCris.LineaPresupuesto.Remove(lineaPresupuesto);
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

        private void LineaPedidoMapper(LineaPresupuestoViewModel source, ref LineaPresupuesto destino)
        {
            destino.IdPresupuesto = source.IdPresupuesto;
            destino.IdArticulo = source.IdArticulo;
            destino.Medida1 = source.Medida1;
            destino.Medida2 = source.Medida2;
            destino.Cantidad = source.Cantidad;
            destino.Precio = source.Precio;
            destino.Descuento = source.Descuento;
        }
    }
}