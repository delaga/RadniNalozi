using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class RadniNalog : Entitet
    {
     
        [ForeignKey("djelatnik")]
        public required Djelatnik Djelatnik{ get; set; }

      
        [ForeignKey("klijent")]
        public required Klijent Klijent { get; set; }

        public DateTime? VrijemePocetka { get; set; }

        public DateTime? VrijemeZavrsetka { get; set; }

        public decimal? RadnihSati { get; set; }

        public string? Napomena { get; set; }

        public ICollection<Posao> Poslovi { get; set; } = [];

        public ICollection<Trosak> Troskovi { get; set; } = [];
    }
}
