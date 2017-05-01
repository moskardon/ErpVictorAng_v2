using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ErpVictorAng.Infraestructura.Core
{

    public abstract class APIControllerBase : ApiController
    {
        protected ErpCrisEntities _DBErpCris;

        public APIControllerBase()
        {
            _DBErpCris = ContextDbFactory.GetCoDbcontext();
        }

        protected HttpResponseMessage CreateHttpResponse(HttpRequestMessage request, Func<HttpResponseMessage> function)
        {
            HttpResponseMessage response = null;

            try
            {
                response = function.Invoke();
            }
            catch(DbUpdateException ex)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest, ex.InnerException.Message);
            }
            catch(Exception ex)
            {
                response = request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

            return response;
        }
    }
}
