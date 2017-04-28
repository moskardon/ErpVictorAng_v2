﻿using ErpVictorAngDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ErpVictorAng.Services.Utilities
{
    public class MembershipContext
    {
        public IPrincipal Principal { get; set; }

        public User User { get; set; }

        public bool IsValid()
        {
            return Principal != null;
        }
    }
}