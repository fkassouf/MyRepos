using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InternalRegime.Models;
using Microsoft.AspNetCore.Hosting;

namespace InternalRegime.Controllers
{
    public class HomeController : Controller
    {

        private readonly IHostingEnvironment hostingEnvironment;
        private readonly string _baseURL;

        public HomeController(IHostingEnvironment environment)
        {
            hostingEnvironment = environment;
            _baseURL = ConfigurationManager.AppSetting["BaseURL"];
            ViewData["BaseURL"] = _baseURL;

        }

        public IActionResult Index()
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                return View(member);
            }
        }
               
        public IActionResult Results()
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                return View(member);
            }
        }

        public IActionResult BulkVoting()
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                return View(member);
            }
        }



        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }


        public IActionResult LogoutUser()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Login");
        }



        [HttpGet]
        public IActionResult GetItemList()
        {
            var list = new List<ItemModel>();
            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    list = dbContext.GetItems();
                }
                   
            }
            catch (Exception ex)
            {
                AddException(ex, "GetItemList");
            }
            return Ok(list);
        }


        [HttpPost]
        public IActionResult GetUnits(UnitModel unit)
        {
            var list = new List<UnitModel>();
            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    list = dbContext.GetUnits();
                }

            }
            catch (Exception ex)
            {
                AddException(ex, "GetUnits");
            }
            return Ok(list);
        }


        [HttpPost]
        public IActionResult GetItemById(ItemModel item)
        {
            
            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    item = dbContext.GetItemById(item.ID);
                }

            }
            catch (Exception ex)
            {
                AddException(ex, "GetItemById");
            }
            return Ok(item);
        }


        [HttpPost]
        public IActionResult GetVotings(MemberModel Member)
        {
            var list = new List<VotingModel>();
            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    list = dbContext.GetVotings(Member.MemberID);
                }

            }
            catch (Exception ex)
            {
                AddException(ex, "GetVotings");
            }
            return Ok(list);
        }



        [HttpPost]
        public IActionResult GetMembersByUnit(UnitModel unit)
        {
            var list = new List<MemberModel>();
            try
            {
                using (TWHContext dbContext = new TWHContext())
                {
                    list = dbContext.GetMembersByUnit(unit.UnitId, unit.ItemId);
                }

            }
            catch (Exception ex)
            {
                AddException(ex, "GetMembersByUnit");
            }
            return Ok(list);
        }



        [HttpGet]
        public IActionResult GetResultsDataSet()
        {
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                var list = new List<ResultDatasetModel>();
                try
                {
                    using (TWHContext dbContext = new TWHContext())
                    {
                        list = dbContext.GetResultsDataSet(DateTime.Now.Year);
                    }

                }
                catch (Exception ex)
                {
                    AddException(ex, "GetResultsDataSet");
                }
                return Ok(list);
            }
        }


        [HttpPost]
        public IActionResult Vote(VotingModel voting)
        {

            voting.VotingTime = DateTime.Now;
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                try
                {
                    using (TWHContext dbContext = new TWHContext())
                    {
                        dbContext.InternalRegimeVote(voting, member.MemberID);
                    }

                }
                catch (Exception ex)
                {
                    AddException(ex, "Vote");
                }
                return Ok();
            }
        }


        [HttpPost]
        public IActionResult ClearVoteAll(VotingModel voting)
        {

            voting.VotingTime = DateTime.Now;
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                try
                {
                    using (TWHContext dbContext = new TWHContext())
                    {
                        dbContext.ClearVoteAll(voting);
                    }

                }
                catch (Exception ex)
                {
                    AddException(ex, "ClearVoteAll");
                }
                return Ok();
            }
        }


        [HttpPost]
        public IActionResult BulkVote(VotingModel voting)
        {

            voting.VotingTime = DateTime.Now;
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                try
                {
                    using (TWHContext dbContext = new TWHContext())
                    {
                        dbContext.InternalRegimeBulkVote(voting, voting.MemberSessionId);
                    }

                }
                catch (Exception ex)
                {
                    AddException(ex, "BulkVote");
                }
                return Ok();
            }
        }


        [HttpPost]
        public IActionResult VoteAll(VotingModel voting)
        {

            voting.VotingTime = DateTime.Now;
            var member = HttpContext.Session.GetObjectFromJson<MemberModel>("Member");
            if (member == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                try
                {
                    using (TWHContext dbContext = new TWHContext())
                    {
                        dbContext.InternalRegimeVoteAll(voting);
                    }

                }
                catch (Exception ex)
                {
                    AddException(ex, "VoteAll");
                }
                return Ok();
            }
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


        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}
    }
}
