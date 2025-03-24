using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Djelatnik : Entitet
    {
        public string Ime { get; set; } = "";

        public string Prezime { get; set; } = "";

        public string? Telefon { get; set; }

        public string? Email { get; set; } 

        public decimal Brutto2Placa  { get; set; } = 0;

        [JsonIgnore]
        public ICollection<RadniNalog> RadniNalozi { get; } = [];
    }
}
