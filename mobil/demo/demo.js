/* IBY ERP Mobil — site demosu: gerçek uygulama arayüzü, sunucu yerine tarayıcıda uydurma veri.
   Hiçbir şey kaydedilmez; sayfa yenilenince başa döner. */
(function () {
  'use strict';
  var bugun = new Date();
  function gun(n) { var d = new Date(bugun); d.setDate(d.getDate() + n); return d; }
  function tr(d) { return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }
  function saat(h, m) { return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2); }

  var MUSTERI = [
    { id: 1, kod: 'MUS00001', ad: 'Örnek Bilişim A.Ş.', sehir: 'Bursa', vkn: '1234567890', vergi_dairesi: 'Nilüfer', yetkili: 'Mehmet Kaya', telefon: '0224 000 00 01', email: 'satinalma@ornekbilisim.com', adres: 'Fethiye Mah. Teknoloji Cad. No:12 Nilüfer/Bursa', limit: 250000, bakiye: 184250, geciken: 22400, vade: 30,
      belgeler: [['SIP-D-0141', 'Sipariş', -4, 48600, 'YENİ'], ['IBY2026000000412', 'Fatura', -11, 92300, 'KESILDI'], ['TK-D-0088', 'Teklif', -17, 125750, 'Onaylandı']] },
    { id: 2, kod: 'MUS00002', ad: 'Anadolu Teknoloji Ltd. Şti.', sehir: 'İstanbul', vkn: '2345678901', vergi_dairesi: 'Kadıköy', yetkili: 'Ayşe Demir', telefon: '0216 000 00 02', email: 'info@anadoluteknoloji.com', adres: 'Hasanpaşa Mah. No:4 Kadıköy/İstanbul', limit: 150000, bakiye: 62400, geciken: 0, vade: 45,
      belgeler: [['SIP-D-0137', 'Sipariş', -7, 62400, 'SEVK EDİLDİ']] },
    { id: 3, kod: 'MUS00003', ad: 'Marmara Bilgisayar Sistemleri', sehir: 'Kocaeli', vkn: '3456789012', vergi_dairesi: 'İzmit', yetkili: 'Can Öztürk', telefon: '0262 000 00 03', email: 'tedarik@marmarabilgisayar.com', adres: 'Kozluk Mah. No:8 İzmit/Kocaeli', limit: 120000, bakiye: 56900, geciken: 0, vade: 60,
      belgeler: [['TK-D-0091', 'Teklif', -6, 138200, 'Taslak'], ['IBY2026000000398', 'Fatura', -20, 56900, 'KESILDI']] },
    { id: 4, kod: 'MUS00004', ad: 'Yeşil Vadi Eğitim Kurumları', sehir: 'Balıkesir', vkn: '4567890123', vergi_dairesi: 'Karesi', yetkili: 'Zeynep Arslan', telefon: '0266 000 00 04', email: '', adres: 'Karesi/Balıkesir', limit: 80000, bakiye: 0, geciken: 0, vade: 30,
      belgeler: [['IBY2026000000377', 'Fatura', -24, 79800, 'Ödendi']] },
    { id: 5, kod: 'MUS00005', ad: 'Ege Ofis Çözümleri Ltd. Şti.', sehir: 'İzmir', vkn: '5678901234', vergi_dairesi: 'Bornova', yetkili: 'Murat Şahin', telefon: '0232 000 00 05', email: '', adres: 'Bornova/İzmir', limit: 90000, bakiye: 41750, geciken: 8200, vade: 30,
      belgeler: [['SIP-D-0129', 'Sipariş', -14, 41750, 'SEVK EDİLDİ']] },
    { id: 6, kod: 'MUS00006', ad: 'Kuzey Yazılım ve Danışmanlık', sehir: 'Ankara', vkn: '6789012345', vergi_dairesi: 'Çankaya', yetkili: 'Elif Aydın', telefon: '0312 000 00 06', email: '', adres: 'Teknokent Çankaya/Ankara', limit: 100000, bakiye: 31200, geciken: 0, vade: 30, belgeler: [] }
  ];
  var URUN = [
    { id: 11, kod: 'SSD-1TB-NVME', ad: 'SSD 1 TB NVMe M.2', birim: 'Adet', fiyat: 2450, kdv: 20, barkod: '8690000000012',
      depolar: [['Merkez Depo', [['A-01-02', 'L2610', 64], ['A-01-03', 'L2614', 32]]], ['Mağaza', [['M-02', '', 8]]]] },
    { id: 12, kod: 'RAM-16-DDR5', ad: 'RAM 16 GB DDR5 5600 MHz', birim: 'Adet', fiyat: 1850, kdv: 20, barkod: '8690000000029',
      depolar: [['Merkez Depo', [['A-02-01', 'L2598', 120]]], ['Mağaza', [['M-01', '', 14]]]] },
    { id: 13, kod: 'CPU-I5-14400', ad: 'İşlemci Intel Core i5-14400', birim: 'Adet', fiyat: 7900, kdv: 20, barkod: '8690000000036',
      depolar: [['Merkez Depo', [['B-01-01', '', 3]]]] },
    { id: 14, kod: 'GPU-RTX4060', ad: 'Ekran Kartı RTX 4060 8 GB', birim: 'Adet', fiyat: 13500, kdv: 20, barkod: '8690000000043',
      depolar: [['Merkez Depo', [['B-02-01', '', 18]]], ['Mağaza', [['M-03', '', 2]]]] },
    { id: 15, kod: 'MON-24-IPS', ad: 'Monitör 24" IPS 165 Hz', birim: 'Adet', fiyat: 4200, kdv: 20, barkod: '8690000000050',
      depolar: [['Merkez Depo', [['C-01', '', 26]]]] },
    { id: 16, kod: 'PSU-650-BRZ', ad: 'Güç Kaynağı 650 W 80+ Bronze', birim: 'Adet', fiyat: 1650, kdv: 20, barkod: '8690000000067', depolar: [] },
    { id: 17, kod: 'KLV-MEK-TRQ', ad: 'Mekanik Klavye Türkçe Q', birim: 'Adet', fiyat: 1250, kdv: 20, barkod: '8690000000074',
      depolar: [['Merkez Depo', [['D-01', '', 45]]], ['Mağaza', [['M-04', '', 6]]]] },
    { id: 18, kod: 'MOU-KBS', ad: 'Kablosuz Mouse', birim: 'Adet', fiyat: 390, kdv: 20, barkod: '8690000000081',
      depolar: [['Mağaza', [['M-04', '', 60]]]] }
  ];
  var siparisSay = 3, tutar = 148250, teklif = 5, sira = 141;

  function stok(u) { return u.depolar.reduce(function (t, d) { return t + d[1].reduce(function (a, r) { return a + r[2]; }, 0); }, 0); }
  function uOzet(u) { return { id: u.id, kod: u.kod, ad: u.ad, birim: u.birim, fiyat: u.fiyat, kdv: u.kdv, stok: stok(u) }; }
  function uDetay(u) {
    var o = uOzet(u); o.barkod = u.barkod;
    o.depolar = u.depolar.map(function (d, i) {
      return { id: i + 1, ad: d[0], miktar: d[1].reduce(function (a, r) { return a + r[2]; }, 0), raflar: d[1].map(function (r) { return { raf: r[0], lot: r[1], miktar: r[2] }; }) };
    });
    return o;
  }
  function mDetay(m) {
    var o = {}; for (var k in m) o[k] = m[k];
    o.belgeler = m.belgeler.map(function (b) { return { no: b[0], tur: b[1], tarih: tr(gun(b[2])), tutar: b[3], durum: b[4] }; });
    return o;
  }
  function ara(metin, alanlar) { var q = (metin || '').toLocaleLowerCase('tr-TR'); return function (x) { return !q || alanlar.map(function (a) { return x[a] || ''; }).join(' ').toLocaleLowerCase('tr-TR').indexOf(q) >= 0; }; }
  function hata(m) { var e = new Error(m); e.durum = 400; throw e; }

  var API = {
    'GET ozet': function () {
      return { bugun_siparis: siparisSay, bugun_siparis_tutar: tutar, bekleyen_teklif: teklif, ay_fatura_adet: 37, ay_satis: 2684500,
               plan: [{ saat: saat(10, 30), tur: 'Ziyaret', konu: 'yeni ürün sunumu', musteri: 'Örnek Bilişim A.Ş.', musteri_id: 1 },
                      { saat: saat(14, 0), tur: 'Telefon', konu: 'teklif takibi', musteri: 'Marmara Bilgisayar Sistemleri', musteri_id: 3 }] };
    },
    'GET musteriler': function (q) { return MUSTERI.filter(ara(q.ara, ['ad', 'kod', 'sehir', 'vkn'])).map(function (m) { return { id: m.id, kod: m.kod, ad: m.ad, sehir: m.sehir, bakiye: m.bakiye }; }); },
    'GET musteri': function (q) { var m = MUSTERI.filter(function (x) { return x.id === +q.id; })[0]; if (!m) hata('Müşteri bulunamadı.'); return mDetay(m); },
    'GET urunler': function (q) { return URUN.filter(ara(q.ara, ['ad', 'kod', 'barkod'])).map(uOzet); },
    'GET urun': function (q) { var u = URUN.filter(function (x) { return x.id === +q.id; })[0]; if (!u) hata('Ürün bulunamadı.'); return uDetay(u); },
    'GET barkod': function (q) { var u = URUN.filter(function (x) { return x.barkod === q.kod || x.kod === q.kod; })[0]; if (!u) hata('Barkod bulunamadı: ' + q.kod + ' (demoda 8690000000012 deneyin)'); return uDetay(u); },
    'POST giris': function (v) {
      if (!(v.kullanici || '').trim()) hata('Demo: herhangi bir kullanıcı adı ve şifre yazın.');
      return { jeton: 'demo', kullanici: KULLANICI };
    },
    'POST cikis': function () { return { ok: true }; },
    'POST musteri': function (v) {
      var ad = (v.ad || '').trim(), vkn = (v.vkn || '').replace(/\D/g, '');
      if (!ad) hata('Ünvan boş olamaz.');
      if (vkn && vkn.length !== 10 && vkn.length !== 11) hata('VKN 10, TCKN 11 haneli olmalı.');
      if (vkn && MUSTERI.some(function (m) { return m.vkn === vkn; })) hata('Bu VKN ile kayıtlı müşteri zaten var.');
      var m = { id: 100 + MUSTERI.length, kod: 'MUS' + ('0000' + (MUSTERI.length + 1)).slice(-5), ad: ad, sehir: (v.il || '').trim(), vkn: vkn,
                vergi_dairesi: v.vergi_dairesi || '', yetkili: v.yetkili || '', telefon: v.telefon || '', email: v.email || '',
                adres: [v.adres, [v.ilce, v.il].filter(Boolean).join('/')].filter(Boolean).join(' '), limit: 0, bakiye: 0, geciken: 0, vade: 30, belgeler: [] };
      MUSTERI.unshift(m); return mDetay(m);
    },
    'POST belge': function (v) {
      var m = MUSTERI.filter(function (x) { return x.id === +v.musteri_id; })[0];
      if (!m) hata('Müşteri bulunamadı.');
      if (!v.kalemler || !v.kalemler.length) hata('En az bir ürün ekleyin.');
      var net = 0, kdv = 0;
      v.kalemler.forEach(function (k) { var u = URUN.filter(function (x) { return x.id === k.urun_id; })[0]; var t = k.miktar * k.fiyat; net += t; kdv += t * (u ? u.kdv : 20) / 100; });
      var sip = v.tur === 'siparis'; sira += 1;
      var no = (sip ? 'SIP-' : 'TK-') + bugun.getFullYear() + ('0' + (bugun.getMonth() + 1)).slice(-2) + ('0' + bugun.getDate()).slice(-2) + '-' + ('000' + sira).slice(-4);
      if (sip) { siparisSay += 1; tutar += net; } else { teklif += 1; }
      m.belgeler.unshift([no, sip ? 'Sipariş' : 'Teklif', 0, Math.round((net + kdv) * 100) / 100, sip ? 'YENİ' : 'Taslak']);
      return { no: no, id: sira, net: net, kdv: kdv, genel: Math.round((net + kdv) * 100) / 100 };
    }
  };
  var KULLANICI = { id: 1, ad_soyad: 'Ahmet Yılmaz', kullanici_adi: 'demo', yetki: 'kullanici', yetkiler: { okuma: true, yazma: true },
                    lisans: { durum: 'deneme', kalan: 30, bitis: tr(gun(30)) } };

  var asil = window.fetch;
  window.fetch = function (url, ayar) {
    url = String(url);
    if (url.indexOf('/api/') !== 0) return asil.apply(this, arguments);
    var u = new URL(url, location.href), yol = u.pathname.slice(5), q = {};
    u.searchParams.forEach(function (v, k) { q[k] = v; });
    var yontem = (ayar && ayar.method) || 'GET', govde = ayar && ayar.body ? JSON.parse(ayar.body) : {};
    return new Promise(function (coz) {
      setTimeout(function () {
        var f = API[yontem + ' ' + yol], kod = 200, veri;
        try { veri = f ? f(yontem === 'GET' ? q : govde) : (kod = 404, { hata: 'Bilinmeyen istek.' }); }
        catch (e) { kod = e.durum || 500; veri = { hata: e.message }; }
        coz(new Response(JSON.stringify(veri), { status: kod, headers: { 'Content-Type': 'application/json' } }));
      }, 180);
    });
  };
  // Demo doğrudan ana sayfadan başlasın
  try {
    if (!localStorage.getItem('iby_jeton')) {
      localStorage.setItem('iby_jeton', 'demo');
      localStorage.setItem('iby_kullanici', JSON.stringify(KULLANICI));
    }
  } catch (e) {}
})();
