//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ErpVictorAngDL
{
    using System;
    using System.Collections.Generic;
    
    public partial class Descuento
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Descuento()
        {
            this.Cliente = new HashSet<Cliente>();
            this.DescuentoCliente = new HashSet<DescuentoCliente>();
        }
    
        public long IdDescuento { get; set; }
        public decimal Valor { get; set; }
        public Nullable<long> IdDivision { get; set; }
        public Nullable<long> IdFamilia { get; set; }
        public Nullable<long> IdSubFamilia { get; set; }
        public Nullable<long> IdArticulo { get; set; }
    
        public virtual Articulo Articulo { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Cliente> Cliente { get; set; }
        public virtual Division Division { get; set; }
        public virtual Familia Familia { get; set; }
        public virtual SubFamilia SubFamilia { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DescuentoCliente> DescuentoCliente { get; set; }
    }
}
