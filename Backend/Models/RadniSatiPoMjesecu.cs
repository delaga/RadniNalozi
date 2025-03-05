using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class RadniSatiPoMjesecu : Entitet
    {
        public int Godina { get; set; }

        public string Mjesec { get; set; } = "";

        public int Sati { get; set; }
    }
}
