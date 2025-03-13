using System.Diagnostics;
using cptc_CPW219_eCommerceSite.data;
using cptc_CPW219_eCommerceSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ECommerceContext _context;
        private readonly CRUDController _crudController;

        public HomeController(ILogger<HomeController> logger, ECommerceContext context)
        {
            _logger = logger;
            _context = context;
            _crudController = new CRUDController(context);
        }

        [HttpGet]
        [Route("")]
        public IActionResult Index()
        {
            // Get 
            MerchEditorViewModel viewModel = _crudController.GetProductsViewModelData();

            return View(viewModel);
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


        [HttpGet]
        [Route("login")]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginUserViewModel loginModel)
        {
            if (ModelState.IsValid)
            {
                // Retrieve the user from the database
                User? u = (from user in _context.Users
                           where user.Email == loginModel.Email
                           select user).SingleOrDefault();

                if (u != null && BCrypt.Net.BCrypt.Verify(loginModel.Password, u.Password))
                {
                    LogUserIn(loginModel.Email);
                    return RedirectToAction("Index", "Home");
                }
            }

            return View(loginModel);
        }


        [HttpGet]
        [Route("register")]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [Route("register")]

        public async Task<IActionResult> Register(RegisterUserViewModel regModel)
        {
            if (ModelState.IsValid)
            {

                // Hash the password
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(regModel.Password);

                // Map RegisterUserViewModel data to User object
                User newUser = new()
                {
                    Email = regModel.Email,
                    Password = hashedPassword
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                LogUserIn(newUser.Email);

                return RedirectToAction("Index", "Home");
            }

            return View(regModel);
        }

        [Route("merch-editor")]
        public IActionResult MerchEditor()
        {
            // Check session for Email to see if they are logged in
            if (HttpContext.Session.GetString("Email") == null)
            {
                return RedirectToAction("Login", "Home");
            }

            MerchEditorViewModel viewModel = _crudController.GetProductsViewModelData();

            return View(viewModel);
        }

        [HttpGet]
        public IActionResult CreateNewMerchProductDialog()
        {
            return PartialView();
        }

        private void LogUserIn(string email)
        {
            HttpContext.Session.SetString("Email", email);
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
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
