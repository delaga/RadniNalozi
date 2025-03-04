using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Klijent : Entitet
    {
        [Required(ErrorMessage = "Naziv obavezno")]
        public string? Naziv { get; set; }
        public string? Oib { get; set; }
        public string? Adresa { get; set; }
        public string? Email { get; set; }
        public string? OdgovornaOsoba { get; set; }
    }
}
