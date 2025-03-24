namespace Backend.Models.DTO
{
    public record RadniNalogDTORead(
        int Sifra,
        List<DjelatnikInfo> Djelatnici,
        string KlijentNaziv,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        decimal? RadnihSati,
        decimal VrijednostRadnihSati,
        decimal UkupniTroskovi,
        decimal UkupnoPoslovi,
        string? Napomena
        );

    public record DjelatnikInfo(
        int Sifra,
        string ImeIPrezime
    );
}
