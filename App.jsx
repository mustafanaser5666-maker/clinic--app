import { useState } from "react";

const const BOT_TOKEN = "8839247627:AAHp3sph_00zVn7GMp_IFJ4kSv3CfqYHJHE";
const CHAT_ID = "1312627565";

const BG_SHAPES = [
  { emoji: "⭐", top:"5%", left:"5%", size:28, rotate:15 },
  { emoji: "🌈", top:"3%", right:"8%", size:32, rotate:-10 },
  { emoji: "🦋", top:"12%", left:"2%", size:24, rotate:20 },
  { emoji: "🌸", bottom:"15%", left:"3%", size:26, rotate:-15 },
  { emoji: "⭐", bottom:"10%", right:"5%", size:22, rotate:25 },
  { emoji: "🌟", top:"8%", right:"20%", size:20, rotate:0 },
  { emoji: "🐣", bottom:"20%", right:"3%", size:28, rotate:-5 },
  { emoji: "🌙", top:"18%", left:"8%", size:22, rotate:10 },
];

export default function ClinicApp() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");

  const today = new Date().toISOString().split("T")[0];

  const isFriday = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr).getDay() === 5;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "يرجى إدخال الاسم";
    if (!/^[0-9]{10,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "رقم هاتف غير صحيح";
    if (!form.date) e.date = "يرجى اختيار التاريخ";
    else if (isFriday(form.date)) e.date = "العيادة مغلقة يوم الجمعة";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStep("loading");

    const now = new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" });
    const msg =
      `🏥 *حجز موعد جديد*\n` +
      `━━━━━━━━━━━━━━\n` +
      `👤 *الاسم:* ${form.name}\n` +
      `📞 *الهاتف:* ${form.phone}\n` +
      `📅 *التاريخ:* ${form.date}\n` +
      (form.notes ? `📝 *ملاحظات:* ${form.notes}\n` : "") +
      `━━━━━━━━━━━━━━\n` +
      `⏰ ${now}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "Markdown" }),
      });
      const data = await res.json();
      setStep(data.ok ? "success" : "error");
    } catch {
      setStep("error");
    }
  };

  const restart = () => {
    setForm({ name: "", phone: "", date: "", notes: "" });
    setErrors({});
    setStep("form");
  };

  if (step === "loading") return (
    <div style={s.root} dir="rtl">
      {BG_SHAPES.map((sh, i) => (
        <span key={i} style={{ position:"fixed", top:sh.top, left:sh.left, right:sh.right, bottom:sh.bottom, fontSize:sh.size, transform:`rotate(${sh.rotate}deg)`, opacity:0.35, pointerEvents:"none", userSelect:"none", zIndex:0 }}>{sh.emoji}</span>
      ))}
      <div style={s.card}>
        <div style={s.spinner} />
        <p style={s.loadTxt}>جاري تأكيد الحجز...</p>
      </div>
    </div>
  );

  if (step === "success") return (
    <div style={s.root} dir="rtl">
      {BG_SHAPES.map((sh, i) => (
        <span key={i} style={{ position:"fixed", top:sh.top, left:sh.left, right:sh.right, bottom:sh.bottom, fontSize:sh.size, transform:`rotate(${sh.rotate}deg)`, opacity:0.35, pointerEvents:"none", userSelect:"none", zIndex:0 }}>{sh.emoji}</span>
      ))}
      <div style={s.card}>
        <div style={s.okIcon}>✓</div>
        <h2 style={s.okTitle}>تم تأكيد الحجز!</h2>
        <p style={s.sub}>تم استلام طلب حجزك</p>
        <div style={s.infoBox}>
          <Row label="الاسم" val={form.name} />
          <Row label="الهاتف" val={form.phone} />
          <Row label="التاريخ" val={form.date} last={!form.notes} />
          {form.notes && <Row label="ملاحظات" val={form.notes} last />}
        </div>
        <button style={s.btn} onClick={restart}>حجز موعد جديد 📅</button>
      </div>
    </div>
  );

  if (step === "error") return (
    <div style={s.root} dir="rtl">
      {BG_SHAPES.map((sh, i) => (
        <span key={i} style={{ position:"fixed", top:sh.top, left:sh.left, right:sh.right, bottom:sh.bottom, fontSize:sh.size, transform:`rotate(${sh.rotate}deg)`, opacity:0.35, pointerEvents:"none", userSelect:"none", zIndex:0 }}>{sh.emoji}</span>
      ))}
      <div style={s.card}>
        <div style={s.errIcon}>!</div>
        <h2 style={s.errTitle}>حدث خطأ</h2>
        <p style={s.sub}>لم يتم الحجز، حاول مجدداً</p>
        <button style={s.btn} onClick={restart}>حاول مجدداً</button>
      </div>
    </div>
  );

  return (
    <div style={s.root} dir="rtl">
      {BG_SHAPES.map((sh, i) => (
        <span key={i} style={{ position:"fixed", top:sh.top, left:sh.left, right:sh.right, bottom:sh.bottom, fontSize:sh.size, transform:`rotate(${sh.rotate}deg)`, opacity:0.35, pointerEvents:"none", userSelect:"none", zIndex:0 }}>{sh.emoji}</span>
      ))}
      <div style={s.card}>
        <div style={s.stickers}>
          <span style={s.sticker}>🩺</span>
          <span style={s.sticker}>💉</span>
          <span style={s.sticker}>🩹</span>
          <span style={s.sticker}>🏥</span>
          <span style={s.sticker}>💊</span>
          <span style={s.sticker}>🧬</span>
          <span style={s.sticker}>🔬</span>
          <span style={s.sticker}>🧸</span>
        </div>
        <h1 style={s.title}>د. مصطفى عبد الكريم الحسيني</h1>
        <p style={s.specialty}>طبيب أطفال وحديثي الولادة</p>
        <div style={s.divider} />
        <p style={s.sub}>احجز موعدك بسهولة وسرعة</p>

        {/* بانر وقت العمل */}
        <div style={s.hours}>
          🕒 ساعات العمل: من 3 ظهراً حتى 8 مساءً
        </div>
        <div style={s.closed}>
          🚫 العيادة مغلقة يوم الجمعة
        </div>

        {/* الاسم */}
        <div style={s.field}>
          <label style={s.label}>الاسم الكامل</label>
          <input style={{...s.input,...(errors.name?s.inpErr:{})}}
            placeholder="محمد أحمد"
            value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} />
          {errors.name && <span style={s.err}>{errors.name}</span>}
        </div>

        {/* الهاتف */}
        <div style={s.field}>
          <label style={s.label}>رقم الهاتف</label>
          <input style={{...s.input,...(errors.phone?s.inpErr:{})}}
            placeholder="05xxxxxxxx" type="tel" inputMode="numeric"
            value={form.phone}
            onChange={e=>setForm({...form,phone:e.target.value})} />
          {errors.phone && <span style={s.err}>{errors.phone}</span>}
        </div>

        {/* التاريخ */}
        <div style={s.field}>
          <label style={s.label}>تاريخ الموعد</label>
          <input
            style={{
              ...s.input,
              ...(errors.date ? s.inpErr : {}),
              ...(isFriday(form.date) ? s.inpErr : {})
            }}
            type="date" min={today}
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
          />
          {errors.date && <span style={s.err}>{errors.date}</span>}
          {isFriday(form.date) && !errors.date && (
            <span style={s.err}>العيادة مغلقة يوم الجمعة، اختر يوماً آخر</span>
          )}
        </div>

        {/* ملاحظات */}
        <div style={s.field}>
          <label style={s.label}>ملاحظات (اختياري)</label>
          <textarea style={s.textarea}
            placeholder="أي معلومات إضافية أو سبب الزيارة..."
            rows={3}
            value={form.notes}
            onChange={e=>setForm({...form,notes:e.target.value})} />
        </div>

        <button style={s.btn} onClick={handleSubmit}>تأكيد الحجز 📅</button>
        <p style={s.foot}>📨 تم استلام طلب حجزك</p>
      </div>
    </div>
  );
}

function Row({ label, val, last }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom: last?"none":"1px solid #e8eaf0" }}>
      <span style={{ color:"#888", fontSize:13 }}>{label}</span>
      <span style={{ fontWeight:700, color:"#00838f", fontSize:14 }}>{val}</span>
    </div>
  );
}

const s = {
  root: { minHeight:"100vh", background:"linear-gradient(160deg, #e0f7fa 0%, #b2ebf2 30%, #e8f5e9 60%, #f3e5f5 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',Tahoma,sans-serif", padding:"20px 16px" },
  card: { background:"#fff", borderRadius:24, padding:"36px 28px", width:"100%", maxWidth:440, boxShadow:"0 24px 80px rgba(0,0,0,0.25)", textAlign:"center" },
  logo: { fontSize:52, marginBottom:8 },
  title: { fontSize:22, fontWeight:800, color:"#00838f", margin:"0 0 6px" },
  sub: { fontSize:14, color:"#888", marginBottom:14 },
  stickers: { display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10, background:"linear-gradient(135deg,#e0f7fa,#f3e5f5)", borderRadius:16, padding:"18px 10px", marginBottom:16 },
  sticker: { fontSize:38, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.15))", cursor:"default" },
  specialty: { fontSize:15, color:"#00838f", fontWeight:700, margin:"4px 0 10px" },
  divider: { height:1, background:"#e8eaf0", margin:"12px 0 14px" },
  hours: { background:"#e0f7fa", border:"1.5px solid #80deea", borderRadius:10, padding:"9px 14px", fontSize:14, color:"#00838f", fontWeight:700, marginBottom:8 },
  closed: { background:"#fff3f3", border:"1.5px solid #ffb3b3", borderRadius:10, padding:"9px 14px", fontSize:14, color:"#c0392b", fontWeight:700, marginBottom:20 },
  field: { marginBottom:18, textAlign:"right" },
  label: { display:"block", fontSize:13, fontWeight:700, color:"#444", marginBottom:8 },
  input: { width:"100%", padding:"12px 14px", border:"1.5px solid #e0e0e0", borderRadius:10, fontSize:15, color:"#222", outline:"none", boxSizing:"border-box", background:"#fafafa" },
  textarea: { width:"100%", padding:"12px 14px", border:"1.5px solid #e0e0e0", borderRadius:10, fontSize:14, color:"#222", outline:"none", boxSizing:"border-box", background:"#fafafa", resize:"none", fontFamily:"inherit" },
  inpErr: { borderColor:"#e53935", background:"#fff5f5" },
  err: { color:"#e53935", fontSize:12, marginTop:5, display:"block" },
  btn: { width:"100%", padding:15, marginTop:8, background:"linear-gradient(135deg,#26c6da,#42a5f5)", color:"#fff", border:"none", borderRadius:12, fontSize:17, fontWeight:800, cursor:"pointer" },
  foot: { fontSize:12, color:"#aaa", marginTop:14, marginBottom:0 },
  spinner: { width:50, height:50, border:"4px solid #e0e0e0", borderTop:"4px solid #26c6da", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 20px" },
  loadTxt: { color:"#555", fontSize:16 },
  okIcon: { width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#26c6da,#42a5f5)", color:"#fff", fontSize:32, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
  okTitle: { fontSize:26, fontWeight:800, color:"#00838f", margin:"0 0 6px" },
  infoBox: { background:"#e0f7fa", borderRadius:12, padding:"16px 20px", marginBottom:24, textAlign:"right" },
  errIcon: { width:72, height:72, borderRadius:"50%", background:"#e53935", color:"#fff", fontSize:36, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
  errTitle: { fontSize:24, fontWeight:800, color:"#e53935", margin:"0 0 6px" },
};
