using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class UnidadViewModel
    {
        public long IdUnidad { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public Nullable<int> NumeroMedida { get; set; }
        public long IdTipoUnidad { get; set; }
        public string TipoUnidadName { get; set; }
    }
}