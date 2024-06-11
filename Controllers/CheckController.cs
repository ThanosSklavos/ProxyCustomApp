using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace ProxyCheckAppStatus.Controllers
{
    public class CheckController : Controller
    {
        public ActionResult Index()
        {
            string ipAddress = "http://192.168.4.15:8088"; // The IP you want to check

            if (CheckIpStatus(ipAddress))
            {
                return Redirect("http://192.168.4.15:8088"); // Redirect to the main app 
            }
            else
            {
                // Display an error message or perform another action
                return View("ErrorView");
            }
        }

        private bool CheckIpStatus(string ipAddress)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(ipAddress);
                request.Timeout = 20000; // Set a timeout value (in milliseconds) for the request

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    // Check if the response status code is success 
                    if (response.StatusCode >= HttpStatusCode.OK && response.StatusCode < HttpStatusCode.Ambiguous)
                    {
                        // Check if the response stream does not contain an error message
                        using (var reader = new StreamReader(response.GetResponseStream()))
                        {
                            string responseText = reader.ReadToEnd();

                            if (!responseText.Contains("Exception Details"))
                            {
                                return true; // is successful
                            }
                        }
                    }
                }
            }
            catch (WebException)
            {
                // Any WebException (e.g., timeout) will be treated as a failure
                return false;
            }

            return false;
        }

    }
}