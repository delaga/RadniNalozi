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
    public class TrosakController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;
        private readonly IMapper _mapper;

        // 2. u konstruktoru postavljamo vrijednost
        public TrosakController(RadniNaloziContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

                var result = troskovi.Select(t => _mapper.Map<TrosakDTORead>(t));

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
                var trosak = _context.Troskovi
                    .Include(t => t.VrstaNavigation)
                    .FirstOrDefault(t => t.Sifra == sifra);
                
                if (trosak == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifra} ne postoji" });
                }
                
                var trosakDTO = _mapper.Map<TrosakDTORead>(trosak);
                return Ok(trosakDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(TrosakDTOInsertUpdate trosakDTO)
        {
            try
            {
                // Check if VrstaTroska exists
                var vrstaTroska = _context.VrsteTroskova.Find(trosakDTO.Vrsta);
                if (vrstaTroska == null)
                {
                    return BadRequest(new { poruka = $"Vrsta troška s šifrom {trosakDTO.Vrsta} ne postoji" });
                }

                // Check if RadniNalog exists
                var radniNalog = _context.RadniNalozi.Find(trosakDTO.RadniNalog);
                if (radniNalog == null)
                {
                    return BadRequest(new { poruka = $"Radni nalog s šifrom {trosakDTO.RadniNalog} ne postoji" });
                }

                // Map DTO to entity
                var trosak = _mapper.Map<Trosak>(trosakDTO);
                
                // Set navigation properties
                trosak.VrstaNavigation = vrstaTroska;
                trosak.RadniNalogNavigation = radniNalog;

                _context.Troskovi.Add(trosak);
                _context.SaveChanges();
                
                // Return the created entity as DTO
                var createdTrosakDTO = _mapper.Map<TrosakDTORead>(trosak);
                return StatusCode(StatusCodes.Status201Created, createdTrosakDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, TrosakDTOInsertUpdate trosakDTO)
        {
            try
            {
                var trosakBaza = _context.Troskovi.Find(sifra);
                if (trosakBaza == null)
                {
                    return NotFound(new { poruka = $"Trošak s šifrom {sifra} ne postoji" });
                }

                // Check if VrstaTroska exists
                var vrstaTroska = _context.VrsteTroskova.Find(trosakDTO.Vrsta);
                if (vrstaTroska == null)
                {
                    return BadRequest(new { poruka = $"Vrsta troška s šifrom {trosakDTO.Vrsta} ne postoji" });
                }

                // Check if RadniNalog exists
                var radniNalog = _context.RadniNalozi.Find(trosakDTO.RadniNalog);
                if (radniNalog == null)
                {
                    return BadRequest(new { poruka = $"Radni nalog s šifrom {trosakDTO.RadniNalog} ne postoji" });
                }

                // Map DTO to entity, preserving the ID
                _mapper.Map(trosakDTO, trosakBaza);
                
                // Set navigation properties
                trosakBaza.VrstaNavigation = vrstaTroska;
                trosakBaza.RadniNalogNavigation = radniNalog;

                _context.Troskovi.Update(trosakBaza);
                _context.SaveChanges();
                
                // Return the updated entity as DTO
                var updatedTrosakDTO = _mapper.Map<TrosakDTORead>(trosakBaza);
                return Ok(updatedTrosakDTO);
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
