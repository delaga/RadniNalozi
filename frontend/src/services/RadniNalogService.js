import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/RadniNalog')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/RadniNalog/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(radniNalog){
    return HttpService.post('/radniNalog',radniNalog)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod dodavanja'}})
}

async function promjena(sifra,radniNalog){
    return HttpService.put('/radniNalog/'+sifra,radniNalog)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod promjene'}})
}

async function obrisi(sifra){
    return HttpService.delete('/radniNalog/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod brisanja'}})
}

// Dohvaća poslove vezane za radni nalog s određenom šifrom
async function getPoslovi(sifra){
    return await HttpService.get('/RadniNalog/' + sifra + '/poslovi')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{return []}) // U slučaju greške vraća prazno polje
}

// Dohvaća troškove vezane za radni nalog s određenom šifrom
async function getTroskovi(sifra){
    return await HttpService.get('/RadniNalog/' + sifra + '/troskovi')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{return []}) // U slučaju greške vraća prazno polje
}


export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi,
    getPoslovi,
    getTroskovi
}
