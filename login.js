// login.js — VEERA Login Page Logic
const DEMO_PROFILES = {
  farmer: {
    role:'farmer',id:'farmer-1',name:'Arun Kumar',
    title:'Progressive Organic Horticulturalist & Soil Health Advocate',
    avatar:'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
    location:'Coimbatore, Tamil Nadu',farmSize:'4.5 Acres',experience:'12 Years',
    phone:'+91 98421 77320',email:'arun.farm@veeramail.in',
    crops:['Tomato (Shimla Hybrid)','Tender Coconut','Robusta Banana','Moringa'],
    bio:'Third-generation farmer practicing sustainable precision drip agriculture and soil rejuvenation.'
  },
  buyer:{
    role:'buyer',id:'buyer-1',name:'Priya Sharma',
    title:'Procurement Head — FreshBasket Organics',
    avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    location:'Bengaluru, Karnataka',buyerType:'Organic Retail Store',
    phone:'+91 80221 33400',email:'priya@freshbasket.in',
    interests:['Vegetables','Fruits','Grains'],
    bio:'Sourcing premium certified organic produce for retail and HORECA distribution.'
  }
};

document.addEventListener('DOMContentLoaded',()=>{
  try{
    const stored=localStorage.getItem('veera_currentUser');
    if(stored){
      const user=JSON.parse(stored);
      if(user&&user.name){
        document.getElementById('activeSessionBar').classList.add('visible');
        document.getElementById('sessionUserName').textContent=user.name;
        document.getElementById('sessionUserRole').textContent=user.role==='farmer'?'Farmer':'Buyer';
      }
    }
  }catch(e){}
});

function selectLoginRole(role){
  const isFarmer = (role === 'farmer');
  const tabF = document.getElementById('tabFarmer');
  const tabB = document.getElementById('tabBuyer');
  const paneF = document.getElementById('paneFarmer');
  const paneB = document.getElementById('paneBuyer');
  const stripe = document.getElementById('cardStripe');

  if(tabF) tabF.classList.toggle('active', isFarmer);
  if(tabB) tabB.classList.toggle('active', !isFarmer);
  if(paneF) paneF.style.display = isFarmer ? 'block' : 'none';
  if(paneB) paneB.style.display = !isFarmer ? 'block' : 'none';
  if(stripe){
    if(isFarmer) stripe.classList.remove('buyer-stripe');
    else stripe.classList.add('buyer-stripe');
  }
}

function quickLogin(role){
  const user={...DEMO_PROFILES[role]};
  localStorage.setItem('veera_currentUser',JSON.stringify(user));
  showToast(role==='farmer'?'Signed in as Arun Kumar (Farmer)':'Signed in as Priya Sharma (Buyer)','success');
  setTimeout(()=>{ window.location.href='index.html'; },900);
}

function handleLogin(event,role){
  event.preventDefault();
  let user;
  if(role==='farmer'){
    const name=document.getElementById('farmerName').value.trim();
    const loc=document.getElementById('farmerLoc').value.trim();
    const size=document.getElementById('farmerSize').value.trim();
    const contact=document.getElementById('farmerContact').value.trim();
    user={role:'farmer',id:'cust-farmer-'+Date.now(),name,title:'Registered Farmer',
      avatar:'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      location:loc,farmSize:size,experience:'5+ Years',phone:contact,
      email:name.toLowerCase().replace(/\s+/g,'')+'@veeramail.in',
      crops:['Seasonal Produce'],bio:`Progressive farmer managing ${size} in ${loc}.`};
    showToast(`Welcome ${name}! Signed in as Farmer.`,'success');
  } else {
    const name=document.getElementById('buyerName').value.trim();
    const type=document.getElementById('buyerType').value;
    const loc=document.getElementById('buyerLoc').value.trim();
    const contact=document.getElementById('buyerContact').value.trim();
    user={role:'buyer',id:'cust-buyer-'+Date.now(),name,title:type,
      avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      location:loc,buyerType:type,
      phone:contact.includes('@')?'+91 98000 00000':contact,
      email:contact.includes('@')?contact:name.toLowerCase().replace(/\s+/g,'')+'@buyer.in',
      interests:['Vegetables','Fruits','Grains'],
      bio:`Sourcing quality farm produce for ${type} in ${loc}.`};
    showToast(`Welcome ${name}! Signed in as Buyer.`,'success');
  }
  localStorage.setItem('veera_currentUser',JSON.stringify(user));
  setTimeout(()=>{ window.location.href='index.html'; },900);
}

function showToast(message,type='success'){
  const container=document.getElementById('toastContainer');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.textContent=message;
  container.appendChild(t);
  setTimeout(()=>t.remove(),3500);
}
