using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Posao : Entitet
    {
        [Required(ErrorMessage = "Naziv posla je obavezan")]
        public string NazivPosla { get; set; }

        [Range(0, 100000, ErrorMessage = "Vrijednost mora biti između 0 i 100.000")]
        public decimal Vrijednost { get; set; }
    }
}
