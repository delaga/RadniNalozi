using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Trosak : Entitet
    {
        [Required(ErrorMessage = "Naziv troška je obavezan")]
        public string Naziv { get; set; }

        [Required(ErrorMessage = "Vrsta troška je obavezna")]
        public VrstaTroska Vrsta { get; set; }

        [Required(ErrorMessage = "Radni nalog je obavezan")]
        public RadniNalog RadniNalog { get; set; }

        [Range(0.01, 100000, ErrorMessage = "Količina mora biti između 0.01 i 100.000")]
        public decimal Kolicina { get; set; }

        [Range(0.01, 100000, ErrorMessage = "Cijena mora biti između 0.01 i 100.000")]
        public decimal Cijena { get; set; }
    }
}
