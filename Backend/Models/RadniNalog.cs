using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RadniNalog : Entitet
    {
        [Required(ErrorMessage = "Djelatnik je obavezan")]
        public Djelatnik Djelatnik { get; set; }

        [Required(ErrorMessage = "Klijent je obavezan")]
        public Klijent Klijent { get; set; }

        public DateTime? VrijemePocetka { get; set; }
        public DateTime? VrijemeZavrsetka { get; set; }

        [Range(0, 1000, ErrorMessage = "Radnih sati mora biti između 0 i 1000")]
        public decimal RadnihSati { get; set; }
        
        public string Napomena { get; set; }
    }
}
