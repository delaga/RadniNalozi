using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class PosaoRadniNalog
    {
        [ForeignKey("PosaoNavigation")]
        public int Posao { get; set; }
        [JsonIgnore]
        public Posao PosaoNavigation { get; set; }

        [ForeignKey("RadniNalogNavigation")]
        public int RadniNalog { get; set; }
        [JsonIgnore] 
        public RadniNalog RadniNalogNavigation { get; set; }
    }
}
