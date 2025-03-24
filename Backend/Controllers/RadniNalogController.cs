using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RadniNalogController(RadniNaloziContext context, IMapper mapper, IServiceProvider serviceProvider) : EdunovaController(context, mapper)
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
                    .Include(r => r.Djelatnici)
                    .Include(r => r.Troskovi)
                    .Include(r => r.Poslovi)
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
                    .Include(r => r.Djelatnici)
                    .Include(r => r.Troskovi)
                    .Include(r => r.Poslovi)
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
                // Check if Djelatnici exist
                foreach (var djelatnikItem in dto.DjelatniciLista)
                {
                    var djelatnik = _context.Djelatnici.Find(djelatnikItem.sifra);
                    if (djelatnik == null)
                    {
                        return BadRequest(new { poruka = $"Djelatnik s šifrom {djelatnikItem.sifra} ne postoji" });
                    }
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(dto.KlijentSifra);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {dto.KlijentSifra} ne postoji" });
                }

                var radniNalog = _mapper.Map<RadniNalog>(dto);
                foreach (var posao in dto.PosloviLista)
                {
                    var posaoBaza = _context.Poslovi.Find(posao.sifra);
                    if (posaoBaza != null)
                    {
                        radniNalog.Poslovi.Add(posaoBaza);
                    }
                }
                // Add djelatnici to radni nalog
                foreach (var djelatnikItem in dto.DjelatniciLista)
                {
                    var djelatnikBaza = _context.Djelatnici.Find(djelatnikItem.sifra);
                    if (djelatnikBaza != null)
                    {
                        radniNalog.Djelatnici.Add(djelatnikBaza);
                    }
                }
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
                var radniNalogBaza = _context.RadniNalozi
                    .Include(r => r.Djelatnici)
                    .Include(r => r.Poslovi)
                    .Include(r => r.Troskovi)
                    .FirstOrDefault(r => r.Sifra == sifra);
                if (radniNalogBaza == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                // Check if Djelatnici exist
                foreach (var djelatnikItem in dto.DjelatniciLista)
                {
                    var djelatnik = _context.Djelatnici.Find(djelatnikItem.sifra);
                    if (djelatnik == null)
                    {
                        return BadRequest(new { poruka = $"Djelatnik s šifrom {djelatnikItem.sifra} ne postoji" });
                    }
                }

                // Check if Klijent exists
                var klijent = _context.Klijenti.Find(dto.KlijentSifra);
                if (klijent == null)
                {
                    return BadRequest(new { poruka = $"Klijent s šifrom {dto.KlijentSifra} ne postoji" });
                }

                // Očisti postojeće kolekcije
                radniNalogBaza.Djelatnici.Clear();
                radniNalogBaza.Poslovi.Clear();

                // Dodaj nove djelatnike
                foreach (var djelatnikItem in dto.DjelatniciLista)
                {
                    var djelatnikBaza = _context.Djelatnici.Find(djelatnikItem.sifra);
                    if (djelatnikBaza != null)
                    {
                        radniNalogBaza.Djelatnici.Add(djelatnikBaza);
                    }
                }

                // Dodaj nove poslove
                foreach (var posao in dto.PosloviLista)
                {
                    var posaoBaza = _context.Poslovi.Find(posao.sifra);
                    if (posaoBaza != null)
                    {
                        radniNalogBaza.Poslovi.Add(posaoBaza);
                    }
                }

                // Ažuriraj ostala svojstva
                radniNalogBaza.Klijent = klijent;
                radniNalogBaza.VrijemePocetka = dto.VrijemePocetka;
                radniNalogBaza.VrijemeZavrsetka = dto.VrijemeZavrsetka;
                radniNalogBaza.RadnihSati = dto.RadnihSati;
                radniNalogBaza.Napomena = dto.Napomena;

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
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Djelatnici)
                    .Include(r => r.Poslovi)
                    .Include(r => r.Troskovi)
                    .FirstOrDefault(r => r.Sifra == sifra);
                    
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
        /// Dohvaća sve troškove za određeni radni nalog
        /// </summary>
        /// <param name="sifra">Šifra radnog naloga</param>
        /// <returns>Lista troškova za određeni radni nalog</returns>
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
        /// Dodaje trošak na radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">Šifra radnog naloga</param>
        /// <param name="sifraTrosak">Šifra troška</param>
        /// <returns>Ažurirana lista troškova</returns>
        [HttpPost("{sifraRadniNalog:int}/troskovi/{sifraTrosak:int}")]
        public IActionResult DodajTrosakNaRadniNalog(int sifraRadniNalog, int sifraTrosak, [FromBody] object data)
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

                var originalTrosak = _context.Troskovi
                    .Include(t => t.VrstaNavigation)
                    .FirstOrDefault(t => t.Sifra == sifraTrosak);
                
                if (originalTrosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifraTrosak} ne postoji" });
                }

                // Kreiraj novi trošak s istim podacima kao originalni
                var noviTrosak = new Trosak
                {
                    Naziv = originalTrosak.Naziv,
                    Vrsta = originalTrosak.Vrsta,
                    RadniNalog = sifraRadniNalog,
                    Kolicina = originalTrosak.Kolicina,
                    Cijena = originalTrosak.Cijena,
                    VrstaNavigation = originalTrosak.VrstaNavigation,
                    RadniNalogNavigation = radniNalog
                };

                // Dodaj novi trošak u bazu
                _context.Troskovi.Add(noviTrosak);
                _context.SaveChanges();

                // Dodaj novi trošak u kolekciju radnog naloga
                radniNalog.Troskovi.Add(noviTrosak);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<TrosakDTORead>>(radniNalog.Troskovi));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Uklanja trošak s radnog naloga
        /// </summary>
        /// <param name="sifraRadniNalog">Šifra radnog naloga</param>
        /// <param name="sifraTrosak">Šifra troška</param>
        /// <returns>Ažurirana lista troškova</returns>
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

        /// <summary>
        /// Gets all djelatnici for a specific radni nalog
        /// </summary>
        /// <param name="sifra">RadniNalog identifier</param>
        /// <returns>List of djelatnici for the specified radni nalog</returns>
        [HttpGet("{sifra:int}/djelatnici")]
        public IActionResult GetDjelatniciNaRadnomNalogu(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest(new { poruka = "Šifra mora biti pozitivan broj" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Djelatnici)
                    .FirstOrDefault(r => r.Sifra == sifra);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifra} ne postoji" });
                }

                return Ok(_mapper.Map<List<DjelatnikDTORead>>(radniNalog.Djelatnici));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Adds a djelatnik to radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraDjelatnik">Djelatnik identifier</param>
        /// <returns>Updated list of djelatnici</returns>
        [HttpPost("{sifraRadniNalog:int}/djelatnici/{sifraDjelatnik:int}")]
        public IActionResult DodajDjelatnikaNaRadniNalog(int sifraRadniNalog, int sifraDjelatnik)
        {
            if (sifraRadniNalog <= 0 || sifraDjelatnik <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Djelatnici)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var djelatnik = _context.Djelatnici.Find(sifraDjelatnik);
                if (djelatnik == null)
                {
                    return NotFound(new { poruka = $"Djelatnik s šifrom {sifraDjelatnik} ne postoji" });
                }

                // Provjeri da li je djelatnik već dodan na radni nalog
                if (radniNalog.Djelatnici.Any(d => d.Sifra == sifraDjelatnik))
                {
                    return BadRequest(new { poruka = $"Djelatnik s šifrom {sifraDjelatnik} je već dodan na ovaj radni nalog" });
                }

                radniNalog.Djelatnici.Add(djelatnik);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<DjelatnikDTORead>>(radniNalog.Djelatnici));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Removes a djelatnik from radni nalog
        /// </summary>
        /// <param name="sifraRadniNalog">RadniNalog identifier</param>
        /// <param name="sifraDjelatnik">Djelatnik identifier</param>
        /// <returns>Updated list of djelatnici</returns>
        [HttpDelete("{sifraRadniNalog:int}/djelatnici/{sifraDjelatnik:int}")]
        public IActionResult MakniDjelatnikaSaRadnogNaloga(int sifraRadniNalog, int sifraDjelatnik)
        {
            if (sifraRadniNalog <= 0 || sifraDjelatnik <= 0)
            {
                return BadRequest(new { poruka = "Šifre moraju biti pozitivni brojevi" });
            }

            try
            {
                var radniNalog = _context.RadniNalozi
                    .Include(r => r.Djelatnici)
                    .FirstOrDefault(r => r.Sifra == sifraRadniNalog);

                if (radniNalog == null)
                {
                    return NotFound(new { poruka = $"Radni nalog s šifrom {sifraRadniNalog} ne postoji" });
                }

                var djelatnik = radniNalog.Djelatnici.FirstOrDefault(d => d.Sifra == sifraDjelatnik);
                if (djelatnik == null)
                {
                    return NotFound(new { poruka = $"Djelatnik s šifrom {sifraDjelatnik} ne postoji na ovom radnom nalogu" });
                }

                radniNalog.Djelatnici.Remove(djelatnik);
                _context.SaveChanges();

                return Ok(_mapper.Map<List<DjelatnikDTORead>>(radniNalog.Djelatnici));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }
    }
}
