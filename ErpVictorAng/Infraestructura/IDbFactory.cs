using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ErpVictorAng.Infraestructura
{
    public interface IDbFactory : IDisposable
    {
        ErpCrisEntities Init();
    }
}