import AsyncStorage from "@react-native-async-storage/async-storage";
import {SEED} from "./seed";

const KEY="forsyth-business-v2";

const clone=x=>JSON.parse(JSON.stringify(x));

export async function loadState(){
  const raw=await AsyncStorage.getItem(KEY);
  if(!raw) return clone(SEED);
  try{
    const d=JSON.parse(raw);
    const base=clone(SEED);
    return {
      ...base,
      ...d,
      schemaVersion:base.schemaVersion,
      settings:{...base.settings,...(d.settings||{})},
      brands:Array.isArray(d.brands)&&d.brands.length?d.brands:base.brands,
      customers:Array.isArray(d.customers)?d.customers:base.customers,
      jobs:Array.isArray(d.jobs)?d.jobs:base.jobs,
      catalog:Array.isArray(d.catalog)?d.catalog:base.catalog,
      vendors:Array.isArray(d.vendors)?d.vendors:base.vendors,
      documents:Array.isArray(d.documents)?d.documents:base.documents,
      expenses:Array.isArray(d.expenses)?d.expenses:[],
      mileage:Array.isArray(d.mileage)?d.mileage:[]
    };
  }catch{
    return clone(SEED);
  }
}
export async function saveState(s){await AsyncStorage.setItem(KEY,JSON.stringify(s));}
export async function resetState(){await AsyncStorage.removeItem(KEY);}
