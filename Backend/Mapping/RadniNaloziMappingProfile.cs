using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Mapping
{
    public class RadniNaloziMappingProfile : Profile
    {
        public RadniNaloziMappingProfile()
        {
            // Klijent mappings
            CreateMap<Klijent, KlijentDTORead>();
            CreateMap<KlijentDTOInsertUpdate, Klijent>();
            CreateMap<Klijent, KlijentDTOInsertUpdate>();
            
            // Djelatnik mappings
            CreateMap<Djelatnik, DjelatnikDTORead>();
            CreateMap<DjelatnikDTOInsertUpdate, Djelatnik>();
            CreateMap<Djelatnik, DjelatnikDTOInsertUpdate>();
            
            // VrstaTroska mappings
            CreateMap<VrstaTroska, VrstaTroskaDTORead>();
            CreateMap<VrstaTroskaDTOInsertUpdate, VrstaTroska>();
            CreateMap<VrstaTroska, VrstaTroskaDTOInsertUpdate>();

            // RadniNalog mappings
            CreateMap<RadniNalog, RadniNalogDTORead>()
                .ForCtorParam("DjelatnikImeIPrezime",
                    opt => opt.MapFrom(src => src.Djelatnik.Ime + " " + src.Djelatnik.Prezime))
                .ForCtorParam("KlijentNaziv",
                    opt => opt.MapFrom(src => src.Klijent.Naziv));
            
            CreateMap<RadniNalogDTOInsertUpdate, RadniNalog>();

            // Posao mappings
            CreateMap<Posao, PosaoDTORead>();

            // Mapiranje troškova
            CreateMap<Trosak, TrosakDTORead>()
                // Mapiranje naziva vrste troška
                .ForCtorParam("VrstaNaziv",
                    opt => opt.MapFrom(src => src.VrstaNavigation != null ? src.VrstaNavigation.Naziv : ""))
                // Izračun ukupne cijene troška (količina * cijena)
                .ForCtorParam("Ukupno",
                    opt => opt.MapFrom(src => src.Kolicina * src.Cijena));
        }
    }
}
