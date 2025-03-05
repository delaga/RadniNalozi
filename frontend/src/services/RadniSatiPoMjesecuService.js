import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/RadniSatiPoMjesecu')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/RadniSatiPoMjesecu/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(radniSatiPoMjesecu){
    return HttpService.post('/radnisatipomjesecu',radniSatiPoMjesecu)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod dodavanja'}})
}

async function promjena(sifra,radniSatiPoMjesecu){
    return HttpService.put('/radnisatipomjesecu/'+sifra,radniSatiPoMjesecu)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod promjene'}})
}

async function obrisi(sifra){
    return HttpService.delete('/radnisatipomjesecu/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod brisanja'}})
}



export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
}
