
using System.ComponentModel.DataAnnotations;

namespace EdunovaAPP.Models.DTO
{
    public record PolaznikDTOInsertUpdate(
        [Required(ErrorMessage = "Ime obavezno")]
        string? Ime,
        [Required(ErrorMessage = "Prezime obavezno")]
        string? Prezime,
        [Required(ErrorMessage = "Email obavezno")]
        [EmailAddress(ErrorMessage ="Email nije dobrog formata")]
        string? Email,
        string? Oib);
}
