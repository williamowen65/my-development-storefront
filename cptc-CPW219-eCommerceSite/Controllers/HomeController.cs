using System.Diagnostics;
using cptc_CPW219_eCommerceSite.data;
using cptc_CPW219_eCommerceSite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.CodeAnalysis.Scripting;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ECommerceContext _context;
        private readonly CRUDController _crudController;
        private readonly ICompositeViewEngine _viewEngine;

        public HomeController(ILogger<HomeController> logger, ECommerceContext context, ICompositeViewEngine viewEngine)
        {
            _logger = logger;
            _context = context;
            _crudController = new CRUDController(context);
            _viewEngine = viewEngine;
        }

        [HttpGet]
        [Route("")]
        public IActionResult Index()
        {
            // Get 
            HomePageViewModel viewModel = _crudController.GetProductsViewModelData();

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

        [HttpGet]
        [Route("merch-editor")]
        public IActionResult MerchEditor_Read()
        {
            // Check session for Email to see if they are logged in
            if (HttpContext.Session.GetString("Email") == null)
            {
                return RedirectToAction("Login", "Home");
            }

            HomePageViewModel viewModel = _crudController.GetProductsViewModelData();

            return View(viewModel);
        }

        [HttpPost]
        [Route("merch-editor")]
        public async Task<IActionResult> MerchEditor_Create(ProductViewModel productVM)
        {
            if (ModelState.IsValid)
            {
                // Save the product to the database
                Product newProduct = new Product
                {
                    Name = productVM.Name,
                    Description = productVM.Description,
                    Price = productVM.Price,
                    ImagePath = SaveImage(productVM.ImageFile) // Implement SaveImage method to save the image and return the path
                };

                _context.Products.Add(newProduct);
                await _context.SaveChangesAsync();

                // Render the partial view to a string
                string productRowHtml = await RenderPartialViewToString("MerchEditor_DataRow", productVM);

                // Return the new product data as JSON
                return Json(new { success = true, product = newProduct, productRow = productRowHtml });
            }

            // Return partial view with validation errors
            return PartialView(productVM);
        }


     


        private async Task<string> RenderPartialViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (var writer = new StringWriter())
            {
                var viewResult = _viewEngine.FindView(ControllerContext, viewName, false);
                if (viewResult.View == null)
                {
                    throw new ArgumentNullException($"{viewName} does not match any available view");
                }
                var viewContext = new ViewContext(
                    ControllerContext,
                    viewResult.View,
                    ViewData,
                    TempData,
                    writer,
                    new HtmlHelperOptions()
                );
                await viewResult.View.RenderAsync(viewContext);
                return writer.GetStringBuilder().ToString();
            }
        }



        [HttpGet]
        [Route("merch-editor/edit/{id?}")]
        public IActionResult MerchEditor_Edit(int? id)
        {
            // Check session for Email to see if they are logged in
            if (HttpContext.Session.GetString("Email") == null)
            {
                return RedirectToAction("Login", "Home");
            }

           
            // Look up the product by ID
            Product? product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            // Map the product to a ProductViewModel
            ProductViewModel productVM = new ProductViewModel
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImagePath = product.ImagePath
            };

            return PartialView(productVM);
        }

        private string SaveImage(IFormFile imageFile)
        {
            // Implement image saving logic here
            // Return the saved image path
            return "path/to/saved/image";
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
