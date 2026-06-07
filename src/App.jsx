import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PASTEL={name:"pastel",bg:"#FDF6FB",surface:"#FFF0F7",card:"#FFFFFF",sidebar:"#F9E8F5",sidebarBorder:"#EEC8E8",accent:"#D46FAC",accentLight:"#F7C8E8",accentText:"#A3347A",text:"#3D1F35",textMuted:"#9B6A87",border:"#EDD5E8",badge:"#F4DAEF",badgeText:"#8B3B72",progress:"#E991CC",highlight:"#FDE8F5",navActive:"#F7C8E8",navActiveText:"#8B3B72",subjectColors:["#F8B4D9","#C3B1E1","#B5EAD7","#FFDAC1","#B5D5F5","#F9C9C9","#CBE4C4"],subjectText:["#8B3B72","#5B3E8F","#2A7D5A","#A85D00","#1A5FAD","#9B2828","#3D6B2A"]};
const EARTHY={name:"earthy",bg:"#F5F0E8",surface:"#EDE5D8",card:"#FDFAF5",sidebar:"#EAE0CE",sidebarBorder:"#C8B89A",accent:"#7C6248",accentLight:"#D4BFA0",accentText:"#5C3D1E",text:"#2C1F0E",textMuted:"#7A6248",border:"#D4C4A8",badge:"#E8DCC8",badgeText:"#5C3D1E",progress:"#A68060",highlight:"#F0E8D5",navActive:"#D4BFA0",navActiveText:"#5C3D1E",subjectColors:["#D4A574","#B5C99A","#A8C4C8","#D4B896","#C4A8B8","#B8C4A0","#C8B084"],subjectText:["#5C3D1E","#3A5A1E","#1E4A50","#5C3D1E","#4A2848","#2A4A1E","#4A3808"]};

const SUBJECTS=["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"];
const TOPICS={FAR:["Cash & Cash Equivalents","Receivables","Inventories","PPE","Intangibles","Investments","Liabilities","Equity","Revenue Recognition","Leases"],AFAR:["Business Combination","Consolidation","Foreign Currency","Joint Arrangement","Government Accounting","Liquidation","Installment Sales"],MAS:["Cost Concepts","CVP Analysis","Budgeting","Standard Costing","Variance Analysis","Decision Making","Transfer Pricing","Performance Evaluation"],RFBT:["Law on Obligations","Law on Contracts","Sales","Agency","Partnership","Corporation","Negotiable Instruments","Insurance"],TAX:["Income Tax - Individuals","Income Tax - Corporate","VAT","Other Percentage Taxes","Excise Tax","Estate Tax","Donor's Tax","Tax Remedies"],"Auditing Theory":["Audit Concepts","Professional Standards","Audit Risk","Internal Control","Audit Evidence","Audit Sampling","Audit Reports","Ethics"],"Auditing Problems":["Cash Audit","Receivables Audit","Inventory Audit","PPE Audit","Liabilities Audit","Equity Audit","Revenue Audit","Expense Audit"]};

const FILE_ICONS={"pdf":"📄","doc":"📝","docx":"📝","xls":"📊","xlsx":"📊","ppt":"📋","pptx":"📋","png":"🖼","jpg":"🖼","jpeg":"🖼","gif":"🖼","default":"📁"};
const getIcon=(name)=>{const ext=name?.split(".").pop()?.toLowerCase();return FILE_ICONS[ext]||FILE_ICONS.default;};
const formatSize=(bytes)=>{if(!bytes)return"";if(bytes<1024)return bytes+"B";if(bytes<1048576)return(bytes/1024).toFixed(1)+"KB";return(bytes/1048576).toFixed(1)+"MB";};

export default function App(){
  const [theme,setTheme]=useState(PASTEL);
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [activeSubject,setActiveSubject]=useState("FAR");
  const [activeTopic,setActiveTopic]=useState(null);
  const [activeTab,setActiveTab]=useState("materials");
  const [materials,setMaterials]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [uploadProgress,setUploadProgress]=useState("");
  const [searchVal,setSearchVal]=useState("");
  const [loginForm,setLoginForm]=useState({email:"",pass:""});
  const [loginError,setLoginError]=useState("");
  const [showRegister,setShowRegister]=useState(false);
  const [registerForm,setRegisterForm]=useState({name:"",email:"",pass:"",school:""});
  const [notifOpen,setNotifOpen]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [toast,setToast]=useState(null);

  const t=theme;
  const card={background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:"16px 20px",marginBottom:12};
  const btn=(primary)=>({background:primary?t.accent:"transparent",color:primary?"#fff":t.accentText,border:`1px solid ${primary?t.accent:t.accentLight}`,borderRadius:8,padding:"8px 20px",cursor:"pointer",fontWeight:500,fontSize:14});

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const navItems=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"subjects",icon:"📚",label:"Subjects"},
    {id:"qbank",icon:"❓",label:"Question Bank"},
    {id:"flashcards",icon:"🃏",label:"Flashcards"},
    {id:"mockexam",icon:"📝",label:"Mock Exam"},
    {id:"discussions",icon:"💬",label:"Discussions"},
    {id:"notes",icon:"📖",label:"Notes Vault"},
    {id:"mistakes",icon:"❌",label:"Mistake Notebook"},
    {id:"groups",icon:"👥",label:"Study Groups"},
    {id:"progress",icon:"📊",label:"Progress"},
    {id:"planner",icon:"📅",label:"Planner"},
    {id:"leaderboard",icon:"🏆",label:"Leaderboard"},
  ];

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session){setUser(session.user);fetchProfile(session.user.id);setPage("dashboard");}
    });
    supabase.auth.onAuthStateChange((_,session)=>{
      if(session){setUser(session.user);fetchProfile(session.user.id);setPage("dashboard");}
      else{setUser(null);setProfile(null);setPage("landing");}
    });
  },[]);

  useEffect(()=>{
    if(page==="subjects"&&user) fetchMaterials();
  },[page,activeSubject,activeTopic]);

  const fetchProfile=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data) setProfile(data);
  };

  const fetchMaterials=async()=>{
    let q=supabase.from("materials").select("*").eq("visibility","shared").order("created_at",{ascending:false});
    const subjectMap={"FAR":1,"AFAR":2,"MAS":3,"RFBT":4,"TAX":5,"Auditing Theory":6,"Auditing Problems":7};
    if(subjectMap[activeSubject]) q=q.eq("subject_id",subjectMap[activeSubject]);
    const{data}=await q;
    setMaterials(data||[]);
  };

  const handleLogin=async()=>{
    setLoginError("");
    const{error}=await supabase.auth.signInWithPassword({email:loginForm.email,password:loginForm.pass});
    if(error) setLoginError(error.message);
  };

  const handleRegister=async()=>{
    setLoginError("");
    const{error}=await supabase.auth.signUp({email:registerForm.email,password:registerForm.pass,options:{data:{full_name:registerForm.name}}});
    if(error) setLoginError(error.message);
    else showToast("Account created! You can now log in.");
  };

  const handleLogout=async()=>{
    await supabase.auth.signOut();
    setPage("landing");
  };

  const handleUpload=async(files)=>{
    if(!files||files.length===0) return;
    setUploading(true);
    const subjectMap={"FAR":1,"AFAR":2,"MAS":3,"RFBT":4,"TAX":5,"Auditing Theory":6,"Auditing Problems":7};
    for(const file of files){
      setUploadProgress(`Uploading ${file.name}...`);
      const ext=file.name.split(".").pop();
      const path=`${activeSubject}/${Date.now()}_${file.name}`;
      const{error:upErr}=await supabase.storage.from("materials").upload(path,file,{cacheControl:"3600",upsert:false});
      if(upErr){showToast(`Failed: ${file.name}`,"error");continue;}
      const{data:urlData}=supabase.storage.from("materials").getPublicUrl(path);
      const{error:dbErr}=await supabase.from("materials").insert({
        subject_id:subjectMap[activeSubject]||1,
        uploaded_by:user.id,
        title:file.name.replace(/\.[^/.]+$/,""),
        file_url:urlData.publicUrl,
        file_type:ext,
        file_size_kb:Math.round(file.size/1024),
        visibility:"shared",
        is_approved:profile?.role==="admin"?true:false,
      });
      if(dbErr) showToast(`DB error: ${file.name}`,"error");
      else showToast(`✅ ${file.name} uploaded!`);
    }
    setUploading(false);
    setUploadProgress("");
    fetchMaterials();
  };

  const handleDownload=async(mat)=>{
    if(mat.file_url){window.open(mat.file_url,"_blank");}
  };

  const handleDelete=async(mat)=>{
    if(!window.confirm(`Delete "${mat.title}"?`)) return;
    await supabase.from("materials").delete().eq("id",mat.id);
    showToast("Material deleted.");
    fetchMaterials();
  };

  const s=(p)=>setPage(p);

  // LANDING
  if(page==="landing") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",color:t.text}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#e53935":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:14}}>{toast.msg}</div>}
      <div style={{position:"fixed",top:0,left:0,right:0,background:t.card,borderBottom:`1px solid ${t.border}`,padding:"12px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>🎓</span><span style={{fontWeight:700,fontSize:18,color:t.accent}}>CPALearn PH</span></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={()=>{setShowRegister(false);s("login")}} style={btn(false)}>Log In</button>
          <button onClick={()=>{setShowRegister(true);s("login")}} style={btn(true)}>Register</button>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"120px 20px 60px"}}>
        <div style={{display:"inline-block",background:t.badge,color:t.badgeText,borderRadius:20,padding:"4px 16px",fontSize:12,marginBottom:16}}>🇵🇭 Built for Filipino CPA Candidates</div>
        <h1 style={{fontSize:48,fontWeight:700,color:t.text,margin:"0 0 16px",lineHeight:1.2}}>Your All-in-One<br/><span style={{color:t.accent}}>CPALE Review</span> Platform</h1>
        <p style={{fontSize:18,color:t.textMuted,maxWidth:560,margin:"0 auto 32px"}}>Study smarter with 7 subjects, collaborative notes, question banks, mock exams, and progress tracking — all in one place.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setShowRegister(true);s("login")}} style={{...btn(true),padding:"14px 32px",fontSize:16}}>Start Studying →</button>
          <button onClick={()=>s("subjects")} style={{...btn(false),padding:"14px 32px",fontSize:16}}>Explore Subjects</button>
        </div>
        <p style={{fontSize:13,color:t.textMuted,marginTop:12}}>One-time access fee to cover hosting. No subscriptions, no recurring charges.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:960,margin:"0 auto 60px",padding:"0 32px"}}>
        {[["📚","7 Subjects","FAR, AFAR, MAS, RFBT, TAX, Audit Theory & Problems"],["❓","Question Bank","MCQs with detailed explanations"],["🃏","Flashcards","Spaced repetition for formulas & concepts"],["📝","Mock Exams","Timed board exam simulations"],["💬","Discussions","Ask & answer with the community"],["📊","Progress Tracking","Visual analytics by subject & topic"],["👥","Study Groups","Collaborate with fellow reviewees"],["❌","Mistake Notebook","Track and review wrong answers"]].map(([icon,title,desc])=>(
          <div key={title} style={{...card,textAlign:"center",padding:"24px 16px"}}><div style={{fontSize:28,marginBottom:8}}>{icon}</div><div style={{fontWeight:600,marginBottom:4,color:t.text}}>{title}</div><div style={{fontSize:13,color:t.textMuted}}>{desc}</div></div>
        ))}
      </div>
      <div style={{background:t.surface,padding:"60px 32px",textAlign:"center"}}>
        <h2 style={{fontSize:28,fontWeight:700,color:t.text,marginBottom:8}}>Join thousands of CPA reviewees</h2>
        <p style={{color:t.textMuted,marginBottom:32}}>Upload, study, collaborate, and pass the board exam together.</p>
        <button onClick={()=>{setShowRegister(true);s("login")}} style={{...btn(true),padding:"14px 32px",fontSize:16}}>Get Started</button>
      </div>
    </div>
  );

  // LOGIN
  if(page==="login") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:14}}>{toast.msg}</div>}
      <div style={{width:400,background:t.card,border:`1px solid ${t.border}`,borderRadius:16,padding:"40px 36px",boxSizing:"border-box"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span style={{fontSize:36}}>🎓</span>
          <h2 style={{fontWeight:700,color:t.accent,margin:"8px 0 4px",fontSize:22}}>CPALearn PH</h2>
          <p style={{color:t.textMuted,fontSize:14,margin:0}}>{showRegister?"Create your account":"Welcome back, reviewee!"}</p>
        </div>
        {showRegister?(
          <>
            {[["Full Name","text",registerForm.name,(v)=>setRegisterForm({...registerForm,name:v}),"e.g. Juls Domingo"],["Email","email",registerForm.email,(v)=>setRegisterForm({...registerForm,email:v}),"your@email.com"],["Password","password",registerForm.pass,(v)=>setRegisterForm({...registerForm,pass:v}),"••••••••"],["School (optional)","text",registerForm.school,(v)=>setRegisterForm({...registerForm,school:v}),"e.g. UST, DLSU, UP Manila"]].map(([label,type,val,setter,ph])=>(
              <div key={label} style={{marginBottom:12}}>
                <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>{label}</label>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
              </div>
            ))}
            {loginError&&<div style={{color:"#e53935",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
            <button onClick={handleRegister} style={{...btn(true),width:"100%",padding:"12px",fontSize:15,marginTop:4}}>Create Account</button>
          </>
        ):(
          <>
            {[["Email","email",loginForm.email,(v)=>setLoginForm({...loginForm,email:v}),"your@email.com"],["Password","password",loginForm.pass,(v)=>setLoginForm({...loginForm,pass:v}),"••••••••"]].map(([label,type,val,setter,ph])=>(
              <div key={label} style={{marginBottom:14}}>
                <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>{label}</label>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
              </div>
            ))}
            {loginError&&<div style={{color:"#e53935",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
            <button onClick={handleLogin} style={{...btn(true),width:"100%",padding:"12px",fontSize:15,marginTop:4}}>Log In</button>
          </>
        )}
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:t.textMuted}}>
          {showRegister?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>{setShowRegister(!showRegister);setLoginError("");}} style={{color:t.accent,cursor:"pointer",fontWeight:600}}>{showRegister?"Log In":"Register"}</span>
        </div>
        <div style={{textAlign:"center",marginTop:12}}><span onClick={()=>s("landing")} style={{fontSize:12,color:t.textMuted,cursor:"pointer"}}>← Back to home</span></div>
      </div>
    </div>
  );

  // APP SHELL
  return(
    <div style={{display:"flex",minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",color:t.text}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#e53935":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:14,boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <div style={{width:200,background:t.sidebar,borderRight:`1px solid ${t.sidebarBorder}`,display:"flex",flexDirection:"column",padding:"16px 0",position:"fixed",top:0,bottom:0,left:0,zIndex:50,overflowY:"auto"}}>
        <div style={{padding:"0 16px 16px",borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>🎓</span><span style={{fontWeight:700,color:t.accent,fontSize:15}}>CPALearn PH</span></div>
        </div>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>s(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",background:page===n.id?t.navActive:"transparent",color:page===n.id?t.navActiveText:t.textMuted,border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:page===n.id?600:400,borderLeft:page===n.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
            <span style={{fontSize:15}}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"12px 16px",borderTop:`1px solid ${t.sidebarBorder}`}}>
          <div style={{fontSize:12,color:t.textMuted,marginBottom:6,textAlign:"center"}}>{profile?.full_name||user?.email}</div>
          <div style={{fontSize:11,color:t.accent,textAlign:"center",marginBottom:8,textTransform:"capitalize"}}>{profile?.role||"student"}</div>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),width:"100%",fontSize:12,padding:"6px 0",marginBottom:6}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={handleLogout} style={{...btn(false),width:"100%",fontSize:12,padding:"6px 0",color:t.textMuted}}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{marginLeft:200,flex:1,padding:24,maxWidth:"calc(100vw - 200px)",overflowX:"hidden"}}>
        {/* TOP BAR */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,position:"relative"}}>
          <input value={searchVal} onChange={e=>setSearchVal(e.target.value)} placeholder="🔍  Search materials, topics, subjects..." style={{flex:1,padding:"10px 16px",border:`1px solid ${t.border}`,borderRadius:10,fontSize:14,background:t.card,color:t.text}}/>
          <div style={{display:"flex",alignItems:"center",gap:8,background:t.badge,borderRadius:8,padding:"6px 12px"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>{(profile?.full_name||user?.email||"?")[0].toUpperCase()}</div>
            <span style={{fontSize:13,color:t.badgeText,fontWeight:500}}>{profile?.full_name||"User"}</span>
          </div>
        </div>

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>Welcome back, {profile?.full_name||"Reviewee"}! 👋</h1>
            <p style={{color:t.textMuted,marginBottom:20,fontSize:14}}>Ready to study today?</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[["📚","Subjects","7 available",()=>s("subjects")],["❓","Questions","Practice MCQs",()=>s("qbank")],["🃏","Flashcards","Review cards",()=>s("flashcards")],["📝","Mock Exam","Test yourself",()=>s("mockexam")]].map(([icon,title,desc,onClick])=>(
                <div key={title} onClick={onClick} style={{...card,textAlign:"center",padding:"24px 16px",cursor:"pointer"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{icon}</div>
                  <div style={{fontWeight:600,color:t.text,marginBottom:4}}>{title}</div>
                  <div style={{fontSize:12,color:t.textMuted}}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{...card,padding:"24px"}}>
              <div style={{fontWeight:600,marginBottom:16,color:t.text}}>📚 Quick Access — Subjects</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                {SUBJECTS.map((sub,i)=>(
                  <div key={sub} onClick={()=>{setActiveSubject(sub);s("subjects")}} style={{background:t.subjectColors[i],borderRadius:10,padding:"14px 16px",cursor:"pointer"}}>
                    <div style={{fontWeight:700,color:t.subjectText[i],fontSize:14}}>{sub}</div>
                    <div style={{fontSize:11,color:t.subjectText[i],opacity:0.7,marginTop:2}}>View materials →</div>
                  </div>
                ))}
              </div>
            </div>
            {profile?.role==="admin"&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`}}>
                <div style={{fontWeight:600,marginBottom:10,color:t.text}}>🛡️ Admin Panel</div>
                <div style={{fontSize:13,color:t.textMuted,marginBottom:12}}>You have admin access. You can upload materials, approve content, and manage users.</div>
                <button onClick={()=>s("subjects")} style={btn(true)}>Upload Materials →</button>
              </div>
            )}
          </div>
        )}

        {/* SUBJECTS + MATERIALS */}
        {page==="subjects"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📚 Subject Library</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Browse and download study materials</p>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              {SUBJECTS.map((s2,i)=>(
                <button key={s2} onClick={()=>{setActiveSubject(s2);setActiveTopic(null);}} style={{background:activeSubject===s2?t.subjectColors[i]:t.badge,color:activeSubject===s2?t.subjectText[i]:t.badgeText,border:`1px solid ${t.border}`,borderRadius:20,padding:"6px 16px",cursor:"pointer",fontSize:13,fontWeight:activeSubject===s2?600:400}}>{s2}</button>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:16}}>
              {/* TOPICS */}
              <div>
                <div style={{fontWeight:600,fontSize:12,color:t.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Topics</div>
                <div onClick={()=>setActiveTopic(null)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:!activeTopic?t.accentLight:t.highlight,fontSize:13,color:!activeTopic?t.accentText:t.text,cursor:"pointer",border:`1px solid ${!activeTopic?t.accentLight:t.border}`,fontWeight:!activeTopic?600:400}}>All Topics</div>
                {TOPICS[activeSubject].map(topic=>(
                  <div key={topic} onClick={()=>setActiveTopic(activeTopic===topic?null:topic)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:activeTopic===topic?t.accentLight:t.highlight,fontSize:13,color:activeTopic===topic?t.accentText:t.text,cursor:"pointer",border:`1px solid ${activeTopic===topic?t.accentLight:t.border}`,fontWeight:activeTopic===topic?600:400}}>{topic}</div>
                ))}
              </div>

              {/* MATERIALS */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:600,fontSize:15,color:t.text}}>{activeSubject} {activeTopic?`— ${activeTopic}`:""}</div>
                  <span style={{fontSize:12,color:t.textMuted}}>{materials.length} file{materials.length!==1?"s":""}</span>
                </div>

                {/* UPLOAD AREA */}
                <div
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);handleUpload(e.dataTransfer.files);}}
                  style={{border:`2px dashed ${dragOver?t.accent:t.border}`,borderRadius:12,padding:"24px",textAlign:"center",background:dragOver?t.highlight:t.surface,marginBottom:16,transition:"all 0.2s"}}>
                  <div style={{fontSize:32,marginBottom:8}}>📂</div>
                  <div style={{fontWeight:600,color:t.text,marginBottom:4}}>
                    {uploading?uploadProgress:"Drag & drop files here"}
                  </div>
                  <div style={{fontSize:13,color:t.textMuted,marginBottom:12}}>PDF, Word, Excel, PowerPoint, Images</div>
                  <label style={{...btn(true),display:"inline-block",cursor:"pointer",padding:"8px 20px"}}>
                    📎 Choose Files
                    <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif" onChange={e=>handleUpload(e.target.files)} style={{display:"none"}}/>
                  </label>
                </div>

                {/* MATERIALS LIST */}
                {materials.length===0?(
                  <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:40,marginBottom:12}}>📭</div>
                    <div style={{fontWeight:600,color:t.text,marginBottom:4}}>No materials yet</div>
                    <div style={{fontSize:13,color:t.textMuted}}>Be the first to upload for {activeSubject}!</div>
                  </div>
                ):(
                  materials.map(mat=>(
                    <div key={mat.id} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                      <span style={{fontSize:28,flexShrink:0}}>{getIcon(mat.title+"."+mat.file_type)}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:13,color:t.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mat.title}</div>
                        <div style={{fontSize:11,color:t.textMuted}}>
                          {mat.file_type?.toUpperCase()} · {formatSize(mat.file_size_kb*1024)}
                          {mat.is_approved?<span style={{color:"#4CAF50",marginLeft:8}}>✓ Approved</span>:<span style={{color:"#FF9800",marginLeft:8}}>⏳ Pending</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button onClick={()=>handleDownload(mat)} style={{...btn(true),fontSize:11,padding:"5px 12px"}}>⬇ Download</button>
                        {(profile?.role==="admin"||mat.uploaded_by===user?.id)&&(
                          <button onClick={()=>handleDelete(mat)} style={{...btn(false),fontSize:11,padding:"5px 12px",color:"#e53935",borderColor:"#e53935"}}>🗑</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PLACEHOLDER PAGES */}
        {["qbank","flashcards","mockexam","discussions","notes","mistakes","groups","progress","planner","leaderboard"].includes(page)&&(
          <div style={{textAlign:"center",padding:"80px 20px"}}>
            <div style={{fontSize:48,marginBottom:16}}>{navItems.find(n=>n.id===page)?.icon}</div>
            <h2 style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:8}}>{navItems.find(n=>n.id===page)?.label}</h2>
            <p style={{color:t.textMuted,marginBottom:24,fontSize:15}}>This section is coming soon! Focus on uploading materials first, then we'll build this out.</p>
            <button onClick={()=>s("subjects")} style={{...btn(true),padding:"12px 28px"}}>← Back to Subjects</button>
          </div>
        )}
      </div>
    </div>
  );
}