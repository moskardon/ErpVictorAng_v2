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
    [RoutePrefix("api/Division")]
    public class DivisionController : APIControllerBase
    {

        //Get api/Divisiones
        [Route("GetAll")]
        public IEnumerable<DivisionViewModel> GetAll()
        {
            var divisiones = _DBErpCris.Division.ToList<Division>();
            List<DivisionViewModel> lstDivs = new List<DivisionViewModel>();
            foreach(Division div in divisiones)
            {
                DivisionViewModel divisionVM = new DivisionViewModel();
                divisionVM.IdDivision = div.IdDivision;
                divisionVM.Nombre = div.Nombre;
                divisionVM.Descripcion = div.Descripcion;
                lstDivs.Add(divisionVM);
            }

            return lstDivs.AsEnumerable();
        }

        [Route("Details")]
        public DivisionViewModel GetDivision(long id)
        {
            var divisionDb = _DBErpCris.Division.Single(c => c.IdDivision == id);
            DivisionViewModel divisionVM = new DivisionViewModel();
            divisionVM.IdDivision = divisionDb.IdDivision;
            divisionVM.Nombre = divisionDb.Nombre;
            divisionVM.Descripcion = divisionDb.Descripcion;

            return divisionVM;

        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, DivisionViewModel division)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if(!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest,ModelState);
                }
                else
                {
                    var divisionDb = _DBErpCris.Division.Single(c => c.IdDivision == division.IdDivision);
                    if(divisionDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid division");
                    }
                    else
                    {
                        this.DivisionMapper(division, ref divisionDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<DivisionViewModel>(HttpStatusCode.OK, division);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, DivisionViewModel division)
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
                    Division newDivision = new Division();
                    this.DivisionMapper(division, ref newDivision);
                    _DBErpCris.Division.Add(newDivision);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<DivisionViewModel>(HttpStatusCode.OK, division);
                    
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
            catch(DataException ex)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest, ex);
                return response;
            }
            //return response;
        }

        private void DivisionMapper(DivisionViewModel source, ref Division destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
        }
    }
}
