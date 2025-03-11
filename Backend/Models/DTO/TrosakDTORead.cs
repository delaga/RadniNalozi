namespace Backend.Models.DTO
{
    public record TrosakDTORead(
        int Sifra,
        string Naziv,
        int Vrsta,
        string VrstaNaziv,
        decimal Kolicina,
        decimal Cijena,
        decimal Ukupno
    );
}
