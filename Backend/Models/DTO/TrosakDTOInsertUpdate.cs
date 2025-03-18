namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za dodavanje i ažuriranje troška
    /// Koristi se za prijenos podataka o trošku od frontenda prema backendu
    /// </summary>
    public record TrosakDTOInsertUpdate
    {
        public string Naziv { get; init; } = "";
        public int VrstaSifra { get; init; }
        public decimal Kolicina { get; init; }
        public decimal Cijena { get; init; }
    }
}
