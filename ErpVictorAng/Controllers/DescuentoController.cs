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
    [Authorize(Roles = "Admin,Com,Adtivo")]
    [RoutePrefix("api/Descuento")]
    public class DescuentoController : APIControllerBase
    {
        //Get 
        [Route("GetAll")]
        public IEnumerable<DescuentoViewModel> GetAll()
        {
            var descuentos = _DBErpCris.Descuento.ToList<Descuento>();
            List<DescuentoViewModel> lstDesc = new List<DescuentoViewModel>();
            foreach (Descuento des in descuentos)
            {
                DescuentoViewModel descuentoVM = new DescuentoViewModel();
                if (des.IdDivision != null)
                {
                    var divisionDb = _DBErpCris.Division.Single(c => c.IdDivision == des.IdDivision);
                    descuentoVM.DivisionName = divisionDb.Nombre;
                }
                if (des.IdFamilia != null)
                {
                    var familiaDb = _DBErpCris.Familia.Single(f => f.IdFamilia == des.IdFamilia);
                    descuentoVM.FamiliaName = familiaDb.Nombre;
                }
                if (des.IdSubFamilia != null)
                {
                    var subfamiliaDb = _DBErpCris.SubFamilia.Single(sf => sf.IdSubFamilia == des.IdSubFamilia);
                    descuentoVM.SubFamiliaName = subfamiliaDb.Nombre;
                }
                if (des.IdArticulo != null)
                {
                    var articuloDb = _DBErpCris.Articulo.Single(a => a.IdArticulo == des.IdArticulo);
                    descuentoVM.ArticuloName = articuloDb.Nombre;
                }

                //DescuentoViewModel descuentoVM = new DescuentoViewModel();
                descuentoVM.IdDescuento = des.IdDescuento;
                descuentoVM.Valor = des.Valor;
                descuentoVM.IdDivision = des.IdDivision;
                descuentoVM.IdFamilia = des.IdFamilia;
                descuentoVM.IdSubFamilia = des.IdSubFamilia;
                descuentoVM.IdArticulo = des.IdArticulo;
                lstDesc.Add(descuentoVM);
            }

            return lstDesc.AsEnumerable();
        }

        [Route("Details")]
        public DescuentoViewModel GetDescuento(long id)
        {
            var descuentonDb = _DBErpCris.Descuento.Single(c => c.IdDescuento == id);
            DescuentoViewModel descuentoVM = new DescuentoViewModel();
            descuentoVM.IdDescuento = descuentonDb.IdDescuento;
            descuentoVM.Valor = descuentonDb.Valor;
            descuentoVM.IdDivision = descuentonDb.IdDivision;
            descuentoVM.IdFamilia = descuentonDb.IdFamilia;
            descuentoVM.IdSubFamilia = descuentonDb.IdSubFamilia;
            descuentoVM.IdArticulo = descuentonDb.IdArticulo;

            return descuentoVM;

        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, DescuentoViewModel descuento)
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
                    var descuentoDb = _DBErpCris.Descuento.Single(c => c.IdDescuento == descuento.IdDescuento);
                    if (descuentoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid descuento");
                    }
                    else
                    {
                        this.DescuentoMapper(descuento, ref descuentoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<DescuentoViewModel>(HttpStatusCode.OK, descuento);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, DescuentoViewModel descuento)
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
                    Descuento newDescuento = new Descuento();
                    this.DescuentoMapper(descuento, ref newDescuento);
                    _DBErpCris.Descuento.Add(newDescuento);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<DescuentoViewModel>(HttpStatusCode.OK, descuento);

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
                        Descuento descuento = _DBErpCris.Descuento.Single(c => c.IdDescuento == id);
                        _DBErpCris.Descuento.Remove(descuento);
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

        private void DescuentoMapper(DescuentoViewModel source, ref Descuento destino)
        {
            destino.Valor = source.Valor;
            destino.IdDivision = source.IdDivision;
            destino.IdFamilia = source.IdFamilia;
            destino.IdSubFamilia = source.IdSubFamilia;
            destino.IdArticulo = source.IdArticulo;
        }
    }
}
