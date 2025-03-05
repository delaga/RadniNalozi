namespace Backend.Models.DTO
{
    public record KlijentDTOInsertUpdate
    {
        public string Naziv { get; init; } = "";
        public string? OIB { get; init; }
        public string? Adresa { get; init; }
        public string? Email { get; init; }
        public string? OdgovornaOsoba { get; init; }
    }
}
