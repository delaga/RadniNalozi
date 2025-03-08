using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RadniNalogController(RadniNaloziContext context, IMapper mapper) : EdunovaController(context, mapper)
    {

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var radniNalozi = _context.RadniNalozi
                    .Include(r => r.Klijent)
                    .Include(r => r.Djelatnik)
                    .ToList();



                return Ok(_mapper.Map<List<RadniNalogDTORead>>(radniNalozi));
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

        [HttpGet("{sifra:int}/poslovi")]
        public IActionResult GetPosloviNaRadnomNalogu(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra mora biti pozitivan broj");
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Poslovi)
                    .FirstOrDefault(r => r.Sifra == sifra);

                if (radniNalog == null)
                {
                    return NotFound($"Radni nalog s šifrom {sifra} ne postoji");
                }

                return Ok(_mapper.Map<List<PosaoDTORead>>(radniNalog.Poslovi));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // dodaj posao na radni nalog (dodaj polaznika na grupu)

        // makni posao s radnog naloga (makni polaznika s grupe)


    }
}
