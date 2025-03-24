namespace Backend.Models.DTO
{
    public record RadniNalogDTOInsertUpdate(
        List<RNDIU> DjelatniciLista,
        int KlijentSifra,
        DateTime? VrijemePocetka,
        DateTime? VrijemeZavrsetka,
        List<RNPIU> PosloviLista,
        List<TrosakDTOInsertUpdate> TroskoviLista,
        decimal? RadnihSati,
        string? Napomena
    );

    public record RNPIU(int sifra);
    
    public record RNDIU(int sifra);
}
