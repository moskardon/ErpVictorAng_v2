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
    [RoutePrefix("api/SubFamilia")]
    public class SubFamiliaController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<SubFamiliaViewModel> GetAll()
        {
            var subfamilias = _DBErpCris.SubFamilia.ToList<SubFamilia>();
            List<SubFamiliaViewModel> lstSubFam = new List<SubFamiliaViewModel>();
            foreach (SubFamilia subFam in subfamilias)
            {
                SubFamiliaViewModel subFailiaVM = new SubFamiliaViewModel();
                subFailiaVM.IdSubFamilia = subFam.IdSubFamilia;                
                subFailiaVM.IdDivision = subFam.IdDivision;
                subFailiaVM.Nombre = subFam.Nombre;
                subFailiaVM.IdFamilia = subFam.IdFamilia;
                subFailiaVM.Descripcion = subFam.Descripcion;
                subFailiaVM.DivisionName = subFam.Division.Nombre;
                subFailiaVM.FamiliaName = subFam.Familia.Nombre;
                lstSubFam.Add(subFailiaVM);
            }

            return lstSubFam.AsEnumerable();
        }

        //modifico de [Route("GetFamiliaById")] --> [Route("GetSubFamiliaById")]
        [Route("GetSubFamiliaById")]
        //modifico de public SubFamiliaViewModel GetFamiliaById(long id) --> public SubFamiliaViewModel GetSubFamiliaById(long id)
        public SubFamiliaViewModel GetSubFamiliaById(long id)
        {
            var subFamilia = _DBErpCris.SubFamilia.Single(sf => sf.IdSubFamilia == id);
            SubFamiliaViewModel subFamiliaVm = new SubFamiliaViewModel()
            {
                IdSubFamilia = subFamilia.IdSubFamilia,
                Nombre = subFamilia.Nombre,
                Descripcion = subFamilia.Descripcion,
                IdFamilia = subFamilia.IdFamilia,
                IdDivision = subFamilia.IdDivision
            };
            return subFamiliaVm;
        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, SubFamiliaViewModel subFamilia)
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
                    var subFamiliaDb = _DBErpCris.SubFamilia.Single(c => c.IdFamilia == subFamilia.IdSubFamilia);
                    if (subFamiliaDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Sub Familia");
                    }
                    else
                    {
                        this.SubFamiliaMapper(subFamilia, ref subFamiliaDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<SubFamiliaViewModel>(HttpStatusCode.OK, subFamilia);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, SubFamiliaViewModel subFamilia)
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
                    SubFamilia newSubFamilia = new SubFamilia();
                    this.SubFamiliaMapper(subFamilia, ref newSubFamilia);
                    _DBErpCris.SubFamilia.Add(newSubFamilia);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<SubFamiliaViewModel>(HttpStatusCode.OK, subFamilia);

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
                        SubFamilia subFamilia = _DBErpCris.SubFamilia.Single(c => c.IdSubFamilia == id);
                        _DBErpCris.SubFamilia.Remove(subFamilia);
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

        private void SubFamiliaMapper(SubFamiliaViewModel source, ref SubFamilia destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
            destino.IdFamilia = source.IdFamilia;
            destino.IdDivision = source.IdDivision;
        }
    }
}
