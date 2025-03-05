namespace Backend.Models.DTO
{
    public record KlijentDTORead(
        int Sifra,
        string Naziv,
        string? OIB,
        string? Adresa,
        string? Email,
        string? OdgovornaOsoba
        );
}
