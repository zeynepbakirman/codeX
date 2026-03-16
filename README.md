# 🚀 codeX - Yeteneklerin Modern Pazaryeri

codeX, müşteri ve mühendisleri bir araya getiren, React Native ve Expo ile geliştirilmiş yeni nesil, oyunlaştırılmış bir serbest çalışma (freelance) pazaryeri uygulamasıdır. 

## 📌 Projenin Amacı ve Oyunlaştırma Özellikleri
Bu projenin temel amacı; yazılım mühendislerinin yeteneklerini sergileyebileceği, müşterilerin ise ihtiyaçlarına uygun mühendisleri kolayca bulup iş teklifi gönderebileceği dinamik bir ekosistem yaratmaktır. Proje, klasik bir iş bulma platformu olmaktan çıkıp **Oyunlaştırma (Gamification)** dinamikleriyle kullanıcıları motive etmeyi hedefler:

* 🎮 **Seviye ve XP Sistemi:** Mühendisler başarıyla tamamladıkları her görev için **+50 XP** kazanır. Her 100 XP'de bir **Level (Seviye)** atlarlar.
* 🔴 **Dinamik Statü Yönetimi:** Bir mühendis iş teklifini kabul ettiğinde durumu anında "Müsait" konumundan "Meşgul" konumuna geçer ve pazaryerindeki görünürlüğü güncellenir.
* 🔔 **Gerçek Zamanlı Bildirim Döngüsü:** Müşteri iş gönderdiğinde, mühendis işi kabul/red ettiğinde veya işi bitirdiğinde iki tarafın da panelinde anlık statü ve bildirim güncellemeleri olur. Biten işler gururla "Tamamlandı" etiketiyle sergilenir.

---

## 🎥 Proje Tanıtım Videosu
Uygulamanın tüm özelliklerinin (Müşteri ve Mühendis senaryoları) gösterildiği tanıtım videomuza aşağıdan ulaşabilirsiniz:
👉 **[YouTube Tanıtım Videosunu İzlemek İçin Tıklayın](https://youtu.be/VDkQgXvBVPw?si=ZdnblSsmEYSmPgIZ)**

---

## 📦 İndirilebilir APK Dosyası
Uygulamayı Android cihazınızda doğrudan kurup test etmek için aşağıdaki linkten APK dosyasını indirebilirsiniz:
👉 **[codeX.apk Dosyasını İndir](./codeX.apk)** *(Alternatif Expo Direkt İndirme Linki: [Buraya Tıklayın](https://expo.dev/artifacts/eas/89zeuDcGPRmwZVT79cWb52.apk))*

---

## 🛠️ Nasıl Çalıştırılır? (Installation & Run)

Projeyi bilgisayarınızda yerel olarak (local) çalıştırmak ve kodları incelemek için aşağıdaki adımları sırasıyla uygulayın:

**1. Projeyi Bilgisayarınıza Klonlayın:**
Terminali (veya Komut İstemcisini) açın ve projeyi bilgisayarınıza indirin:
```bash
git clone https://github.com/zeynepbakirman/codeX.git
cd codeX
```

**2. Gerekli Kütüphaneleri Kurun:**
Projenin çalışması için gereken paketleri yükleyin:
```bash
npm install
```

**3. Uygulamayı Başlatın:**
Expo sunucusunu (önbelleği temizleyerek) çalıştırın:
```bash
npx expo start -c
```

**4. Test Edin:**
* **Fiziksel Cihazda:** Telefonunuza **Expo Go** uygulamasını (iOS/Android) indirin ve terminalde açılan QR kodu telefonunuzun kamerası ile okutun.
* **Sanal Cihazda (Emulator):** Bilgisayarınızda Android Studio kuruluysa, terminalde `a` tuşuna basarak Android emülatöründe başlatabilirsiniz.
