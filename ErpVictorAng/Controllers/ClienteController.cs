using ErpVictorAng.Infraestructura.Core;
using ErpVictorAng.Models;
using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ErpVictorAng.Controllers
{
    //[Authorize(Roles = "Admin")]
    [Authorize(Roles = "Admin,Cliente,Com,Adtivo")]
    [RoutePrefix("api/Cliente")]
    public class ClienteController : APIControllerBase
    {
        [Route("GetAll")]
        public IEnumerable<ClienteViewModel> GetAll()
        {
            var clientes = _DBErpCris.Cliente.ToList<Cliente>();
            List<ClienteViewModel> lstCli = new List<ClienteViewModel>();
            foreach (Cliente cli in clientes)
            {
                ClienteViewModel clienteVM = new ClienteViewModel();
                clienteVM.IdCliente = cli.IdCliente;
                clienteVM.IdUsuario = cli.IdUsuario;
                clienteVM.NombreUsuario = cli.User.Nombre;
                clienteVM.IdDescuento = cli.IdDescuento;
                clienteVM.Descuento = cli.Descuento.Valor;
                clienteVM.Nombre = cli.Nombre;
                clienteVM.Apellido1 = cli.Apellido1;
                clienteVM.Apellido2 = cli.Apellido2;
                clienteVM.FechaNacimiento = cli.FechaNacimiento;
                clienteVM.Dni = cli.Dni;
                clienteVM.Cif = cli.Cif;
                clienteVM.NombreEmpresa = cli.NombreEmpresa;
                clienteVM.DescripcionEmpresa = cli.DescripcionEmpresa;
                clienteVM.Direccion = cli.Direccion;
                clienteVM.NumTelefono1 = cli.NumTelefono1;
                clienteVM.NumTelefono2 = cli.NumTelefono2;
                clienteVM.Email = cli.Email;
                clienteVM.Saldo = cli.Saldo;
                clienteVM.Moroso = cli.Moroso;
                lstCli.Add(clienteVM);
            }

            return lstCli.AsEnumerable();
        }
        
        [Route("GetClienteById")]
        public ClienteViewModel GetClienteById(long id)
        {
            var cliente = _DBErpCris.Cliente.Single(sf => sf.IdCliente == id);
            ClienteViewModel clienteVm = new ClienteViewModel()
            {
                IdCliente = cliente.IdCliente,
                IdUsuario = cliente.IdUsuario,
                IdDescuento = cliente.IdDescuento,
                Nombre = cliente.Nombre,
                Apellido1 = cliente.Apellido1,
                Apellido2 = cliente.Apellido2,
                FechaNacimiento = cliente.FechaNacimiento,
                Dni = cliente.Dni,
                Cif = cliente.Cif,
                NombreEmpresa = cliente.NombreEmpresa,
                DescripcionEmpresa = cliente.DescripcionEmpresa,
                Direccion = cliente.Direccion,
                NumTelefono1 = cliente.NumTelefono1,
                NumTelefono2 = cliente.NumTelefono2,
                Email = cliente.Email,
                Saldo = cliente.Saldo,
                Moroso = cliente.Moroso
        };
            return clienteVm;
        }

        [Authorize(Roles = "Admin,Com,Adtivo")]
        [Route("Update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, ClienteViewModel cliente)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var clienteDb = _DBErpCris.Cliente.Single(c => c.IdCliente == cliente.IdCliente);
                    if (clienteDb == null)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid Cliente" );
                    }
                    else
                    {
                        this.ClienteMapper(cliente, ref clienteDb);
                        _DBErpCris.SaveChanges();
                        response = request.CreateResponse<ClienteViewModel>(HttpStatusCode.OK, cliente);
                    }
                }
                return response;
            });
        }

        [Authorize(Roles = "Admin,Com,Adtivo")]
        [Route("Add")]
        [HttpPost]
        public HttpResponseMessage Add(HttpRequestMessage request, ClienteViewModel cliente)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    Cliente newCliente = new Cliente();
                    this.ClienteMapper(cliente, ref newCliente);
                    _DBErpCris.Cliente.Add(newCliente);
                    _DBErpCris.SaveChanges();

                    response = request.CreateResponse<ClienteViewModel>(HttpStatusCode.OK, cliente);

                }
                return response;
            });
        }

        [Authorize(Roles = "Admin,Com,Adtivo")]
        [Route("Delete")]
        public HttpResponseMessage Delete(HttpRequestMessage request, long id)
        {
            HttpResponseMessage response = null;
            try
            {
                return CreateHttpResponse(request, () =>
                {
                    if (!ModelState.IsValid)
                    {
                        response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                    }
                    else
                    {
                        Cliente cliente = _DBErpCris.Cliente.Single(c => c.IdCliente == id);
                        _DBErpCris.Cliente.Remove(cliente);
                        _DBErpCris.SaveChanges();

                        response = request.CreateResponse(HttpStatusCode.OK);
                    }
                    return response;
                });
            }
            catch (DataException ex)
            {
                response = request.CreateResponse(HttpStatusCode.BadRequest, ex);
                return response;
            }
        }

        private void ClienteMapper (ClienteViewModel source, ref Cliente destino)
        {
            destino.IdUsuario = source.IdUsuario;
            destino.IdDescuento = source.IdDescuento;
            destino.Nombre = source.Nombre;
            destino.Apellido1 = source.Apellido1;
            destino.Apellido2 = source.Apellido2;
            destino.FechaNacimiento = source.FechaNacimiento;
            destino.Dni = source.Dni;
            destino.Cif = source.Cif;
            destino.NombreEmpresa = source.NombreEmpresa;
            destino.DescripcionEmpresa = source.DescripcionEmpresa;
            destino.Direccion = source.Direccion;
            destino.NumTelefono1 = source.NumTelefono1;
            destino.NumTelefono2 = source.NumTelefono2;
            destino.Email = source.Email;
            destino.Saldo = source.Saldo;
            destino.Moroso = source.Moroso;
        }
    }
}
