using Microsoft.EntityFrameworkCore;
using cptc_CPW219_eCommerceSite.Models;

namespace cptc_CPW219_eCommerceSite.data
{
    public partial class ECommerceContext : DbContext
    {
        public ECommerceContext(DbContextOptions<ECommerceContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Category> Categories { get; set; } = null!;

        public DbSet<Product> Products { get; set; } = null!;

        public DbSet<GeneralContact> generalContacts { get; set; } = null!;

            public DbSet<PremiumContact> premiumContacts { get; set; } = null!;
        public DbSet<BarterContact> barterContacts { get; set; } = null!;


    }

}
