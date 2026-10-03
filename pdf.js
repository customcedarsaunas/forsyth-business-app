import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {documentTotals, money} from "./calc";

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const typeLabel=t=>({invoice:"INVOICE",estimate:"ESTIMATE",change_order:"CHANGE ORDER"}[t]||String(t||"").toUpperCase());

export function documentHtml(state,doc){
  const brand=state.brands.find(b=>b.id===doc.brandId)||{};
  const job=state.jobs.find(j=>j.id===doc.jobId)||{};
  const customer=state.customers.find(c=>c.id===job.customerId)||{};
  const t=documentTotals(doc,state.settings);
  const rows=(doc.items||[]).map(i=>`<tr><td><div class="desc">${esc(i.description)}</div>${i.notes?`<div class="itemnote">${esc(i.notes)}</div>`:""}</td><td class="num">${esc(i.qty)}${i.unit?` ${esc(i.unit)}`:""}</td><td class="num">${money(i.unitPrice)}</td><td class="num strong">${money(Number(i.qty)*Number(i.unitPrice))}</td></tr>`).join("");
  const logo=brand.logoUri?`<img class="logo" src="${esc(brand.logoUri)}"/>`:"";
  const address=brand.address?`<div>${esc(brand.address)}</div>`:"";
  const customerAddress=customer.address?`<div>${esc(customer.address)}</div>`:"";
  const gst=Number(t.gst||0)>0?`<div><span>GST (${esc(doc.gstRate??state.settings?.gstRate??5)}%)</span><span>${money(t.gst)}</span></div>`:"";
  const pst=Number(t.pst||0)>0?`<div><span>PST</span><span>${money(t.pst)}</span></div>`:"";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @page{margin:0}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#202124;font-size:12px;background:#fff}.page{padding:44px 48px 38px;min-height:100vh}.header{display:flex;justify-content:space-between;align-items:flex-start}.logo{max-width:170px;max-height:76px;object-fit:contain;margin-bottom:10px}.brandname{font-size:17px;font-weight:700;margin-bottom:4px}.contact{line-height:1.55;color:#5f6368}.doctype{text-align:right}.doctype h1{font-size:31px;font-weight:400;letter-spacing:.5px;margin:0 0 9px}.docnum{font-size:14px;font-weight:600}.date{margin-top:5px;color:#5f6368}.rule{height:1px;background:#d8dadd;margin:28px 0 24px}.info{display:flex;justify-content:space-between;gap:36px}.label{text-transform:uppercase;font-size:9px;letter-spacing:.9px;color:#777;margin-bottom:7px;font-weight:700}.bill{font-size:13px;line-height:1.55}.job{text-align:right;max-width:46%}.jobtitle{font-size:14px;font-weight:700}.jobnotes{margin-top:5px;color:#666;line-height:1.45}table{width:100%;border-collapse:collapse;margin-top:30px}thead{background:#f2f3f5}th{padding:10px 9px;text-align:left;text-transform:uppercase;font-size:9px;letter-spacing:.65px;color:#555;border-bottom:1px solid #d8dadd}td{padding:12px 9px;border-bottom:1px solid #e6e7e9;vertical-align:top}.num{text-align:right;white-space:nowrap}.strong,.desc{font-weight:600}.itemnote{font-size:10px;color:#777;margin-top:3px}.summary{width:310px;margin:24px 0 0 auto}.summary>div{display:flex;justify-content:space-between;padding:5px 2px}.total{font-size:19px;font-weight:700;border-top:1px solid #aeb1b5;margin-top:6px;padding-top:12px!important}.balance{font-size:15px;font-weight:700}.notes{margin-top:36px;border-top:1px solid #d8dadd;padding-top:18px;display:flex;gap:40px}.notes>div{flex:1}.notesbody{white-space:pre-line;line-height:1.5;color:#555}.taxid{margin-top:7px;font-size:10px;color:#777}.footer{margin-top:30px;text-align:center;font-size:9px;color:#999}
  </style></head><body><div class="page">
  <div class="header"><div>${logo}<div class="brandname">${esc(brand.displayName||"")}</div><div class="contact">${address}${brand.email?`<div>${esc(brand.email)}</div>`:""}${brand.phone?`<div>${esc(brand.phone)}</div>`:""}${brand.website?`<div>${esc(brand.website)}</div>`:""}</div>${brand.gstNumber?`<div class="taxid">GST/HST # ${esc(brand.gstNumber)}</div>`:""}</div><div class="doctype"><h1>${typeLabel(doc.type)}</h1><div class="docnum"># ${esc(doc.number||"")}</div><div class="date">Date: ${esc(doc.date||"")}</div>${doc.dueDate?`<div class="date">Due: ${esc(doc.dueDate)}</div>`:""}</div></div>
  <div class="rule"></div><div class="info"><div><div class="label">Bill to</div><div class="bill"><strong>${esc(customer.name||"")}</strong>${customerAddress}${customer.email?`<div>${esc(customer.email)}</div>`:""}${customer.phone?`<div>${esc(customer.phone)}</div>`:""}</div></div><div class="job">${doc.title?`<div class="label">Job</div><div class="jobtitle">${esc(doc.title)}</div>`:""}${doc.notes?`<div class="jobnotes">${esc(doc.notes)}</div>`:""}</div></div>
  <table><thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="summary"><div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>${gst}${pst}<div class="total"><span>Total</span><span>${money(t.total)}</span></div>${doc.type==="invoice"?`<div><span>Paid</span><span>${money(t.paid)}</span></div><div class="balance"><span>Balance Due</span><span>${money(t.balance)}</span></div>`:""}</div>
  <div class="notes"><div><div class="label">Notes / Terms</div><div class="notesbody">${esc(brand.defaultPaymentTerms||"")}</div></div><div><div class="label">Payment</div><div class="notesbody">${esc(brand.defaultPaymentInstructions||"")}</div></div></div>
  <div class="footer">Thank you for your business.</div></div></body></html>`;
}

export async function shareDocument(state,doc){
  const {uri}=await Print.printToFileAsync({html:documentHtml(state,doc)});
  if(await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri,{mimeType:"application/pdf",dialogTitle:`Share ${doc.number}`});
  return uri;
}
