const fs = require('fs');

const TOP_UP_RULES = [
  { item: "Vitrectomy", layanan: 1, cbgs: ["H-1-30-I", "H-1-30-II", "H-1-30-III"], procs: ["14.71", "14.72", "14.73", "14.74"], tarif: 8970200, category: "sr" },
  { item: "Phacoemulsification", layanan: 1, cbgs: ["H-2-36-0"], procs: ["13.41"], tarif: 4410000, category: "sr" },
  { item: "Microlaringoscopy", layanan: 2, cbgs: ["J-3-15-0"], procs: ["31.41", "31.42", "31.44"], tarif: 1173500, category: "sr" },
  { item: "Cholangiograph", layanan: 2, cbgs: ["B-3-11-0"], procs: ["51.10", "51.11", "51.14", "51.15", "52.13"], tarif: 3411600, category: "sr" },
  { item: "Coil", layanan: 2, cbgs: ["G-1-12-I", "G-1-12-II", "G-1-12-III"], procs: ["39.75"], tarif: 24141000, category: "sr" },
  { item: "Trombektomi", layanan: 1, cbgs: ["G-1-12-I", "G-1-12-II", "G-1-12-III"], procs: ["39.74"], tarif: 17171600, category: "sr" },
  { item: "Percutaneous Endoscopy Gastrostomy", layanan: 1, cbgs: ["E-4-10-I", "E-4-10-II", "E-4-10-III"], diags: ["E43", "E44.0", "E44.1"], procs: ["43.11"], tarif: 2110100, category: "sr" },
  { item: "Odontektomi", layanan: 1, cbgs: ["U-3-16-0"], procs: ["23.19"], tarif: 1475200, category: "sr" },
  { item: "Brakiterapi", layanan: 2, cbgs: ["C-3-10-0"], diags: ["Z51.0"], procs: ["92.20", "92.27"], tarif: 1150000, category: "sr" },
  { item: "Knee Implant", layanan: 1, cbgs: ["M-1-04-I", "M-1-04-II", "M-1-04-III"], procs: ["81.51", "81.52", "81.53", "81.54", "81.55"], tarif: 13000000, category: "sr" },
  { item: "CAPD (Consumables)", layanan: 1, procs: ["54.98"], tarif: 8000000, category: "sd" },
  { item: "Imunohistokimia", layanan: 1, tarif: 1170000, category: "sd" },
  { item: "EGFR Kanker Paru", layanan: 1, tarif: 1620000, category: "sd" },
  { item: "PET Scan", layanan: 1, tarif: 10000000, category: "si" }
];

const normalize_c = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

const PROCESSED_TOP_UP_RULES = TOP_UP_RULES.map(r => ({
  ...r,
  n_cbgs: (r.cbgs || []).map(normalize_c),
  n_diags: (r.diags || []).map(normalize_c),
  n_procs: (r.procs || []).map(normalize_c)
}));

const data = fs.readFileSync('C:\\Users\\User\\Downloads\\3272014_20260503_MIX.TXT', 'utf-8').split('\n');
const headers = data[0].split('\t').map(h => h.trim());

let topUpItems = {};
let topUpKasus = 0;

for (let i = 1; i < data.length; i++) {
  if (!data[i].trim()) continue;
  const cols = data[i].split('\t');
  let row = {};
  for (let j = 0; j < headers.length; j++) {
    row[headers[j]] = cols[j];
  }

  const ptd = String(row['PTD'] || row['JENIS_RAWAT'] || row['PELAYANAN'] || '').trim();
  const inaCode = String(row['INACBG'] || row['KODE_INACBG'] || '').trim();
  
  const billCols = ["SI", "SD", "SR", "SP", "KODE_SI", "KODE_SD", "KODE_SR", "KODE_SP", "SPECIAL_SI", "SPECIAL_SD", "SPECIAL_SR", "SPECIAL_SP", "SPECIAL_CMG"];
  let billing_detected = false;
  for (let c of billCols) {
    let v = String(row[c] || row[c.toLowerCase()] || '').trim().toUpperCase();
    if (v && !["-", "0", "0.0", "NONE", "NAN", ""].includes(v)) { billing_detected = true; break; }
  }

  if (!billing_detected) {
    const ina_norm = normalize_c(inaCode);
    const all_codes = (String(row['DIAGLIST'] || '') + " " + String(row['PROCLIST'] || '')).split(/[;, ]/).map(c => normalize_c(c)).filter(c => c);
    PROCESSED_TOP_UP_RULES.forEach(rule => {
      if (rule.layanan && String(rule.layanan) !== ptd) return;
      const has_criteria = rule.n_cbgs.length > 0 || rule.n_diags.length > 0 || rule.n_procs.length > 0;
      if (!has_criteria) return;

      const cbg_ok = rule.n_cbgs.length === 0 || rule.n_cbgs.some(c => ina_norm === c);
      const diag_ok = rule.n_diags.length === 0 || rule.n_diags.some(c => all_codes.includes(c));
      const proc_ok = rule.n_procs.length === 0 || rule.n_procs.some(c => all_codes.includes(c));

      if (cbg_ok && diag_ok && proc_ok) {
        if (!topUpItems[rule.item]) topUpItems[rule.item] = 0;
        topUpItems[rule.item]++;
        topUpKasus++;
      }
    });
  }
}

console.log("Total Kasus:", topUpKasus);
console.log(topUpItems);
