using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class RadniNalog : Entitet
    {
        public int Djelatnik { get; set; }
        [JsonIgnore]
        [ForeignKey("Djelatnik")]
        public Djelatnik DjelatnikNavigation { get; set; }

        public int Klijent { get; set; }
        [JsonIgnore]
        [ForeignKey("Klijent")]
        public Klijent KlijentNavigation { get; set; }

        public DateTime? VrijemePocetka { get; set; }

        public DateTime? VrijemeZavrsetka { get; set; }

        public decimal? RadnihSati { get; set; }

        public string? Napomena { get; set; }

        [JsonIgnore]
        public ICollection<PosaoRadniNalog> PosloviRadniNalozi { get; set; } = new List<PosaoRadniNalog>();
    }
}
