using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RadniSatiPoMjesecuController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;


        // 2. u konstruktoru postavljamo vrijednost
        public RadniSatiPoMjesecuController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.RadniSatiPoMjesecu);
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
                var radniSati = _context.RadniSatiPoMjesecu.Find(sifra);
                if (radniSati == null)
                {
                    return NotFound(new { poruka = $"Radni sati po mjesecu s šifrom {sifra} ne postoji" });
                }
                return Ok(radniSati);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(RadniSatiPoMjesecu radniSatiPoMjesecu)
        {
            try
            {
                _context.RadniSatiPoMjesecu.Add(radniSatiPoMjesecu);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, radniSatiPoMjesecu);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, RadniSatiPoMjesecu radniSatiPoMjesecu)
        {
            try
            {

                var radniSatiBaza = _context.RadniSatiPoMjesecu.Find(sifra);
                if (radniSatiBaza == null)
                {
                    return NotFound(new { poruka = $"Radni sati po mjesecu s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                radniSatiBaza.Godina = radniSatiPoMjesecu.Godina;
                radniSatiBaza.Mjesec = radniSatiPoMjesecu.Mjesec;
                radniSatiBaza.Sati = radniSatiPoMjesecu.Sati;

                _context.RadniSatiPoMjesecu.Update(radniSatiBaza);
                _context.SaveChanges();
                return Ok(radniSatiBaza);
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
                var radniSati = _context.RadniSatiPoMjesecu.Find(sifra);
                if (radniSati == null)
                {
                    return NotFound(new { poruka = $"Radni sati po mjesecu s šifrom {sifra} ne postoji" });
                }
                _context.RadniSatiPoMjesecu.Remove(radniSati);
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
