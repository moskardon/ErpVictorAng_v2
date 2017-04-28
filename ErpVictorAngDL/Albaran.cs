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
    
    public partial class Albaran
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Albaran()
        {
            this.Factura = new HashSet<Factura>();
            this.LineaAlbaran = new HashSet<LineaAlbaran>();
        }
    
        public long IdAlbaran { get; set; }
        public long IdPedido { get; set; }
        public long IdCliente { get; set; }
        public System.DateTime FechCreacion { get; set; }
        public string NumeroAlbaran { get; set; }
        public string Observaciones { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        public virtual Pedido Pedido { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Factura> Factura { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<LineaAlbaran> LineaAlbaran { get; set; }
    }
}
