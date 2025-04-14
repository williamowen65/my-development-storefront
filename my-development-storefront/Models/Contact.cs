using System.ComponentModel.DataAnnotations;

namespace cptc_CPW219_eCommerceSite.Models
{
    public class ContactMessage
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
        
        // Common field to identify the type of contact
        [Required]
        public string ContactType { get; set; } // "General", "Premium", "Barter"
        
        // Date and time the message was created
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Fields for Premium contacts
        public string? CompanyName { get; set; }
        
        [DataType(DataType.PhoneNumber)]
        public string? PhoneNumber { get; set; }
        
        public string? ConsultationType { get; set; }
        
        public string? Budget { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime? PreferredDate { get; set; }
        
        [DataType(DataType.Time)]
        public TimeSpan? PreferredTime { get; set; }
        
        public bool IsUrgent { get; set; }
        
        // Fields for Barter contacts
        public string? ProjectDescription { get; set; }
        
        public string? SkillsOffered { get; set; }
        
        // Additional useful fields
        public bool IsRead { get; set; } = false;
        
        public string? Status { get; set; } = "New"; // New, In Progress, Completed, etc.
    }

    // Class for handling status updates via API
    public class MessageStatusUpdate
    {
        public string Status { get; set; }
    }

    // Keep these for backward compatibility during migration
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
