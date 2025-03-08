namespace Backend.Models.DTO
{
    public record PosaoDTORead(
        int Sifra,
        string NazivPosla,
        decimal? Vrijednost
    );
}
