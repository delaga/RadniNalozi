﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Backend.Data
{
    public class RadniNaloziContext : DbContext
    {

        public RadniNaloziContext(DbContextOptions<RadniNaloziContext> opcije) : base(opcije)
        {
            //ovdje se  mogu fino postaviti opcije, ali ne za sada
        }


        public DbSet<Djelatnik> Djelatnici { get; set; }
        public DbSet<Klijent> Klijenti { get; set; }
        public DbSet<Posao> Poslovi { get; set; }
        public DbSet<VrstaTroska> VrsteTroskova { get; set; }
        public DbSet<RadniSatiPoMjesecu> RadniSatiPoMjesecu { get; set; }
        public DbSet<RadniNalog> RadniNalozi { get; set; }
        public DbSet<Trosak> Troskovi { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite key for the many-to-many relationship
            modelBuilder.Entity<RadniNalog>().HasOne(rn => rn.Klijent);

            // Many-to-many relationship between RadniNalog and Posao
            modelBuilder.Entity<RadniNalog>()
               .HasMany(g => g.Poslovi)
               .WithMany(p => p.RadniNalozi)
               .UsingEntity<Dictionary<string, object>>("posao_radniNalog",
                c => c.HasOne<Posao>().WithMany().HasForeignKey("posao"),
               c => c.HasOne<RadniNalog>().WithMany().HasForeignKey("radniNalog"),
               c => c.ToTable("posao_radniNalog")
               );

            // Many-to-many relationship between RadniNalog and Djelatnik
            modelBuilder.Entity<RadniNalog>()
               .HasMany(rn => rn.Djelatnici)
               .WithMany(d => d.RadniNalozi)
               .UsingEntity<Dictionary<string, object>>("djelatnik_radniNalog",
                c => c.HasOne<Djelatnik>().WithMany().HasForeignKey("djelatnik"),
               c => c.HasOne<RadniNalog>().WithMany().HasForeignKey("radniNalog"),
               c => c.ToTable("djelatnik_radniNalog")
               );

        }
    }
}
