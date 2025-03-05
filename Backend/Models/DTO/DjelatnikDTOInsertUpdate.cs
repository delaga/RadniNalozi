namespace Backend.Models.DTO
{
    public record DjelatnikDTOInsertUpdate
    {
        public string Ime { get; init; } = "";
        public string Prezime { get; init; } = "";
        public string? Telefon { get; init; }
        public string? Email { get; init; }
        public decimal Brutto2Placa { get; init; } = 0;
    }
}
