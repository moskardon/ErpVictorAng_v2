﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ErpCrisEntities : DbContext
    {
        public ErpCrisEntities()
            : base("name=ErpCrisEntities")
        {
        }

        public ErpCrisEntities(string connectionString)
            : base(connectionString)
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Articulo> Articulo { get; set; }
        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<Descuento> Descuento { get; set; }
        public virtual DbSet<DescuentoCliente> DescuentoCliente { get; set; }
        public virtual DbSet<Division> Division { get; set; }
        public virtual DbSet<Familia> Familia { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<SubFamilia> SubFamilia { get; set; }
        public virtual DbSet<TipoUnidad> TipoUnidad { get; set; }
        public virtual DbSet<Unidad> Unidad { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserRol> UserRol { get; set; }
    }
}
