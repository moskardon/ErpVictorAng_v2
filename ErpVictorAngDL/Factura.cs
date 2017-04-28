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
    
    public partial class Factura
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Factura()
        {
            this.LineaFactura = new HashSet<LineaFactura>();
        }
    
        public long IdFactura { get; set; }
        public long IdPedido { get; set; }
        public Nullable<long> IdAlbaran { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string NumeroFactura { get; set; }
        public string Observaciones { get; set; }
        public long IdCliente { get; set; }
    
        public virtual Albaran Albaran { get; set; }
        public virtual Cliente Cliente { get; set; }
        public virtual Pedido Pedido { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<LineaFactura> LineaFactura { get; set; }
    }
}