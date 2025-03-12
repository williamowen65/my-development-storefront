using Microsoft.EntityFrameworkCore;
using cptc_CPW219_eCommerceSite.Models;

namespace cptc_CPW219_eCommerceSite.data
{
    public class ECommerceContext : DbContext
    {
        public ECommerceContext(DbContextOptions<ECommerceContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; } = null!;
   
    }

}
