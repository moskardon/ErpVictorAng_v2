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
    
    public partial class LineaPedido
    {
        public long IdLineaPedido { get; set; }
        public long IdPedido { get; set; }
        public long IdArticulo { get; set; }
        public Nullable<short> Medida1 { get; set; }
        public Nullable<short> Medida2 { get; set; }
        public short Cantidad { get; set; }
        public Nullable<decimal> Precio { get; set; }
        public Nullable<decimal> Descuento { get; set; }
    
        public virtual Articulo Articulo { get; set; }
        public virtual Pedido Pedido { get; set; }
    }
}
