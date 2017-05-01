using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class PresupuestoViewModel
    {
        public long IdPresupuesto { get; set; }
        public long IdCliente { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string FechaCreacionString { get; set; }
        public Nullable<System.DateTime> FechaAceptacion { get; set; }
        public string NumeroPresupuesto { get; set; }
        public string Observaciones { get; set; }
        public string NombreCliente { get; set; }
    }
}