using cptc_CPW219_eCommerceSite.Models;
using Microsoft.EntityFrameworkCore;
using cptc_CPW219_eCommerceSite.data;

namespace cptc_CPW219_eCommerceSite.Controllers
{
    public class CRUDController
    {

        private readonly ECommerceContext _context;

        public CRUDController(ECommerceContext context)
        {
            _context = context;
        }

        public HomePageViewModel GetProductsViewModelData()
        {

            Console.WriteLine("about to fetch data");
            // Get all the merch items from the database
            Product[] products = _context.Products.ToArray();

            Console.WriteLine("fetched products data from SQL db");
            // Get all the categories from the database
            //Category[] categories = _context.Categories.ToArray();
            // Convert products to ProductViewModels
            ProductViewModel[] productViewModels = products.Select(p => new ProductViewModel
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImagePath = p.ImagePath,
                ImageFile = GetFormFileFromPath(p.ImagePath)
            }).ToArray();
            // Create a view model to pass to the view
            HomePageViewModel viewModel = new HomePageViewModel
            {
                ProductsVM = productViewModels, 
                //Categories = categories
            };

            return viewModel;
        }

        public IFormFile? GetFormFileFromPath(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                throw new ArgumentNullException(nameof(path));
            }

            // Remove leading slash if present
            if (path.StartsWith("/"))
            {
                path = path.TrimStart('/');
            }

            var relativePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path);

            try
            {
                var fileStream = new FileStream(relativePath, FileMode.Open, FileAccess.Read);
                return new FormFile(fileStream, 0, fileStream.Length, null, Path.GetFileName(relativePath))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/octet-stream"
                };
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine($"File not found: {relativePath}");
                return null; // Return null if the file is not found
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while accessing the file: {ex.Message}");
                throw; // Re-throw the exception for unexpected errors
            }
        }

    }
}
