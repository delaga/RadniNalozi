using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Klijent : Entitet
    {
        [Required(ErrorMessage = "Naziv klijenta je obavezan")]
        public string Naziv { get; set; }
        
        [StringLength(11, MinimumLength = 11, ErrorMessage = "OIB mora imati 11 znamenki")]
        public string Oib { get; set; }
        
        public string Adresa { get; set; }
        
        [EmailAddress(ErrorMessage = "Neispravan format email adrese")]
        public string Email { get; set; }
        
        public string OdgovornaOsoba { get; set; }
    }
}
