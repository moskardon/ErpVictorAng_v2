using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class FacturaViewModel
    {
        public long IdFactura { get; set; }
        public long IdPedido { get; set; }
        public Nullable<long> IdAlbaran { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string FechaCreacionString { get; set; }
        public string NumeroFactura { get; set; }
        public string NumeroPedido { get; set; }
        public string Observaciones { get; set; }
        public long IdCliente { get; set; }
    }
}