using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class AlbaranViewModel
    {
        public long IdAlbaran { get; set; }
        public long IdPedido { get; set; }
        public long IdCliente { get; set; }
        public System.DateTime FechCreacion { get; set; }
        public string NumeroAlbaran { get; set; }
        public string Observaciones { get; set; }
    }
}