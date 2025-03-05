using AutoMapper;
using EdunovaAPP.Data;
using EdunovaAPP.Models;
using Microsoft.AspNetCore.Mvc;

namespace EdunovaAPP.Controllers
{

    public abstract class EdunovaController:ControllerBase
    {

        // dependecy injection
        // 1. definiraš privatno svojstvo
        protected readonly EdunovaContext _context;

        protected readonly IMapper _mapper;


        // dependecy injection
        // 2. proslijediš instancu kroz konstruktor
        public EdunovaController(EdunovaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    }
}
