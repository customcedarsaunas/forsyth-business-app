export const ACCOUNTS = [
  {id:"1000", name:"Business bank", type:"asset"},
  {id:"1100", name:"Accounts receivable", type:"asset"},
  {id:"1200", name:"GST input tax credits", type:"asset"},
  {id:"2000", name:"Accounts payable", type:"liability"},
  {id:"2100", name:"GST payable", type:"liability"},
  {id:"2110", name:"PST payable", type:"liability"},
  {id:"3000", name:"Owner equity", type:"equity"},
  {id:"3100", name:"Owner draws", type:"equity"},
  {id:"4000", name:"Contracting revenue", type:"revenue"},
  {id:"4010", name:"Sauna revenue", type:"revenue"},
  {id:"5000", name:"Materials", type:"expense"},
  {id:"5010", name:"Subcontractors", type:"expense"},
  {id:"5020", name:"Fuel & auto", type:"expense"},
  {id:"5030", name:"Tools & supplies", type:"expense"},
  {id:"5040", name:"Travel", type:"expense"},
  {id:"5050", name:"Insurance", type:"expense"},
  {id:"5060", name:"Office & software", type:"expense"},
  {id:"5070", name:"Other business expense", type:"expense"}
];

export const SEED = {
  schemaVersion: 2,
  activeBrandId: "jfe",
  brands: [
    {
      id:"jfe",
      legalName:"John Forsyth Enterprises",
      displayName:"J. Forsyth Enterprises",
      division:"Contracting",
      email:"jforsyth.ent@gmail.com",
      phone:"250-842-8311",
      website:"customcedarsaunas.com",
      gstNumber:"780098356RT0001",
      pstNumber:"",
      logoUri:null,
      defaultPaymentTerms:"Due on receipt",
      defaultPaymentInstructions:"E-transfer: jforsyth.ent@gmail.com\nCheque: John Forsyth Enterprises"
    },
    {
      id:"sauna",
      legalName:"John Forsyth Enterprises",
      displayName:"Custom Cedar Saunas",
      division:"Custom Cedar Saunas",
      email:"john@customcedarsaunas.com",
      phone:"250-842-8311",
      website:"customcedarsaunas.com",
      gstNumber:"780098356RT0001",
      pstNumber:"",
      logoUri:null,
      defaultPaymentTerms:"50% deposit to begin procurement. Balance due before delivery unless otherwise stated.",
      defaultPaymentInstructions:"E-transfer: john@customcedarsaunas.com\nCheque: John Forsyth Enterprises"
    }
  ],
  settings: {
    labourRate:90,
    helperRate:50,
    mileageRate:0.85,
    defaultMaterialMarkupPct:20,
    estimateValidityDays:30,
    invoicePrefix:"INV",
    estimatePrefix:"EST",
    changePrefix:"CO",
    requireReviewBeforeSend:true,
    currency:"CAD",
    gstRate:0.05,
    pstRate:0.07
  },
  customers: [
    {id:"kevin", name:"Kevin", email:"", phone:"", notes:"Fence customer"},
    {id:"jessie", name:"Jessie Marshall", email:"", phone:"", notes:"Renovation customer"}
  ],
  jobs: [
    {
      id:"kevin-fence", customerId:"kevin", brandId:"jfe", name:"Kevin — Fence",
      status:"active", taxProfile:"GST", site:"", notes:"Cedar/tin fence with gates and approved/additional changes.",
      budget:0, startDate:"2026-09-25"
    },
    {
      id:"jessie-reno", customerId:"jessie", brandId:"jfe", name:"Jessie — Renovation",
      status:"active", taxProfile:"EXEMPT", site:"", notes:"Tax-exempt renovation job.",
      budget:38369.98, startDate:"2026-09-01"
    }
  ],
  catalog: [
    {id:"labour", kind:"service", brandId:"jfe", name:"Skilled labour", unit:"hr", cost:0, price:90, taxCode:"GST", vendorId:null},
    {id:"helper", kind:"service", brandId:"jfe", name:"Helper labour", unit:"hr", cost:50, price:50, taxCode:"GST", vendorId:null},
    {id:"cedar-6x6", kind:"material", brandId:"jfe", name:"Planed cedar 6×6 post", unit:"ea", cost:100, price:120, taxCode:"GST_PST", vendorId:"west-sawmill"},
    {id:"fence-tin", kind:"material", brandId:"jfe", name:"Black corrugated fence tin", unit:"lf", cost:11, price:13.2, taxCode:"GST_PST", vendorId:"timber-mart"},
    {id:"concrete-bag", kind:"material", brandId:"jfe", name:"Concrete bag", unit:"bag", cost:15, price:18, taxCode:"GST_PST", vendorId:null},
    {id:"sauna-base", kind:"service", brandId:"sauna", name:"Base cedar sauna", unit:"ea", cost:0, price:12500, taxCode:"GST_PST", vendorId:null},
    {id:"sauna-delivery", kind:"service", brandId:"sauna", name:"Delivery", unit:"ea", cost:0, price:2500, taxCode:"GST", vendorId:null},
    {id:"covered-porch", kind:"service", brandId:"sauna", name:"Covered porch", unit:"ea", cost:0, price:1000, taxCode:"GST_PST", vendorId:null},
    {id:"rear-glass", kind:"material", brandId:"sauna", name:"Rear panoramic glass", unit:"ea", cost:0, price:3080, taxCode:"GST_PST", vendorId:null},
    {id:"front-glass", kind:"material", brandId:"sauna", name:"Front glass package allowance", unit:"ea", cost:0, price:2660, taxCode:"GST_PST", vendorId:null},
    {id:"huum", kind:"material", brandId:"sauna", name:"HUUM heater package", unit:"ea", cost:0, price:5714.40, taxCode:"GST_PST", vendorId:"huum"},
    {id:"lighting", kind:"service", brandId:"sauna", name:"Lighting package", unit:"ea", cost:0, price:500, taxCode:"GST_PST", vendorId:null},
    {id:"audio", kind:"service", brandId:"sauna", name:"Audio package", unit:"ea", cost:0, price:500, taxCode:"GST_PST", vendorId:null}
  ],
  vendors: [
    {id:"west-sawmill", name:"West Sawmill Limited", terms:"", notes:"Cedar supplier"},
    {id:"timber-mart", name:"Timber Mart", terms:"", notes:"Fence tin / building materials"},
    {id:"huum", name:"HUUM supplier", terms:"", notes:"Track dealer discounts, freight, controls and stones"},
    {id:"homecraft", name:"Homecraft", terms:"", notes:"Supplier discount pricing"}
  ],
  documents: [
    {
      id:"kevin-co-001", type:"change_order", number:"CO-0001", jobId:"kevin-fence", brandId:"jfe",
      status:"draft", date:"2026-09-22", dueDate:null, depositPct:0,
      title:"Fence extension and added gates",
      notes:"Customer-requested additional scope. Review before sending.",
      items:[
        {id:"1", description:"Additional fence — 36 ft", qty:36, unit:"ft", unitPrice:120, internalCost:0, taxCode:"GST"},
        {id:"2", description:"4 ft man gate", qty:1, unit:"ea", unitPrice:900, internalCost:0, taxCode:"GST"},
        {id:"3", description:"3 ft man gate", qty:1, unit:"ea", unitPrice:900, internalCost:0, taxCode:"GST"},
        {id:"4", description:"Additional helper / demo labour allowance", qty:1, unit:"allowance", unitPrice:480, internalCost:0, taxCode:"GST"}
      ],
      payments:[]
    }
  ],
  expenses: [],
  mileage: [],
  ledger: [],
  bankTransactions: [],
  receipts: [],
  activity: [
    {id:"a1", at:"2026-09-22T09:50:00-07:00", type:"system", text:"Forsyth Business workspace created."}
  ]
};
