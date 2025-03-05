﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿using Backend.Models;
using Microsoft.EntityFrameworkCore;

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
public DbSet<PosaoRadniNalog> PosloviRadniNalozi { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure composite key for the many-to-many relationship
        modelBuilder.Entity<PosaoRadniNalog>()
            .HasKey(pr => new { pr.Posao, pr.RadniNalog });

        // Configure relationships
        modelBuilder.Entity<PosaoRadniNalog>()
            .HasOne(pr => pr.PosaoNavigation)
            .WithMany()
            .HasForeignKey(pr => pr.Posao);

        modelBuilder.Entity<PosaoRadniNalog>()
            .HasOne(pr => pr.RadniNalogNavigation)
            .WithMany()
            .HasForeignKey(pr => pr.RadniNalog);
    }
}
