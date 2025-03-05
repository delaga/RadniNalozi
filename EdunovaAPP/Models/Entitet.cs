using System.ComponentModel.DataAnnotations;

namespace EdunovaAPP.Models
{
    public abstract class Entitet
    {
        [Key] // dio EF ORM-a
        public int? Sifra { get; set; }
    }
}
