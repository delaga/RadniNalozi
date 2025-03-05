using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TrosakController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;

        // 2. u konstruktoru postavljamo vrijednost
        public TrosakController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var troskovi = _context.Troskovi
                    .Include(t => t.VrstaNavigation)
                    .Include(t => t.RadniNalogNavigation)
                    .ToList();

                // Transform the data to include vrsta troska and radni nalog information
                var result = troskovi.Select(t => new
                {
                    t.Sifra,
                    t.Naziv,
                    t.Vrsta,
                    VrstaNaziv = t.VrstaNavigation?.Naziv,
                    t.RadniNalog,
                    RadniNalogInfo = t.RadniNalogNavigation != null ? $"RN-{t.RadniNalogNavigation.Sifra}" : "",
                    t.Kolicina,
                    t.Cijena,
                    Ukupno = t.Kolicina * t.Cijena
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
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var trosak = _context.Troskovi.Find(sifra);
                if (trosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifra} ne postoji" });
                }
                return Ok(trosak);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(Trosak trosak)
        {
            try
            {
                // Check if VrstaTroska exists
                var vrstaTroska = _context.VrsteTroskova.Find(trosak.Vrsta);
                if (vrstaTroska == null)
                {
                    return BadRequest(new { poruka = $"Vrsta troška s šifrom {trosak.Vrsta} ne postoji" });
                }

                // Check if RadniNalog exists
                var radniNalog = _context.RadniNalozi.Find(trosak.RadniNalog);
                if (radniNalog == null)
                {
                    return BadRequest(new { poruka = $"Radni nalog s šifrom {trosak.RadniNalog} ne postoji" });
                }

                _context.Troskovi.Add(trosak);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, trosak);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Trosak trosak)
        {
            try
            {
                var trosakBaza = _context.Troskovi.Find(sifra);
                if (trosakBaza == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifra} ne postoji" });
                }

                // Check if VrstaTroska exists
                var vrstaTroska = _context.VrsteTroskova.Find(trosak.Vrsta);
                if (vrstaTroska == null)
                {
                    return BadRequest(new { poruka = $"Vrsta troška s šifrom {trosak.Vrsta} ne postoji" });
                }

                // Check if RadniNalog exists
                var radniNalog = _context.RadniNalozi.Find(trosak.RadniNalog);
                if (radniNalog == null)
                {
                    return BadRequest(new { poruka = $"Radni nalog s šifrom {trosak.RadniNalog} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                trosakBaza.Naziv = trosak.Naziv;
                trosakBaza.Vrsta = trosak.Vrsta;
                trosakBaza.RadniNalog = trosak.RadniNalog;
                trosakBaza.Kolicina = trosak.Kolicina;
                trosakBaza.Cijena = trosak.Cijena;

                _context.Troskovi.Update(trosakBaza);
                _context.SaveChanges();
                return Ok(trosakBaza);
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
                var trosak = _context.Troskovi.Find(sifra);
                if (trosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifra} ne postoji" });
                }
                _context.Troskovi.Remove(trosak);
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
