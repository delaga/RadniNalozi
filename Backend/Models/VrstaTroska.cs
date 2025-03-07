using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("vrstaTroskova")]
    public class VrstaTroska : Entitet
    {
        public string Naziv { get; set; } = "";
    }
}
