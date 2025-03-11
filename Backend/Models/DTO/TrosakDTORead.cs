namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za čitanje podataka o trošku
    /// Koristi se za prijenos podataka o trošku od backenda prema frontendu
    /// </summary>
    public record TrosakDTORead(
        int Sifra,        // Jedinstveni identifikator troška
        string Naziv,     // Naziv troška
        int Vrsta,        // Šifra vrste troška
        string VrstaNaziv, // Naziv vrste troška (iz VrstaTroska entiteta)
        decimal Kolicina, // Količina troška
        decimal Cijena,   // Cijena po jedinici
        decimal Ukupno    // Ukupna cijena (Kolicina * Cijena)
    );
}
