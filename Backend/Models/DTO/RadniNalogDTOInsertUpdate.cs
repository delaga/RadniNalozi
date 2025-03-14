namespace Backend.Models.DTO
{
    public record RadniNalogDTOInsertUpdate(
        int DjelatnikSifra,
        int KlijentSifra,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        List<RNPIU> PosloviLista,
        decimal? RadnihSati,
        string? Napomena
    );

    public record RNPIU(int sifra);
}
