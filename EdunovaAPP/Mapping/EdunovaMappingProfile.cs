using AutoMapper;
using EdunovaAPP.Models;
using EdunovaAPP.Models.DTO;

namespace EdunovaAPP.Mapping
{
    public class EdunovaMappingProfile:Profile
    {
        public EdunovaMappingProfile()
        {
            // kreiramo mapiranja: izvor, odredište
            CreateMap<Smjer, SmjerDTORead>();
            CreateMap<SmjerDTOInsertUpdate, Smjer>();
            CreateMap<Smjer, SmjerDTOInsertUpdate>();

            CreateMap<Polaznik, PolaznikDTORead>();
            CreateMap<PolaznikDTOInsertUpdate, Polaznik>();
            CreateMap<Polaznik, PolaznikDTOInsertUpdate>();


            CreateMap<Grupa, GrupaDTORead>()
               .ForCtorParam(
                   "SmjerNaziv",
                   opt => opt.MapFrom(src => src.Smjer.Naziv)
               );
            CreateMap<Grupa, GrupaDTOInsertUpdate>().ForMember(
                    dest => dest.SmjerSifra,
                    opt => opt.MapFrom(src => src.Smjer.Sifra)
                );
            CreateMap<GrupaDTOInsertUpdate, Grupa>();

        }
    }
}
