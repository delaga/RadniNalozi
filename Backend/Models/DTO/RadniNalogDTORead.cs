namespace Backend.Models.DTO
{
    public record RadniNalogDTORead(
        int Sifra,
        string DjelatnikImeIPrezime,
        string KlijentNaziv,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        decimal? RadnihSati,
        decimal UkupniTroskovi,
        decimal UkupnoPoslovi,
        string? Napomena
        );
}
