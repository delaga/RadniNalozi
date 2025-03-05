using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Klijent : Entitet
    {
        public string Naziv { get; set; } = "";

        public string? OIB { get; set; }

        public string? Adresa { get; set; }

        public string? Email { get; set; } 

        public string? OdgovornaOsoba { get; set; }
    }
}
