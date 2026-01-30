// Tarihleri karşılaştırmak için sadece YYYY-MM-DD
const getTodayDateString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
  // return '2025-11-27';
};

const getInitialNameSurname = (name, surname) => {
  const nameInitial = name?.[0]?.toUpperCase();
  const surnameInitial = surname?.[0]?.charAt(0)?.toUpperCase();
  return nameInitial + surnameInitial;
};

const formatCurrency = (value = 0) => {
  if (isNaN(value)) {
    return '0,00 ₺';
  }
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}₺`;
};

function formatDate(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const formatNumber = num => {
  if (num == null) {
    return '0';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatPickerDate = date => {
  return date.toISOString().split('T')[0]; // 2025-01-01
};
// YYYY-MM-DD  →  DD-MM-YYYY
const formatDisplayDate = dateStr => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
};
const subtractOneDay = dateString => {
  const [year, month, day] = dateString.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');

  return `${y}-${m}-${da}`;
};

const normalizeText = (str = '') =>
  str
    .normalize('NFD') // Unicode normalizasyonu
    .replace(/\p{Diacritic}/gu, '') // aksanları (ş,ç,ö vs) temizler
    .replace(/ı/g, 'i') // özel Türkçe karakterleri dönüştür
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .toLowerCase()
    .trim();
const parseDisplayDateToApiDate = text => {
  // 24.12.2025
  const parts = text.split('.');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return null;
  }

  return `${year}-${month}-${day}`; // 2025-12-24
};

export {
  getTodayDateString,
  getInitialNameSurname,
  formatCurrency,
  formatDate,
  formatDisplayDate,
  formatNumber,
  formatPickerDate,
  subtractOneDay,
  normalizeText,
  parseDisplayDateToApiDate,
};
