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

        /// <summary>
        /// Gets all RadniNalozi
        /// </summary>
        /// <returns>List of RadniNalozi</returns>
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
                return BadRequest(new { poruka = e.Message });
            }
        }


        /// <summary>
        /// Gets a single RadniNalog by sifra
        /// </summary>
        /// <param name="sifra">RadniNalog identifier</param>
        /// <returns>RadniNalog</returns>
        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new {poruka= "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Klijent)
                    .Include(r => r.Djelatnik)
                    .FirstOrDefault(r => r.Sifra == sifra);
                    
                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }
                return Ok(_mapper.Map<RadniNalogDTORead>(radniNalog));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }



        /// <summary>
        /// Creates a new RadniNalog
        /// </summary>
        /// <param name="dto">RadniNalogDTOInsertUpdate containing radni nalog data</param>
        /// <returns>Created RadniNalog</returns>
        [HttpPost]
        public IActionResult Post(RadniNalogDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if Djelatnik exists
                var djelatnik = _context.Djelatnici.Find(dto.DjelatnikSifra);
                if (djelatnik == null)
                {
                    return BadRequest(new { poruka = $"Djelatnik s šifrom {dto.DjelatnikSifra} ne postoji" });
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(dto.KlijentSifra);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {dto.KlijentSifra} ne postoji" });
                }

                var radniNalog = _mapper.Map<RadniNalog>(dto);
                radniNalog.Djelatnik = djelatnik;
                radniNalog.Klijent = klijent;
                _context.RadniNalozi.Add(radniNalog);

                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<RadniNalogDTORead>(radniNalog));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        /// <summary>
        /// Updates an existing RadniNalog
        /// </summary>
        /// <param name="sifra">RadniNalog identifier</param>
        /// <param name="dto">RadniNalogDTOInsertUpdate containing updated data</param>
        /// <returns>Updated RadniNalog</returns>
        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, RadniNalogDTOInsertUpdate dto)
        {
            if (sifra <= 0 || dto == null)
            {
                return BadRequest();
            }

            try
            {
                var radniNalogBaza = _context.RadniNalozi.Find(sifra);
                if (radniNalogBaza == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                // Check if Djelatnik exists
                var djelatnik = _context.Djelatnici.Find(dto.DjelatnikSifra);
                if (djelatnik == null)
                {
                    return BadRequest(new { poruka = $"Djelatnik s šifrom {dto.DjelatnikSifra} ne postoji" });
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(dto.KlijentSifra);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {dto.KlijentSifra} ne postoji" });
                }

                _mapper.Map(dto, radniNalogBaza);
                _context.RadniNalozi.Update(radniNalogBaza);
                _context.SaveChanges();
                return Ok(_mapper.Map<RadniNalogDTORead>(radniNalogBaza));
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

        /// <summary>
        /// Gets all poslovi for a specific radni nalog
        /// </summary>
        /// <param name="sifra">RadniNalog identifier</param>
        /// <returns>List of poslovi for the specified radni nalog</returns>
        [HttpGet("{sifra:int}/poslovi")]
        public IActionResult GetPosloviNaRadnomNalogu(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest(new { poruka = "Šifra mora biti pozitivan broj" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Poslovi)
                    .FirstOrDefault(r => r.Sifra == sifra);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                return Ok(_mapper.Map<List<PosaoDTORead>>(radniNalog.Poslovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Adds a posao to radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraPosao">Posao identifier</param>
        /// <returns>Updated list of poslovi</returns>
        [HttpPost("{sifraRadniNalog:int}/poslovi/{sifraPosao:int}")]
        public IActionResult DodajPosaoNaRadniNalog(int sifraRadniNalog, int sifraPosao)
        {
            if (sifraRadniNalog <= 0 || sifraPosao <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Poslovi)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var posao = _context.Poslovi.Find(sifraPosao);
                if (posao == null)
                {
                    return NotFound(new { poruka = $"Posao s šifrom {sifraPosao} ne postoji" });
                }

                radniNalog.Poslovi.Add(posao);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<PosaoDTORead>>(radniNalog.Poslovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Removes a posao from radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraPosao">Posao identifier</param>
        /// <returns>Updated list of poslovi</returns>
        [HttpDelete("{sifraRadniNalog:int}/poslovi/{sifraPosao:int}")]
        public IActionResult MakniPosaoSaRadnogNaloga(int sifraRadniNalog, int sifraPosao)
        {
            if (sifraRadniNalog <= 0 || sifraPosao <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Poslovi)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var posao = radniNalog.Poslovi.FirstOrDefault(p => p.Sifra == sifraPosao);
                if (posao == null)
                {
                    return NotFound(new { poruka = $"Posao s šifrom {sifraPosao} ne postoji na ovom radnom nalogu" });
                }

                radniNalog.Poslovi.Remove(posao);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<PosaoDTORead>>(radniNalog.Poslovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Gets all troskovi for a specific radni nalog
        /// </summary>
        /// <param name="sifra">RadniNalog identifier</param>
        /// <returns>List of troskovi for the specified radni nalog</returns>
        [HttpGet("{sifra:int}/troskovi")]
        public IActionResult GetTroskoviNaRadnomNalogu(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest(new { poruka = "Šifra mora biti pozitivan broj" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Troskovi)
                    .ThenInclude(t => t.VrstaNavigation)
                    .FirstOrDefault(r => r.Sifra == sifra);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                return Ok(_mapper.Map<List<TrosakDTORead>>(radniNalog.Troskovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Adds a trosak to radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraTrosak">Trosak identifier</param>
        /// <returns>Updated list of troskovi</returns>
        [HttpPost("{sifraRadniNalog:int}/troskovi/{sifraTrosak:int}")]
        public IActionResult DodajTrosakNaRadniNalog(int sifraRadniNalog, int sifraTrosak)
        {
            if (sifraRadniNalog <= 0 || sifraTrosak <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Troskovi)
                    .ThenInclude(t => t.VrstaNavigation)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var trosak = _context.Troskovi.Find(sifraTrosak);
                if (trosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifraTrosak} ne postoji" });
                }

                // Check if the trosak is already associated with this radni nalog
                if (trosak.RadniNalog != sifraRadniNalog)
                {
                    // Update the trosak to be associated with this radni nalog
                    trosak.RadniNalog = sifraRadniNalog;
                    _context.Troskovi.Update(trosak);
                }

                // Make sure the trosak is in the collection
                if (!radniNalog.Troskovi.Any(t => t.Sifra == sifraTrosak))
                {
                    radniNalog.Troskovi.Add(trosak);
                }

                _context.SaveChanges();

                return Ok(_mapper.Map<List<TrosakDTORead>>(radniNalog.Troskovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Removes a trosak from radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraTrosak">Trosak identifier</param>
        /// <returns>Updated list of troskovi</returns>
        [HttpDelete("{sifraRadniNalog:int}/troskovi/{sifraTrosak:int}")]
        public IActionResult MakniTrosakSaRadnogNaloga(int sifraRadniNalog, int sifraTrosak)
        {
            if (sifraRadniNalog <= 0 || sifraTrosak <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Troskovi)
                    .ThenInclude(t => t.VrstaNavigation)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var trosak = radniNalog.Troskovi.FirstOrDefault(t => t.Sifra == sifraTrosak);
                if (trosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifraTrosak} ne postoji na ovom radnom nalogu" });
                }

                radniNalog.Troskovi.Remove(trosak);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<TrosakDTORead>>(radniNalog.Troskovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }
    }
}
