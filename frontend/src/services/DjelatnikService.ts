import { HttpService } from "./HttpService";
import { DjelatnikDTO } from "../models/DjelatnikDTO";

interface ServiceResponse {
    greska: boolean;
    poruka: string;
}

async function get(): Promise<any> {
    return await HttpService.get('/Djelatnik')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra: number): Promise<any> {
    return await HttpService.get('/Djelatnik/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(dto: DjelatnikDTO): Promise<ServiceResponse> {
    return HttpService.post('/djelatnik', dto)
    .then((): ServiceResponse => ({greska: false, poruka: 'Dodano'}))
    .catch((): ServiceResponse => ({greska: true, poruka: 'Problem kod dodavanja'}));
}

async function promjena(sifra: number, dto: DjelatnikDTO): Promise<ServiceResponse> {
    return HttpService.put(`/djelatnik/${sifra}`, dto)
    .then((): ServiceResponse => ({greska: false, poruka: 'Promjenjeno'}))
    .catch((): ServiceResponse => ({greska: true, poruka: 'Problem kod promjene'}));
}

async function obrisi(sifra: number): Promise<ServiceResponse> {
    return HttpService.delete(`/djelatnik/${sifra}`)
    .then((): ServiceResponse => ({greska: false, poruka: 'Obrisano'}))
    .catch((): ServiceResponse => ({greska: true, poruka: 'Problem kod brisanja'}));
}



export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
}
