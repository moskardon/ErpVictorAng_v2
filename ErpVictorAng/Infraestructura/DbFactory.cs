using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ErpVictorAngDL;
using System.Configuration;

namespace ErpVictorAng.Infraestructura
{
    public class DbFactory : Disposable, IDbFactory
    {
        ErpCrisEntities dbContext;
        public ErpCrisEntities Init()
        {
            return dbContext ?? (dbContext = new ErpCrisEntities(ConfigurationManager.ConnectionStrings["ErpCrisEntities"].ConnectionString));
        }

        protected override void DisposeCore()
        {
            if(dbContext != null)
            {
                dbContext.Dispose();
            }
        }
    }
}