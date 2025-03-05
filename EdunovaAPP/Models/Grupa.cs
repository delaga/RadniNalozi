using System.ComponentModel.DataAnnotations.Schema;

namespace EdunovaAPP.Models
{
    public class Grupa : Entitet
    {
        public string? Naziv { get; set; }

        [ForeignKey("smjer")]
        public required Smjer Smjer { get; set; }

        public string? Predavac { get; set; }

        public ICollection<Polaznik>? Polaznici { get; set; }
    }
}