using RadniNalozi.Models;
using Microsoft.EntityFrameworkCore;

namespace RadniNalozi.Data
{
    public class RadniNaloziContext : DbContext
    {

        public RadniNaloziContext(DbContextOptions<RadniNaloziContext> opcije) : base(opcije)
        {
            //ovdje se  mogu fino postaviti opcije, ali ne za sada
        }


        public DbSet<Djelatnik> Smjerovi { get; set; } // zbog ovog ovdje Smjerovi se tablica zove u mnozini

    }
}
