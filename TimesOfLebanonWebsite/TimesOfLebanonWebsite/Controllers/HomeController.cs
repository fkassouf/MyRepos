using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimesOfLebanonWebsite.Models;

namespace TimesOfLebanonWebsite.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        public IActionResult SubIndex()
        {
            return View();
        }


        [HttpGet]
        public IActionResult GetCategories()
        {

            List<Categories> list = null;
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                list = dbContext.GetCategories();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(list);
        }



        [HttpGet]
        public IActionResult GetTodayNews()
        {

            List<News> list = null;
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                list = dbContext.GetTodayNews();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(list);
        }


        [HttpPost]
        public IActionResult GetNewsById(News news)
        {
            
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                news = dbContext.GetNewsById(news.Id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(news);
        }

    }
}