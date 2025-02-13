using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class VrstaTroska : Entitet
    {
        [Required(ErrorMessage = "Naziv vrste troška je obavezan")]
        public string Naziv { get; set; }
    }
}
