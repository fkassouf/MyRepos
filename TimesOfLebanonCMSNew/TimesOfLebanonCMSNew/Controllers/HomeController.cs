using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using TimesOfLebanonCMSNew.Models;
using TimesOfLebanonCMSNew.utilities;

namespace TimesOfLebanonCMSNew.Controllers
{
    public class HomeController : Controller
    {
        private static int BUFFER_SIZE = 64 * 1024; //64kB

        private readonly IHostingEnvironment hostingEnvironment;
        private readonly string _baseURL;
        

        public HomeController(IHostingEnvironment environment)
        {
            hostingEnvironment = environment;
            _baseURL = ConfigurationManager.AppSetting["BaseURL"];


        }

        public IActionResult Index()
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                
                return View(user);
            }
        }



        public IActionResult NewsManagement()
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                return View(user);
            }
        }


        [HttpGet]
        public IActionResult GetUsersList()
        {
            var list = new List<Users>();
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                list = dbContext.GetUsersList();
            }
            catch (Exception ex)
            {
                var user = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(user.UserId, "GetUsersList", ex);
            }
            return Ok(list);
        }



        [HttpGet]
        public IActionResult GetUser()
        {

            var UserId = Convert.ToInt32(Request.Query["UserId"]);
            Users user = null;
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                user = dbContext.GetUser(UserId);
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "GetUser", ex);
            }
            return Ok(user);
        }


        [HttpGet]
        public IActionResult GetCategories()
        {
                        
            List<Category> list = null;
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                list = dbContext.GetCategories();
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "GetCategories", ex);
            }
            return Ok(list);
        }


        [HttpGet]
        public IActionResult GetStatuses()
        {

            List<Status> list = null;
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                list = dbContext.GetStatuses();
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "GetStatuses", ex);
            }
            return Ok(list);
        }



        [HttpPost]
        public bool DeletePhoto(News news)
        {
            var deleted = false;
            
            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                dbContext.DeletePhoto(news.Id);
                deleted = true;
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "DeletePhoto", ex);
            }
            return deleted;
        }


        [HttpPost]
        public bool DeleteVideo(News news)
        {
            var deleted = false;

            try
            {
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                //var rootPath = hostingEnvironment.ContentRootPath;
                var wwwPath = hostingEnvironment.WebRootPath;
                var videoPath = news.VideoPath.Replace(_baseURL, "");
                //videoPath = videoPath.Replace("/", "\\");
                //var physicalPath = wwwPath + videoPath;
                var provider = new PhysicalFileProvider(wwwPath);
                var fileInfo = provider.GetFileInfo(videoPath);
                if (fileInfo.Exists)
                {
                    System.IO.File.Delete(fileInfo.PhysicalPath);
                    dbContext.DeleteVideo(news.Id);
                    deleted = true;
                }
                
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "DeleteVideo", ex);
            }
            return deleted;
        }




        [HttpPost]
        public JsonResult GetNewsRecords()
        {

            var lst = new DatatableData<News>();
            var vdata = new DatatableData<News>();
            try
            {
                dynamic obj = null;
                int start = 0;
                int length = 0;
                string searchVal = "";
                string sortDirVal = "";
                int sortVal = 0;
                string sortCol = "";
                int tableLength = 0;
                MemoryStream stream = new MemoryStream();
                Request.Body.CopyTo(stream);
                stream.Position = 0;
                using (StreamReader reader = new StreamReader(stream))
                {
                    string requestBody = reader.ReadToEnd();
                    if (requestBody.Length > 0)
                    {
                        obj = JsonConvert.DeserializeObject(requestBody);
                        if (obj != null)
                        {
                            searchVal = obj.parameters.search.value;
                            start = obj.parameters.start;
                            length = obj.parameters.length;
                            sortDirVal = obj.parameters.order.First.dir;
                            sortVal = obj.parameters.order.First.column;
                            sortCol = obj.parameters.columns[sortVal].name;
                            if (sortCol == "")
                            {
                                sortCol = "CreationDate";
                            }

                            tableLength = obj.parameters.columns.Count;
                        }
                    }
                }

                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                var Helper = new Helper();
                lst = Helper.GetNewsRecords(start, length, sortDirVal, sortCol);

                vdata = lst;


                vdata.draw = obj.parameters.draw;
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "GetNewsRecords", ex);
            }
            return new JsonResult(vdata);
        }





        [HttpPost]
        public JsonResult GetNewsById(News news)
        {

            try
            {
             
                TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                news = dbContext.GetNewsById(news.Id);

                
            }
            catch (Exception ex)
            {
                var _User = HttpContext.Session.GetObjectFromJson<Users>("User");
                HandleException(_User.UserId, "GetNewsById", ex);
            }
            return new JsonResult(news);
        }


        public IActionResult ChangePassword()
        {
            return View();
        }


        public byte[] FileToByte(IFormFile file)
        {
            byte[] result = null;
            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    string contentAsString = reader.ReadToEnd();
                    byte[] bytes = new byte[contentAsString.Length * sizeof(char)];
                    System.Buffer.BlockCopy(contentAsString.ToCharArray(), 0, bytes, 0, bytes.Length);
                }
            }
            return result;
        }

        public static byte[] Compress(byte[] inputData)
        {
            if (inputData == null)
                throw new ArgumentNullException("inputData must be non-null");

            using (var compressIntoMs = new MemoryStream())
            {
                using (var gzs = new BufferedStream(new GZipStream(compressIntoMs,
                 CompressionMode.Compress), BUFFER_SIZE))
                {
                    gzs.Write(inputData, 0, inputData.Length);
                }
                return compressIntoMs.ToArray();
            }
        }


        [HttpPost]

        public IActionResult SaveNews(News news)
        {
            var res = "";
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                
                
                try
                {


                    TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                    if (news.Mode.Equals("add"))
                    {
                        news.CreationUserId = user.UserId;
                        dbContext.InsertNews(news);
                    }
                    else if (news.Mode.Equals("edit"))
                    {
                        news.UpdateUserId = user.UserId;
                        dbContext.UpdateNews(news);
                    }
                   
                }
                catch (Exception ex)
                {
                    HandleException(user.UserId, "SaveNews", ex);
                }
                
            }
            return Ok(res);
        }



        public byte[] FileToArray(IFormFile file)
        {
            var ms = new MemoryStream();
            file.OpenReadStream().CopyTo(ms);
            byte[] Value = ms.ToArray();
            return Value;
        }



        [HttpPost]
       
        public IActionResult ChangeUserPassword(UserCriteria criteria)
        {
            var res = "";
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                try
                {
                    if (!Cipher.Encrypt(criteria.OldPassword, user.Username).Equals(user.Password))
                    {
                        res = "Error: your old password is incorrect!";
                    }
                    else
                    {
                        if (!criteria.NewPassword.Equals(criteria.ConfirmPassword))
                        {
                            res = "Passwords don't match!";
                        }
                        else
                        {
                            string password = criteria.NewPassword;
                            TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                            dbContext.ChangePassword(user.UserId, Cipher.Encrypt(password, user.Username));
                            res = "true";
                        }
                    }
                    

                   

                }
                catch (Exception ex)
                {
                    res = ex.Message;
                }
                return Ok(res);
            }
        }




        [HttpPost]

        public IActionResult InsertUser(Users _User)
        {
            var res = 0;
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                try
                {
                    TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                    if (!dbContext.CheckUserName(_User.Username))
                    {
                        _User.Password = Cipher.Encrypt(_User.Password, _User.Username);
                        res = dbContext.InsertUser(_User);
                    }
                    else
                    {
                        res = -69;
                    }
                }
                catch (Exception ex)
                {
                    HandleException(user.UserId, "InsertUser", ex);
                }
                return Ok(res.ToString());
            }
        }



        [HttpPost]

        public IActionResult UpdateUser(Users _User)
        {
            var res = 0;
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                try
                {
                    TimesOfLebanonContext dbContext = new TimesOfLebanonContext();
                    
                        
                        dbContext.UpdateUser(_User);
                    
                        
                }
                catch (Exception ex)
                {
                    HandleException(user.UserId, "UpdateUser", ex);
                }
                return Ok(res);
            }
        }



        [HttpPost]

        public IActionResult SetPassword(Users _User)
        {
           
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                try
                {
                    TimesOfLebanonContext dbContext = new TimesOfLebanonContext();

                    _User.Password = Cipher.Encrypt(_User.Password, _User.Username);
                    dbContext.SetPassword(_User);


                }
                catch (Exception ex)
                {
                    HandleException(user.UserId, "SetPassword", ex);
                }
                return Ok(null);
            }
        }



        public IActionResult News()
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {

                return View(user);
            }
        }


       
        public IActionResult Users()
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            var request = HttpContext.Request;
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                if (user.Username.ToUpper().Equals("ADMIN"))
                {
                    return View(user);
                }
                else
                {
                    return RedirectToAction("Login", "Login");
                }
            }
        }

        //public string Index() {
        //    return "Hello workd";
        //}


        //[Route("country")]
        //public string Country()
        //{
        //    return "Germany";
        //}


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

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
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


        [HttpPost]
        public async Task<IActionResult> UploadVideo(IList<IFormFile> files)
        {
            var user = HttpContext.Session.GetObjectFromJson<Users>("User");
            var succeeded = false;
            
            if (user == null)
            {
                return RedirectToAction("Login", "Login");
            }
            else
            {
                try
                {
                    foreach (IFormFile source in files)
                    {
                        string filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                        filename = this.EnsureCorrectFilename(filename);

                        using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                            await source.CopyToAsync(output);

                        succeeded = true;
                    }
                }
                catch (Exception ex) {
                    HandleException(user.UserId, "UploadVideo", ex);
                }
            }

            return Ok(succeeded);
        }

        private string EnsureCorrectFilename(string filename)
        {
            if (filename.Contains("\\"))
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);

            return filename;
        }

        private string GetPathAndFilename(string filename)
        {
            return this.hostingEnvironment.WebRootPath + "\\media\\videos\\" + filename;
        }
    }


    public class UserCriteria
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }


    

}
