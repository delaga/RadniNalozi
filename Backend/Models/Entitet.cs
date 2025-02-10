using System.ComponentModel.DataAnnotations;

namespace RadniNalozi.Models
{
    public abstract class Entitet
    {
        [Key]
        public int Sifra { get; set; }
    }
}
