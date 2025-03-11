using System.Diagnostics;
using cptc_CPW219_eCommerceSite.Models;
using Microsoft.AspNetCore.Mvc;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("api/contact/create")]
        public IActionResult CreateContact([FromForm] Contact contact)
        {
            if (ModelState.IsValid)
            {
                // Save the contact data to the database or process it as needed
                // For example:
                // _context.Contacts.Add(contact);
                // _context.SaveChanges();

                return Json(new { success = true, message = "Message sent successfully!" });
            }

            // If the model state is not valid, return a JSON response with validation errors
            return Json(new { success = false, message = "Validation failed.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
