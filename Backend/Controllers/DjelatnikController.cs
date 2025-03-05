﻿using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DjelatnikController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;
        private readonly IMapper _mapper;

        // 2. u konstruktoru postavljamo vrijednost
        public DjelatnikController(RadniNaloziContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var djelatnici = _context.Djelatnici.ToList();
                return Ok(_mapper.Map<List<DjelatnikDTORead>>(djelatnici));
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
                var djelatnik = _context.Djelatnici.Find(sifra);
                if (djelatnik == null)
                {
                    return NotFound(new { poruka = $"Djelatnik s šifrom {sifra} ne postoji" });
                }
                return Ok(_mapper.Map<DjelatnikDTOInsertUpdate>(djelatnik));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(DjelatnikDTOInsertUpdate djelatnikDTO)
        {
            try
            {
                var djelatnik = _mapper.Map<Djelatnik>(djelatnikDTO);
                _context.Djelatnici.Add(djelatnik);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<DjelatnikDTORead>(djelatnik));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, DjelatnikDTOInsertUpdate djelatnikDTO)
        {
            try
            {

                var djelatnikBaza = _context.Djelatnici.Find(sifra);
                if (djelatnikBaza == null)
                {
                    return NotFound(new { poruka = $"Djelatnik s šifrom {sifra} ne postoji" });
                }

                // koristimo automapper
                _mapper.Map(djelatnikDTO, djelatnikBaza);

                _context.Djelatnici.Update(djelatnikBaza);
                _context.SaveChanges();
                return Ok(_mapper.Map<DjelatnikDTORead>(djelatnikBaza));
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
                var djelatnik = _context.Djelatnici.Find(sifra);
                if (djelatnik == null)
                {
                    return NotFound(new { poruka = $"Djelatnik s šifrom {sifra} ne postoji" });
                }
                _context.Djelatnici.Remove(djelatnik);
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
