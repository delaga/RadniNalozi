using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RadniSatiPoMjesecu : Entitet
    {
        [Required(ErrorMessage = "Godina je obavezna")]
        [Range(2000, 2100, ErrorMessage = "Godina mora biti između 2000 i 2100")]
        public int Godina { get; set; }

        [Required(ErrorMessage = "Mjesec je obavezan")]
        [StringLength(2, MinimumLength = 1, ErrorMessage = "Neispravan format mjeseca")]
        public string Mjesec { get; set; }

        [Required(ErrorMessage = "Sati su obavezni")]
        [Range(0, 744, ErrorMessage = "Sati moraju biti između 0 i 744")]
        public int Sati { get; set; }
    }
}
