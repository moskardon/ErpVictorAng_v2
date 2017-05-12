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
    [Authorize(Roles = "Admin,Adtivo,Cont")]
    [RoutePrefix("api/Pedido")]
    public class PedidoController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<PedidoViewModel> GetAll()
        {
            var pedidos = _DBErpCris.Pedido.ToList<Pedido>();
            List<PedidoViewModel> lstPedidos = new List<PedidoViewModel>();
            foreach (Pedido ped in pedidos)
            {
                PedidoViewModel pedidoVM = new PedidoViewModel();
                pedidoVM.IdPedido = ped.IdPedido;
                pedidoVM.IdCliente = ped.IdCliente;
                pedidoVM.NombreCliente = ped.Cliente.Nombre;
                pedidoVM.IdPresupuesto = ped.IdPresupuesto;
                pedidoVM.FechaCreacion = ped.FechaCreacion;
                pedidoVM.FechaCreacionString = ped.FechaCreacion.ToString("dd/MM/yyyy");
                pedidoVM.NumeroPedido = ped.NumeroPedido;
                pedidoVM.Observaciones = ped.Observaciones;
                lstPedidos.Add(pedidoVM);
            }

            return lstPedidos.AsEnumerable();
        }

        [Route("GetPedidoById")]
        public PedidoViewModel GetPedidoById(long id)
        {
            var pedido = _DBErpCris.Pedido.Single(f => f.IdPedido == id);
            PedidoViewModel pedidoVm = new PedidoViewModel()
            {
                IdPedido = pedido.IdPedido,
                IdCliente = pedido.IdCliente,
                IdPresupuesto = pedido.IdPresupuesto,
                FechaCreacion = pedido.FechaCreacion,
                NumeroPedido = pedido.NumeroPedido,
                Observaciones = pedido.Observaciones
        };
            return pedidoVm;
        }

        [Route("GetPedidoByNumber/{numPed:int}")]
        public PedidoViewModel GetPedidoByNumber(int numPed)
        {
            var pedido = _DBErpCris.Pedido.Single(f => f.NumeroPedido == numPed.ToString());
            PedidoViewModel pedVm = new PedidoViewModel()
            {
                IdPedido = pedido.IdPedido,
                IdPresupuesto = pedido.IdPresupuesto,
                IdCliente = pedido.IdCliente,
                FechaCreacion = pedido.FechaCreacion,
                NumeroPedido = pedido.NumeroPedido,
                Observaciones = pedido.Observaciones
            };
            return pedVm;
        }

        [Authorize(Roles = "Admin,Adtivo")]
        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, PedidoViewModel pedido)
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
                    var pedidoDb = _DBErpCris.Pedido.Single(c => c.IdPedido == pedido.IdPedido);
                    if (pedidoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid pedido");
                    }
                    else
                    {
                        this.PedidoMapper(pedido, ref pedidoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<PedidoViewModel>(HttpStatusCode.OK, pedido);
                    }
                }
                return response;
            });
        }

        [Authorize(Roles = "Admin,Adtivo")]
        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, PedidoViewModel pedido)
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
                    Pedido newPedido = new Pedido();
                    this.PedidoMapper(pedido, ref newPedido);
                    _DBErpCris.Pedido.Add(newPedido);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<PedidoViewModel>(HttpStatusCode.OK, pedido);

                }
                return response;
            });
        }
        
        [Authorize(Roles = "Admin,Adtivo")]
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
                        DeleteLineasPedidoById(id);
                        Pedido pedido = _DBErpCris.Pedido.Single(c => c.IdPedido == id);
                        _DBErpCris.Pedido.Remove(pedido);
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

        private void DeleteLineasPedidoById(long idPedido)
        {
            var lineas = _DBErpCris.LineaPedido.Where(f => f.IdPedido == idPedido);

            List<LineaPedidoViewModel> lstLineas = new List<LineaPedidoViewModel>();
            foreach (LineaPedido lin in lineas)
            {
                DeleteLineaPedido(lin.IdLineaPedido);
            }
        }

        private void DeleteLineaPedido(long idLinea)
        {
            LineaPedido lineaPedido = _DBErpCris.LineaPedido.Single(c => c.IdLineaPedido == idLinea);
            _DBErpCris.LineaPedido.Remove(lineaPedido);
        }

        private void PedidoMapper(PedidoViewModel source, ref Pedido destino)
        {
            destino.IdCliente = source.IdCliente;
            destino.IdPresupuesto = source.IdPresupuesto;
            destino.FechaCreacion = source.FechaCreacion;
            destino.NumeroPedido = source.NumeroPedido;
            destino.Observaciones = source.Observaciones;
        }
    }
}
