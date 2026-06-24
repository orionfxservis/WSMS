// Customer form logic
let customers=[
  {id:'CUST-0001',name:'Ali Hassan',phone:'0300-1234567',address:'Gulshan Block 10',rate:'150'},
  {id:'CUST-0002',name:'Fatima Malik',phone:'0321-7654321',address:'DHA Phase 2',rate:'150'},
  {id:'CUST-0003',name:'Umar Farooq',phone:'0333-9876543',address:'Clifton Block 5',rate:'160'},
  {id:'CUST-0004',name:'Sara Ahmed',phone:'0312-1112233',address:'PECHS Block 2',rate:'140'},
  {id:'CUST-0005',name:'Bilal Sheikh',phone:'0345-5566778',address:'Nazimabad No.3',rate:'150'},
  {id:'CUST-0006',name:'Zainab Raza',phone:'0301-4455667',address:'Korangi Sector 15',rate:'145'},
];
let custCounter=7;
let editingCustId=null;
function genCustId(){return 'CUST-'+String(custCounter).padStart(4,'0');}
function refreshCustIdDisplay(){document.getElementById('cust-id-display').textContent='Customer ID: '+(editingCustId||genCustId());}
refreshCustIdDisplay();renderCustTable();
function saveCustomer(){
  const name=document.getElementById('cust-name').value.trim();
  const phone=document.getElementById('cust-phone').value.trim();
  const address=document.getElementById('cust-address').value.trim();
  const cane=document.getElementById('cust-cane').value.trim();
  const caneAssign=document.getElementById('cust-cane-assign').value.trim();
  const rate=document.getElementById('cust-rate').value.trim();
  if(!name){alert('Customer Name is required.');return;}
  if(editingCustId){
    const c=customers.find(x=>x.id===editingCustId);
    if(c){c.name=name;c.phone=phone;c.address=address;c.cane=cane;c.caneAssign=caneAssign;c.rate=rate;}
    editingCustId=null;
  } else {
    customers.push({id:genCustId(),name,phone,address,cane,caneAssign,rate});
    custCounter++;
  }
  clearCustomerForm();renderCustTable();
}
function clearCustomerForm(){
  ['cust-name','cust-phone','cust-address','cust-cane','cust-cane-assign','cust-rate'].forEach(id=>document.getElementById(id).value='');
  editingCustId=null;refreshCustIdDisplay();
}
function editCustomer(id){
  const c=customers.find(x=>x.id===id);if(!c)return;
  document.getElementById('cust-name').value=c.name;
  document.getElementById('cust-phone').value=c.phone;
  document.getElementById('cust-address').value=c.address;
  document.getElementById('cust-cane').value=c.cane||'';
  document.getElementById('cust-cane-assign').value=c.caneAssign||'';
  document.getElementById('cust-rate').value=c.rate;
  editingCustId=id;refreshCustIdDisplay();
  document.getElementById('cust-id-display').textContent='Customer ID: '+id+' (Editing)';
}
function deleteCustomer(id){
  if(!confirm('Delete this customer?'))return;
  customers=customers.filter(x=>x.id!==id);renderCustTable();
}
function renderCustTable(){
  const tbody=document.getElementById('cust-tbody');
  if(!customers.length){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--muted);font-size:.875rem;">No customers yet. Add one above.</td></tr>';return;}
  tbody.innerHTML=customers.map((c,i)=>`
    <tr style="background:${i%2===0?'#fff':'#f8fafc'}">
      <td style="padding:.6rem 1rem;font-size:.82rem;font-weight:600;color:var(--primary);">${c.id}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">${c.name}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">${c.phone||'—'}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">${c.address||'—'}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">${c.cane||'—'}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">${c.caneAssign||'—'}</td>
      <td style="padding:.6rem 1rem;font-size:.82rem;">₨ ${c.rate||'0'}</td>
      <td style="padding:.6rem 1rem;">
        <button onclick="editCustomer('${c.id}')" style="padding:.25rem .6rem;font-size:.75rem;border:1px solid var(--primary);color:var(--primary);background:#fff;border-radius:5px;cursor:pointer;margin-right:.3rem;">Edit</button>
        <button onclick="deleteCustomer('${c.id}')" style="padding:.25rem .6rem;font-size:.75rem;border:1px solid var(--danger);color:var(--danger);background:#fff;border-radius:5px;cursor:pointer;">Delete</button>
      </td>
    </tr>`).join('');
}
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const vals=[210,280,320,290,350,348,400,380,420,390,360,410];

const weeklyLabels=['1st Week','2nd Week','3rd Week','4th Week'];
const weeklyVals=[85,92,78,93];

function buildBarChart(){
  const c=document.getElementById('bar-chart');if(!c)return;
  const tf = document.getElementById('chart-timeframe');
  const type = tf ? tf.value : 'monthly';
  
  const labels = type === 'monthly' ? months : weeklyLabels;
  const data = type === 'monthly' ? vals : weeklyVals;
  const count = type === 'monthly' ? 6 : 4;
  
  const dispLabels = labels.slice(0, count);
  const dispData = data.slice(0, count);
  const max=Math.max(...dispData);
  
  c.innerHTML=dispData.map((v,i)=>`
    <div class="bar-wrap">
      <div class="bar-val">${v}</div>
      <div class="bar" style="height:${(v/max*110)}px;background:${i===dispData.length-1?'var(--accent)':'var(--primary)'}"></div>
      <div class="bar-label">${dispLabels[i]}</div>
    </div>`).join('');
}
buildBarChart();

function scrollToAuth(){
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
}
function doLogin(){
  var landing = document.getElementById('landing');
  if(landing) landing.style.display='none';
  var auth = document.getElementById('auth');
  if(auth) auth.style.display='none';
  var dash = document.getElementById('dashboard');
  if(dash) dash.style.display='flex';
}
function switchAuthTab(t){
  document.querySelectorAll('.auth-tab').forEach((el,i)=>{el.classList.toggle('active',i===(t==='login'?0:1));});
  document.getElementById('panel-login').classList.toggle('active',t==='login');
  document.getElementById('panel-signup').classList.toggle('active',t==='signup');
}
function setType(el){document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');}
function showSection(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('section-'+id).classList.add('active');
  el.classList.add('active');
  const titles={overview:'Dashboard',customers:'Customers',deliveries:'Deliveries',inventory:'Inventory',expenses:'Expenses',stations:'Stations',reports:'Reports',settings:'Settings'};
  document.getElementById('topbar-title').textContent=titles[id]||id;
}
function openModal(){document.getElementById('modal').classList.add('open');}
function closeModal(){document.getElementById('modal').classList.remove('open');}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal();});

function openModalInventory() {
  const d = new Date();
  document.getElementById('inv-date').value = d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
  document.getElementById('inv-12l-nos').value = '';
  document.getElementById('inv-12l-price').value = '';
  document.getElementById('inv-19l-nos').value = '';
  document.getElementById('inv-19l-price').value = '';
  document.getElementById('modal-inventory').classList.add('open');
}
function closeModalInventory() {
  document.getElementById('modal-inventory').classList.remove('open');
}
document.getElementById('modal-inventory').addEventListener('click', function(e) {
  if (e.target === this) closeModalInventory();
});

function saveInventory() {
  const date = document.getElementById('inv-date').value;
  const nos12 = parseInt(document.getElementById('inv-12l-nos').value) || 0;
  const price12 = document.getElementById('inv-12l-price').value;
  const nos19 = parseInt(document.getElementById('inv-19l-nos').value) || 0;
  const price19 = document.getElementById('inv-19l-price').value;
  
  if(nos12 === 0 && nos19 === 0) {
    closeModalInventory();
    return;
  }
  
  // update stock
  let stock19El = document.getElementById('stock-19l');
  let stock12El = document.getElementById('stock-12l');
  
  let current19 = parseInt(stock19El.innerText.replace(/,/g, '')) || 0;
  let current12 = parseInt(stock12El.innerText.replace(/,/g, '')) || 0;
  
  stock19El.innerText = (current19 + nos19).toLocaleString();
  stock12El.innerText = (current12 + nos12).toLocaleString();
  
  if(price19) document.getElementById('price-19l').innerText = '₨ ' + price19;
  if(price12) document.getElementById('price-12l').innerText = '₨ ' + price12;
  
  closeModalInventory();
}
