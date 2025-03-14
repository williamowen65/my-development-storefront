using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cptc_CPW219_eCommerceSite.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        //public int CategoryId { get; set; }
        //public Category Category { get; set; }
        public string ImagePath { get; set; } // New property for image path
    }


    public class ProductViewModel
    {

        [Key]
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [DataType(DataType.Currency)]
        public decimal Price { get; set; }
        //public int CategoryId { get; set; }

        //[Display(Name = "Category")]
        //public string CategoryName { get; set; }

        [Display(Name = "Merch Image")]
        [NotMapped]
        public IFormFile ImageFile { get; set; } // New property for image file

        public string? ImagePath { get; set; }



    }


    public class HomePageViewModel
    {
        public ProductViewModel[] ProductsVM { get; set; }
        //public Category[] Categories { get; set; }
    }
}
