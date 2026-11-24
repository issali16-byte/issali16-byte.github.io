/* IBY ERP Mobil — tek sayfa uygulama (çerçevesiz, derleme gerektirmez). Veri: aynı sunucudaki /api/ */
(function () {
  'use strict';
  var uyg = document.getElementById('uygulama');
  var durum = { jeton: oku('jeton'), kullanici: JSON.parse(oku('kullanici') || 'null'), ekran: 'ana', param: {},
                sepet: null, gecmis: [] };

  // ── yardımcılar ──
  function el(id) { return document.getElementById(id) || {}; }   // ekrandan çıkıldıysa geç gelen cevap boşa yazar
  function oku(k) { try { return localStorage.getItem('iby_' + k); } catch (e) { return null; } }
  function yaz(k, v) { try { v == null ? localStorage.removeItem('iby_' + k) : localStorage.setItem('iby_' + k, v); } catch (e) {} }
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tl(n) { return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'; }
  function sayi(n) { return Number(n || 0).toLocaleString('tr-TR', { maximumFractionDigits: 3 }); }
  function bas(ad) { return String(ad || '?').split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toLocaleUpperCase('tr-TR'); }
  function satisVar() { var y = (durum.kullanici || {}).yetkiler || {}; return !!y.okuma; }
  function uretimVar() { var y = (durum.kullanici || {}).yetkiler || {}; return !!(y.uretim && y.uretim.okuma); }
  function bildir(m) { var b = document.getElementById('bildirim'); b.textContent = m; b.classList.add('goster'); clearTimeout(bildir.t); bildir.t = setTimeout(function () { b.classList.remove('goster'); }, 2600); }
  var IK = {
    geri: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    ileri: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6675" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    ara: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    barkod: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/><line x1="13" y1="8" x2="13" y2="16"/><line x1="17" y1="8" x2="17" y2="16"/></svg>',
    ev: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    kisi: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    sepet: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    kutu: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    grafik: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    arti: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    carpi: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6675" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    tel: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    cark: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    tamam: '<svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1E7A46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  // ── sunucu ──
  function api(yol, veri) {
    var ayar = { method: veri ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' } };
    if (durum.jeton) ayar.headers.Authorization = 'Bearer ' + durum.jeton;
    if (veri) ayar.body = JSON.stringify(veri);
    return fetch('/api/' + yol, ayar).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && yol !== 'giris') { cikisYap(); throw new Error(j.hata || 'Oturum kapandı.'); }
        if (!r.ok) throw new Error(j.hata || 'Bir hata oluştu.');
        return j;
      });
    }, function () { throw new Error('Sunucuya ulaşılamadı. Şirket ağına (Wi-Fi) bağlı olduğunuzu kontrol edin.'); });
  }

  // ── gezinme ──
  function git(ekran, param, gecmiseEkleme) {
    if (!gecmiseEkleme && durum.ekran !== ekran) durum.gecmis.push({ ekran: durum.ekran, param: durum.param });
    durum.ekran = ekran; durum.param = param || {};
    history.pushState(null, '', '#' + ekran);
    ciz();
    window.scrollTo(0, 0);
  }
  function geri() {
    var o = durum.gecmis.pop();
    if (o) { durum.ekran = o.ekran; durum.param = o.param; ciz(); } else git('ana', {}, true);
  }
  window.addEventListener('popstate', function () { if (durum.jeton) geri(); });

  function ust(baslik, alt, geriVar, sagHtml) {
    return '<header class="ust">' + (geriVar ? '<button class="geri" data-eylem="geri">' + IK.geri + 'Geri</button>' : '') +
      '<div class="satir"><h1>' + h(baslik) + '</h1>' + (sagHtml || '') + '</div>' + (alt ? '<div class="alt">' + h(alt) + '</div>' : '') + '</header>';
  }
  function altMenu() {
    var a = { ana: 'ana', musteriler: 'musteri', musteri: 'musteri', yeniMusteri: 'musteri', belge: 'belge', tamam: 'belge', stok: 'stok', urun: 'stok', ozet: 'ozet' }[durum.ekran];
    function b(k, e, ik, ad) { return '<button data-git="' + e + '" class="' + (a === k ? 'aktif' : '') + '"' + (a === k ? ' aria-current="page"' : '') + '>' + ik + ad + '</button>'; }
    return '<nav class="alt-menu" aria-label="Ana menü">' + b('ana', 'ana', IK.ev, 'Ana Sayfa') + b('musteri', 'musteriler', IK.kisi, 'Müşteriler') +
      b('belge', 'belge', IK.sepet, 'Sipariş') + b('stok', 'stok', IK.kutu, 'Stok') + b('ozet', 'ozet', IK.grafik, 'Özet') + '</nav>';
  }
  function yukleniyor(baslik) { uyg.innerHTML = ust(baslik, '', durum.gecmis.length > 0) + '<main class="icerik"><div class="bos">Yükleniyor…</div></main>' + altMenu(); }
  function hataGoster(baslik, e) { uyg.innerHTML = ust(baslik, '', true) + '<main class="icerik"><div class="hata" role="alert">' + h(e.message) + '</div><button class="dugme" data-eylem="yenile">Tekrar Dene</button></main>' + altMenu(); }

  // ── ekranlar ──
  var EKRAN = {};

  EKRAN.giris = function () {
    uyg.innerHTML = '<header class="ust" style="padding-top:48px;padding-bottom:28px"><div class="marka">IBY ERP MOBİL</div><h1>Giriş</h1><div class="alt">Programdaki kullanıcı adı ve şifrenizle girin</div></header>' +
      '<main class="icerik"><form id="girisForm" class="liste">' +
      '<label class="alan">Kullanıcı adı<input name="kullanici" autocomplete="username" autocapitalize="none" required></label>' +
      '<label class="alan">Şifre<input name="sifre" type="password" autocomplete="current-password" required></label>' +
      '<div id="girisHata"></div><button class="dugme tam" type="submit">Giriş Yap</button></form></main>';
    document.getElementById('girisForm').onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, d = f.querySelector('button'); d.disabled = true;
      api('giris', { kullanici: f.kullanici.value, sifre: f.sifre.value }).then(function (j) {
        durum.jeton = j.jeton; durum.kullanici = j.kullanici; yaz('jeton', j.jeton); yaz('kullanici', JSON.stringify(j.kullanici));
        durum.gecmis = []; git(satisVar() ? 'ana' : 'atolye', {}, true);
      }, function (er) { d.disabled = false; el('girisHata').innerHTML = '<div class="hata" role="alert">' + h(er.message) + '</div>'; });
    };
  };

  EKRAN.ana = function () {
    var k = durum.kullanici || {};
    uyg.innerHTML = '<header class="ust" style="padding-top:28px"><div class="satir"><div class="marka">IBY ERP MOBİL</div>' +
      '<button class="yuvarlak" style="background:#2E6DA4;color:#fff;border:0;cursor:pointer" data-eylem="cikis" aria-label="Çıkış yap">' + h(bas(k.ad_soyad)) + '</button></div>' +
      '<h1 style="font-size:22px;margin-top:6px">Merhaba, ' + h((k.ad_soyad || '').split(' ')[0]) + '</h1>' +
      '<div class="alt">' + h(new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</div></header>' +
      (k.lisans && k.lisans.durum === 'deneme' ? '<div style="background:#FFF4CE;color:#5C4400;font-size:13px;font-weight:600;padding:8px 16px">Ücretsiz deneme · ' + k.lisans.kalan + ' gün kaldı (' + h(k.lisans.bitis) + ')</div>' : '') +
      '<main class="icerik"><div class="izgara2">' +
      (satisVar() ? kutu('musteriler', '#E6EEF7', '#1F4E79', IK.kisi, 'Müşteriler', 'Bakiye, kart, yeni müşteri') +
      kutu('belge', '#FDEBD8', '#B35400', IK.sepet, 'Yeni Sipariş', 'Müşteri seç, ürün ekle') +
      kutu('stok', '#E3F2EA', '#1E7A46', IK.kutu, 'Stok Sorgu', 'Depo, raf, barkod') +
      kutu('ozet', '#ECE8F7', '#5B3FA6', IK.grafik, 'Satış Özeti', 'Bugün ve bu ay') : '') +
      (uretimVar() ? kutu('atolye', '#FFF0E0', '#B35400', IK.cark, 'Atölye', 'İş emirleri, başla / durdur, bildirim') : '') +
      '</div><div id="anaOzet"></div></main>' + (satisVar() ? altMenu() : '');
    if (!satisVar()) return;
    api('ozet').then(function (o) {
      var plan = o.plan.length ? o.plan.map(function (p) {
        return '<button class="oge" data-musteri="' + h(p.musteri_id || '') + '"><b style="color:#1F4E79;width:48px">' + h(p.saat) + '</b><span class="orta"><span class="ad">' + h(p.musteri || p.konu) + '</span><span class="bilgi">' + h(p.tur) + ' · ' + h(p.konu) + '</span></span>' + IK.ileri + '</button>';
      }).join('') : '<div class="bos" style="padding:12px">Bugün için planlı aktivite yok.</div>';
      el('anaOzet').innerHTML = '<div class="kart"><div class="baslik" style="margin:0 0 10px">BUGÜN</div><div class="izgara2">' +
        '<div><div class="sayi">' + o.bugun_siparis + '</div><div class="etk">Sipariş</div></div>' +
        '<div><div class="sayi">' + o.bekleyen_teklif + '</div><div class="etk">Açık teklif</div></div></div>' +
        '<div class="toplam" style="margin-top:12px;flex-wrap:wrap;gap:4px 12px"><span>Bugünkü sipariş tutarı</span><b style="color:#1B2430">' + tl(o.bugun_siparis_tutar) + '</b></div></div>' +
        '<div class="baslik">BUGÜNKÜ PLAN</div><div class="liste">' + plan + '</div>';
    }, function (e) { el('anaOzet').innerHTML = '<div class="hata">' + h(e.message) + '</div>'; });
  };
  function kutu(ekran, zemin, renk, ik, ad, alt) {
    return '<button class="kutu" data-git="' + ekran + '"><span class="ik" style="background:' + zemin + ';color:' + renk + '">' + ik + '</span><b>' + ad + '</b><small>' + alt + '</small></button>';
  }

  EKRAN.musteriler = function () {
    var secim = durum.param.sec;   // belge ekranından müşteri seçmek için
    uyg.innerHTML = ust(secim ? 'Müşteri Seç' : 'Müşteriler', '', !!secim, secim ? '' : '<button class="dugme kucuk beyaz" data-git="yeniMusteri">' + IK.arti + 'Yeni</button>') +
      '<main class="icerik"><label class="ara" style="border:1px solid #DDE3EC">' + IK.ara + '<span class="gizli">Müşteri ara</span><input id="araKutu" type="search" placeholder="Ünvan, kod, şehir, VKN…" autocomplete="off"></label><div id="sonuc" class="liste"><div class="bos">Yükleniyor…</div></div></main>' + altMenu();
    var kutuEl = document.getElementById('araKutu');
    function getir() {
      api('musteriler?ara=' + encodeURIComponent(kutuEl.value)).then(function (l) {
        el('sonuc').innerHTML = l.length ? l.map(function (m) {
          return '<button class="oge" data-musteri="' + m.id + '"' + (secim ? ' data-sec="1"' : '') + '><span class="yuvarlak">' + h(bas(m.ad)) + '</span><span class="orta"><span class="ad">' + h(m.ad) + '</span><span class="bilgi">' + h(m.kod) + (m.sehir ? ' · ' + h(m.sehir) : '') + '</span></span><span class="sag"><b>' + tl(m.bakiye) + '</b><span class="etk">bakiye</span></span></button>';
        }).join('') : '<div class="bos">Aramaya uyan müşteri yok.</div>';
      }, function (e) { el('sonuc').innerHTML = '<div class="hata">' + h(e.message) + '</div>'; });
    }
    var t; kutuEl.oninput = function () { clearTimeout(t); t = setTimeout(getir, 250); };
    getir();
  };

  EKRAN.musteri = function () {
    yukleniyor('Müşteri');
    api('musteri?id=' + durum.param.id).then(function (m) {
      var bel = m.belgeler.length ? m.belgeler.map(function (b) {
        return '<div class="oge" style="cursor:default"><span class="orta"><span class="ad">' + h(b.no) + '</span><span class="bilgi">' + h(b.tur) + ' · ' + h(b.tarih) + '</span></span><span class="sag"><b>' + tl(b.tutar) + '</b><span class="etk">' + h(b.durum) + '</span></span></div>';
      }).join('') : '<div class="bos" style="padding:12px">Henüz belge yok.</div>';
      uyg.innerHTML = ust(m.ad, [m.kod, m.sehir, m.vkn ? 'VKN ' + m.vkn : ''].filter(Boolean).join(' · '), true) +
        '<main class="icerik"><div class="izgara3">' +
        '<div class="kart"><div class="etk">Bakiye</div><b>' + tl(m.bakiye) + '</b></div>' +
        '<div class="kart"><div class="etk">Risk limiti</div><b>' + tl(m.limit) + '</b></div>' +
        '<div class="kart"><div class="etk">Vadesi geçen</div><b class="' + (m.geciken > 0 ? 'kirmizi' : '') + '">' + tl(m.geciken) + '</b></div></div>' +
        (m.limit > 0 && m.bakiye > m.limit ? '<div class="hata">Risk limiti aşıldı.</div>' : '') +
        '<div class="izgara2"><button class="dugme" data-belge="siparis" data-mid="' + m.id + '">Yeni Sipariş</button><button class="dugme ikincil" data-belge="teklif" data-mid="' + m.id + '">Yeni Teklif</button></div>' +
        (m.telefon ? '<a class="dugme ikincil" href="tel:' + h(m.telefon.replace(/[^\d+]/g, '')) + '">' + IK.tel + 'Ara · ' + h(m.yetkili || m.telefon) + '</a>' : '') +
        (m.adres ? '<div class="kart" style="font-size:14px;color:#3A4555">' + h(m.adres) + '</div>' : '') +
        '<div class="baslik">SON BELGELER</div><div class="liste">' + bel + '</div></main>' + altMenu();
      durum.param.ad = m.ad;
    }, function (e) { hataGoster('Müşteri', e); });
  };

  EKRAN.yeniMusteri = function () {
    function a(ad, etk, ek) { return '<label class="alan">' + etk + '<input name="' + ad + '" ' + (ek || '') + '></label>'; }
    uyg.innerHTML = ust('Yeni Müşteri', 'Kaydedince programdaki cari kartlara eklenir', true) +
      '<main class="icerik"><form id="mForm" class="liste">' + a('ad', 'Ünvan *', 'required placeholder="Firma ünvanı veya ad soyad"') +
      '<div class="izgara2">' + a('vkn', 'VKN / TCKN', 'inputmode="numeric" placeholder="10 veya 11 hane"') + a('vergi_dairesi', 'Vergi dairesi') + '</div>' +
      '<div class="izgara2">' + a('telefon', 'Telefon', 'type="tel"') + a('yetkili', 'Yetkili kişi') + '</div>' +
      a('email', 'E-posta (e-Fatura / teklif için)', 'type="email"') +
      '<div class="izgara2">' + a('il', 'İl') + a('ilce', 'İlçe') + '</div>' +
      '<label class="alan">Adres<textarea name="adres" rows="3"></textarea></label><div id="mHata"></div>' +
      '<button class="dugme tam" type="submit">Müşteriyi Kaydet</button></form></main>' + altMenu();
    document.getElementById('mForm').onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, v = {}, d = f.querySelector('button[type=submit]');
      ['ad', 'vkn', 'vergi_dairesi', 'telefon', 'yetkili', 'email', 'il', 'ilce', 'adres'].forEach(function (k) { v[k] = f[k].value; });
      d.disabled = true;
      api('musteri', v).then(function (m) { bildir('Müşteri kaydedildi: ' + m.kod); durum.gecmis.pop(); git('musteri', { id: m.id }); },
        function (er) { d.disabled = false; el('mHata').innerHTML = '<div class="hata" role="alert">' + h(er.message) + '</div>'; });
    };
  };

  // ── sipariş / teklif ──
  function yeniSepet(tur, mid, mad) { durum.sepet = { tur: tur || 'siparis', musteri_id: mid || null, musteri_ad: mad || '', satirlar: [] }; }
  EKRAN.belge = function () {
    if (!durum.sepet) yeniSepet('siparis');
    var s = durum.sepet, net = 0, kdv = 0;
    s.satirlar.forEach(function (k) { var t = satirNet(k); net += t; kdv += t * k.kdv / 100; });
    var satirlar = s.satirlar.map(function (k, i) {
      var yeter = k.miktar <= k.stok;
      return '<div class="kart liste" style="gap:10px"><div class="satir" style="display:flex;justify-content:space-between;gap:8px"><div class="orta" style="min-width:0"><div class="ad" style="font-weight:600">' + h(k.ad) + '</div><div class="bilgi etk" style="font-size:12px">' + h(k.kod) + '</div></div>' +
        '<button class="geri" style="color:#5B6675" data-sil="' + i + '" aria-label="Satırı sil">' + IK.carpi + '</button></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div class="adim"><button data-adim="' + i + '" data-yon="-1" aria-label="Azalt">−</button><label class="gizli" for="m' + i + '">Miktar</label><input id="m' + i + '" inputmode="decimal" data-miktar="' + i + '" value="' + h(sayi(k.miktar)) + '"><button data-adim="' + i + '" data-yon="1" aria-label="Artır">+</button></div>' +
        '<label class="alan" style="flex-direction:row;align-items:center;gap:6px;font-weight:400">Fiyat<input style="width:96px;height:42px" class="' + (k.fiyat > 0 ? '' : 'fiyat-yok') + '" inputmode="decimal" data-fiyat="' + i + '" value="' + h(String(k.fiyat).replace('.', ',')) + '"></label>' +
        '<label class="alan" style="flex-direction:row;align-items:center;gap:6px;font-weight:400">İsk. %<input style="width:58px;height:42px" inputmode="decimal" data-isk="' + i + '" value="' + h(String(k.iskonto || 0).replace('.', ',')) + '"></label></div>' +
        (k.aciklama ? '<div class="etk" style="font-size:12px">' + h(k.aciklama) + '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;font-size:13px"><span class="' + (yeter ? 'yesil' : 'kirmizi') + '" style="font-weight:600">' + (yeter ? 'Stokta var · ' : 'Stok yetersiz · depoda ') + sayi(k.stok) + ' ' + h(k.birim) + '</span><b>' + tl(satirNet(k)) + '</b></div></div>';
    }).join('');
    uyg.innerHTML = ust('Yeni ' + (s.tur === 'siparis' ? 'Sipariş' : 'Teklif'), s.musteri_ad || 'Müşteri seçilmedi', durum.gecmis.length > 0) +
      '<main class="icerik" style="padding-bottom:16px"><div class="sekme" role="tablist"><button role="tab" data-tur="siparis" class="' + (s.tur === 'siparis' ? 'secili' : '') + '">Sipariş</button><button role="tab" data-tur="teklif" class="' + (s.tur === 'teklif' ? 'secili' : '') + '">Teklif</button></div>' +
      '<button class="oge" data-eylem="musteriSec"><span class="yuvarlak">' + h(s.musteri_ad ? bas(s.musteri_ad) : '?') + '</span><span class="orta"><span class="ad">' + h(s.musteri_ad || 'Müşteri seçin') + '</span><span class="bilgi">Değiştirmek için dokunun</span></span>' + IK.ileri + '</button>' +
      satirlar + '<button class="dugme ikincil tam" data-eylem="urunEkle">' + IK.arti + 'Ürün Ekle</button>' +
      '<label class="alan">Not (isteğe bağlı)<input id="belgeNot" value="' + h(s.not || '') + '" placeholder="Teslim, ödeme notu…"></label></main>' +
      '<div class="sepet-alt"><div class="toplam"><span>Ara toplam</span><span>' + tl(net) + '</span></div><div class="toplam"><span>KDV</span><span>' + tl(kdv) + '</span></div>' +
      '<div class="toplam buyuk"><span>Genel toplam</span><span>' + tl(net + kdv) + '</span></div><div id="bHata"></div>' +
      (s.satirlar.some(function (k) { return !(k.fiyat > 0); }) ? '<div style="font-size:13px;color:#8A4100;font-weight:600">Fiyatı 0 olan satır var — fiyat girin.</div>' : '') + '<button class="dugme tam" data-eylem="gonder"' + (s.satirlar.length && s.musteri_id ? '' : ' disabled') + '>' + (s.tur === 'siparis' ? 'Siparişi Gönder' : 'Teklifi Gönder') + '</button></div>';
  };
  function satirNet(k) { return k.miktar * k.fiyat * (1 - (k.iskonto || 0) / 100); }
  // PL248: müşterinin fiyat listesi (miktar kademesi) + kampanya iskontosu sunucudan; elle değiştirilene dokunulmaz
  function fiyatYenile() {
    var s = durum.sepet;
    if (!s || !s.satirlar.length) return;
    api('fiyatlar', { musteri_id: s.musteri_id, kalemler: s.satirlar.map(function (k) { return { urun_id: k.urun_id, miktar: k.miktar }; }) })
      .then(function (l) {
        if (durum.sepet !== s) return;
        var oneri = {};
        (l || []).forEach(function (o) { oneri[o.urun_id] = o; });
        s.satirlar.forEach(function (k) {
          var o = oneri[k.urun_id];
          if (!o) return;
          if (!k.fiyatElle) k.fiyat = o.fiyat;
          if (!k.iskElle) k.iskonto = o.iskonto;
          k.aciklama = o.aciklama || '';
        });
        if (durum.ekran === 'belge') ciz();
      }, function () {});                                  // öneri alınamazsa sepet olduğu gibi kalır
  }
  function sayiOku(v) { var n = parseFloat(String(v).replace(/\./g, '').replace(',', '.')); return isNaN(n) ? 0 : n; }

  EKRAN.tamam = function () {
    var p = durum.param;
    uyg.innerHTML = '<main class="ortala"><div class="yuvarlak" style="width:72px;height:72px;border-radius:36px;background:#E3F2EA">' + IK.tamam + '</div>' +
      '<h1 style="margin:0;font-size:20px">' + (p.tur === 'siparis' ? 'Sipariş programa kaydedildi' : 'Teklif programa kaydedildi') + '</h1>' +
      '<div style="color:#5B6675">' + h(p.musteri_ad) + '</div><b style="color:#1F4E79;font-size:16px">' + h(p.no) + ' · ' + tl(p.genel) + '</b>' +
      '<button class="dugme tam" data-git="ana">Ana Sayfa</button><button class="dugme ikincil tam" data-musteri="' + h(p.musteri_id) + '">Müşteri Kartı</button></main>';
  };

  // ── stok / el terminali ──
  EKRAN.stok = function () {
    uyg.innerHTML = ust('Stok Sorgu', 'Barkod okutun ya da ürün arayın', durum.gecmis.length > 0 && durum.param.sec) +
      '<main class="icerik">' + barkodKutusu() + '<div id="sonuc" class="liste"><div class="bos">Yükleniyor…</div></div></main>' + (durum.param.sec ? '' : altMenu());
    stokListeBagla(function (u) { durum.param.sec ? sepeteEkle(u) : git('urun', { id: u.id }); });
  };
  function barkodKutusu() {
    var kamera = window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    return '<form id="barkodForm" class="liste" style="gap:8px"><label class="ara" style="border:1px solid #DDE3EC">' + IK.barkod +
      '<span class="gizli">Barkod veya ürün ara</span><input id="araKutu" type="search" placeholder="Barkod okutun / ürün adı, kodu…" autocomplete="off" enterkeyhint="search"></label>' +
      (kamera ? '<button type="button" class="dugme ikincil" data-eylem="kamera">' + IK.barkod + 'Kamera ile Okut</button><video class="kamera" id="kamera" hidden playsinline muted></video>' : '') + '</form>';
  }
  function stokListeBagla(sec) {
    var kutuEl = document.getElementById('araKutu'), liste = [];
    function getir() {
      api('urunler?ara=' + encodeURIComponent(kutuEl.value)).then(function (l) {
        liste = l;
        el('sonuc').innerHTML = l.length ? l.map(function (u, i) {
          var r = u.stok <= 0 ? ['yok', 'Tükendi'] : ['var', 'Var'];
          return '<button class="oge" data-urun="' + i + '"><span class="orta"><span class="ad">' + h(u.ad) + '</span><span class="bilgi">' + h(u.kod) + ' · ' + sayi(u.stok) + ' ' + h(u.birim) + '</span></span><span class="sag"><b>' + tl(u.fiyat) + '</b><span class="rozet ' + r[0] + '">' + r[1] + '</span></span></button>';
        }).join('') : '<div class="bos">Ürün bulunamadı.</div>';
      }, function (e) { el('sonuc').innerHTML = '<div class="hata">' + h(e.message) + '</div>'; });
    }
    function barkodla(kod) {
      api('barkod?kod=' + encodeURIComponent(kod)).then(function (u) { kutuEl.value = ''; sec(u); }, function (e) { bildir(e.message); kutuEl.select(); });
    }
    var t; kutuEl.oninput = function () { clearTimeout(t); t = setTimeout(getir, 250); };
    document.getElementById('barkodForm').onsubmit = function (e) { e.preventDefault(); if (kutuEl.value.trim()) barkodla(kutuEl.value.trim()); };
    document.getElementById('sonuc').onclick = function (e) { var b = e.target.closest('[data-urun]'); if (b) sec(liste[+b.dataset.urun]); };
    var kb = document.querySelector('[data-eylem=kamera]');
    if (kb) kb.onclick = function () { kameraOkut(barkodla); };
    kutuEl.focus();       // el terminalinin okuyucusu klavye gibi yazar → Enter ile ürün açılır
    getir();
  }
  // Kamerayla barkod: her telefonda (iPhone / Android) aynı okuyucu — zxing.min.js (ZXing, Apache-2.0), ilk kullanımda yüklenir.
  var kameraOkuyucu = null;
  function zxingYukle() {
    if (window.ZXing) return Promise.resolve(window.ZXing);
    return new Promise(function (tamam, hata) {
      var s = document.createElement('script');
      s.src = 'zxing.min.js';
      s.onload = function () { window.ZXing ? tamam(window.ZXing) : hata(new Error('Barkod okuyucu yüklenemedi.')); };
      s.onerror = function () { document.head.removeChild(s); hata(new Error('Barkod okuyucu yüklenemedi, bağlantıyı kontrol edin.')); };
      document.head.appendChild(s);
    });
  }
  function kameraKapat() {
    if (kameraOkuyucu) { try { kameraOkuyucu.reset(); } catch (e) {} kameraOkuyucu = null; }
    var v = document.getElementById('kamera'); if (v) v.hidden = true;
  }
  function kameraOkut(bulunca) {
    if (kameraOkuyucu) return kameraKapat();          // ikinci basış kamerayı kapatır
    var v = document.getElementById('kamera');
    zxingYukle().then(function (Z) {
      // format ipucu verme: POSSIBLE_FORMATS/TRY_HARDER ile ZXing 0.21.3 canlı görüntüde EAN-13'ü okuyamıyor (denendi)
      var okuyucu = kameraOkuyucu = new Z.BrowserMultiFormatReader(undefined, 250);
      v.hidden = false;
      return okuyucu.decodeFromConstraints({ video: { facingMode: 'environment' } }, v, function (sonuc) {
        if (okuyucu !== kameraOkuyucu) return;
        if (!document.body.contains(v)) return kameraKapat();          // başka ekrana geçildi
        if (sonuc) { kameraKapat(); if (navigator.vibrate) navigator.vibrate(80); bulunca(sonuc.getText()); }
      });
    }).catch(function (e) {
      kameraKapat();
      bildir(e && /Permission|NotAllowed/i.test(e.name + e.message) ? 'Kameraya izin verilmedi.' : (e && e.message) || 'Kamera açılamadı.');
    });
  }

  EKRAN.urun = function () {
    yukleniyor('Ürün');
    var goster = function (u) {
      var dep = u.depolar.length ? u.depolar.map(function (d) {
        return '<div class="kart"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + h(d.ad) + '</b><b style="color:#1F4E79">' + sayi(d.miktar) + ' ' + h(u.birim) + '</b></div>' +
          d.raflar.map(function (r) { return '<div class="raf"><span>' + h(r.raf || 'Raf yok') + (r.lot ? ' · ' + h(r.lot) : '') + '</span><span>' + sayi(r.miktar) + '</span></div>'; }).join('') + '</div>';
      }).join('') : '<div class="bos">Hiçbir depoda stok yok.</div>';
      uyg.innerHTML = ust(u.ad, u.kod + (u.barkod ? ' · ' + u.barkod : ''), true) +
        '<main class="icerik"><div class="izgara3"><div class="kart"><div class="etk">Toplam stok</div><b>' + sayi(u.stok) + ' ' + h(u.birim) + '</b></div>' +
        '<div class="kart"><div class="etk">Satış fiyatı</div><b>' + tl(u.fiyat) + '</b></div><div class="kart"><div class="etk">KDV</div><b>%' + sayi(u.kdv) + '</b></div></div>' +
        '<div class="baslik">DEPO VE RAF</div>' + dep + '<button class="dugme tam" data-eylem="sepeteEkle">' + IK.sepet + 'Siparişe Ekle</button></main>' + altMenu();
      durum.param.urun = u;
    };
    api('urun?id=' + durum.param.id).then(goster, function (e) { hataGoster('Ürün', e); });
  };
  function sepeteEkle(u) {
    if (!durum.sepet) yeniSepet('siparis');
    var var_ = durum.sepet.satirlar.filter(function (k) { return k.urun_id === u.id; })[0];
    if (var_) var_.miktar += 1;
    else durum.sepet.satirlar.push({ urun_id: u.id, ad: u.ad, kod: u.kod, birim: u.birim, fiyat: u.fiyat, kdv: u.kdv, stok: u.stok, miktar: 1, iskonto: 0 });
    bildir(u.ad + ' eklendi');
    fiyatYenile();
    if (durum.ekran === 'stok' && durum.param.sec) {          // sipariş ekranından açılan ürün seçici → geri dön
      durum.gecmis.pop(); durum.ekran = 'belge'; durum.param = {}; return ciz();
    }
    git('belge');
  }

  EKRAN.ozet = function () {
    yukleniyor('Satış Özeti');
    api('ozet').then(function (o) {
      uyg.innerHTML = ust('Satış Özeti', new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }), false) +
        '<main class="icerik"><div class="kart"><div class="etk">Bu ay kesilen fatura (KDV hariç)</div><div style="font-size:26px;font-weight:700">' + tl(o.ay_satis) + '</div><div class="etk">' + o.ay_fatura_adet + ' fatura</div></div>' +
        '<div class="izgara2"><div class="kart"><div class="etk">Bugünkü sipariş</div><b style="font-size:18px">' + o.bugun_siparis + '</b><div class="etk">' + tl(o.bugun_siparis_tutar) + '</div></div>' +
        '<div class="kart"><div class="etk">Açık teklif</div><b style="font-size:18px">' + o.bekleyen_teklif + '</b></div></div></main>' + altMenu();
    }, function (e) { hataGoster('Satış Özeti', e); });
  };


  // ── atölye (PL199, tablet / makine ekranı) — kurallar programdaki Atölye Ekranı ile aynı ──
  var ONCELIK_RENK = { 1: '#C62828', 2: '#EF6C00', 3: '#1565C0', 4: '#78909C' };
  var OP_DURUM = { BEKLIYOR: 'Bekliyor', DEVAM: 'Çalışıyor', DURDU: 'Durdu', TAMAMLANDI: 'Tamamlandı' };
  EKRAN.atolye = function () {
    var k = durum.kullanici || {};
    uyg.innerHTML = '<header class="ust"><div class="satir"><h1>Atölye</h1><div style="display:flex;gap:8px;align-items:center">' +
      '<button class="dugme kucuk beyaz" data-eylem="atolyeYenile">Yenile</button>' +
      '<button class="yuvarlak" style="background:#2E6DA4;color:#fff;border:0;cursor:pointer" data-eylem="cikis" aria-label="Çıkış yap">' + h(bas(k.ad_soyad)) + '</button></div></div>' +
      '<label class="gizli" for="merkezSec">İş merkezi</label><select id="merkezSec" class="secim"></select>' +
      '<div class="alt" id="atolyeOzet"></div></header>' +
      '<main class="icerik"><div id="kartlar" class="kartlar"><div class="bos">Yükleniyor…</div></div></main>' + (satisVar() ? altMenu() : '');
    document.getElementById('merkezSec').onchange = function (e) { durum.param.merkez = +e.target.value; atolyeGetir(); };
    atolyeGetir();
  };
  function atolyeGetir() {
    var m = durum.param.merkez;
    return api('atolye' + (m === undefined ? '' : '?merkez=' + m)).then(function (v) {
      if (durum.ekran !== 'atolye') return;
      durum.atolye = v; durum.param.merkez = v.merkez;
      el('merkezSec').innerHTML = '<option value="0">Tüm iş emirleri</option>' + v.merkezler.map(function (x) {
        return '<option value="' + x.id + '"' + (x.id === v.merkez ? ' selected' : '') + '>' + h(x.ad) + '</option>';
      }).join('');
      var calisan = v.kartlar.filter(function (x) { return x.op && x.op.durum === 'DEVAM'; }).length;
      var duran = v.kartlar.filter(function (x) { return x.op && x.op.durum === 'DURDU'; }).length;
      el('atolyeOzet').textContent = v.kartlar.length + ' iş · ' + calisan + ' çalışıyor · ' + duran + ' durdu · ' +
        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      el('kartlar').innerHTML = v.kartlar.length ? v.kartlar.map(isKarti).join('') : '<div class="bos">Bu iş merkezinde açık iş yok.</div>';
    }, function (e) { el('kartlar').innerHTML = '<div class="hata" role="alert">' + h(e.message) + '</div>'; });
  }
  function isKarti(x) {
    var renk = ONCELIK_RENK[x.oncelik] || '#1565C0', op = x.op, kapali = x.hazir ? '' : ' disabled';
    var opSatir = '';
    if (op) {
      var od = OP_DURUM[op.durum] || op.durum;
      opSatir = '<div class="is-op ' + (op.durum === 'DEVAM' ? 'yesil' : op.durum === 'DURDU' ? 'kirmizi' : '') + '">Operasyon ' + h(x.op_sira) + ': ' +
        h(op.aciklama || 'Üretim') + (op.merkez ? ' (' + h(op.merkez) + ')' : '') + ' · ' + h(od) +
        (op.durum === 'DURDU' && op.durus_nedeni ? ': ' + h(op.durus_nedeni) : '') +
        (op.calisma_dk || op.plan_dk ? ' · ' + sayi(op.calisma_dk) + ' dk' + (op.plan_dk ? ' / plan ' + sayi(op.plan_dk) : '') : '') +
        (op.operator ? ' · ' + h(op.operator) : '') + '</div>';
    }
    var dugmeler = (op && op.durum === 'DEVAM'
      ? '<button class="dugme turuncu-d" data-at="durdur" data-id="' + x.id + '">⏸ Durdur</button>'
      : '<button class="dugme yesil-d" data-at="basla" data-id="' + x.id + '"' + kapali + '>▶ ' + (op && op.durum === 'DURDU' ? 'Devam' : 'Başla') + '</button>') +
      '<button class="dugme" data-at="bildir" data-id="' + x.id + '"' + kapali + '>✔ Üretim Bildir</button>' +
      (op ? '<button class="dugme gri-d" data-at="bitir" data-id="' + x.id + '">■ Operasyonu Bitir</button>' : '');
    return '<div class="kart is" style="border-left:8px solid ' + renk + '"><div class="is-bas"><b class="is-no">' + h(x.uretim_no) + '</b>' +
      '<span class="rozet" style="background:' + renk + '1A;color:' + renk + '">' + h(x.oncelik_adi) + '</span>' +
      (x.termin ? '<span class="' + (/gecikti/.test(x.termin_metni) ? 'kirmizi' : 'etk2') + '">Termin ' + h(x.termin) + ' (' + h(x.termin_metni) + ')</span>' : '') + '</div>' +
      '<div class="is-mamul">' + h(x.mamul_kodu) + ' — ' + h(x.mamul) + (x.musteri ? ' <span class="etk2">· ' + h(x.musteri) + '</span>' : '') + '</div>' +
      '<div class="is-miktar">Plan ' + sayi(x.miktar) + ' · Üretilen ' + sayi(x.uretilen) + ' · Kalan ' + sayi(x.kalan) + ' ' + h(x.birim) +
      (x.fire ? ' · Fire ' + sayi(x.fire) : '') + '</div>' + opSatir +
      (x.neden ? '<div class="is-uyari ' + (x.hazir ? '' : 'kirmizi') + '">⚠ ' + h(x.neden) + '</div>' : '') +
      '<div class="is-dugmeler">' + dugmeler + '</div></div>';
  }
  function atolyeKart(id) { return ((durum.atolye || {}).kartlar || []).filter(function (x) { return x.id === id; })[0]; }
  function atolyeGonder(veri, mesaj, b) {
    if (b) b.disabled = true;
    return api('atolye', veri).then(function (r) { perdeKapat(); bildir(mesaj); atolyeGetir(); return r; },
      function (e) { if (b) b.disabled = false; var y = el('perdeHata'); if (y.innerHTML !== undefined && document.querySelector('.perde')) y.innerHTML = '<div class="hata" role="alert">' + h(e.message) + '</div>'; else bildir(e.message); });
  }
  function atolyeEylem(ad, id, b) {
    var x = atolyeKart(id); if (!x) return;
    var op = x.op;
    if (ad === 'basla') return atolyeGonder({ eylem: 'basla', op_id: op ? op.id : null, uretim_id: x.id, merkez_id: durum.atolye.merkez }, x.uretim_no + ' başladı', b);
    if (ad === 'bitir') {
      if (!confirm(x.uretim_no + ' — "' + (op.aciklama || 'Üretim') + '" tamamlansın mı?\nÇalışma süresi: ' + sayi(op.calisma_dk) + ' dk')) return;
      return atolyeGonder({ eylem: 'bitir', op_id: op.id }, 'Operasyon tamamlandı', b);
    }
    if (ad === 'durdur') {
      return perdeAc('Neden duruyor?', x.uretim_no, '<div class="izgara2">' + durum.atolye.durus_nedenleri.map(function (n) {
        return '<button class="dugme ' + (n === 'Arıza' ? 'turuncu-d' : 'gri-d') + '" data-durus="' + h(n) + '" data-op="' + op.id + '">' + h(n) + '</button>';
      }).join('') + '</div><label class="alan" style="margin-top:12px">Not (isteğe bağlı)<input id="durusNot"></label><div id="perdeHata"></div>');
    }
    if (ad === 'bildir') {
      perdeAc('Üretim Bildir', x.uretim_no + ' · ' + x.mamul, '<form id="bildirForm" class="liste">' +
        '<div class="izgara2"><label class="alan">Sağlam (' + h(x.birim) + ')<input name="miktar" inputmode="decimal" value="' + h(sayi(x.kalan)) + '"></label>' +
        '<label class="alan">Fire<input name="fire" inputmode="decimal" value="0"></label></div>' +
        '<label class="alan">Fire nedeni (fire varsa)<select name="fire_nedeni" class="secim acik"><option value=""></option>' +
        durum.atolye.fire_nedenleri.map(function (n) { return '<option>' + h(n) + '</option>'; }).join('') + '</select></label>' +
        '<label class="alan">Not (vardiya, makine…)<input name="aciklama"></label>' +
        (x.seri_takipli ? '<label class="alan">Seri no (boş: otomatik ' + h(x.uretim_no) + '-001…)<input name="seriler" ' +
          'placeholder="virgülle ya da boşlukla ayırın"></label>' : '') + '<div id="perdeHata"></div>' +
        '<button class="dugme tam" type="submit" style="height:56px;font-size:17px">Bildir</button></form>');
      document.getElementById('bildirForm').onsubmit = function (e) {
        e.preventDefault();
        var f = e.target;
        atolyeGonder({ eylem: 'bildir', uretim_id: x.id, miktar: f.miktar.value, fire: f.fire.value, fire_nedeni: f.fire_nedeni.value, aciklama: f.aciklama.value,
                       seriler: f.seriler ? f.seriler.value : '' },
          'Bildirim kaydedildi', f.querySelector('button[type=submit]')).then(function (r) {
          if (r && r.planlanan && r.bildirilen >= r.planlanan) bildir(r.uretim_no + ': planlanan miktara ulaşıldı — iş emrini planlama kapatır');
          if (r && r.seriler && r.seriler.length) seriListesi(r);       // PL214: etiket yazmak için kalıcı liste
        });
      };
    }
  }
  function seriListesi(r) {
    perdeAc('Seri numaraları', r.uretim_no + ' · ' + r.seriler.length + ' adet', '<div class="liste" id="seriListe">' +
      r.seriler.map(function (s, i) { return '<div class="oge" style="cursor:default"><span class="ad">' + h(s) + '</span>' +
        '<span class="bilgi" style="margin-left:auto">' + (i + 1) + '</span></div>'; }).join('') + '</div>' +
      '<button class="dugme tam" type="button" data-eylem="perdeKapat" style="height:56px;font-size:17px;margin-top:12px">Tamam</button>');
  }
  function perdeAc(baslik, alt, govde) {
    perdeKapat();
    var p = document.createElement('div');
    p.className = 'perde'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true');
    p.innerHTML = '<div class="sayfa-alt"><div class="bas"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:18px">' + h(baslik) + '</b>' +
      '<button class="geri" style="color:#5B6675" data-eylem="perdeKapat" aria-label="Kapat">' + IK.carpi + '</button></div><div class="etk2">' + h(alt) + '</div></div><div class="govde">' + govde + '</div></div>';
    p.onclick = function (e) { if (e.target === p) perdeKapat(); };
    document.body.appendChild(p);
  }
  function perdeKapat() { var p = document.querySelector('.perde'); if (p) p.parentNode.removeChild(p); }
  setInterval(function () {      // açık atölye ekranı dakikada bir yenilenir (pencere açıkken / sekme gizliyken beklenir)
    if (durum.jeton && durum.ekran === 'atolye' && !document.querySelector('.perde') && document.visibilityState !== 'hidden') atolyeGetir();
  }, 60000);

  // ── olaylar (tek dinleyici) ──
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button, a');
    if (!b) return;
    var d = b.dataset;
    if (d.at) return atolyeEylem(d.at, +d.id, b);
    if (d.durus) { var not_ = document.getElementById('durusNot'); return atolyeGonder({ eylem: 'durdur', op_id: +d.op, neden: d.durus, aciklama: not_ ? not_.value : '' }, 'Durduruldu: ' + d.durus, b); }
    if (d.git) { if (d.git === 'belge' && !durum.sepet) yeniSepet('siparis'); return git(d.git); }
    if (d.musteri !== undefined && d.musteri !== '') {
      if (d.sec) { // belgeye müşteri seçimi
        durum.sepet.musteri_id = +d.musteri; durum.sepet.musteri_ad = b.querySelector('.ad').textContent;
        durum.gecmis.pop(); durum.ekran = 'belge'; durum.param = {}; fiyatYenile(); return ciz();
      }
      return git('musteri', { id: +d.musteri });
    }
    if (d.belge) { yeniSepet(d.belge, +d.mid, durum.param.ad); return git('belge'); }
    if (d.tur) { durum.sepet.tur = d.tur; return ciz(); }
    if (d.sil !== undefined) { durum.sepet.satirlar.splice(+d.sil, 1); return ciz(); }
    if (d.adim !== undefined) { var k = durum.sepet.satirlar[+d.adim]; k.miktar = Math.max(1, k.miktar + (+d.yon)); fiyatYenile(); return ciz(); }
    switch (d.eylem) {
      case 'geri': return geri();
      case 'yenile': return ciz();
      case 'cikis': if (confirm('Çıkış yapılsın mı?')) { api('cikis', {}).catch(function () {}); cikisYap(); } return;
      case 'musteriSec': return git('musteriler', { sec: true });
      case 'urunEkle': return git('stok', { sec: true });
      case 'sepeteEkle': return sepeteEkle(durum.param.urun);
      case 'gonder': return gonder(b);
      case 'atolyeYenile': return atolyeGetir();
      case 'perdeKapat': return perdeKapat();
    }
  });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset;
    if (d.miktar !== undefined) { durum.sepet.satirlar[+d.miktar].miktar = Math.max(0.001, sayiOku(e.target.value)); fiyatYenile(); ciz(); }
    if (d.fiyat !== undefined) { var kf = durum.sepet.satirlar[+d.fiyat]; kf.fiyat = Math.max(0, sayiOku(e.target.value)); kf.fiyatElle = true; ciz(); }
    if (d.isk !== undefined) { var ki = durum.sepet.satirlar[+d.isk]; ki.iskonto = Math.min(99.99, Math.max(0, sayiOku(e.target.value))); ki.iskElle = true; ciz(); }
    if (e.target.id === 'belgeNot') durum.sepet.not = e.target.value;
  });
  function gonder(b) {
    var s = durum.sepet; b.disabled = true;
    var notEl = document.getElementById('belgeNot'); if (notEl) s.not = notEl.value;
    api('belge', { tur: s.tur, musteri_id: s.musteri_id, notlar: s.not || '',
                   kalemler: s.satirlar.map(function (k) { return { urun_id: k.urun_id, miktar: k.miktar, fiyat: k.fiyat, iskonto: k.iskonto || 0 }; }) })
      .then(function (r) {
        var p = { tur: s.tur, no: r.no, genel: r.genel, musteri_ad: s.musteri_ad, musteri_id: s.musteri_id };
        durum.sepet = null; durum.gecmis = []; git('tamam', p, true);
      }, function (er) { b.disabled = false; el('bHata').innerHTML = '<div class="hata" role="alert">' + h(er.message) + '</div>'; });
  }
  function cikisYap() { perdeKapat(); durum.atolye = null; durum.jeton = null; durum.kullanici = null; yaz('jeton', null); yaz('kullanici', null); durum.gecmis = []; durum.ekran = 'giris'; ciz(); }

  function ciz() {
    if (durum.jeton && durum.ekran === 'ana' && !satisVar() && uretimVar()) durum.ekran = 'atolye';   // yalnız üretim: operatör
    document.body.classList.toggle('genis', !!durum.jeton && durum.ekran === 'atolye');   // tablette geniş, iki sütun
    if (!durum.jeton) { EKRAN.giris(); return; }
    (EKRAN[durum.ekran] || EKRAN.ana)();
  }
  if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('sw.js').catch(function () {});
  ciz();
})();
