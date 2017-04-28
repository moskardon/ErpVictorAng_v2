using ErpVictorAng.Infraestructura.Core;
using ErpVictorAng.Services.Utilities;
using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ErpVictorAng.Services
{
    public class MembershipService
    {
        #region Variables
        private readonly ErpCrisEntities _DBErpCris;
        private readonly EncryptionService _encryptionService;
        #endregion

        public MembershipService(ErpCrisEntities dbContext, EncryptionService encryptionService)
        {
            _DBErpCris = dbContext;
            _encryptionService = encryptionService;
        }

        public MembershipService()
        {
            _DBErpCris = ContextDbFactory.GetCoDbcontext();
            _encryptionService = new EncryptionService();
        }

        #region IMembershipService Implementation

        public MembershipContext ValidateUser(string username, string password)
        {
            var membershipCtx = new MembershipContext();

            var user = _DBErpCris.User.Single(u => u.Nombre == username);
            if(user != null && isUserValid(user,password))
            {
                var userRoles = GetUserRoles(user.Nombre);
                membershipCtx.User = user;

                var identify = new GenericIdentity(user.Nombre);
                membershipCtx.Principal = new GenericPrincipal(identify, userRoles.Select(x => x.Nombre).ToArray());
            }

            return membershipCtx;
        }

        public User CreateUser (string username, string email, string password, int[] roles)
        {
            var existingUser = _DBErpCris.User.SingleOrDefault(u => u.Nombre == username);

            if(existingUser != null)
            {
                throw new Exception("Username is already in use");
            }
            var passwordSalt = _encryptionService.CreateSalt();

            var user = new User()
            {
                Nombre = username,
                Salt = passwordSalt,
                Email = email,
                IsLocked = false,
                HashedPassword = _encryptionService.EncryptPassword(password, passwordSalt),
                FechaCreacion = DateTime.Now
            };

            _DBErpCris.User.Add(user);
            _DBErpCris.SaveChanges();

            if(roles != null || roles.Length > 0)
            {
                foreach (var role in roles)
                {
                    addUserToRole(user, role);
                }
            }

            _DBErpCris.SaveChanges();

            return user;
        }

        public User GetUser(int userId)
        {
            return _DBErpCris.User.Single(u => u.IdUsuario == userId);
        }

        public List<Rol> GetUserRoles(string username)
        {
            List<Rol> _result = new List<Rol>();

            var existingUser = _DBErpCris.User.Single(u => u.Nombre == username);

            if (existingUser != null)
            {
                foreach (var userRole in existingUser.UserRol)
                {
                    _result.Add(userRole.Rol);
                }
            }

            return _result.Distinct().ToList();
        }

        #endregion

        #region Helper metodos

        public void addUserToRole(User user, int roleId)
        {
            var role = _DBErpCris.Rol.Single(r => r.IdRol == roleId);
            if (role == null)
            {
                throw new ApplicationException("No existe tal Rol.");
            }

            var userRole = new ErpVictorAngDL.UserRol()
            {
                IdRol = role.IdRol,
                IdUser= user.IdUsuario
            };

            _DBErpCris.UserRol.Add(userRole);
            _DBErpCris.SaveChanges();
        }
        private bool isPasswordValid(User user, string password)
        {
            return string.Equals(_encryptionService.EncryptPassword(password, user.Salt),user.HashedPassword);
        }

        private bool isUserValid(User user, string password)
        {
            if (isPasswordValid(user,password))
            {
                return !user.IsLocked;
            }
            return false;
        }

        #endregion
    }
}