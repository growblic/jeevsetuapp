// Simple front-end data handling using localStorage
const STORAGE_KEY = "jeevsetu_data_v1";

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) return JSON.parse(raw);
  // default sample data
  return {
    animals: [
      { tag: "C001", name: "Ganga", type: "Cow", age: 4, breed: "Sahiwal", notes: "" },
      { tag: "B001", name: "Bhavani", type: "Buffalo", age: 5, breed: "Murrah", notes: "" }
    ],
    production: [
      // {date: "2025-11-01", tag:"C001", qty: 6.5}
    ]
  };
}

function saveData(d){ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

const state = loadData();
saveData(state);

// utility
function el(sel){ return document.querySelector(sel); }
function els(sel){ return Array.from(document.querySelectorAll(sel)); }

// Populate animals table
function renderAnimals(){
  const tb = el("#animalsTable tbody");
  if(!tb) return;
  tb.innerHTML = "";
  const q = (el("#search")?.value || "").toLowerCase();
  state.animals.filter(a => (a.name + a.tag + a.type + a.breed).toLowerCase().includes(q))
    .forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${a.tag}</td><td>${a.name}</td><td>${a.type}</td><td>${a.age}</td><td>${a.breed}</td><td>${a.notes}</td>`;
      tb.appendChild(tr);
    });
}

// Add animal modal logic
function wireAnimalForm(){
  const addBtn = el("#addAnimalBtn");
  if(!addBtn) return;
  const modal = el("#formWrap");
  addBtn.onclick = ()=> modal.classList.remove("hidden");
  el("#cancelAnimal").onclick = ()=> modal.classList.add("hidden");
  el("#saveAnimal").onclick = ()=>{
    const tag = el("#tag").value.trim();
    if(!tag){ alert("Tag zaroori hai"); return; }
    const a = {
      tag,
      name: el("#name").value.trim(),
      type: el("#type").value,
      age: Number(el("#age").value) || 0,
      breed: el("#breed").value.trim(),
      notes: el("#notes").value.trim()
    };
    state.animals.push(a);
    saveData(state);
    modal.classList.add("hidden");
    renderAnimals();
    populateAnimalSelect();
  };
  el("#search")?.addEventListener("input", renderAnimals);
}

// Production page functions
function populateAnimalSelect(){
  const sel = el("#selectAnimal");
  if(!sel) return;
  sel.innerHTML = "";
  state.animals.forEach(a=>{
    const opt = document.createElement("option");
    opt.value = a.tag;
    opt.textContent = `${a.tag} — ${a.name}`;
    sel.appendChild(opt);
  });
}

function renderProduction(){
  const tb = el("#prodTable tbody");
  if(!tb) return;
  tb.innerHTML = "";
  (state.production || []).slice().reverse().forEach(p=>{
    const animal = state.animals.find(a=>a.tag===p.tag) || {name:'-', tag:p.tag};
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.date}</td><td>${p.tag}</td><td>${animal.name}</td><td>${p.qty}</td>`;
    tb.appendChild(tr);
  });
}

function wireProduction(){
  const saveBtn = el("#saveProduction");
  if(!saveBtn) return;
  saveBtn.onclick = ()=>{
    const tag = el("#selectAnimal").value;
    const date = el("#prodDate").value || new Date().toISOString().slice(0,10);
    const qty = Number(el("#prodQty").value) || 0;
    if(!tag){ alert("Animal select karein"); return; }
    state.production = state.production || [];
    state.production.push({date, tag, qty});
    saveData(state);
    renderProduction();
    renderReports();
  };
}

// Reports
function renderReports(){
  const sumWrap = el("#summary");
  const dailyWrap = el("#daily");
  if(!sumWrap) return;
  const total = (state.production || []).reduce((s,p)=>s + Number(p.qty || 0), 0);
  sumWrap.innerHTML = `<p>Total milk recorded: <strong>${total} L</strong></p>`;
  const byDay = {};
  (state.production || []).forEach(p=>{
    byDay[p.date] = (byDay[p.date] || 0) + Number(p.qty || 0);
  });
  dailyWrap.innerHTML = "<ul>" + Object.keys(byDay).sort().map(d=>`<li>${d}: ${byDay[d]} L</li>`).join("") + "</ul>";
}

// Generic init
document.addEventListener("DOMContentLoaded", ()=>{
  renderAnimals();
  wireAnimalForm();
  populateAnimalSelect();
  renderProduction();
  wireProduction();
  renderReports();
});
