namespace Backend.Models.DTO
{
    public record RadniNalogDTORead(
        int Sifra,
        string DjelatnikIme,
        string DjelatnikPrezime,
        string KlijentNaziv,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        decimal? RadnihSati,
        string Napomena
        );
}
