using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class LineaPresupuestoViewModel
    {
        public long IdLineaPresupuesto { get; set; }
        public long IdPresupuesto { get; set; }
        public long IdArticulo { get; set; }
        public Nullable<short> Medida1 { get; set; }
        public Nullable<short> Medida2 { get; set; }
        public short Cantidad { get; set; }
        public Nullable<decimal> Precio { get; set; }
        public Nullable<decimal> Descuento { get; set; }
        public string NombreArticulo { get; set; }
    }
}