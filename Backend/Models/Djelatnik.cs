using System.ComponentModel.DataAnnotations.Schema;

namespace RadniNalozi.Models
{
    public class Djelatnik : Entitet
    {
        public string Ime { get; set; } = "";

        public string Prezime { get; set; } = "";

        public string Telefon { get; set; }

        public string Email { get; set; } 
 
        public decimal CijenaSmjera { get; set; }
      
    }
}
