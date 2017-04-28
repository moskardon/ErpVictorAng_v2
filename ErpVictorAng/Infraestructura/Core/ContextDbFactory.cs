using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Infraestructura.Core
{
    //estatica
    public static class ContextDbFactory
    {
        private static ErpCrisEntities _DBErpCris;
        private static readonly DbFactory dbFactory;

        static ContextDbFactory()
        {
            if (dbFactory == null) dbFactory = new DbFactory();
            if (_DBErpCris == null) _DBErpCris = dbFactory.Init();
        }

        public static ErpCrisEntities GetCoDbcontext()
        {
            return _DBErpCris;
        }
    }
}