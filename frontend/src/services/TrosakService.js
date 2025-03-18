import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/Trosak')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/Trosak/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(trosak){
    return HttpService.post('/Trosak',trosak)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch((e)=>{
        console.error("Greška kod dodavanja troška:", e);
        return {greska: true, poruka:'Problem kod dodavanja'}
    })
}

async function promjena(sifra,trosak){
    return HttpService.put('/Trosak/'+sifra,trosak)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch((e)=>{
        console.error("Greška kod promjene troška:", e);
        return {greska: true, poruka:'Problem kod promjene'}
    })
}

async function obrisi(sifra){
    return HttpService.delete('/Trosak/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch((e)=>{
        console.error("Greška kod brisanja troška:", e);
        return {greska: true, poruka:'Problem kod brisanja'}
    })
}



export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
}
