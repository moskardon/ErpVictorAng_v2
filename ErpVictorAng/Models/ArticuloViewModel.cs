using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class ArticuloViewModel
    {
        public long IdArticulo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public Nullable<short> Medida1 { get; set; }
        public Nullable<short> Medida2 { get; set; }
        public long IdUnidad { get; set; }
        public long IdSubFamilia {get; set;}
        public string UnidadName { get; set; }
        public string SubFamiliaName { get; set; }
        public Nullable<decimal> PrecioBase { get; set; }
    }
}