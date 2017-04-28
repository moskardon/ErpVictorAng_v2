using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class UserViewModel
    {
        public long IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string HashedPassword { get; set; }
        public string Salt { get; set; }
        public bool IsLocked { get; set; }
        public System.DateTime FechaCreacion { get; set; }
    }
}