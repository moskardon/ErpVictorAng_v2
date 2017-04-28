using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class PedidoViewModel
    {
        public long IdPedido { get; set; }
        public long IdCliente { get; set; }
        public Nullable<long> IdPresupuesto { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string NumeroPedido { get; set; }
        public string Observaciones { get; set; }
    }
}