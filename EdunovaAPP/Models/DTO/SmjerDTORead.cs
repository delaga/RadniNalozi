
namespace EdunovaAPP.Models.DTO
{
    public record SmjerDTORead(
        int Sifra,
        string Naziv,
        decimal? CijenaSmjera,
        DateTime? IzvodiSeOd,
        bool? Vaucer
        );

   
}
