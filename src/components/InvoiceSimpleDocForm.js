import React,{useEffect,useMemo,useState} from "react";
import {View,Text,TouchableOpacity,Alert,StyleSheet} from "react-native";
import {Field,Chip,Button,Card,Small,s} from "./ui";
import {money} from "../lib/calc";

const today=()=>new Date().toISOString().slice(0,10);
const id=()=>String(Date.now())+Math.random();
const blank=(taxCode="GST",patch={})=>({id:id(),description:"",notes:"",qty:"1",unit:"ea",unitPrice:"",internalCost:"0",taxCode,...patch});

export default function InvoiceSimpleDocForm({state,setState,type,close}){
 const [jobId,setJobId]=useState(state.jobs[0]?.id||"");
 const job=state.jobs.find(j=>j.id===jobId);
 const defaultTax=job?.taxProfile==="EXEMPT"?"EXEMPT":"GST";
 const [title,setTitle]=useState("");
 const [notes,setNotes]=useState("");
 const [deposit,setDeposit]=useState(type==="estimate"?"50":"0");
 const [items,setItems]=useState([blank(defaultTax)]);
 useEffect(()=>{setItems(xs=>xs.map(x=>({...x,taxCode:defaultTax})))},[jobId]);
 const setItem=(itemId,key,val)=>setItems(xs=>xs.map(x=>x.id===itemId?{...x,[key]:val}:x));
 const remove=itemId=>setItems(xs=>xs.length===1?xs:xs.filter(x=>x.id!==itemId));
 const addPreset=(kind)=>{
  const p=kind==="labour"?{description:"Skilled labour",unit:"hr",unitPrice:String(state.settings.labourRate||90),taxCode:defaultTax}:kind==="mileage"?{description:"Travel / mileage",unit:"km",unitPrice:String(state.settings.mileageRate||0),taxCode:defaultTax}:{description:"Materials",unit:"ea",taxCode:defaultTax};
  setItems(xs=>xs.length===1&&!xs[0].description&&!xs[0].unitPrice?[blank(defaultTax,p)]:[...xs,blank(defaultTax,p)]);
 };
 const subtotal=useMemo(()=>items.reduce((n,x)=>n+(Number(x.qty)||0)*(Number(x.unitPrice)||0),0),[items]);
 const gst=useMemo(()=>items.reduce((n,x)=>["GST","GST_PST"].includes(x.taxCode)?n+(Number(x.qty)||0)*(Number(x.unitPrice)||0)*Number(state.settings.gstRate||.05):n,0),[items,state.settings.gstRate]);
 const pst=useMemo(()=>items.reduce((n,x)=>["PST","GST_PST"].includes(x.taxCode)?n+(Number(x.qty)||0)*(Number(x.unitPrice)||0)*Number(state.settings.pstRate||.07):n,0),[items,state.settings.pstRate]);
 const internal=useMemo(()=>items.reduce((n,x)=>n+(Number(x.qty)||0)*(Number(x.internalCost)||0),0),[items]);
 const save=()=>{
  const good=items.filter(x=>x.description.trim()&&x.unitPrice!=="");
  if(!jobId)return Alert.alert("Choose a job");
  if(!good.length)return Alert.alert("Add at least one item","Enter a description and price.");
  const n=state.documents.filter(d=>d.type===type).length+1;
  const prefix=type==="invoice"?state.settings.invoicePrefix:type==="estimate"?state.settings.estimatePrefix:state.settings.changePrefix;
  const doc={id:String(Date.now()),type,number:`${prefix}-${String(n).padStart(4,"0")}`,jobId,brandId:job.brandId,status:"draft",date:today(),depositPct:Number(deposit)||0,title:title||good[0].description,notes,items:good.map((x,i)=>({...x,id:String(i+1),qty:Number(x.qty)||1,unitPrice:Number(x.unitPrice)||0,internalCost:Number(x.internalCost)||0})),payments:[]};
  setState({...state,documents:[...state.documents,doc]});close();
 };
 return <>
  <Text style={s.label}>Customer / job</Text><View style={z.wrap}>{state.jobs.map(j=><Chip key={j.id} text={j.name} active={jobId===j.id} onPress={()=>setJobId(j.id)}/>)}</View>
  <Field label="Title" value={title} onChangeText={setTitle} placeholder={type==="invoice"?"Invoice title":"Estimate title"}/>
  <Text style={z.section}>Quick add</Text><View style={z.wrap}><Chip text={`Labour ${money(state.settings.labourRate||90)}/hr`} onPress={()=>addPreset("labour")}/><Chip text={`Mileage ${money(state.settings.mileageRate||0)}/km`} onPress={()=>addPreset("mileage")}/><Chip text="Materials" onPress={()=>addPreset("materials")}/></View>
  <Text style={z.section}>Items</Text>
  {items.map((x,i)=><Card key={x.id} style={z.item}>
   <View style={z.itemHead}><Text style={z.itemTitle}>Item {i+1}</Text>{items.length>1&&<TouchableOpacity onPress={()=>remove(x.id)}><Text style={z.remove}>Remove</Text></TouchableOpacity>}</View>
   <Field label="Description" value={x.description} onChangeText={v=>setItem(x.id,"description",v)} placeholder="Labour, materials, delivery…"/>
   <Field label="Item note" value={x.notes} onChangeText={v=>setItem(x.id,"notes",v)} placeholder="Optional detail"/>
   <View style={z.row}><View style={z.third}><Field label="Qty" value={x.qty} onChangeText={v=>setItem(x.id,"qty",v)} keyboardType="decimal-pad"/></View><View style={z.third}><Field label="Unit" value={x.unit} onChangeText={v=>setItem(x.id,"unit",v)} placeholder="hr/km/ea"/></View><View style={z.third}><Field label="Rate" value={x.unitPrice} onChangeText={v=>setItem(x.id,"unitPrice",v)} keyboardType="decimal-pad"/></View></View>
   <Field label="Internal cost / unit (hidden from customer)" value={x.internalCost} onChangeText={v=>setItem(x.id,"internalCost",v)} keyboardType="decimal-pad"/>
   <Text style={s.label}>Tax</Text><View style={z.wrap}>{["GST","GST_PST","PST","EXEMPT"].map(t=><Chip key={t} text={t==="GST_PST"?"GST + PST":t} active={x.taxCode===t} onPress={()=>setItem(x.id,"taxCode",t)}/>)}</View>
  </Card>)}
  <Button title="+ Add another item" kind="soft" onPress={()=>setItems(xs=>[...xs,blank(defaultTax)])}/>
  <View style={{height:12}}/><Field label="Notes" multiline value={notes} onChangeText={setNotes} placeholder="Customer notes, scope details, warranty, etc."/>
  {type==="estimate"&&<><Text style={s.label}>Deposit</Text><View style={z.wrap}>{["0","35","50"].map(v=><Chip key={v} text={`${v}%`} active={deposit===v} onPress={()=>setDeposit(v)}/>)}</View><Field label="Custom deposit %" value={deposit} onChangeText={setDeposit} keyboardType="decimal-pad"/></>}
  <Card style={z.total}><View style={z.totalRow}><Small>Subtotal</Small><Text>{money(subtotal)}</Text></View>{gst>0&&<View style={z.totalRow}><Small>GST</Small><Text>{money(gst)}</Text></View>}{pst>0&&<View style={z.totalRow}><Small>PST</Small><Text>{money(pst)}</Text></View>}<View style={z.totalRow}><Text style={z.grand}>Total</Text><Text style={z.grand}>{money(subtotal+gst+pst)}</Text></View><View style={z.internal}><Small>Internal cost {money(internal)} · gross before overhead {money(subtotal-internal)}</Small></View></Card>
  <Button title={`Save ${type==="estimate"?"estimate":type==="invoice"?"invoice":"change order"}`} onPress={save}/>
 </>;
}
const z=StyleSheet.create({wrap:{flexDirection:"row",flexWrap:"wrap",marginBottom:7},section:{fontSize:18,fontWeight:"900",marginTop:7,marginBottom:10},item:{marginBottom:12},itemHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:3},itemTitle:{fontWeight:"900",fontSize:15},remove:{fontWeight:"800",color:"#A43A3A"},row:{flexDirection:"row",gap:8},third:{flex:1},total:{marginTop:12,marginBottom:12},totalRow:{flexDirection:"row",justifyContent:"space-between",paddingVertical:4},grand:{fontWeight:"900",fontSize:18,marginTop:5},internal:{borderTopWidth:1,borderTopColor:"#E3E7EA",marginTop:8,paddingTop:8}});
