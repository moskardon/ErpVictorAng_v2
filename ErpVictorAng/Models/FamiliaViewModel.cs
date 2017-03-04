using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class FamiliaViewModel
    {
        public long IdFamilia { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public long IdDivision { get; set; }
        public string NombreDivision { get; set; }
    }
}