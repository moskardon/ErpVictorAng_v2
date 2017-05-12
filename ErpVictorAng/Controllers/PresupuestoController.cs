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
    [Authorize(Roles = "Admin,Cliente,Com,Adtivo")]
    [RoutePrefix("api/Presupuesto")]
    public class PresupuestoController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<PresupuestoViewModel> GetAll()
        {
            var presupuestos = _DBErpCris.Presupuesto.ToList<Presupuesto>();
            List<PresupuestoViewModel> lstPresupuestos = new List<PresupuestoViewModel>();
            foreach (Presupuesto pres in presupuestos)
            {
                PresupuestoViewModel presupuestoVM = new PresupuestoViewModel();
                presupuestoVM.IdPresupuesto = pres.IdPresupuesto;
                presupuestoVM.IdCliente = pres.IdCliente;
                presupuestoVM.NombreCliente = pres.Cliente.Nombre;
                presupuestoVM.FechaCreacion = pres.FechaCreacion;
                presupuestoVM.FechaCreacionString = pres.FechaCreacion.ToString("dd/MM/yyyy");
                presupuestoVM.FechaAceptacion = pres.FechaAceptacion;
                presupuestoVM.NumeroPresupuesto = pres.NumeroPresupuesto;
                presupuestoVM.Observaciones = pres.Observaciones;
                lstPresupuestos.Add(presupuestoVM);
            }

            return lstPresupuestos.AsEnumerable();
        }

        [Route("GetPresupuestoById")]
        public PresupuestoViewModel GetPresupuestoById(long id)
        {
            var presupuesto = _DBErpCris.Presupuesto.Single(p => p.IdPresupuesto == id);
            PresupuestoViewModel presupuestoVM = new PresupuestoViewModel()
            {
                IdPresupuesto = presupuesto.IdPresupuesto,
                IdCliente = presupuesto.IdCliente,
                FechaAceptacion = presupuesto.FechaAceptacion,
                FechaCreacion = presupuesto.FechaCreacion,
                NumeroPresupuesto = presupuesto.NumeroPresupuesto,
                Observaciones = presupuesto.Observaciones
            };
            return presupuestoVM;
        }


       // [Route("GetFamiliaByIdDivision/{idDivision:int}")]
        [Route("GetPresupuestoByNumber/{numPres:int}")]
        public PresupuestoViewModel GetPresupuestoByNumber(int numPres)
        {
            var presupuesto = _DBErpCris.Presupuesto.Single(f => f.NumeroPresupuesto == numPres.ToString());
            PresupuestoViewModel presuVm = new PresupuestoViewModel()
            {
                IdPresupuesto = presupuesto.IdPresupuesto,
                IdCliente = presupuesto.IdCliente,
                FechaAceptacion = presupuesto.FechaAceptacion,
                FechaCreacion = presupuesto.FechaCreacion,
                NumeroPresupuesto = presupuesto.NumeroPresupuesto,
                Observaciones = presupuesto.Observaciones
            };
            return presuVm;
        }


        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, PresupuestoViewModel presupuesto)
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
                    var presupuestoDb = _DBErpCris.Presupuesto.Single(c => c.IdPresupuesto == presupuesto.IdPresupuesto);
                    if (presupuestoDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Presupuesto");
                    }
                    else
                    {
                        this.PresupuestoMapper(presupuesto, ref presupuestoDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<PresupuestoViewModel>(HttpStatusCode.OK, presupuesto);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, PresupuestoViewModel presupuesto)
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
                    Presupuesto newPresupuesto = new Presupuesto();
                    this.PresupuestoMapper(presupuesto, ref newPresupuesto);
                    _DBErpCris.Presupuesto.Add(newPresupuesto);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<PresupuestoViewModel>(HttpStatusCode.OK, presupuesto);

                }
                return response;
            });
        }

        //[Route("Add_Identity")]
        //[HttpPost]
        //public HttpResponseMessage AddIdentity(HttpRequestMessage request, PresupuestoViewModel presupuesto)
        //{
        //    return CreateHttpResponse(request, () =>
        //    {
        //        HttpResponseMessage response = null;

        //        if (!ModelState.IsValid)
        //        {
        //            response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //        }
        //        else
        //        {
        //            Presupuesto newPresupuesto = new Presupuesto();
        //            this.PresupuestoMapper(presupuesto, ref newPresupuesto);
        //            _DBErpCris.Presupuesto.Add(newPresupuesto);
        //            _DBErpCris.SaveChanges();

        //            //guardo el id del insert en el objeto a devolver
        //            presupuesto.IdPresupuesto = 1;
        //            response = request.CreateResponse<PresupuestoViewModel>(HttpStatusCode.OK, presupuesto);

        //        }
        //        return response;
        //    });
        //}

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
                        DeleteLineasPresupuestoById(id);
                        Presupuesto presupuesto = _DBErpCris.Presupuesto.Single(c => c.IdPresupuesto == id);
                        _DBErpCris.Presupuesto.Remove(presupuesto);
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
        

        private void DeleteLineasPresupuestoById(long idPresupuesto)
        {
            var lineas = _DBErpCris.LineaPresupuesto.Where(f => f.IdPresupuesto == idPresupuesto);
            
            List<LineaPresupuestoViewModel> lstLineas = new List<LineaPresupuestoViewModel>();
            foreach (LineaPresupuesto lin in lineas)
            {
                DeleteLineaPresupuesto(lin.IdLineaPresupuesto);
            }
        }

        private void DeleteLineaPresupuesto(long idLinea)
        {
            LineaPresupuesto lineaPresupuesto = _DBErpCris.LineaPresupuesto.Single(c => c.IdLineaPresupuesto == idLinea);
            _DBErpCris.LineaPresupuesto.Remove(lineaPresupuesto);
        }
        private void PresupuestoMapper(PresupuestoViewModel source, ref Presupuesto destino)
        {
            destino.IdCliente = source.IdCliente;
            destino.FechaCreacion = source.FechaCreacion;
            destino.FechaAceptacion = source.FechaAceptacion;
            destino.NumeroPresupuesto = source.NumeroPresupuesto;
            destino.Observaciones = source.Observaciones;
        }
    }
}