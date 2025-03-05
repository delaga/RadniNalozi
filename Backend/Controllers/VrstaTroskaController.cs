using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VrstaTroskaController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;


        // 2. u konstruktoru postavljamo vrijednost
        public VrstaTroskaController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.VrsteTroskova);
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
                var vrstaTroska = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroska == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }
                return Ok(vrstaTroska);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(VrstaTroska vrstaTroska)
        {
            try
            {
                _context.VrsteTroskova.Add(vrstaTroska);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, vrstaTroska);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, VrstaTroska vrstaTroska)
        {
            try
            {

                var vrstaTroskaBaza = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroskaBaza == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                vrstaTroskaBaza.Naziv = vrstaTroska.Naziv;

                _context.VrsteTroskova.Update(vrstaTroskaBaza);
                _context.SaveChanges();
                return Ok(vrstaTroskaBaza);
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
                var vrstaTroska = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroska == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }
                _context.VrsteTroskova.Remove(vrstaTroska);
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
