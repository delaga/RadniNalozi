using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Trosak : Entitet
    {
        public string Naziv { get; set; } = "";

        public int Vrsta { get; set; }
        [JsonIgnore]
        [ForeignKey("Vrsta")]
        public VrstaTroska? VrstaNavigation { get; set; }

        public int RadniNalog { get; set; }
        [JsonIgnore]
        [ForeignKey("RadniNalog")]
        public RadniNalog? RadniNalogNavigation { get; set; }

        public decimal Kolicina { get; set; }

        public decimal Cijena { get; set; }
    }
}
