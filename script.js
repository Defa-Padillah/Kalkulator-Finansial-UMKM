// Element Selection
const hppInput = document.getElementById('hpp');
const packingInput = document.getElementById('packing');
const targetMarginInput = document.getElementById('target-margin');
const platformSelect = document.getElementById('platform');
const adminFeePercentInput = document.getElementById('admin-fee-percent');
const fixedFeeInput = document.getElementById('fixed-fee');
const customFeeGroup = document.getElementById('custom-fee-group');
const btnCalculate = document.getElementById('btn-calculate');

// Result Elements
const resSellingPrice = document.getElementById('res-selling-price');
const resTotalCost = document.getElementById('res-total-cost');
const resAdminCost = document.getElementById('res-admin-cost');
const resNettProfit = document.getElementById('res-nett-profit');
const resEffectiveMargin = document.getElementById('res-effective-margin');

// Manual Check Elements
const manualPriceInput = document.getElementById('manual-price');
const btnCheckManual = document.getElementById('btn-check-manual');
const manualResultText = document.getElementById('manual-result-text');

// Event listener untuk preset platform
platformSelect.addEventListener('change', () => {
  const selected = platformSelect.value;
  if (selected === 'midtrans_qris') {
    adminFeePercentInput.value = 0.7;
    fixedFeeInput.value = 0;
  } else if (selected === 'midtrans_va') {
    adminFeePercentInput.value = 0;
    fixedFeeInput.value = 4400;
  } else if (selected === 'shopee') {
    adminFeePercentInput.value = 6.5;
    fixedFeeInput.value = 1000;
  } else if (selected === 'tiktok') {
    adminFeePercentInput.value = 6.0;
    fixedFeeInput.value = 1000;
  }
});

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

function calculateFinancials() {
  const hpp = parseFloat(hppInput.value) || 0;
  const packing = parseFloat(packingInput.value) || 0;
  const targetMarginPct = (parseFloat(targetMarginInput.value) || 0) / 100;
  const adminFeePct = (parseFloat(adminFeePercentInput.value) || 0) / 100;
  const fixedFee = parseFloat(fixedFeeInput.value) || 0;

  const totalCost = hpp + packing;

  // Rumus Menghitung Rekomendasi Harga Jual Bebas Potongan Fee & Mencapai Target Margin:
  // Rumus: (Total Modal + Fixed Fee) / (1 - Target Margin % - Admin Fee %)
  const denominator = 1 - targetMarginPct - adminFeePct;

  if (denominator <= 0) {
    alert("Kombinasi Target Margin dan Fee Admin terlalu tinggi! Silakan kurangi persentase target margin.");
    return;
  }

  const sellingPrice = (totalCost + fixedFee) / denominator;
  const adminCost = (sellingPrice * adminFeePct) + fixedFee;
  const nettProfit = sellingPrice - totalCost - adminCost;
  const effectiveMargin = (nettProfit / sellingPrice) * 100;

  // Update UI
  resSellingPrice.innerText = formatRupiah(sellingPrice);
  resTotalCost.innerText = formatRupiah(totalCost);
  resAdminCost.innerText = formatRupiah(adminCost);
  resNettProfit.innerText = formatRupiah(nettProfit);
  resEffectiveMargin.innerText = effectiveMargin.toFixed(1) + '%';

  // Set default nilai tes manual
  manualPriceInput.value = Math.round(sellingPrice);
}

function checkManualPrice() {
  const hpp = parseFloat(hppInput.value) || 0;
  const packing = parseFloat(packingInput.value) || 0;
  const adminFeePct = (parseFloat(adminFeePercentInput.value) || 0) / 100;
  const fixedFee = parseFloat(fixedFeeInput.value) || 0;

  const userPrice = parseFloat(manualPriceInput.value) || 0;
  const totalCost = hpp + packing;

  const adminCost = (userPrice * adminFeePct) + fixedFee;
  const nettProfit = userPrice - totalCost - adminCost;
  const marginPct = (nettProfit / userPrice) * 100;

  if (nettProfit < 0) {
    manualResultText.innerHTML = `<span class="text-danger">⚠️ Jika dijual dengan harga ${formatRupiah(userPrice)}, Anda <b>RUGI</b> sebesar ${formatRupiah(Math.abs(nettProfit))}.</span>`;
  } else {
    manualResultText.innerHTML = `<span class="text-success">✅ Jika dijual ${formatRupiah(userPrice)}, Anda untung <b>${formatRupiah(nettProfit)}</b> (Margin: ${marginPct.toFixed(1)}%). Potongan admin: ${formatRupiah(adminCost)}.</span>`;
  }
}

// Listeners
btnCalculate.addEventListener('click', calculateFinancials);
btnCheckManual.addEventListener('click', checkManualPrice);

// Hitung otomatis saat pertama load
calculateFinancials();