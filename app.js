
// ---------- Google Analytics 4 ----------
// Replace G-XXXXXXXXXX with your Spendly GA4 Measurement ID.
// No name, note, income source, or subcategory text is sent to Analytics.
const GA_ID="G-44MRTP3RL2";
function initGA(){
  if(!/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID==="G-XXXXXXXXXX") return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments)};
  gtag("js",new Date());
  gtag("config",GA_ID,{send_page_view:true});
  const s=document.createElement("script");
  s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_ID);
  document.head.appendChild(s);
}
function track(event,params={}){
  if(typeof window.gtag==="function") gtag("event",event,params);
}
initGA();


const KEY="spendly_v1";
const CATS=["Fixed Fees","Transportation","Food","Family","Shopping","Entertainment","Installments"];
const fresh={profile:{name:"",onboarded:false},income:{},budgets:{},subcats:{Savings:[]},tx:[]};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(fresh);
let page="home", month=new Date().toISOString().slice(0,7), modal=null;
const today=()=>new Date().toISOString().slice(0,10);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();

function normalizeIncome(){
  if(!state.incomes) state.incomes=[];
  if(state.income){
    Object.entries(state.income).forEach(([m,v])=>{
      const amount=Number(v||0);
      if(amount && !state.incomes.some(x=>x.migratedMonth===m)){
        state.incomes.push({id:uid(),date:m+"-01",amount,source:"",migratedMonth:m});
      }
    });
    delete state.income;
    save();
  }
}

normalizeIncome();
const money=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2})+" SAR";
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function range(m){let [y,mo]=m.split("-").map(Number);return [m+"-01",new Date(y,mo,0).toISOString().slice(0,10)]}
function data(from,to){
 let rows=state.tx.filter(x=>x.date>=from&&x.date<=to), incomes=(state.incomes||[]).filter(x=>x.date>=from&&x.date<=to),expenses=0,savings=0,by={};
 rows.forEach(x=>{if(x.type==="Expense"){expenses+=x.amount;by[x.category]=(by[x.category]||0)+x.amount}if(x.type==="Savings")savings+=x.amount});
 let income=incomes.reduce((a,x)=>a+Number(x.amount||0),0);
 return{rows,incomes,income,expenses,savings,by}
}
function go(x){page=x;modal=null;render()}
function picker(){return `<input type="month" value="${month}" onchange="month=this.value;render()">`}
function nav(){return `<div class="bottom"><div class="nav">
<button class="${page==="home"?"active":""}" onclick="go('home')"><span class="navicon">⌂</span><span>Home</span></button>
<button class="${page==="transactions"?"active":""}" onclick="go('transactions')"><span class="navicon">☷</span><span>Transactions</span></button>
<button onclick="openAdd()"><div class="plus">+</div><span>Add</span></button>
<button class="${page==="budgets"?"active":""}" onclick="go('budgets')"><span class="navicon">◉</span><span>Budgets</span></button>
<button class="${page==="profile"?"active":""}" onclick="go('profile')"><span class="navicon">♙</span><span>Profile</span></button></div></div>`}
function stat(k,v){return `<div class="card stat"><span class="muted">${k}</span><b>${money(v)}</b></div>`}
function home(){
 let defaultRange=range(month), f=window.homeFrom||defaultRange[0], t=window.homeTo||defaultRange[1], d=data(f,t);
 let months=[]; let cur=new Date(f+"T00:00:00"), last=new Date(t+"T00:00:00");
 while(cur<=last){months.push(cur.toISOString().slice(0,7));cur.setMonth(cur.getMonth()+1)}
 let inc=d.income, available=inc-d.expenses-d.savings;
 let budget={}; months.forEach(m=>{let b=state.budgets[m]||{};CATS.forEach(c=>budget[c]=(budget[c]||0)+Number(b[c]||0))});
 return `<div class="top"><div><div class="muted">Welcome back</div><div class="brand">${esc(state.profile.name||"Spendly")}</div></div></div>
 <div class="card range-card"><div class="row mobile-stack"><div class="field" style="flex:1"><label>From</label><input id="hfrom" type="date" value="${f}" max="${t}" onchange="syncHomeDates()"></div><div class="field" style="flex:1"><label>To</label><input id="hto" type="date" value="${t}" min="${f}" onchange="syncHomeDates()"></div><button class="btn" onclick="applyHomeRange()">Apply filter</button><button class="btn secondary" onclick="resetHomeRange()">This month</button></div></div>
 <div class="card hero"><div class="muted">Available balance for selected period</div><h1>${money(available)}</h1><div class="muted">Income − Expenses − Savings</div><button class="btn secondary" style="margin-top:12px" onclick="openIncome()">Manage income</button></div>
 <h3 class="section">Selected period</h3><div class="grid stats">${stat("Income",inc)}${stat("Expenses",d.expenses)}${stat("Savings",d.savings)}${stat("Remaining",available)}</div>
 <h3 class="section">Spending by category</h3><div class="card bars">${CATS.map(c=>{let s=d.by[c]||0,lim=Number(budget[c]||0),p=lim?Math.min(100,s/lim*100):0;return `<div class="barrow ${lim&&s>lim?"over":""}"><div class="row between"><b>${c}</b><span>${money(s)}${lim?" / "+money(lim):""}</span></div>${lim?`<div class="track"><div class="fill" style="width:${p}%"></div></div><div class="small muted">${s>lim?"Over by "+money(s-lim):money(lim-s)+" remaining"}</div>`:`<div class="small muted">No budget set</div>`}</div>`}).join("")}</div>
 <h3 class="section">Recent transactions</h3>${txList(d.rows.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6))}`}
function applyHomeRange(){
  const from=document.querySelector("#hfrom").value;
  const to=document.querySelector("#hto").value;
  if(!from||!to)return alert("Please select both From and To dates.");
  if(from>to)return alert("From date must be before or equal to To date.");
  window.homeFrom=from;
  window.homeTo=to;
  track("date_filter_applied",{screen:"home",range_days:Math.round((new Date(to)-new Date(from))/86400000)+1});
  render();
}
function resetHomeRange(){
  const [from,to]=range(month);
  window.homeFrom=from;
  window.homeTo=to;
  track("this_month_selected",{screen:"home"});
  render();
}
function txList(rows){if(!rows.length)return `<div class="card empty">No transactions yet.</div>`;return `<div class="card list">${rows.map(x=>`<div class="item" onclick="editTx('${x.id}')"><div><b>${esc(x.subcategory||x.type)}</b><div class="small muted">${x.date} · ${x.type}${x.category?" · "+esc(x.category):""}</div>${x.note?`<div class="small">${esc(x.note)}</div>`:""}</div><div class="amount ${x.type==="Expense"?"expense":"saving"}">−${money(x.amount)}</div></div>`).join("")}</div>`}
function groupedTx(rows){
 let groups={};CATS.forEach(c=>groups[c]=[]);
 rows.filter(x=>x.type==="Expense").forEach(x=>(groups[x.category]||(groups[x.category]=[])).push(x));
 let extras=rows.filter(x=>x.type==="Savings");
 return `<div class="category-groups">${CATS.map(c=>{let arr=groups[c]||[],total=arr.reduce((a,x)=>a+x.amount,0);return `<div class="card catgroup"><button class="cathead" onclick="toggleCat('${c.replace(/'/g,"\\'")}')"><div><b>${c}</b><div class="small muted">${arr.length} transaction${arr.length===1?"":"s"}</div></div><div class="cat-amount">${money(total)}</div><div></div><span class="expand" id="icon-${c.replace(/\s/g,'-')}">+</span></button><div class="catbody" id="cat-${c.replace(/\s/g,'-')}" hidden>${arr.length?txList(arr.sort((a,b)=>b.date.localeCompare(a.date))):`<div class="empty">No spending in this category.</div>`}</div></div>`}).join("")}${extras.length?`<div class="card catgroup"><button class="cathead" onclick="toggleCat('Savings')"><div><b>Savings</b><div class="small muted">${extras.length} entries · ${money(extras.reduce((a,x)=>a+x.amount,0))}</div></div><span class="expand" id="icon-Savings">+</span></button><div class="catbody" id="cat-Savings" hidden>${txList(extras.sort((a,b)=>b.date.localeCompare(a.date)))}</div></div>`:""}</div>`
}
function toggleCat(c){let key=c.replace(/\s/g,"-"),el=document.getElementById("cat-"+key),ic=document.getElementById("icon-"+key);if(!el)return;el.hidden=!el.hidden;if(ic)ic.textContent=el.hidden?"+":"−";if(!el.hidden)track("category_expanded",{category:c})}
function transactions(){let [f,t]=range(month),d=data(f,t);return `<div class="top"><div><div class="brand">Transactions</div><div class="muted">Open a category to see what you spent</div></div></div><div class="card tx-total"><div class="muted">Total expenses</div><div class="tx-total-number">${money(d.expenses)}</div></div><div class="card"><div class="row mobile-stack"><div class="field" style="flex:1"><label>From</label><input id="from" type="date" value="${f}" max="${t}" onchange="syncTxDates()"></div><div class="field" style="flex:1"><label>To</label><input id="to" type="date" value="${t}" min="${f}" onchange="syncTxDates()"></div><button class="btn" onclick="filterTx()">Apply</button></div><div id="results">${groupedTx(d.rows)}</div></div>`}
function syncHomeDates(){
  const f=document.querySelector("#hfrom"),t=document.querySelector("#hto");
  if(f&&t){f.max=t.value;t.min=f.value;}
}
function syncTxDates(){
  const f=document.querySelector("#from"),t=document.querySelector("#to");
  if(f&&t){f.max=t.value;t.min=f.value;}
}
function filterTx(){
  const f=document.querySelector("#from").value;
  const t=document.querySelector("#to").value;
  if(!f||!t)return alert("Please select both From and To dates.");
  if(f>t)return alert("From date must be before or equal to To date.");
  const d=data(f,t);
  document.querySelector("#results").innerHTML=groupedTx(d.rows);
  document.querySelector(".tx-total-number").textContent=money(d.expenses);
  track("date_filter_applied",{screen:"transactions",range_days:Math.round((new Date(t)-new Date(f))/86400000)+1});
}
let budgetEditing=false;
function budgets(){let b=state.budgets[month]||{};return `<div class="top"><div><div class="brand">Budgets</div><div class="muted">Monthly category limits</div></div>${picker()}</div><div class="card"><div class="row between"><b>${month}</b><button class="btn ${budgetEditing?"secondary":""}" onclick="budgetEditing=!budgetEditing;render()">${budgetEditing?"Cancel":"Edit budgets"}</button></div>${CATS.map(c=>`<div class="field"><label>${c}</label><input class="budget-input" data-cat="${c}" type="number" min="0" step=".01" value="${b[c]||""}" placeholder="No budget" ${budgetEditing?"":"disabled"}></div>`).join("")}${budgetEditing?`<button class="btn" onclick="saveBudgets()">Save budgets</button>`:""}</div>`}
function saveBudgets(){state.budgets[month]=state.budgets[month]||{};document.querySelectorAll(".budget-input").forEach(i=>state.budgets[month][i.dataset.cat]=Number(i.value||0));save();track("budgets_saved",{month:month});budgetEditing=false;render()}
function setBudget(c,v){state.budgets[month]=state.budgets[month]||{};state.budgets[month][c]=Number(v||0);save();render()}
function profile(){return `<div class="top"><div><div class="brand">Profile</div><div class="muted">Preferences & saved subcategories</div></div></div><div class="card"><div class="field"><label>Your name</label><input id="pn" value="${esc(state.profile.name)}"></div><button class="btn" onclick="state.profile.name=document.querySelector('#pn').value.trim();save();alert('Changes saved')">Save</button><button class="btn secondary" onclick="state.profile.onboarded=false;save();render()">Replay tutorial</button></div><h3 class="section">Saved subcategories</h3><div class="card">${CATS.map(c=>`<p><b>${c}</b><br><span class="small muted">${(state.subcats[c]||[]).map(esc).join(", ")||"None yet"}</span></p>`).join("")}</div>`}
function openIncome(){modal={kind:"income"};render()}
function incomeSheet(){
 let entries=(state.incomes||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
 return `<div class="modal"><div class="sheet"><div class="row between"><h2>Income</h2><button class="btn secondary" onclick="modal=null;render()">Close</button></div>
 <p class="muted">Add one or more income sources. Source is optional.</p>
 <div class="field"><label>Date</label><input id="idate" type="date" value="${today()}"></div>
 <div class="field"><label>Amount (SAR)</label><input id="iamount" type="number" min="0" step=".01" placeholder="0"></div>
 <div class="field"><label>Source (optional)</label><input id="isource" placeholder="e.g. Salary, Freelance, Bonus"></div>
 <button class="btn" onclick="addIncome()">Add income</button>
 <h3 class="section">Income history</h3>
 ${entries.length?`<div class="list">${entries.map(x=>`<div class="item"><div><b>${esc(x.source||"Income")}</b><div class="small muted">${x.date}</div></div><div class="row"><div class="amount saving">+${money(x.amount)}</div><button class="btn secondary" onclick="editIncome('${x.id}')">Edit</button></div></div>`).join("")}</div>`:`<div class="empty">No income added yet.</div>`}
 </div></div>`
}
function addIncome(){
 let date=document.querySelector("#idate").value,amount=Number(document.querySelector("#iamount").value),source=document.querySelector("#isource").value.trim();
 if(!date||!amount)return alert("Date and amount are required.");
 state.incomes=state.incomes||[];state.incomes.push({id:uid(),date,amount,source});save();track("income_added",{has_source:!!source});render()
}
function editIncome(id){
 let x=(state.incomes||[]).find(a=>a.id===id);if(!x)return;
 modal={kind:"editIncome",x};render()
}
function editIncomeSheet(){
 let x=modal.x;
 return `<div class="modal"><div class="sheet"><h2>Edit income</h2>
 <div class="field"><label>Date</label><input id="eidate" type="date" value="${x.date}"></div>
 <div class="field"><label>Amount (SAR)</label><input id="eiamount" type="number" min="0" step=".01" value="${x.amount}"></div>
 <div class="field"><label>Source (optional)</label><input id="eisource" value="${esc(x.source||"")}"></div>
 <div class="row"><button class="btn" onclick="saveIncomeEdit('${x.id}')">Save changes</button><button class="btn danger" onclick="deleteIncome('${x.id}')">Delete</button><button class="btn secondary" onclick="modal={kind:'income'};render()">Cancel</button></div>
 </div></div>`
}
function saveIncomeEdit(id){
 let x=(state.incomes||[]).find(a=>a.id===id);if(!x)return;
 let amount=Number(document.querySelector("#eiamount").value),date=document.querySelector("#eidate").value;
 if(!date||!amount)return alert("Date and amount are required.");
 x.date=date;x.amount=amount;x.source=document.querySelector("#eisource").value.trim();save();track("income_edited");modal={kind:"income"};render()
}
function deleteIncome(id){if(confirm("Delete this income?")){state.incomes=(state.incomes||[]).filter(x=>x.id!==id);save();track("income_deleted");modal={kind:"income"};render()}}
function openAdd(type="Expense",x=null){modal={kind:"add",type,x};render()}
function editTx(i){let x=state.tx.find(a=>a.id===i);if(x)openAdd(x.type,x)}
function addSheet(){let x=modal.x||{},type=modal.type,cat=x.category||CATS[0],subs=state.subcats[cat]||[];return `<div class="modal"><div class="sheet"><div class="row between"><h2>${x.id?"Edit":"Add"} transaction</h2><button class="btn secondary" onclick="modal=null;render()">Close</button></div><div class="chips">${["Expense","Savings"].map(t=>`<button class="chip ${type===t?"active":""}" onclick="modal.type='${t}';render()">${t}</button>`).join("")}</div>
<div class="field"><label>Date</label><input id="date" type="date" value="${x.date||today()}"></div><div class="field"><label>Amount (SAR)</label><input id="amount" type="number" min="0" step=".01" value="${x.amount||""}"></div>
${type==="Expense"?`<div class="field"><label>Category</label><select id="cat" onchange="modal.x={...(modal.x||{}),category:this.value};render()">${CATS.map(c=>`<option ${c===cat?"selected":""}>${c}</option>`).join("")}</select></div><div class="field"><label>Subcategory (optional)</label><input id="sub" list="sublist" value="${esc(x.subcategory||"")}" placeholder="Type or choose a saved subcategory"><datalist id="sublist">${subs.map(s=>`<option value="${esc(s)}">`).join("")}</datalist><div class="small muted">Type a new one once; it will be saved here for next time.</div></div>`:`<div class="field"><label>Savings type</label><input id="savetype" list="sl" value="${esc(x.subcategory||"")}" placeholder="e.g. جمعية, Emergency Fund"><datalist id="sl">${(state.subcats.Savings||[]).map(s=>`<option value="${esc(s)}">`).join("")}</datalist></div>`}
<div class="field"><label>Note (optional)</label><textarea id="note">${esc(x.note||"")}</textarea></div><div class="row"><button class="btn" onclick="saveTx('${x.id||""}')">${x.id?"Save changes":"Add"}</button>${x.id?`<button class="btn danger" onclick="deleteTx('${x.id}')">Delete</button>`:""}</div></div></div>`}
function saveTx(existing){let amount=Number(document.querySelector("#amount").value),date=document.querySelector("#date").value;if(!amount||!date)return alert("Date and amount are required.");let x={id:existing||uid(),type:modal.type,date,amount,note:document.querySelector("#note").value.trim()};if(x.type==="Expense"){x.category=document.querySelector("#cat").value;x.subcategory=document.querySelector("#sub").value.trim();state.subcats[x.category]=state.subcats[x.category]||[];if(x.subcategory&&!state.subcats[x.category].includes(x.subcategory))state.subcats[x.category].push(x.subcategory)}else{x.subcategory=document.querySelector("#savetype").value.trim()||"Savings";if(!state.subcats.Savings.includes(x.subcategory))state.subcats.Savings.push(x.subcategory)}let i=state.tx.findIndex(a=>a.id===existing);if(i>=0){state.tx[i]=x;track("transaction_edited",{transaction_type:x.type,category:x.type==="Expense"?x.category:"Savings"});}
else{state.tx.push(x);track(x.type==="Expense"?"expense_added":"savings_added",{category:x.type==="Expense"?x.category:"Savings",has_subcategory:!!x.subcategory});}
save();modal=null;render()}
function deleteTx(i){if(confirm("Delete this transaction?")){let old=state.tx.find(x=>x.id===i);state.tx=state.tx.filter(x=>x.id!==i);save();track("transaction_deleted",{transaction_type:old?.type||"unknown"});modal=null;render()}}
function onboarding(){if(state.profile.onboarded)return "";if(!state.profile.name)return `<div class="modal"><div class="sheet"><h2>Welcome 👋</h2><p class="muted">What should we call you?</p><div class="field"><label>Your name</label><input id="on"></div><button class="btn" onclick="let n=document.querySelector('#on').value.trim();if(n){state.profile.name=n;save();render()}">Continue</button></div></div>`;return `<div class="modal"><div class="sheet"><h2>Quick setup</h2><div class="tour"><b>1. Add your income 💰</b><div class="small muted">Set the money available for the month.</div></div><div class="tour"><b>2. Add expenses by date</b><div class="small muted">Choose date, amount, category and subcategory.</div></div><div class="tour"><b>3. Track Savings separately</b><div class="small muted">Savings reduce available balance but do not count as expenses.</div></div><div class="tour"><b>4. Set category budgets</b><div class="small muted">See planned vs actual spending.</div></div><button class="btn" onclick="state.profile.onboarded=true;save();track("onboarding_completed");modal={kind:'income'};render()">Start tracking</button></div></div>`}
function render(){let body=page==="home"?home():page==="transactions"?transactions():page==="budgets"?budgets():profile();document.querySelector("#app").innerHTML=`<main class="shell">${body}</main>${nav()}${onboarding()}${modal?.kind==="add"?addSheet():""}${modal?.kind==="income"?incomeSheet():""}${modal?.kind==="editIncome"?editIncomeSheet():""}`}
render();
