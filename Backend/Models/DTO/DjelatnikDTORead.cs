namespace Backend.Models.DTO
{
    public record DjelatnikDTORead(
        int Sifra,
        string Ime,
        string Prezime,
        string? Telefon,
        string? Email,
        decimal Brutto2Placa
        );
}
