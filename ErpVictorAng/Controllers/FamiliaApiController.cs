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
    public class FamiliaApiController : APIControllerBase
    {
        public IEnumerable<FamiliaViewModel> GetAll()
        {
            var familias = _DBErpCris.Familia.ToList<Familia>();
            List<FamiliaViewModel> lstDivs = new List<FamiliaViewModel>();
            foreach (Familia fam in familias)
            {
                FamiliaViewModel familiaVM = new FamiliaViewModel();
                familiaVM.IdFamilia = fam.IdFamilia;
                familiaVM.IdDivision = fam.IdDivision;
                //familiaVM.NombreDivision = "";
                familiaVM.Nombre = fam.Nombre;
                familiaVM.Descripcion = fam.Descripcion;
                lstDivs.Add(familiaVM);
            }

            return lstDivs.AsEnumerable();
        }
        
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, FamiliaViewModel familia)
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
                    var familiaDb = _DBErpCris.Familia.Single(c => c.IdFamilia == familia.IdFamilia);
                    if (familiaDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid familia");
                    }
                    else
                    {
                        this.FamiliaMapper(familia, ref familiaDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<FamiliaViewModel>(HttpStatusCode.OK, familia);
                    }
                }
                return response;
            });
        }

        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, FamiliaViewModel familia)
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
                    Familia newFamilia = new Familia();
                    this.FamiliaMapper(familia, ref newFamilia);
                    _DBErpCris.Familia.Add(newFamilia);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<FamiliaViewModel>(HttpStatusCode.OK, familia);

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
                        Familia familia = _DBErpCris.Familia.Single(c => c.IdFamilia == id);
                        _DBErpCris.Familia.Remove(familia);
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

        private void FamiliaMapper(FamiliaViewModel source, ref Familia destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
            destino.IdDivision = source.IdDivision;
        }
    }
}
