using RadniNalozi.Data;
using RadniNalozi.Models;
using Microsoft.AspNetCore.Mvc;

namespace RadniNalozi.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DjelatnikController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;


        // 2. u konstruktoru postavljamo vrijednost
        public DjelatnikController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Djelatnici);
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
                var smjer = _context.Djelatnici.Find(sifra);
                if (smjer == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }
                return Ok(smjer);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(Djelatnik smjer)
        {
            try
            {
                _context.Djelatnici.Add(smjer);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, smjer);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Djelatnik djelatnik)
        {
            try
            {

                var djelatnikBaza = _context.Djelatnici.Find(sifra);
                if (djelatnikBaza == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                djelatnikBaza.Ime = djelatnik.Ime;
                djelatnikBaza.Prezime = djelatnik.Prezime;
                djelatnikBaza.Telefon = djelatnik.Telefon;
                djelatnikBaza.Email = djelatnik.Email;
                djelatnikBaza.brutto2Placa = djelatnik.brutto2Placa;

                _context.Djelatnici.Update(djelatnikBaza);
                _context.SaveChanges();
                return Ok(djelatnikBaza);
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
                var smjer = _context.Djelatnici.Find(sifra);
                if (smjer == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }
                _context.Djelatnici.Remove(smjer);
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
