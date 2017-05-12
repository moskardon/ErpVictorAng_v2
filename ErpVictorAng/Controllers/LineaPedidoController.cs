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
    [RoutePrefix("api/LineaPedido")]
    public class LineaPedidoController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<LineaPedidoViewModel> GetAll()
        {
            var lineasPedido = _DBErpCris.LineaPedido.ToList<LineaPedido>();
            List<LineaPedidoViewModel> lstLineas = new List<LineaPedidoViewModel>();
            foreach (LineaPedido lin in lineasPedido)
            {
                LineaPedidoViewModel lineasPedidoVM = new LineaPedidoViewModel();
                lineasPedidoVM.IdLineaPedido = lin.IdLineaPedido;
                lineasPedidoVM.IdPedido = lin.IdPedido;
                lineasPedidoVM.IdArticulo = lin.IdArticulo;
                lineasPedidoVM.Medida1 = lin.Medida1;
                lineasPedidoVM.Medida2 = lin.Medida2;
                lineasPedidoVM.Cantidad = lin.Cantidad;
                lineasPedidoVM.Precio = lin.Precio;
                lineasPedidoVM.Descuento = lin.Descuento;
                lstLineas.Add(lineasPedidoVM);
            }

            return lstLineas.AsEnumerable();
        }

        [Route("GetLineasByIdPedido/{idPedido:int}")]
        public IEnumerable<LineaPedidoViewModel> GetLineasByIdPedido(long idPedido)
        {
            var lineas = _DBErpCris.LineaPedido.Where(f => f.IdPedido == idPedido);
            List<LineaPedidoViewModel> lstLineas = new List<LineaPedidoViewModel>();
            foreach (LineaPedido lin in lineas)
            {
                LineaPedidoViewModel lineaPedidoVM = new LineaPedidoViewModel();
                lineaPedidoVM.IdLineaPedido = lin.IdLineaPedido;
                lineaPedidoVM.IdPedido = lin.IdPedido;
                lineaPedidoVM.IdArticulo = lin.IdArticulo;
                lineaPedidoVM.NombreArticulo = lin.Articulo.Nombre;
                lineaPedidoVM.Medida1 = lin.Medida1;
                lineaPedidoVM.Medida2 = lin.Medida2;
                lineaPedidoVM.Precio = lin.Precio;
                lineaPedidoVM.Cantidad = lin.Cantidad;
                lineaPedidoVM.Descuento = lin.Descuento;
                lstLineas.Add(lineaPedidoVM);
            }

            return lstLineas.AsEnumerable();
        }
        
        [Route("GetLineaPedidoById")]        
        public LineaPedidoViewModel GetLineaPedidoById(long id)
        {
            var lineaPedido = _DBErpCris.LineaPedido.Single(sf => sf.IdLineaPedido == id);
            LineaPedidoViewModel lineasPedidoVM = new LineaPedidoViewModel()
            {
                IdLineaPedido = lineaPedido.IdLineaPedido,
                IdPedido = lineaPedido.IdPedido,
                IdArticulo = lineaPedido.IdArticulo,
                Medida1 = lineaPedido.Medida1,
                Medida2 = lineaPedido.Medida2,
                Cantidad = lineaPedido.Cantidad
        };
            return lineasPedidoVM;
        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, LineaPedidoViewModel lineaPedido)
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
                    var lineaPedidoDb = _DBErpCris.LineaPedido.Single(c => c.IdLineaPedido == lineaPedido.IdLineaPedido);
                    if (lineaPedidoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid linea de pedido");
                    }
                    else
                    {
                        this.LineaPedidoMapper(lineaPedido, ref lineaPedidoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<LineaPedidoViewModel>(HttpStatusCode.OK, lineaPedido);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, LineaPedidoViewModel lineaPedido)
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
                    LineaPedido newLineaPedido = new LineaPedido();
                    this.LineaPedidoMapper(lineaPedido, ref newLineaPedido);
                    _DBErpCris.LineaPedido.Add(newLineaPedido);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<LineaPedidoViewModel>(HttpStatusCode.OK, lineaPedido);

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
                        LineaPedido lineaPedido = _DBErpCris.LineaPedido.Single(c => c.IdLineaPedido == id);
                        _DBErpCris.LineaPedido.Remove(lineaPedido);
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

        private void LineaPedidoMapper(LineaPedidoViewModel source, ref LineaPedido destino)
        {
            destino.IdPedido = source.IdPedido;
            destino.IdArticulo = source.IdArticulo;
            destino.Medida1 = source.Medida1;
            destino.Medida2 = source.Medida2;
            destino.Cantidad = source.Cantidad;
            destino.Precio = source.Precio;
            destino.Descuento = source.Descuento;
        }
    }
}