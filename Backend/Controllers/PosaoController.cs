using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PosaoController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;


        // 2. u konstruktoru postavljamo vrijednost
        public PosaoController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Poslovi);
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
                var posao = _context.Poslovi.Find(sifra);
                if (posao == null)
                {
                    return NotFound(new { poruka = $"Posao s šifrom {sifra} ne postoji" });
                }
                return Ok(posao);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(Posao posao)
        {
            try
            {
                _context.Poslovi.Add(posao);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, posao);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Posao posao)
        {
            try
            {

                var posaoBaza = _context.Poslovi.Find(sifra);
                if (posaoBaza == null)
                {
                    return NotFound(new { poruka = $"Posao s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                posaoBaza.NazivPosla = posao.NazivPosla;
                posaoBaza.Vrijednost = posao.Vrijednost;

                _context.Poslovi.Update(posaoBaza);
                _context.SaveChanges();
                return Ok(posaoBaza);
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
                var posao = _context.Poslovi.Find(sifra);
                if (posao == null)
                {
                    return NotFound(new { poruka = $"Posao s šifrom {sifra} ne postoji" });
                }
                _context.Poslovi.Remove(posao);
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
