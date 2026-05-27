import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import SimpleFooter from '../components/SimpleFooter';
import './PrivacyPolicy.css';

const SON_GUNCELLEME_TR = '18 Mayıs 2026';
const SON_GUNCELLEME_EN = 'May 18, 2026';

const BOLUMLER_EN = [
  {
    baslik: '1. Introduction',
    icerik: `MasalMatik values the privacy of our users. This policy explains what personal data we collect when you use our service, how we use it, and your rights.

MasalMatik is an AI-powered story platform that lets parents, guardians, and educators create personalized bedtime stories for children. This policy applies to our service at masalmatik.com.`,
  },
  {
    baslik: '2. Information We Collect',
    icerik: `**Account Information**
During registration, we collect your username, email address, and password. Passwords are never stored in plain text; they are encrypted using a secure hashing algorithm (bcrypt).

**Content Information**
The stories you create, selected character names (from pre-defined options), age range, location and language preferences, and any custom story prompt (max. 500 characters) are stored in our system. This data is used to build your personal story library.

**Technical Information**
Standard technical data such as IP address, browser type, and operating system may be collected to improve service performance. This data is not used to personally identify you.

**Notification Preferences**
You can manage which email notifications you receive from your settings page. These preferences are stored in our database.`,
  },
  {
    baslik: '3. How We Use Your Information',
    icerik: `We use the information we collect only for the following purposes:

• **Account management:** To perform actions like login, password changes, and account deletion.
• **Service delivery:** To process your story creation request. Your content information is anonymously passed to the Amazon Bedrock API for story generation (see Section 4).
• **Email notifications:** Emails are sent for password resets, security alerts, and your preferred notification types. Security emails (e.g., password changes) are always sent regardless of your notification preferences.
• **Security and debugging:** To detect potential security breaches and maintain service quality.

We do not sell, rent, or share your data with third parties for commercial purposes.`,
  },
  {
    baslik: '4. Third-Party Services',
    icerik: `**Amazon Bedrock (AI Story Generation)**
Stories are generated through the AI model on the Amazon Bedrock platform. Only story-related parameters (character name, age, location, language) are sent to Bedrock. Your account information (email, identity) is never passed to Bedrock. Amazon's privacy policy: https://aws.amazon.com/privacy/

**Gmail SMTP (Email Delivery)**
Notifications and security emails are sent using Gmail SMTP infrastructure. Google's privacy policy: https://policies.google.com/privacy

**MongoDB Atlas (Database)**
User and story data is stored in the MongoDB Atlas cloud database. MongoDB's privacy policy: https://www.mongodb.com/legal/privacy-policy`,
  },
  {
    baslik: "5. Children's Privacy",
    icerik: `MasalMatik generates content for children; however, account holders are adults (parents, guardians, educators). The platform does not directly collect accounts or personal data from users under the age of 13.

Character names selected during story creation are chosen from a pre-defined list and stored as part of the story in the database. Any custom guidance text entered by the user (optional, max. 500 characters) is also stored with the story. We recommend not sharing sensitive personal information such as a child's real last name, school name, or address in this text.

If you wish to have your child's information deleted, you can permanently remove all your stories and associated data by deleting your account.`,
  },
  {
    baslik: '6. Data Retention and Deletion',
    icerik: `**Account Data**
Your data is retained in our system as long as your account is active.

**Account Deletion**
When you delete your account, all your personal information (username, email, password) is permanently deleted. For your public stories, two options are provided:
• **Delete stories:** All stories are permanently removed.
• **Keep anonymous:** Stories remain on the platform but are completely disconnected from you, and your name will not appear in any way.

**Security Logs**
System logs kept for security purposes are stored for a maximum of 90 days and then deleted.`,
  },
  {
    baslik: '7. User Rights',
    icerik: `You have the following rights over your personal data:

• **Right of access:** You can view your account information from your profile page.
• **Right of rectification:** You can update your username and notification preferences from the settings page.
• **Right of erasure:** You can permanently delete your account (Profile → Manage Account → Delete My Account).
• **Managing email preferences:** You can control which notifications you receive from your Profile page.

**KVKK (Personal Data Protection Law)**
For users in Turkey, your rights under the KVKK (Law No. 6698) apply. As the data controller, you can direct your privacy-related requests to the contact address below.

**GDPR (General Data Protection Regulation)**
For users in the European Union, your GDPR rights (access, portability, objection, restriction) apply. You can submit requests via the contact address below.`,
  },
  {
    baslik: '8. Cookies',
    icerik: `MasalMatik uses JWT (JSON Web Token) based authentication for session management. Browser cookies are used only to maintain session continuity.

• **Session cookie:** Used to keep you logged in.
• **Theme and language preferences:** Stored in your browser via localStorage.
• **No advertising cookies:** MasalMatik does not use any advertising networks or tracking cookies.`,
  },
  {
    baslik: '9. Changes',
    icerik: `We may update this privacy policy from time to time. When significant changes are made, we will send a notification to your registered email address. The current version of the policy is always published on this page.

Continued use of the service means you accept the updated policy.`,
  },
  {
    baslik: '10. Contact',
    icerik: `For questions about our privacy policy or your personal data, please contact us:

📧 Email: selinayturksal@gmail.com

We recommend including "Privacy" in the subject of your message. We respond within 48 hours.`,
  },
];

const BOLUMLER = [
  {
    baslik: '1. Giriş',
    icerik: `MasalMatik olarak kullanıcılarımızın gizliliğini önemsiyoruz. Bu politika, hizmetimizi kullanırken hangi kişisel verileri topladığımızı, bu verileri nasıl kullandığımızı ve haklarınızı açıklamaktadır.

MasalMatik, ebeveynler, veliler ve eğitimcilerin çocuklar için kişiselleştirilmiş masallar oluşturmasına olanak tanıyan bir yapay zekâ destekli masal platformudur. Bu politika, masalmatik.com adresinden erişilen hizmetimiz için geçerlidir.`,
  },
  {
    baslik: '2. Topladığımız Bilgiler',
    icerik: `**Hesap Bilgileri**
Kayıt sırasında kullanıcı adı, e-posta adresi ve şifrenizi toplarız. Şifreler hiçbir zaman düz metin olarak saklanmaz; güvenli bir hash algoritmasıyla (bcrypt) şifrelenerek veritabanına kaydedilir.

**İçerik Bilgileri**
Oluşturduğunuz masallar, seçtiğiniz karakter isimleri (önceden belirlenmiş seçeneklerden), yaş aralığı, mekan ve dil tercihleri ve varsa özel masal yönlendirmeniz (maksimum 500 karakter) sistemimizde saklanır. Bu veriler size ait masal kitaplığınızı oluşturmak için kullanılır.

**Teknik Bilgiler**
Hizmetin işleyişini iyileştirmek amacıyla IP adresi, tarayıcı türü ve işletim sistemi bilgileri gibi standart teknik veriler toplanabilir. Bu veriler sizi kişisel olarak tanımlamak için kullanılmaz.

**Bildirim Tercihleri**
Hangi e-posta bildirimlerini almak istediğinizi ayarlar sayfasından yönetebilirsiniz. Bu tercihler veritabanımızda saklanır.`,
  },
  {
    baslik: '3. Bilgileri Nasıl Kullanıyoruz',
    icerik: `Topladığımız bilgileri yalnızca aşağıdaki amaçlar için kullanırız:

• **Hesap yönetimi:** Giriş, şifre değişikliği, hesap silme gibi işlemleri gerçekleştirmek.
• **Hizmet sunumu:** Masal oluşturma isteğinizi işlemek. Masal üretimi için içerik bilgileriniz Amazon Bedrock API'sine anonim olarak iletilir (bkz. Bölüm 4).
• **E-posta bildirimleri:** Şifre sıfırlama, güvenlik uyarıları ve tercih ettiğiniz bildirim türleri için mail gönderilir. Güvenlik e-postaları (şifre değişikliği vb.) bildirim tercihlerinizden bağımsız olarak her zaman gönderilir.
• **Güvenlik ve hata ayıklama:** Olası güvenlik ihlallerini tespit etmek ve hizmet kalitesini korumak.

Verilerinizi üçüncü taraflara satmaz, kiralamaz veya ticari amaçla paylaşmayız.`,
  },
  {
    baslik: '4. Üçüncü Taraf Hizmetler',
    icerik: `**Amazon Bedrock (Yapay Zekâ Masal Üretimi)**
Masallar Amazon Bedrock platformundaki yapay zekâ modeli aracılığıyla oluşturulmaktadır. Bedrock'a iletilen veri yalnızca masalın içeriğiyle ilgili parametrelerdir (karakter adı, yaş, mekan, dil). Hesap bilgileriniz (e-posta, kimlik) Bedrock'a asla iletilmez. Amazon'un gizlilik politikası için: https://aws.amazon.com/privacy/

**Gmail SMTP (E-posta Gönderimi)**
Bildirimleri ve güvenlik e-postalarını göndermek için Gmail SMTP altyapısı kullanılmaktadır. Google'ın gizlilik politikası için: https://policies.google.com/privacy

**MongoDB Atlas (Veritabanı)**
Kullanıcı ve masal verileri MongoDB Atlas bulut veritabanında saklanmaktadır. MongoDB'nin gizlilik politikası için: https://www.mongodb.com/legal/privacy-policy`,
  },
  {
    baslik: '5. Çocuk Gizliliği',
    icerik: `MasalMatik çocuklar için içerik üretir; ancak hesap sahipleri yetişkinlerdir (ebeveynler, veliler, eğitimciler). Platform, 13 yaşın altındaki kullanıcılardan doğrudan hesap oluşturma veya kişisel veri toplama işlemi yapmaz.

Masal oluşturma sırasında seçilen karakter isimleri, önceden belirlenmiş bir listeden seçilir ve masalın bir parçası olarak veritabanında saklanır. Kullanıcının girdiği özel yönlendirme metni (isteğe bağlı, maks. 500 karakter) da masalla birlikte saklanır. Bu metinlerde çocuğun gerçek soyadı, okul adı, adres gibi hassas kişisel bilgileri paylaşmamanızı öneririz.

Çocuğunuzun bilgilerinin silinmesini istiyorsanız hesabınızı silerek tüm masallarınızı ve ilişkili verileri kalıcı olarak kaldırabilirsiniz.`,
  },
  {
    baslik: '6. Veri Saklama ve Silme',
    icerik: `**Hesap Verileri**
Hesabınız aktif olduğu sürece verileriniz sistemde saklanır.

**Hesap Silme**
Hesabınızı sildiğinizde, tüm kişisel bilgileriniz (kullanıcı adı, e-posta, şifre) kalıcı olarak silinir. Herkese açık masallarınız için iki seçenek sunulur:
• **Masalları sil:** Tüm masallar kalıcı olarak kaldırılır.
• **Anonim bırak:** Masallar platformda kalır, ancak sizinle bağlantısı tamamen kesilir ve adınız hiçbir şekilde görünmez.

**Güvenlik Günlükleri**
Güvenlik amacıyla tutulan sistem günlükleri en fazla 90 gün saklanır ve ardından silinir.`,
  },
  {
    baslik: '7. Kullanıcı Hakları',
    icerik: `Kişisel verileriniz üzerinde aşağıdaki haklara sahipsiniz:

• **Erişim hakkı:** Profil sayfasından hesap bilgilerinizi görüntüleyebilirsiniz.
• **Düzeltme hakkı:** Kullanıcı adı ve bildirim tercihlerinizi ayarlar sayfasından güncelleyebilirsiniz.
• **Silme hakkı:** Hesabınızı kalıcı olarak silebilirsiniz (Profil → Hesabı Yönet → Hesabımı Sil).
• **E-posta tercihlerini yönetme:** Hangi bildirimleri alacağınızı Profil sayfasından kontrol edebilirsiniz.

**KVKK (Kişisel Verilerin Korunması Kanunu)**
Türkiye'deki kullanıcılar için 6698 sayılı KVKK kapsamındaki haklarınız geçerlidir. Veri sorumlusu olarak gizlilik konularındaki başvurularınızı aşağıdaki iletişim adresine iletebilirsiniz.

**GDPR (Genel Veri Koruma Tüzüğü)**
Avrupa Birliği'ndeki kullanıcılar için GDPR kapsamındaki haklarınız (erişim, taşınabilirlik, itiraz, kısıtlama) geçerlidir. Taleplerini aşağıdaki iletişim adresiyle iletebilirsiniz.`,
  },
  {
    baslik: '8. Çerezler (Cookies)',
    icerik: `MasalMatik, oturum yönetimi için JWT (JSON Web Token) tabanlı kimlik doğrulama kullanmaktadır. Tarayıcı çerezleri yalnızca oturum devamlılığını sağlamak için kullanılır.

• **Oturum çerezi:** Giriş durumunuzu korumak için kullanılır.
• **Tema ve dil tercihleri:** Tarayıcınızda yerel depolama (localStorage) aracılığıyla saklanır.
• **Reklam çerezi kullanılmaz:** MasalMatik'te herhangi bir reklam ağı veya izleme çerezi bulunmamaktadır.`,
  },
  {
    baslik: '9. Değişiklikler',
    icerik: `Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yapıldığında kayıtlı e-posta adresinize bildirim göndeririz. Politikanın güncel sürümü her zaman bu sayfada yayımlanır.

Hizmeti kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.`,
  },
  {
    baslik: '10. İletişim',
    icerik: `Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz:

📧 E-posta: selinayturksal@gmail.com

Mesajınıza "Gizlilik" konusunu eklemenizi öneririz. En geç 48 saat içinde yanıt veririz.`,
  },
];

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const tr = lang === 'tr';
  const bolumler = tr ? BOLUMLER : BOLUMLER_EN;

  return (
    <div className="pp-page">
      <div className="pp-container">


        <div className="pp-header">
          <h1 className="pp-title">
            🔒 {tr ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </h1>
          <p className="pp-date">
            {tr ? `Son güncelleme: ${SON_GUNCELLEME_TR}` : `Last updated: ${SON_GUNCELLEME_EN}`}
          </p>
          <p className="pp-intro">
            {tr
              ? 'MasalMatik olarak verilerinizin güvenliğini ve gizliliğini ciddiye alıyoruz. Bu sayfa, hangi verileri topladığımızı ve bunları nasıl kullandığımızı şeffaf biçimde açıklamaktadır.'
              : 'At MasalMatik, we take the security and privacy of your data seriously. This page transparently explains what data we collect and how we use it.'}
          </p>
        </div>

        <div className="pp-toc">
          <h3>{tr ? 'İçindekiler' : 'Table of Contents'}</h3>
          <ul>
            {bolumler.map((b, i) => (
              <li key={i}>
                <a href={`#bolum-${i}`}>{b.baslik}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="pp-sections">
          {bolumler.map((b, i) => (
            <section key={i} id={`bolum-${i}`} className="pp-section">
              <h2 className="pp-section-title">{b.baslik}</h2>
              <div className="pp-section-body">
                {b.icerik.split('\n\n').map((paragraf, j) => {
                  // **Başlık** satırlarını kalın yap
                  if (paragraf.startsWith('**') && paragraf.split('\n')[0].endsWith('**')) {
                    const [baslikSatiri, ...geri] = paragraf.split('\n');
                    const baslikMetni = baslikSatiri.replace(/\*\*/g, '');
                    return (
                      <div key={j} className="pp-subsection">
                        <h3 className="pp-subsection-title">{baslikMetni}</h3>
                        {geri.length > 0 && <p>{geri.join('\n')}</p>}
                      </div>
                    );
                  }
                  // Madde listesi (• ile başlayan)
                  if (paragraf.includes('\n•') || paragraf.startsWith('•')) {
                    const satirlar = paragraf.split('\n');
                    return (
                      <ul key={j} className="pp-list">
                        {satirlar.map((satir, k) => {
                          const temiz = satir.replace(/^•\s*/, '');
                          const parca = temiz.split(/\*\*(.*?)\*\*/);
                          return (
                            <li key={k}>
                              {parca.map((p, l) =>
                                l % 2 === 1 ? <strong key={l}>{p}</strong> : p
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  return <p key={j}>{paragraf}</p>;
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="pp-footer">
          <Link to="/" className="pp-back-link">← {tr ? 'Ana Sayfaya Dön' : 'Back to Home'}</Link>
          <p className="pp-footer-note">
            {tr
              ? 'Bu politika Türkçe olarak hazırlanmıştır. Çeviri farklılıkları durumunda Türkçe metin esas alınır.'
              : 'This policy is prepared in Turkish. In case of translation discrepancies, the Turkish text shall prevail.'}
          </p>
        </div>

      </div>

      <SimpleFooter />
    </div>
  );
}
