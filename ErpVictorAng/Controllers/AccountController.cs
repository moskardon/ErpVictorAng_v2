using ErpVictorAng.Infraestructura.Core;
using ErpVictorAng.Models;
using ErpVictorAng.Services;
using ErpVictorAng.Services.Utilities;
using ErpVictorAngDL;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ErpVictorAng.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/Account")]
    public class AccountController : APIControllerBase
    {
        private readonly MembershipService _membershipService;

        public AccountController()
        {
            _membershipService = new MembershipService(this._DBErpCris, new EncryptionService());
        }

        [AllowAnonymous]
        [Route("authenticate")]
        [HttpPost]
        public HttpResponseMessage Authenticate(HttpRequestMessage request, LoginViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (ModelState.IsValid)
                {
                    MembershipContext _userContext = _membershipService.ValidateUser(user.Username, user.Password);

                    if (_userContext.User != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }
                else
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = false });

                return response;
            });
        }

        [AllowAnonymous]
        [Route("register")]
        [HttpPost]
        public HttpResponseMessage Register(HttpRequestMessage request, RegistrationViewModel user)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    //usuarios dados de alta como administradores por defecto
                    User _user = _membershipService.CreateUser(user.Username, user.Email, user.Password, new int[] { 2 });

                    if (_user != null)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = true });
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { success = false });
                    }
                }

                return response;
            });
        }
    }
}
