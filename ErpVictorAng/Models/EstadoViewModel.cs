using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class EstadoViewModel
    {
        public long IdEstado { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public long Entidad { get; set; }
    }
}