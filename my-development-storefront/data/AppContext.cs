using Microsoft.EntityFrameworkCore;
using cptc_CPW219_eCommerceSite.Models;

namespace cptc_CPW219_eCommerceSite.data
{
    public partial class AppContext : DbContext
    {
        public AppContext(DbContextOptions<AppContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Category> Categories { get; set; } = null!;

        public DbSet<Product> Products { get; set; } = null!;

        // New unified contact messages table
        public DbSet<ContactMessage> ContactMessages { get; set; } = null!;

        // Keep these for backward compatibility during migration
        public DbSet<Contact> Contacts { get; set; } = null!;
    }
}
