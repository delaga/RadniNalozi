using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Swashbuckle.AspNetCore.Annotations;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [SwaggerTag("Operations related to Klijenti")]
    public class KlijentController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public KlijentController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        [SwaggerOperation("Get all Klijenti")]
        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var klijenti = _context.Klijenti.ToList();
                return Ok(klijenti);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        [HttpGet("{sifra:int}")]
        [SwaggerOperation("Get Klijent by sifra")]
        public IActionResult GetBySifra(int sifra)
        {
            if (!ModelState.IsValid || sifra <= 0)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var klijent = _context.Klijenti.Find(sifra);
                if (klijent == null)
                {
                    return BadRequest("Klijent s šifrom " + sifra + " ne postoji");
                }
                return Ok(klijent);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        [HttpPost]
        [SwaggerOperation("Create new Klijent")]
        public IActionResult Post(Klijent klijent)
        {
            if (!ModelState.IsValid || klijent == null)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Klijenti.Add(klijent);
                _context.SaveChanges();
                return Ok(klijent);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        [HttpPut("{sifra:int}")]
        [SwaggerOperation("Update existing Klijent")]
        public IActionResult Put(int sifra, Klijent klijent)
        {
            if (!ModelState.IsValid || klijent == null || sifra <= 0)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var klijentIzBaze = _context.Klijenti.Find(sifra);
                if (klijentIzBaze == null)
                {
                    return BadRequest("Klijent s šifrom " + sifra + " ne postoji");
                }

                klijentIzBaze.Naziv = klijent.Naziv;
                klijentIzBaze.Oib = klijent.Oib;
                klijentIzBaze.Adresa = klijent.Adresa;
                klijentIzBaze.Email = klijent.Email;
                klijentIzBaze.OdgovornaOsoba = klijent.OdgovornaOsoba;

                _context.Klijenti.Update(klijentIzBaze);
                _context.SaveChanges();
                return Ok(klijentIzBaze);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        [HttpDelete("{sifra:int}")]
        [SwaggerOperation("Delete Klijent by sifra")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid || sifra <= 0)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var klijent = _context.Klijenti.Find(sifra);
                if (klijent == null)
                {
                    return BadRequest("Klijent s šifrom " + sifra + " ne postoji");
                }

                _context.Klijenti.Remove(klijent);
                _context.SaveChanges();
                return Ok("Klijent obrisan");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }
    }
}
