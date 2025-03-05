using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Posao : Entitet
    {
        public string NazivPosla { get; set; } = "";

        public decimal? Vrijednost { get; set; }

        [JsonIgnore]
        public ICollection<PosaoRadniNalog> PosloviRadniNalozi { get; set; } = new List<PosaoRadniNalog>();
    }
}
