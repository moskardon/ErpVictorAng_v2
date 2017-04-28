using ErpVictorAng.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace ErpVictorAng.Infraestructura.Extensions
{
    public static class RequestMessageExtensions
    {
        internal static MembershipService GetMembershipService(this HttpRequestMessage request)
        {
            return new MembershipService();
        }
    }
}