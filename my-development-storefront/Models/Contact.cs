using System.ComponentModel.DataAnnotations;

namespace cptc_CPW219_eCommerceSite.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }
    }

    public class GeneralContact : Contact
    {
        public string type = "GeneralContact";
    }

    public class PremiumContact : Contact
    {
        public string type = "PremiumContact";
    }

    public class BarterContact : Contact
    {
        public string type = "BarterContact";
        
        [Required]
        public string ProjectDescription { get; set; }
        
        [Required]
        public string SkillsOffered { get; set; }
    }
}
