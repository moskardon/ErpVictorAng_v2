using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ErpVictorAng.Models
{
    public class ClienteViewModel
    {
        public long IdCliente { get; set; }
        public long IdUsuario { get; set; }
        public string NombreUsuario { get; set; }
        public long IdDescuento { get; set; }
        public decimal Descuento { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public Nullable<System.DateTime> FechaNacimiento { get; set; }
        public string Dni { get; set; }
        public string Cif { get; set; }
        public string NombreEmpresa { get; set; }
        public string DescripcionEmpresa { get; set; }
        public string Direccion { get; set; }
        public string NumTelefono1 { get; set; }
        public string NumTelefono2 { get; set; }
        public string Email { get; set; }
        public Nullable<decimal> Saldo { get; set; }
        public bool Moroso { get; set; }
    }
}