namespace Backend.Models.DTO
{
    public record RadniNalogDTOInsertUpdate(
        int DjelatnikSifra,
        int KlijentSifra,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        decimal? RadnihSati,
        string? Napomena
    );
}
