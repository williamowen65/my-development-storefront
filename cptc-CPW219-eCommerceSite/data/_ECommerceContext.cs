using cptc_CPW219_eCommerceSite.Models;
using Microsoft.EntityFrameworkCore;

namespace cptc_CPW219_eCommerceSite.data
{
    public partial class ECommerceContext
    {

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.Price)
                      .HasPrecision(18, 2); // Specify precision and scale
            });
        }


        public MerchEditorViewModel GetProductsViewModelData()
        {
            // Get all the merch items from the database
            Product[] products = this.Products.ToArray();
            // Get all the categories from the database
            Category[] categories = this.Categories.ToArray();
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
            MerchEditorViewModel viewModel = new()
            {
                Products = productViewModels,
                //Categories = categories
            };

            return viewModel;


        }
    }
}
