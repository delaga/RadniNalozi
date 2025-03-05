using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RadniNalogController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;


        // 2. u konstruktoru postavljamo vrijednost
        public RadniNalogController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var radniNalozi = _context.RadniNalozi
                    .Include(r => r.KlijentNavigation)
                    .Include(r => r.DjelatnikNavigation)
                    .ToList();

                // Transform the data to include klijent and djelatnik information
                var result = radniNalozi.Select(r => new
                {
                    r.Sifra,
                    r.Djelatnik,
                    DjelatnikImePrezime = r.DjelatnikNavigation != null ? $"{r.DjelatnikNavigation.Ime} {r.DjelatnikNavigation.Prezime}" : "",
                    r.Klijent,
                    KlijentNaziv = r.KlijentNavigation?.Naziv,
                    r.VrijemePocetka,
                    r.VrijemeZavrsetka,
                    r.RadnihSati,
                    r.Napomena
                });

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new {poruka= "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var radniNalog = _context.RadniNalozi.Find(sifra);
                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }
                return Ok(radniNalog);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(RadniNalog radniNalog)
        {
            try
            {
                // Check if Djelatnik exists
                var djelatnik = _context.Djelatnici.Find(radniNalog.Djelatnik);
                if (djelatnik == null)
                {
                    return BadRequest(new { poruka = $"Djelatnik s šifrom {radniNalog.Djelatnik} ne postoji" });
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(radniNalog.Klijent);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {radniNalog.Klijent} ne postoji" });
                }

                _context.RadniNalozi.Add(radniNalog);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, radniNalog);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, RadniNalog radniNalog)
        {
            try
            {
                var radniNalogBaza = _context.RadniNalozi.Find(sifra);
                if (radniNalogBaza == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                // Check if Djelatnik exists
                var djelatnik = _context.Djelatnici.Find(radniNalog.Djelatnik);
                if (djelatnik == null)
                {
                    return BadRequest(new { poruka = $"Djelatnik s šifrom {radniNalog.Djelatnik} ne postoji" });
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(radniNalog.Klijent);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {radniNalog.Klijent} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                radniNalogBaza.Djelatnik = radniNalog.Djelatnik;
                radniNalogBaza.Klijent = radniNalog.Klijent;
                radniNalogBaza.VrijemePocetka = radniNalog.VrijemePocetka;
                radniNalogBaza.VrijemeZavrsetka = radniNalog.VrijemeZavrsetka;
                radniNalogBaza.RadnihSati = radniNalog.RadnihSati;
                radniNalogBaza.Napomena = radniNalog.Napomena;

                _context.RadniNalozi.Update(radniNalogBaza);
                _context.SaveChanges();
                return Ok(radniNalogBaza);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var radniNalog = _context.RadniNalozi.Find(sifra);
                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }
                _context.RadniNalozi.Remove(radniNalog);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
