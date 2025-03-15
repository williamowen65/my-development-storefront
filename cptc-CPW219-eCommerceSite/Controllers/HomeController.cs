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

        [HttpGet]
        [Route("merch-editor/create")]
        public IActionResult MerchEditor_Create()
        {

            return PartialView();
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

                productVM.ProductId = newProduct.ProductId;

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

        [HttpPost]
        [Route("merch-editor/edit/{id?}")]
        public async Task<IActionResult> MerchEditor_Edit(int? id, ProductViewModel productVM)
        {
            if (HttpContext.Session.GetString("Email") == null)
            {
                return RedirectToAction("Login", "Home");
            }

            if (ModelState.IsValid)
            {
                // Look up the product by ID
                Product? product = _context.Products.Find(id);

                if (product == null)
                {
                    return NotFound();
                }

                // Update the product with the new values
                product.Name = productVM.Name;
                product.Description = productVM.Description;
                product.Price = productVM.Price;
                product.ImagePath = SaveImage(productVM.ImageFile); // Implement SaveImage method to save the image and return the path

                _context.Products.Update(product);
                _context.SaveChanges();


                // Render the partial view to a string
                string productRowHtml = await RenderPartialViewToString("MerchEditor_DataRow", productVM);

                // Return the new product data as JSON
                return Json(new { success = true, productId = product.ProductId, productRow = productRowHtml });
            }

            return PartialView(productVM);
        }


        [HttpDelete]
        [Route("merch-editor/delete/{id}")]
        public async Task<IActionResult> MerchEditor_Delete(int? id)
        {
            if (HttpContext.Session.GetString("Email") == null)
            {
                return RedirectToAction("Login", "Home");
            }

            // Look up the product by ID
            Product? product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            try
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch
            {
                return Json(new { success = false });
            }
        }



        private string SaveImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return null;
            }

            // Generate a unique file name
            var fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            var extension = Path.GetExtension(imageFile.FileName);
            var uniqueFileName = $"{fileName}_{Guid.NewGuid()}{extension}";

            // Define the path to save the image
            var imagePath = Path.Combine("wwwroot", "images", "products", uniqueFileName);

            // Ensure the directory exists
            var directory = Path.GetDirectoryName(imagePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Save the image file
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                imageFile.CopyTo(fileStream);
            }

            // Return the saved image path without 'wwwroot' and with '/' instead of '\'
            return imagePath.Replace("wwwroot", "").Replace("\\", "/");
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
