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
    
    public partial class UserRol
    {
        public long IdUserRol { get; set; }
        public long IdUser { get; set; }
        public long IdRol { get; set; }
    
        public virtual Roles Roles { get; set; }
        public virtual User User { get; set; }
    }
}
