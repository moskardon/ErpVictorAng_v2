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
    [RoutePrefix("api/Articulo")]
    public class ArticuloController : APIControllerBase
    {
        //Get 
        [Route("GetAll")]
        public IEnumerable<ArticuloViewModel> GetAll()
        {
            var articulos = _DBErpCris.Articulo.ToList<Articulo>();
            List<ArticuloViewModel> lstArts = new List<ArticuloViewModel>();
            foreach (Articulo art in articulos)
            {
                ArticuloViewModel articuloVM = new ArticuloViewModel();
                articuloVM.IdArticulo = art.IdArticulo;
                articuloVM.Nombre = art.Nombre;
                articuloVM.Descripcion = art.Descripcion;
                articuloVM.Medida1 = art.Medida1;
                articuloVM.Medida2 = art.Medida2;
                articuloVM.IdUnidad = art.IdUnidad;
                articuloVM.IdSubFamilia = art.IdSubFamilia;
                articuloVM.UnidadName = art.Unidad.Nombre;
                articuloVM.SubFamiliaName = art.SubFamilia.Nombre;
                articuloVM.PrecioBase = art.PrecioBase;
                lstArts.Add(articuloVM);
            }

            return lstArts.AsEnumerable();
        }

        [Route("Details")]
        public ArticuloViewModel GetArticulo(long id)
        {
            //REVISAR SI RECOGE CORRECTAMENTE LA SUBFAMILIA
            var articuloDb = _DBErpCris.Articulo.Single(c => c.IdArticulo == id);
            ArticuloViewModel articuloVM = new ArticuloViewModel();
            articuloVM.IdArticulo = articuloDb.IdArticulo;
            articuloVM.Nombre = articuloDb.Nombre;
            articuloVM.Descripcion = articuloDb.Descripcion;
            articuloVM.Medida1 = articuloDb.Medida1;
            articuloVM.Medida2 = articuloDb.Medida2;
            articuloVM.IdUnidad = articuloDb.IdUnidad;
            articuloVM.IdSubFamilia = articuloDb.IdSubFamilia;
            return articuloVM;

        }

        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, ArticuloViewModel articulo)
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
                    var articuloDb = _DBErpCris.Articulo.Single(c => c.IdArticulo == articulo.IdArticulo);
                    if (articuloDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Articulo");
                    }
                    else
                    {
                        this.ArticuloMapper(articulo, ref articuloDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<ArticuloViewModel>(HttpStatusCode.OK, articulo);
                    }
                }
                return response;
            });
        }

        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, ArticuloViewModel articulo)
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
                    Articulo newArticulo = new Articulo();
                    this.ArticuloMapper(articulo, ref newArticulo);
                    _DBErpCris.Articulo.Add(newArticulo);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<ArticuloViewModel>(HttpStatusCode.OK, articulo);

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
                        Articulo articulo = _DBErpCris.Articulo.Single(c => c.IdArticulo == id);
                        _DBErpCris.Articulo.Remove(articulo);
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

        private void ArticuloMapper(ArticuloViewModel source, ref Articulo destino)
        {
            destino.Nombre = source.Nombre;
            destino.Descripcion = source.Descripcion;
            destino.Medida1 = source.Medida1;
            destino.Medida2 = source.Medida2;
            destino.IdUnidad = source.IdUnidad;
            destino.IdSubFamilia = source.IdSubFamilia;
            destino.PrecioBase = source.PrecioBase;
        }
    }
}