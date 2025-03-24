using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class RadniNalog : Entitet
    {
        // Kolekcija djelatnika vezanih za radni nalog
        public ICollection<Djelatnik> Djelatnici { get; set; } = [];
      
        [ForeignKey("klijent")]
        public required Klijent Klijent { get; set; }

        public DateTime? VrijemePocetka { get; set; }

        public DateTime? VrijemeZavrsetka { get; set; }

        public decimal? RadnihSati { get; set; }

        public string? Napomena { get; set; }

        // Kolekcija poslova vezanih za radni nalog
        public ICollection<Posao> Poslovi { get; set; } = [];

        // Kolekcija troškova vezanih za radni nalog
        [JsonIgnore]
        public ICollection<Trosak> Troskovi { get; set; } = [];
    }
}
