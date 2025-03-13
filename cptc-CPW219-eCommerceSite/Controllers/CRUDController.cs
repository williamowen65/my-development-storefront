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


        public MerchEditorViewModel GetProductsViewModelData()
        {
            // Get all the merch items from the database
            Product[] products = _context.Products.ToArray();
            // Get all the categories from the database
            Category[] categories = _context.Categories.ToArray();
            // Convert products to ProductViewModels
            ProductViewModel[] productViewModels = products.Select(p => new ProductViewModel
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            }).ToArray();
            // Create a view model to pass to the view
            MerchEditorViewModel viewModel = new MerchEditorViewModel
            {
                ProductsVM = productViewModels,
                //Categories = categories
            };

            return viewModel;
        }
    }
}
