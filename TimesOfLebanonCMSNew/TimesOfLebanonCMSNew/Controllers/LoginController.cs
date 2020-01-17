using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimesOfLebanonCMSNew.Models;

namespace TimesOfLebanonCMSNew.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Login()
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");

            //var encrypted = Cipher.Encrypt("kassouf", "admin");
            if (user != null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return View();
            }
          
        }

        public LoginController() {
            
        }


        [HttpGet]
        public ActionResult VerifyUser()
        {
            var username = Request.Query["username"];
            var password = Request.Query["password"];
            Users user = null;
            var res = false;
            TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
            try
            {
                // Get the stock item by id
                var encrypted = Cipher.Encrypt(password, username.ToString().ToLower());
                user = dbContext.Verify_User(username, encrypted);
                if (user != null)
                {
                    HttpContext.Session.SetObjectAsJson("User", user);
                    TempData["verified"] = "true";
                    return RedirectToAction("Index", "Home");
                }


                //var myComplexObject = HttpContext.Session.GetObjectFromJson<MyClass>("Test");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            TempData["verified"] = "false";
            return RedirectToAction("Login", "Login");
            //return login();

        }



        public void HandleException(Int32 UserId, string ActionName, Exception ex)
        {
            TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
            ExceptionModel model = new ExceptionModel();
            model.ActionName = ActionName;
            model.Exception = ex.StackTrace;
            model.Message = ex.Message;
            model.UserId = UserId;
            dbContext.InsertException(model);
        }
    }
}