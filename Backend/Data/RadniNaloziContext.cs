﻿using Backend.Models;
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
    }
}
