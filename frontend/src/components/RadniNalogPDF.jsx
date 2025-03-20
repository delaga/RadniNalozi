import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { formatirajValutu, formatirajDatum } from '../pages/radninalozi/RadniNaloziPregled';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/Roboto-Bold.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#333',
    paddingBottom: 10
  },
  logo: {
    width: 100,
    marginRight: 20
  },
  companyInfo: {
    flex: 1
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 15
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCell: {
    flex: 1,
    padding: 3,
    fontSize: 8
  },
  totals: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#333'
  }
});

export const PdfDocument = ({ radniNalog, poslovi, troskovi }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src="/logo.png" style={styles.logo} />
        <View style={styles.companyInfo}>
          <Text style={styles.title}>RADNI NALOG</Text>
          <Text style={styles.title}>OCULUS</Text>
          <Text>Obrt za informatičke djelatnosti</Text>
          <Text>vl. Jelena Drača</Text>
          <Text>Borisa Kidriča 65b, 31324 Jagodnjak - HR</Text>
          <Text>OIB: 73331016418</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Osnovni podaci radnog naloga</Text>
        <Text>Broj naloga: {radniNalog.sifra}</Text>
        <Text>Djelatnik: {radniNalog.djelatnikImeIPrezime}</Text>
        <Text>Klijent: {radniNalog.klijentNaziv}</Text>
        <Text>Početak: {formatirajDatum(radniNalog.vrijemePocetka)}</Text>
        <Text>Završetak: {formatirajDatum(radniNalog.vrijemeZavrsetka)}</Text>
        
        <View style={[styles.section, {marginTop: 10}]}>
          <Text style={styles.subtitle}>Radni sati:</Text>
          <Text>Broj sati: {radniNalog.radnihSati || 0}</Text>
          <Text>Cijena po satu: {radniNalog.radnihSati && radniNalog.vrijednostRadnihSati ? 
            formatirajValutu(radniNalog.vrijednostRadnihSati / radniNalog.radnihSati) : 
            formatirajValutu(0)}</Text>
          <Text>Ukupna vrijednost: {formatirajValutu(radniNalog.vrijednostRadnihSati)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Poslovi</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Naziv posla</Text>
            <Text style={styles.tableCell}>Vrijednost</Text>
          </View>
          {poslovi && poslovi.length > 0 ? (
            poslovi.map((posao, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{posao.nazivPosla}</Text>
                <Text style={styles.tableCell}>{formatirajValutu(posao.vrijednost)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell} colSpan={2}>Nema unesenih poslova</Text>
              <Text style={styles.tableCell}></Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Troškovi</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Naziv</Text>
            <Text style={styles.tableCell}>Vrsta</Text>
            <Text style={styles.tableCell}>Količina</Text>
            <Text style={styles.tableCell}>Cijena</Text>
            <Text style={styles.tableCell}>Ukupno</Text>
          </View>
          {troskovi && troskovi.length > 0 ? (
            troskovi.map((trosak, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{trosak.naziv}</Text>
                <Text style={styles.tableCell}>{trosak.vrstaNaziv}</Text>
                <Text style={styles.tableCell}>{trosak.kolicina}</Text>
                <Text style={styles.tableCell}>{formatirajValutu(trosak.cijena)}</Text>
                <Text style={styles.tableCell}>{formatirajValutu(trosak.ukupno)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell} colSpan={5}>Nema unesenih troškova</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.totals}>
        <Text>Ukupna vrijednost radnih sati: {formatirajValutu(radniNalog.vrijednostRadnihSati)}</Text>
        <Text>Ukupni troškovi: {formatirajValutu(radniNalog.ukupniTroskovi)}</Text>
        <Text>Ukupna vrijednost poslova: {formatirajValutu(radniNalog.ukupnoPoslovi)}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          Ukupna vrijednost naloga: {formatirajValutu(
            radniNalog.vrijednostRadnihSati + 
            radniNalog.ukupniTroskovi + 
            radniNalog.ukupnoPoslovi
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Napomena:</Text>
        <Text>
          {radniNalog.napomena || 'Nema napomene uz radni nalog'}
        </Text>
      </View>
    </Page>
  </Document>
);
