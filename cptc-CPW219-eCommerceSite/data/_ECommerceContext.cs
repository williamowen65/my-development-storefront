using cptc_CPW219_eCommerceSite.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

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

            // If you need to configure the ProductViewModel for some reason, you can do it here
            modelBuilder.Entity<ProductViewModel>(entity =>
            {
                entity.Property(e => e.Price)
                      .HasPrecision(18, 2); // Specify precision and scale
            });
        }

       
    }
}
