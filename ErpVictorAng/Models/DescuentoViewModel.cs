using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class DescuentoViewModel
    {
        public long IdDescuento { get; set; }
        public decimal Valor { get; set; }
        public Nullable<long> IdDivision { get; set; }
        public Nullable<long> IdFamilia { get; set; }
        public Nullable<long> IdSubFamilia { get; set; }
        public Nullable<long> IdArticulo { get; set; }
        public string DivisionName { get; set; }
        public string FamiliaName { get; set; }
        public string SubFamiliaName { get; set; }
        public string ArticuloName { get; set; }
    }
}