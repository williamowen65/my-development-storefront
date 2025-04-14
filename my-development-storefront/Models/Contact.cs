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
        
        [Required]
        public string CompanyName { get; set; }
        
        [Required]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }
        
        [Required]
        public string ConsultationType { get; set; }
        
        [Required]
        public string Budget { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime PreferredDate { get; set; }
        
        [DataType(DataType.Time)]
        public TimeSpan PreferredTime { get; set; }
        
        public bool IsUrgent { get; set; }
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
