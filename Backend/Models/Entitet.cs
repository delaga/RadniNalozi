using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public abstract class Entitet
    {
        [Key]
        public int Sifra { get; set; }
    }
}
