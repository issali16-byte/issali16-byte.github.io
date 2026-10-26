/* IBY ERP Mobil — site demosu: gerçek uygulama arayüzü, sunucu yerine tarayıcıda uydurma veri.
   Hiçbir şey kaydedilmez; sayfa yenilenince başa döner. */
(function () {
  'use strict';
  var bugun = new Date();
  function gun(n) { var d = new Date(bugun); d.setDate(d.getDate() + n); return d; }
  function tr(d) { return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }
  function saat(h, m) { return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2); }

  var MUSTERI = [
    { id: 1, kod: 'MUS00001', ad: 'Örnek Gıda San. A.Ş.', sehir: 'Bursa', vkn: '1234567890', vergi_dairesi: 'Nilüfer', yetkili: 'Mehmet Kaya', telefon: '0224 000 00 01', email: 'satinalma@ornekgida.com', adres: 'Organize Sanayi Bölgesi 3. Cad. No:12 Nilüfer/Bursa', limit: 150000, bakiye: 84250, geciken: 12400, vade: 30,
      belgeler: [['SIP-' + 'D-0141', 'Sipariş', -4, 18600, 'YENİ'], ['IBY2026000000412', 'Fatura', -11, 42300, 'KESILDI'], ['TK-D-0088', 'Teklif', -17, 25750, 'Onaylandı']] },
    { id: 2, kod: 'MUS00002', ad: 'Anadolu Kozmetik Ltd. Şti.', sehir: 'İstanbul', vkn: '2345678901', vergi_dairesi: 'Tuzla', yetkili: 'Ayşe Demir', telefon: '0216 000 00 02', email: 'info@anadolukozmetik.com', adres: 'Aydınlı Mah. Sanayi Sok. No:4 Tuzla/İstanbul', limit: 60000, bakiye: 12400, geciken: 0, vade: 45,
      belgeler: [['SIP-D-0137', 'Sipariş', -7, 12400, 'SEVK EDİLDİ']] },
    { id: 3, kod: 'MUS00003', ad: 'Marmara İlaç A.Ş.', sehir: 'Kocaeli', vkn: '3456789012', vergi_dairesi: 'Gebze', yetkili: 'Can Öztürk', telefon: '0262 000 00 03', email: 'tedarik@marmarailac.com', adres: 'GOSB İhsan Dede Cad. No:8 Gebze/Kocaeli', limit: 120000, bakiye: 56900, geciken: 0, vade: 60,
      belgeler: [['TK-D-0091', 'Teklif', -6, 38200, 'Taslak'], ['IBY2026000000398', 'Fatura', -20, 56900, 'KESILDI']] },
    { id: 4, kod: 'MUS00004', ad: 'Yeşil Vadi Süt Ürünleri', sehir: 'Balıkesir', vkn: '4567890123', vergi_dairesi: 'Bandırma', yetkili: 'Zeynep Arslan', telefon: '0266 000 00 04', email: '', adres: 'Bandırma/Balıkesir', limit: 40000, bakiye: 0, geciken: 0, vade: 30,
      belgeler: [['IBY2026000000377', 'Fatura', -24, 9800, 'Ödendi']] },
    { id: 5, kod: 'MUS00005', ad: 'Ege Kimya Tic. Ltd. Şti.', sehir: 'İzmir', vkn: '5678901234', vergi_dairesi: 'Torbalı', yetkili: 'Murat Şahin', telefon: '0232 000 00 05', email: '', adres: 'Torbalı/İzmir', limit: 50000, bakiye: 21750, geciken: 3200, vade: 30,
      belgeler: [['SIP-D-0129', 'Sipariş', -14, 21750, 'SEVK EDİLDİ']] },
    { id: 6, kod: 'MUS00006', ad: 'Kuzey Lojistik A.Ş.', sehir: 'Ankara', vkn: '6789012345', vergi_dairesi: 'Ostim', yetkili: 'Elif Aydın', telefon: '0312 000 00 06', email: '', adres: 'Ostim OSB Ankara', limit: 80000, bakiye: 31200, geciken: 0, vade: 30, belgeler: [] }
  ];
  var URUN = [
    { id: 11, kod: 'ETK-KS-100x50', ad: 'Kuşe Etiket 100×50 mm', birim: 'Adet', fiyat: 0.42, kdv: 20, barkod: '8690000000017',
      depolar: [['Merkez Depo', [['A-01-02', 'L2610', 32000], ['A-01-03', 'L2614', 16000]]], ['Sevkiyat Deposu', [['S-02', '', 4000]]]] },
    { id: 12, kod: 'ETK-TR-58x40', ad: 'Termal Etiket 58×40 mm', birim: 'Adet', fiyat: 0.18, kdv: 20, barkod: '8690000000024',
      depolar: [['Merkez Depo', [['B-04-01', 'L2598', 125000]]]] },
    { id: 13, kod: 'ETK-PP-80x60', ad: 'Opak PP Etiket 80×60 mm', birim: 'Adet', fiyat: 0.65, kdv: 20, barkod: '8690000000031',
      depolar: [['Merkez Depo', [['A-02-01', '', 3200]]]] },
    { id: 14, kod: 'RBN-WAX-110', ad: 'Wax Ribon 110 mm × 300 m', birim: 'Rulo', fiyat: 145, kdv: 20, barkod: '8690000000048',
      depolar: [['Merkez Depo', [['C-01', '', 64]]], ['Sevkiyat Deposu', [['S-01', '', 22]]]] },
    { id: 15, kod: 'RBN-RES-110', ad: 'Resin Ribon 110 mm × 300 m', birim: 'Rulo', fiyat: 310, kdv: 20, barkod: '8690000000055',
      depolar: [['Merkez Depo', [['C-02', '', 18]]]] },
    { id: 16, kod: 'ETK-KR-40x30', ad: 'Kraft Etiket 40×30 mm', birim: 'Adet', fiyat: 0.29, kdv: 20, barkod: '8690000000062', depolar: [] },
    { id: 17, kod: 'KLS-75-4000', ad: 'Karton Kutu 40×30×30', birim: 'Adet', fiyat: 18.5, kdv: 20, barkod: '8690000000079',
      depolar: [['Merkez Depo', [['D-01', '', 850]]]] },
    { id: 18, kod: 'STR-500', ad: 'Streç Film 50 cm', birim: 'Rulo', fiyat: 96, kdv: 20, barkod: '8690000000086',
      depolar: [['Sevkiyat Deposu', [['S-03', '', 140]]]] }
  ];
  var siparisSay = 3, tutar = 48250, teklif = 5, sira = 141;

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
      return { bugun_siparis: siparisSay, bugun_siparis_tutar: tutar, bekleyen_teklif: teklif, ay_fatura_adet: 37, ay_satis: 1284500,
               plan: [{ saat: saat(10, 30), tur: 'Ziyaret', konu: 'yeni ürün sunumu', musteri: 'Örnek Gıda San. A.Ş.', musteri_id: 1 },
                      { saat: saat(14, 0), tur: 'Telefon', konu: 'teklif takibi', musteri: 'Marmara İlaç A.Ş.', musteri_id: 3 }] };
    },
    'GET musteriler': function (q) { return MUSTERI.filter(ara(q.ara, ['ad', 'kod', 'sehir', 'vkn'])).map(function (m) { return { id: m.id, kod: m.kod, ad: m.ad, sehir: m.sehir, bakiye: m.bakiye }; }); },
    'GET musteri': function (q) { var m = MUSTERI.filter(function (x) { return x.id === +q.id; })[0]; if (!m) hata('Müşteri bulunamadı.'); return mDetay(m); },
    'GET urunler': function (q) { return URUN.filter(ara(q.ara, ['ad', 'kod', 'barkod'])).map(uOzet); },
    'GET urun': function (q) { var u = URUN.filter(function (x) { return x.id === +q.id; })[0]; if (!u) hata('Ürün bulunamadı.'); return uDetay(u); },
    'GET barkod': function (q) { var u = URUN.filter(function (x) { return x.barkod === q.kod || x.kod === q.kod; })[0]; if (!u) hata('Barkod bulunamadı: ' + q.kod + ' (demoda 8690000000017 deneyin)'); return uDetay(u); },
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
