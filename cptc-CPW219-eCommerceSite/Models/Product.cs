using System.ComponentModel.DataAnnotations;

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

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }


    public class ProductViewModel
    {

        [Key]
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }


    public class MerchEditorViewModel
    {
        public ProductViewModel[] Products { get; set; }
        //public Category[] Categories { get; set; }
    }
}
