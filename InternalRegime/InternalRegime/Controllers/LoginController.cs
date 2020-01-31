using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternalRegime.Models;
using Microsoft.AspNetCore.Mvc;

namespace InternalRegime.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Login()
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");

            
            if (member != null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return View();
            }
        }

        [HttpGet]
        public IActionResult VerifyMember(MemberModel Member)
        {
            var memberId = Request.Query["memberId"];

            MemberModel member = null;

            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    member = dbContext.VerifyMember(Convert.ToInt64(memberId));
                }


                if (member != null)
                {
                    HttpContext.Session.SetObjectAsJson("Member", member);
                    TempData["verified"] = "true";
                    return RedirectToAction("Index", "Home");
                }
            }
            catch (Exception ex)
            {
                AddException(ex, "VerifyLogin");
            }

            TempData["verified"] = "false";
            return RedirectToAction("Login", "Login");

        }



        public int AddException(Exception ex, string absoluteURL)
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            int id = 0;
            ExceptionModel model = new ExceptionModel();
            model.StackTrace = ex.StackTrace;
            model.AbsoluteUrl = absoluteURL;
            model.MemberId = member.MemberID;
            model.MemberFullName = member.FullName;
            using (TWHContext context = new TWHContext())
            {
                id = context.AddException(model);
            }

            return id;
        }
    }
}