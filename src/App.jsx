import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

// ── FONTS ──
const FONT_STYLE=`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Sorts+Mill+Goudy:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Montserrat',sans-serif;}
h1,h2,h3{font-family:'Montserrat',sans-serif;font-weight:800;letter-spacing:-0.5px;}
.serif{font-family:'Sorts Mill Goudy',serif;}
.brand{font-family:'Montserrat',sans-serif;font-weight:800;letter-spacing:-1px;}
input,textarea,select,button{font-family:'Montserrat',sans-serif;}
`;

const PASTEL={name:"pastel",bg:"#FDF6FB",surface:"#FFF0F7",card:"#FFFFFF",sidebar:"#F9E8F5",sidebarBorder:"#EEC8E8",accent:"#D46FAC",accentLight:"#F7C8E8",accentText:"#A3347A",text:"#3D1F35",textMuted:"#9B6A87",border:"#EDD5E8",badge:"#F4DAEF",badgeText:"#8B3B72",highlight:"#FDE8F5",navActive:"#F7C8E8",navActiveText:"#8B3B72",subjectColors:["#F8B4D9","#C3B1E1","#B5EAD7","#FFDAC1","#B5D5F5","#F9C9C9","#CBE4C4"],subjectText:["#8B3B72","#5B3E8F","#2A7D5A","#A85D00","#1A5FAD","#9B2828","#3D6B2A"]};
const EARTHY={name:"earthy",bg:"#F5F0E8",surface:"#EDE5D8",card:"#FDFAF5",sidebar:"#EAE0CE",sidebarBorder:"#C8B89A",accent:"#7C6248",accentLight:"#D4BFA0",accentText:"#5C3D1E",text:"#2C1F0E",textMuted:"#7A6248",border:"#D4C4A8",badge:"#E8DCC8",badgeText:"#5C3D1E",highlight:"#F0E8D5",navActive:"#D4BFA0",navActiveText:"#5C3D1E",subjectColors:["#D4A574","#B5C99A","#A8C4C8","#D4B896","#C4A8B8","#B8C4A0","#C8B084"],subjectText:["#5C3D1E","#3A5A1E","#1E4A50","#5C3D1E","#4A2848","#2A4A1E","#4A3808"]};

const SUBJECTS=["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"];
const SUBJECT_ID={"FAR":1,"AFAR":2,"MAS":3,"RFBT":4,"TAX":5,"Auditing Theory":6,"Auditing Problems":7};
const DEFAULT_TOPICS={FAR:["Cash & Cash Equivalents","Receivables","Inventories","PPE","Intangibles","Investments","Liabilities","Equity","Revenue Recognition","Leases"],AFAR:["Business Combination","Consolidation","Foreign Currency","Joint Arrangement","Government Accounting","Liquidation","Installment Sales"],MAS:["Cost Concepts","CVP Analysis","Budgeting","Standard Costing","Variance Analysis","Decision Making","Transfer Pricing","Performance Evaluation"],RFBT:["Law on Obligations","Law on Contracts","Sales","Agency","Partnership","Corporation","Negotiable Instruments","Insurance"],TAX:["Income Tax - Individuals","Income Tax - Corporate","VAT","Other Percentage Taxes","Excise Tax","Estate Tax","Donor's Tax","Tax Remedies"],"Auditing Theory":["Audit Concepts","Professional Standards","Audit Risk","Internal Control","Audit Evidence","Audit Sampling","Audit Reports","Ethics"],"Auditing Problems":["Cash Audit","Receivables Audit","Inventory Audit","PPE Audit","Liabilities Audit","Equity Audit","Revenue Audit","Expense Audit"]};

const FILE_ICONS={"pdf":"📄","doc":"📝","docx":"📝","xls":"📊","xlsx":"📊","ppt":"📋","pptx":"📋","png":"🖼","jpg":"🖼","jpeg":"🖼","gif":"🖼","default":"📁"};
const getIcon=(n)=>{const e=n?.split(".").pop()?.toLowerCase();return FILE_ICONS[e]||FILE_ICONS.default;};
const fmtSize=(b)=>{if(!b)return"";if(b<1048576)return(b/1024).toFixed(1)+"KB";return(b/1048576).toFixed(1)+"MB";};
const fmtDate=(d)=>d?new Date(d).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"}):"—";

const PAYMENT_CONFIG={gcashName:"Juliana Domingo",gcashNumber:"09XX-XXX-XXXX",amount:"₱99",qrUrl:""};

export default function App(){
  const [theme,setTheme]=useState(PASTEL);
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [toast,setToast]=useState(null);
  // subjects
  const [activeSubject,setActiveSubject]=useState("FAR");
  const [activeTopic,setActiveTopic]=useState(null);
  const [materials,setMaterials]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [newTopicName,setNewTopicName]=useState("");
  const [showAddTopic,setShowAddTopic]=useState(false);
  // questions
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [qFilter,setQFilter]=useState("All");
  const [showAddQ,setShowAddQ]=useState(false);
  const [newQ,setNewQ]=useState({subject:"FAR",topic:"",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});
  // flashcards
  const [flashcards,setFlashcards]=useState([]);
  const [fcIdx,setFcIdx]=useState(0);
  const [fcFlipped,setFcFlipped]=useState(false);
  const [showAddFC,setShowAddFC]=useState(false);
  const [newFC,setNewFC]=useState({subject:"FAR",front:"",back:""});
  // discussions
  const [discussions,setDiscussions]=useState([]);
  const [showAddD,setShowAddD]=useState(false);
  const [newD,setNewD]=useState({subject:"FAR",topic:"",question:""});
  const [activeDiscussion,setActiveDiscussion]=useState(null);
  const [newReply,setNewReply]=useState("");
  // notes
  const [notes,setNotes]=useState([]);
  const [activeNote,setActiveNote]=useState(null);
  const [showAddNote,setShowAddNote]=useState(false);
  const [newNote,setNewNote]=useState({title:"",subject:"FAR",body:""});
  const [editingNote,setEditingNote]=useState(false);
  // mistakes
  const [mistakes,setMistakes]=useState([]);
  const [showAddM,setShowAddM]=useState(false);
  const [newM,setNewM]=useState({q:"",correct:"",note:"",subject:"FAR"});
  // mock exam
  const [examStarted,setExamStarted]=useState(false);
  const [examAnswers,setExamAnswers]=useState({});
  const [examDone,setExamDone]=useState(false);
  const [examQuestions,setExamQuestions]=useState([]);
  const [examSubject,setExamSubject]=useState("FAR");
  // progress
  const [studySessions,setStudySessions]=useState([]);
  // groups
  const [groups,setGroups]=useState([]);
  const [showAddGroup,setShowAddGroup]=useState(false);
  const [newGroup,setNewGroup]=useState({name:"",subject:"FAR",type:"public",description:""});
  // payment
  const [paymentForm,setPaymentForm]=useState({ref:"",screenshot:null,screenshotName:""});
  const [submittingPayment,setSubmittingPayment]=useState(false);
  const [paymentSubmitted,setPaymentSubmitted]=useState(false);
  const [pendingPayments,setPendingPayments]=useState([]);
  // profile
  const [editingProfile,setEditingProfile]=useState(false);
  const [editForm,setEditForm]=useState({});
  const [savingProfile,setSavingProfile]=useState(false);
  // auth
  const [loginForm,setLoginForm]=useState({email:"",pass:""});
  const [loginError,setLoginError]=useState("");
  const [showRegister,setShowRegister]=useState(false);
  const [registerForm,setRegisterForm]=useState({name:"",email:"",pass:"",school:""});

  const t=theme;
  const isAdmin=profile?.role==="admin";
  const card={background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:"18px 20px",marginBottom:12};
  const btn=(primary,danger)=>({background:primary?t.accent:danger?"#c62828":"transparent",color:primary||danger?"#fff":t.accentText,border:`1px solid ${primary?t.accent:danger?"#c62828":t.border}`,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"Montserrat,sans-serif"});
  const inp={width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,background:t.surface,color:t.text,fontFamily:"Montserrat,sans-serif"};

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const s=(p)=>setPage(p);

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
    {id:"profile",icon:"👤",label:"My Profile"},
    ...(isAdmin?[{id:"admin",icon:"🛡️",label:"Admin Panel"}]:[]),
  ];

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session){setUser(session.user);loadProfile(session.user.id);}});
    supabase.auth.onAuthStateChange((_,session)=>{if(session){setUser(session.user);loadProfile(session.user.id);}else{setUser(null);setProfile(null);setPage("landing");}});
  },[]);

  const loadProfile=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){setProfile(data);setEditForm(data);if(!data.is_approved&&data.role!=="admin")setPage("payment");else setPage("dashboard");}
    else setPage("dashboard");
  };

  useEffect(()=>{if(page==="subjects"&&user)fetchMaterials();},[page,activeSubject,activeTopic]);
  useEffect(()=>{if(page==="qbank"&&user)fetchQuestions();},[page,qFilter]);
  useEffect(()=>{if(page==="flashcards"&&user)fetchFlashcards();},[page]);
  useEffect(()=>{if(page==="discussions"&&user)fetchDiscussions();},[page]);
  useEffect(()=>{if(page==="notes"&&user)fetchNotes();},[page]);
  useEffect(()=>{if(page==="mistakes"&&user)fetchMistakes();},[page]);
  useEffect(()=>{if(page==="groups"&&user)fetchGroups();},[page]);
  useEffect(()=>{if(page==="progress"&&user)fetchSessions();},[page]);
  useEffect(()=>{if(page==="admin"&&isAdmin)fetchPendingPayments();},[page]);
  useEffect(()=>{if(activeDiscussion)fetchReplies(activeDiscussion.id);},[activeDiscussion]);

  const fetchMaterials=async()=>{let q=supabase.from("materials").select("*").eq("visibility","shared").order("created_at",{ascending:false});if(SUBJECT_ID[activeSubject])q=q.eq("subject_id",SUBJECT_ID[activeSubject]);const{data}=await q;setMaterials(data||[]);};
  const fetchQuestions=async()=>{let q=supabase.from("questions").select("*").eq("is_approved",true).order("created_at",{ascending:false});if(qFilter!=="All")q=q.eq("subject_id",SUBJECT_ID[qFilter]);const{data}=await q;setQuestions(data||[]);};
  const fetchFlashcards=async()=>{const{data}=await supabase.from("flashcards").select("*").eq("visibility","shared").order("created_at",{ascending:false});setFlashcards(data||[]);};
  const fetchDiscussions=async()=>{const{data}=await supabase.from("discussions").select("*").order("created_at",{ascending:false});setDiscussions(data||[]);};
  const fetchReplies=async(did)=>{const{data}=await supabase.from("discussion_replies").select("*").eq("discussion_id",did).order("created_at",{ascending:true});setActiveDiscussion(d=>({...d,replies:data||[]}));};
  const fetchNotes=async()=>{const{data}=await supabase.from("user_notes").select("*").eq("user_id",user.id).order("created_at",{ascending:false});setNotes(data||[]);};
  const fetchMistakes=async()=>{const{data}=await supabase.from("mistake_notebook").select("*").eq("user_id",user.id).order("created_at",{ascending:false});setMistakes(data||[]);};
  const fetchGroups=async()=>{const{data}=await supabase.from("study_groups").select("*").order("created_at",{ascending:false});setGroups(data||[]);};
  const fetchSessions=async()=>{const{data}=await supabase.from("study_sessions").select("*").eq("user_id",user.id).order("started_at",{ascending:false}).limit(30);setStudySessions(data||[]);};
  const fetchPendingPayments=async()=>{const{data}=await supabase.from("user_payments").select("*").eq("status","pending").order("created_at",{ascending:false});setPendingPayments(data||[]);};

  const handleLogin=async()=>{setLoginError("");const{error}=await supabase.auth.signInWithPassword({email:loginForm.email,password:loginForm.pass});if(error)setLoginError(error.message);};
  const handleRegister=async()=>{setLoginError("");if(!registerForm.name||!registerForm.email||!registerForm.pass){setLoginError("Please fill in all required fields.");return;}const{error}=await supabase.auth.signUp({email:registerForm.email,password:registerForm.pass,options:{data:{full_name:registerForm.name,school:registerForm.school}}});if(error)setLoginError(error.message);else{showToast("Account created! Please complete payment.");setShowRegister(false);}};
  const handleLogout=async()=>{await supabase.auth.signOut();};

  const handleUpload=async(files)=>{
    if(!files?.length)return;setUploading(true);
    for(const file of files){
      const path=`${activeSubject}/${Date.now()}_${file.name}`;
      const{error:upErr}=await supabase.storage.from("materials").upload(path,file,{cacheControl:"3600",upsert:false});
      if(upErr){showToast(`Failed: ${file.name}`,"error");continue;}
      const{data:urlData}=supabase.storage.from("materials").getPublicUrl(path);
      await supabase.from("materials").insert({subject_id:SUBJECT_ID[activeSubject]||1,uploaded_by:user.id,title:file.name.replace(/\.[^/.]+$/,""),file_url:urlData.publicUrl,file_type:file.name.split(".").pop(),file_size_kb:Math.round(file.size/1024),visibility:"shared",is_approved:isAdmin});
      showToast(`✅ ${file.name} uploaded!`);
    }
    setUploading(false);fetchMaterials();
  };

  const handleAddQuestion=async()=>{
    if(!newQ.question||newQ.options.some(o=>!o)){showToast("Fill in all fields","error");return;}
    await supabase.from("questions").insert({subject_id:SUBJECT_ID[newQ.subject],topic_id:null,created_by:user.id,question_text:newQ.question,question_type:"mcq",options:newQ.options,correct_answer:String(newQ.answer),explanation:newQ.explanation,difficulty:newQ.difficulty,is_approved:isAdmin});
    showToast("Question added! ✅");setShowAddQ(false);setNewQ({subject:"FAR",topic:"",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});fetchQuestions();
  };

  const handleAddFlashcard=async()=>{
    if(!newFC.front||!newFC.back){showToast("Fill in front and back","error");return;}
    await supabase.from("flashcards").insert({subject_id:SUBJECT_ID[newFC.subject],created_by:user.id,front_text:newFC.front,back_text:newFC.back,visibility:"shared"});
    showToast("Flashcard added! ✅");setShowAddFC(false);setNewFC({subject:"FAR",front:"",back:""});fetchFlashcards();
  };

  const handleAddDiscussion=async()=>{
    if(!newD.question){showToast("Enter a question","error");return;}
    await supabase.from("discussions").insert({subject_id:SUBJECT_ID[newD.subject],user_id:user.id,title:newD.question.slice(0,100),body:newD.question});
    showToast("Question posted! ✅");setShowAddD(false);setNewD({subject:"FAR",topic:"",question:""});fetchDiscussions();
  };

  const handleAddReply=async()=>{
    if(!newReply||!activeDiscussion)return;
    await supabase.from("discussion_replies").insert({discussion_id:activeDiscussion.id,user_id:user.id,body:newReply,is_verified:false});
    setNewReply("");fetchReplies(activeDiscussion.id);
  };

  const handleVerifyReply=async(replyId)=>{
    await supabase.from("discussion_replies").update({is_verified:true}).eq("id",replyId);
    fetchReplies(activeDiscussion.id);showToast("Answer verified! ✅");
  };

  const handleAddNote=async()=>{
    if(!newNote.title){showToast("Add a title","error");return;}
    await supabase.from("user_notes").insert({user_id:user.id,subject_id:SUBJECT_ID[newNote.subject],title:newNote.title,body:newNote.body,is_shared:false});
    showToast("Note saved! ✅");setShowAddNote(false);setNewNote({title:"",subject:"FAR",body:""});fetchNotes();
  };

  const handleSaveNote=async()=>{
    await supabase.from("user_notes").update({title:activeNote.title,body:activeNote.body,updated_at:new Date().toISOString()}).eq("id",activeNote.id);
    showToast("Note updated! ✅");setEditingNote(false);fetchNotes();
  };

  const handleDeleteNote=async(id)=>{await supabase.from("user_notes").delete().eq("id",id);showToast("Note deleted.");fetchNotes();setActiveNote(null);};

  const handleAddMistake=async()=>{
    if(!newM.q){showToast("Enter the question","error");return;}
    await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:SUBJECT_ID[newM.subject],question_text:newM.q,correct_answer:newM.correct,personal_note:newM.note});
    showToast("Added to Mistake Notebook! ✅");setShowAddM(false);setNewM({q:"",correct:"",note:"",subject:"FAR"});fetchMistakes();
  };

  const handleDeleteMistake=async(id)=>{await supabase.from("mistake_notebook").delete().eq("id",id);showToast("Removed.");fetchMistakes();};

  const handleAddGroup=async()=>{
    if(!newGroup.name){showToast("Enter group name","error");return;}
    await supabase.from("study_groups").insert({name:newGroup.name,subject_id:SUBJECT_ID[newGroup.subject],created_by:user.id,type:newGroup.type,description:newGroup.description,member_count:1});
    showToast("Group created! ✅");setShowAddGroup(false);setNewGroup({name:"",subject:"FAR",type:"public",description:""});fetchGroups();
  };

  const handlePaymentSubmit=async()=>{
    if(!paymentForm.ref){showToast("Enter your reference number","error");return;}
    setSubmittingPayment(true);
    await supabase.from("user_payments").insert({user_id:user.id,amount:99,currency:"PHP",payment_method:"GCash",reference_number:paymentForm.ref,status:"pending"});
    setPaymentSubmitted(true);showToast("Payment submitted! ✅");setSubmittingPayment(false);
  };

  const handleApprovePayment=async(p)=>{
    await supabase.from("user_payments").update({status:"verified",verified_at:new Date().toISOString()}).eq("id",p.id);
    await supabase.from("profiles").update({is_approved:true}).eq("id",p.user_id);
    showToast("User approved! ✅");fetchPendingPayments();
  };

  const handleSaveProfile=async()=>{
    setSavingProfile(true);
    await supabase.from("profiles").update({full_name:editForm.full_name,school:editForm.school,year_level:editForm.year_level,updated_at:new Date().toISOString()}).eq("id",user.id);
    setProfile({...profile,...editForm});setEditingProfile(false);showToast("Profile updated! ✅");setSavingProfile(false);
  };

  const startExam=async(subj)=>{
    setExamSubject(subj);
    const{data}=await supabase.from("questions").select("*").eq("subject_id",SUBJECT_ID[subj]).eq("is_approved",true).limit(20);
    setExamQuestions(data||[]);setExamAnswers({});setExamStarted(true);setExamDone(false);
  };

  const submitExam=async()=>{
    let correct=0;
    examQuestions.forEach((q,i)=>{if(String(examAnswers[i])===String(q.correct_answer))correct++;});
    await supabase.from("exam_attempts").insert({user_id:user.id,answers:examAnswers,score:(correct/examQuestions.length)*100,total_questions:examQuestions.length,completed_at:new Date().toISOString()});
    setExamDone(true);setExamStarted(false);
  };

  // ── LANDING ──
  if(!user&&page==="landing") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",color:t.text}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#c62828":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13,fontWeight:600}}>{toast.msg}</div>}
      <div style={{position:"fixed",top:0,left:0,right:0,background:t.card,borderBottom:`1px solid ${t.border}`,padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>🎓</span><span className="brand" style={{fontSize:20,color:t.accent,letterSpacing:"-1px"}}>CPALearn PH</span></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={()=>{setShowRegister(false);s("login");}} style={btn(false)}>Log In</button>
          <button onClick={()=>{setShowRegister(true);s("login");}} style={btn(true)}>Register</button>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"130px 20px 60px"}}>
        <div style={{display:"inline-block",background:t.badge,color:t.badgeText,borderRadius:20,padding:"5px 18px",fontSize:12,marginBottom:20,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>🇵🇭 For Filipino CPA Candidates</div>
        <h1 style={{fontSize:52,fontWeight:800,color:t.text,marginBottom:16,lineHeight:1.15,letterSpacing:"-2px"}}>Your All-in-One<br/><span style={{color:t.accent}}>CPALE Review</span> Platform</h1>
        <p className="serif" style={{fontSize:20,color:t.textMuted,maxWidth:560,margin:"0 auto 36px",lineHeight:1.7,fontStyle:"italic"}}>Study smarter with 7 subjects, collaborative notes, question banks, mock exams, and progress tracking — all in one place.</p>
        <button onClick={()=>{setShowRegister(true);s("login");}} style={{...btn(true),padding:"16px 40px",fontSize:16,borderRadius:12}}>Start Studying →</button>
        <p style={{fontSize:12,color:t.textMuted,marginTop:14,letterSpacing:"0.5px"}}>ONE-TIME ACCESS FEE · NO SUBSCRIPTIONS · NO RECURRING CHARGES</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,maxWidth:1000,margin:"0 auto 60px",padding:"0 40px"}}>
        {[["📚","7 Subjects","FAR, AFAR, MAS, RFBT, TAX & Audit"],["❓","Question Bank","MCQs with explanations"],["🃏","Flashcards","Spaced repetition"],["📝","Mock Exams","Timed simulations"],["💬","Discussions","Community Q&A"],["📊","Progress","Visual analytics"],["👥","Study Groups","Collaborate"],["❌","Mistakes","Track errors"]].map(([icon,title,desc])=>(
          <div key={title} style={{...card,textAlign:"center",padding:"24px 16px"}}><div style={{fontSize:28,marginBottom:8}}>{icon}</div><div style={{fontWeight:700,marginBottom:4,color:t.text,fontSize:14}}>{title}</div><div style={{fontSize:12,color:t.textMuted}}>{desc}</div></div>
        ))}
      </div>
    </div>
  );

  // ── LOGIN ──
  if(!user&&page==="login") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13}}>{toast.msg}</div>}
      <div style={{width:420,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"44px 40px"}}>
        <div style={{textAlign:"center",marginBottom:28}}><span style={{fontSize:40}}>🎓</span><h2 style={{color:t.accent,margin:"10px 0 4px",letterSpacing:"-1px"}}>{showRegister?"Create Account":"Welcome Back"}</h2><p className="serif" style={{color:t.textMuted,fontSize:14,fontStyle:"italic"}}>{showRegister?"Join thousands of CPA reviewees":"Continue your review journey"}</p></div>
        {(showRegister?[["Full Name *","text",registerForm.name,(v)=>setRegisterForm({...registerForm,name:v}),"e.g. Juls Domingo"],["Email *","email",registerForm.email,(v)=>setRegisterForm({...registerForm,email:v}),"your@email.com"],["Password *","password",registerForm.pass,(v)=>setRegisterForm({...registerForm,pass:v}),"min. 6 characters"],["School","text",registerForm.school,(v)=>setRegisterForm({...registerForm,school:v}),"e.g. UST, DLSU"]]:[["Email","email",loginForm.email,(v)=>setLoginForm({...loginForm,email:v}),"your@email.com"],["Password","password",loginForm.pass,(v)=>setLoginForm({...loginForm,pass:v}),"••••••••"]]).map(([label,type,val,setter,ph])=>(
          <div key={label} style={{marginBottom:14}}><label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{label}</label><input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={inp}/></div>
        ))}
        {loginError&&<div style={{color:"#c62828",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
        <button onClick={showRegister?handleRegister:handleLogin} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,marginTop:4,borderRadius:10}}>{showRegister?"Create Account":"Log In"}</button>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:t.textMuted}}>
          {showRegister?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>{setShowRegister(!showRegister);setLoginError("");}} style={{color:t.accent,cursor:"pointer",fontWeight:700}}>{showRegister?"Log In":"Register"}</span>
        </div>
        <div style={{textAlign:"center",marginTop:10}}><span onClick={()=>s("landing")} style={{fontSize:12,color:t.textMuted,cursor:"pointer"}}>← Back to home</span></div>
      </div>
    </div>
  );

  // ── PAYMENT ──
  if(user&&page==="payment") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13}}>{toast.msg}</div>}
      <div style={{width:"100%",maxWidth:480,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"40px 36px"}}>
        {paymentSubmitted?(
          <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><h2 style={{color:t.accent,marginBottom:8}}>Payment Submitted!</h2><p className="serif" style={{color:t.textMuted,lineHeight:1.7,fontStyle:"italic",marginBottom:20}}>Your payment is being reviewed. You'll receive access within 24 hours after verification.</p><button onClick={handleLogout} style={{...btn(false),width:"100%"}}>Log Out</button></div>
        ):(
          <>
            <div style={{textAlign:"center",marginBottom:24}}><span style={{fontSize:36}}>💳</span><h2 style={{color:t.accent,margin:"8px 0 4px"}}>Complete Payment</h2><p className="serif" style={{color:t.textMuted,fontSize:13,fontStyle:"italic"}}>One-time access · No recurring charges</p></div>
            <div style={{background:t.accentLight,borderRadius:12,padding:"20px",textAlign:"center",marginBottom:16}}><div style={{fontSize:40,fontWeight:800,color:t.accentText,letterSpacing:"-2px"}}>{PAYMENT_CONFIG.amount}</div><div style={{fontSize:12,color:t.accentText,marginTop:4,fontWeight:600}}>ONE-TIME ACCESS FEE</div></div>
            <div style={{background:t.surface,borderRadius:12,padding:"20px",textAlign:"center",marginBottom:16,border:`1px solid ${t.border}`}}>
              <div style={{fontWeight:700,color:t.text,marginBottom:12,fontSize:14}}>📱 GCash Payment</div>
              {PAYMENT_CONFIG.qrUrl?<img src={PAYMENT_CONFIG.qrUrl} alt="GCash QR" style={{width:180,height:180,borderRadius:8,margin:"0 auto 12px",display:"block"}}/>:<div style={{width:180,height:180,background:t.border,borderRadius:8,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}><span style={{fontSize:32}}>📷</span><span style={{fontSize:11,color:t.textMuted}}>QR Code</span></div>}
              <div style={{fontWeight:700,color:t.text}}>{PAYMENT_CONFIG.gcashName}</div>
              <div style={{fontSize:13,color:t.textMuted}}>{PAYMENT_CONFIG.gcashNumber}</div>
            </div>
            <div style={{marginBottom:14}}><label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>GCash Reference Number *</label><input value={paymentForm.ref} onChange={e=>setPaymentForm({...paymentForm,ref:e.target.value})} placeholder="e.g. 1234567890" style={inp}/></div>
            <div style={{marginBottom:20}}><label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>Screenshot of Payment</label><label style={{display:"block",border:`2px dashed ${t.border}`,borderRadius:8,padding:"16px",textAlign:"center",cursor:"pointer",background:t.surface}}><div style={{fontSize:24,marginBottom:4}}>📎</div><div style={{fontSize:13,color:paymentForm.screenshotName?t.accent:t.textMuted}}>{paymentForm.screenshotName||"Click to upload"}</div><input type="file" accept="image/*" onChange={e=>{if(e.target.files[0])setPaymentForm({...paymentForm,screenshot:e.target.files[0],screenshotName:e.target.files[0].name});}} style={{display:"none"}}/></label></div>
            <button onClick={handlePaymentSubmit} disabled={submittingPayment||!paymentForm.ref} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,opacity:!paymentForm.ref?0.5:1,borderRadius:10}}>{submittingPayment?"Submitting...":"Submit for Verification"}</button>
            <button onClick={handleLogout} style={{...btn(false),width:"100%",marginTop:8,fontSize:13}}>Log Out</button>
          </>
        )}
      </div>
    </div>
  );

  // ── APP SHELL ──
  return(
    <div style={{display:"flex",minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",color:t.text}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#c62828":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <div style={{width:210,background:t.sidebar,borderRight:`1px solid ${t.sidebarBorder}`,display:"flex",flexDirection:"column",padding:"16px 0",position:"fixed",top:0,bottom:0,left:0,zIndex:50,overflowY:"auto"}}>
        <div style={{padding:"0 16px 16px",borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>🎓</span><span className="brand" style={{color:t.accent,fontSize:16,letterSpacing:"-0.5px"}}>CPALearn PH</span></div>
        </div>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>s(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",background:page===n.id?t.navActive:"transparent",color:page===n.id?t.navActiveText:t.textMuted,border:"none",cursor:"pointer",textAlign:"left",fontSize:12,fontWeight:page===n.id?700:500,borderLeft:page===n.id?`3px solid ${t.accent}`:"3px solid transparent",letterSpacing:"0.2px"}}>
            <span style={{fontSize:15}}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"12px 16px",borderTop:`1px solid ${t.sidebarBorder}`}}>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600}}>{profile?.full_name||user?.email}</div>
          <div style={{fontSize:10,color:t.accent,marginBottom:8,textTransform:"uppercase",fontWeight:700,letterSpacing:"0.5px"}}>{profile?.role||"student"}</div>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),width:"100%",fontSize:11,padding:"6px 0",marginBottom:5}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={handleLogout} style={{...btn(false),width:"100%",fontSize:11,padding:"6px 0",color:t.textMuted}}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{marginLeft:210,flex:1,padding:"24px 28px",overflowX:"hidden"}}>

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <h1 style={{fontSize:26,marginBottom:4}}>Welcome back, {profile?.full_name?.split(" ")[0]||"Reviewee"}! 👋</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:24,fontSize:15,fontStyle:"italic"}}>Ready to study today?</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
              {[["📚","Subjects","Browse materials","subjects"],["❓","Questions","Practice MCQs","qbank"],["🃏","Flashcards","Review cards","flashcards"],["📝","Mock Exam","Test yourself","mockexam"]].map(([icon,title,desc,pg])=>(
                <div key={title} onClick={()=>s(pg)} style={{...card,textAlign:"center",padding:"24px 16px",cursor:"pointer",transition:"transform 0.1s"}} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="none"}>
                  <div style={{fontSize:32,marginBottom:8}}>{icon}</div><div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>{title}</div><div style={{fontSize:12,color:t.textMuted}}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{...card,padding:"24px"}}>
              <div style={{fontWeight:700,marginBottom:16,color:t.text,fontSize:15,letterSpacing:"-0.3px"}}>📚 Jump to Subject</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                {SUBJECTS.map((sub,i)=>(
                  <div key={sub} onClick={()=>{setActiveSubject(sub);s("subjects");}} style={{background:t.subjectColors[i],borderRadius:10,padding:"14px 16px",cursor:"pointer"}}>
                    <div style={{fontWeight:700,color:t.subjectText[i],fontSize:13}}>{sub}</div>
                    <div style={{fontSize:11,color:t.subjectText[i],opacity:0.7,marginTop:2}}>View materials →</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {page==="subjects"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📚 Subject Library</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Browse, download, and upload study materials</p>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              {SUBJECTS.map((s2,i)=>(
                <button key={s2} onClick={()=>{setActiveSubject(s2);setActiveTopic(null);}} style={{background:activeSubject===s2?t.subjectColors[i]:t.badge,color:activeSubject===s2?t.subjectText[i]:t.badgeText,border:`1px solid ${t.border}`,borderRadius:20,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:activeSubject===s2?700:500}}>{s2}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"190px 1fr",gap:16}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:11,color:t.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Topics</div>
                  {isAdmin&&<button onClick={()=>setShowAddTopic(!showAddTopic)} style={{...btn(true),fontSize:10,padding:"3px 8px"}}>+ Add</button>}
                </div>
                {isAdmin&&showAddTopic&&(
                  <div style={{marginBottom:8}}>
                    <input value={newTopicName} onChange={e=>setNewTopicName(e.target.value)} placeholder="New topic name" style={{...inp,marginBottom:4,fontSize:12}}/>
                    <button onClick={async()=>{if(newTopicName){await supabase.from("topics").insert({subject_id:SUBJECT_ID[activeSubject],name:newTopicName});showToast("Topic added! ✅");setNewTopicName("");setShowAddTopic(false);}}} style={{...btn(true),width:"100%",fontSize:12,padding:"6px"}}>Save Topic</button>
                  </div>
                )}
                <div onClick={()=>setActiveTopic(null)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:!activeTopic?t.accentLight:t.highlight,fontSize:12,color:!activeTopic?t.accentText:t.text,cursor:"pointer",fontWeight:!activeTopic?700:500}}>All Topics</div>
                {(DEFAULT_TOPICS[activeSubject]||[]).map(topic=>(
                  <div key={topic} onClick={()=>setActiveTopic(activeTopic===topic?null:topic)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:activeTopic===topic?t.accentLight:t.highlight,fontSize:12,color:activeTopic===topic?t.accentText:t.text,cursor:"pointer",fontWeight:activeTopic===topic?700:500}}>{topic}</div>
                ))}
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:15}}>{activeSubject}{activeTopic?` — ${activeTopic}`:""}</div>
                  <span style={{fontSize:12,color:t.textMuted}}>{materials.length} file{materials.length!==1?"s":""}</span>
                </div>
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleUpload(e.dataTransfer.files);}} style={{border:`2px dashed ${dragOver?t.accent:t.border}`,borderRadius:12,padding:"20px",textAlign:"center",background:dragOver?t.highlight:t.surface,marginBottom:16}}>
                  <div style={{fontSize:28,marginBottom:6}}>📂</div>
                  <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:13}}>{uploading?"Uploading...":"Drag & drop files here"}</div>
                  <div style={{fontSize:12,color:t.textMuted,marginBottom:10}}>PDF, Word, Excel, PowerPoint, Images</div>
                  <label style={{...btn(true),display:"inline-block",cursor:"pointer",padding:"7px 18px",fontSize:12}}>📎 Choose Files<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif" onChange={e=>handleUpload(e.target.files)} style={{display:"none"}}/></label>
                </div>
                {materials.length===0?(
                  <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:40,marginBottom:12}}>📭</div>
                    <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No materials yet</div>
                    <div style={{fontSize:13,color:t.textMuted}}>Upload the first file for {activeSubject}!</div>
                  </div>
                ):materials.map(mat=>(
                  <div key={mat.id} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                    <span style={{fontSize:26,flexShrink:0}}>{getIcon(mat.title+"."+mat.file_type)}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mat.title}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{mat.file_type?.toUpperCase()} · {fmtSize(mat.file_size_kb*1024)} · {fmtDate(mat.created_at)}{mat.is_approved?<span style={{color:"#4CAF50",marginLeft:8}}>✓</span>:<span style={{color:"#FF9800",marginLeft:8}}>⏳</span>}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>window.open(mat.file_url,"_blank")} style={{...btn(true),fontSize:11,padding:"5px 12px"}}>⬇ Download</button>
                      {(isAdmin||mat.uploaded_by===user?.id)&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("materials").delete().eq("id",mat.id);showToast("Deleted.");fetchMaterials();}} style={{...btn(false,true),fontSize:11,padding:"5px 10px"}}>🗑</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION BANK */}
        {page==="qbank"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>❓ Question Bank</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Practice MCQs with detailed explanations</p>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              {["All",...SUBJECTS].map(f=>(
                <button key={f} onClick={()=>{setQFilter(f);setQIdx(0);setSelected(null);setShowAnswer(false);}} style={{...btn(qFilter===f),fontSize:11,padding:"5px 12px"}}>{f}</button>
              ))}
              {isAdmin&&<button onClick={()=>setShowAddQ(!showAddQ)} style={{...btn(true),marginLeft:"auto",fontSize:12}}>+ Add Question</button>}
            </div>
            {isAdmin&&showAddQ&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Add New Question (Admin)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject</label><select value={newQ.subject} onChange={e=>setNewQ({...newQ,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Difficulty</label><select value={newQ.difficulty} onChange={e=>setNewQ({...newQ,difficulty:e.target.value})} style={inp}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                </div>
                <div style={{marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Question</label><textarea value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} placeholder="Enter question..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                {newQ.options.map((opt,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                    <input type="radio" checked={newQ.answer===i} onChange={()=>setNewQ({...newQ,answer:i})}/>
                    <input value={opt} onChange={e=>{const o=[...newQ.options];o[i]=e.target.value;setNewQ({...newQ,options:o});}} placeholder={`Option ${String.fromCharCode(65+i)}`} style={{...inp,flex:1}}/>
                  </div>
                ))}
                <div style={{marginTop:8,marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Explanation</label><textarea value={newQ.explanation} onChange={e=>setNewQ({...newQ,explanation:e.target.value})} placeholder="Explain the correct answer..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}><button onClick={handleAddQuestion} style={btn(true)}>Save Question</button><button onClick={()=>setShowAddQ(false)} style={btn(false)}>Cancel</button></div>
              </div>
            )}
            {questions.length===0?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No questions yet</div>
                {isAdmin&&<button onClick={()=>setShowAddQ(true)} style={{...btn(true),marginTop:8}}>+ Add First Question</button>}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"3px 10px",fontSize:11,fontWeight:600}}>{questions[qIdx]?.subject_id} · Q{qIdx+1}/{questions.length}</div>
                    <div style={{display:"flex",gap:4}}>{questions.map((_,i)=><div key={i} onClick={()=>{setQIdx(i);setSelected(null);setShowAnswer(false);}} style={{width:8,height:8,borderRadius:"50%",background:i===qIdx?t.accent:t.border,cursor:"pointer"}}/>)}</div>
                  </div>
                  <p style={{fontWeight:700,color:t.text,fontSize:15,lineHeight:1.6,marginBottom:16}}>{questions[qIdx]?.question_text}</p>
                  {(questions[qIdx]?.options||[]).map((opt,i)=>(
                    <div key={i} onClick={()=>!showAnswer&&setSelected(i)} style={{padding:"10px 14px",borderRadius:8,marginBottom:8,border:`1.5px solid ${selected===i?(showAnswer?i===Number(questions[qIdx]?.correct_answer)?"#4CAF50":"#c62828":t.accent):t.border}`,background:selected===i?(showAnswer?i===Number(questions[qIdx]?.correct_answer)?"#E8F5E9":"#FFEBEE":t.accentLight):t.surface,cursor:showAnswer?"default":"pointer",fontSize:13,color:t.text,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:22,height:22,borderRadius:"50%",border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,background:selected===i?t.accent:"transparent",color:selected===i?"#fff":t.textMuted}}>{String.fromCharCode(65+i)}</span>{opt}
                    </div>
                  ))}
                  {!showAnswer&&<button disabled={selected===null} onClick={()=>setShowAnswer(true)} style={{...btn(true),width:"100%",opacity:selected===null?0.5:1,marginTop:4}}>Check Answer</button>}
                  {showAnswer&&(
                    <div>
                      <div style={{background:t.highlight,border:`1px solid ${t.accentLight}`,borderRadius:8,padding:"12px 14px",marginTop:8}}>
                        <div style={{fontWeight:700,color:t.accent,marginBottom:6,fontSize:13}}>💡 Explanation</div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.7,margin:0}}>{questions[qIdx]?.explanation||"No explanation provided."}</p>
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:10}}>
                        <button onClick={()=>{setQIdx((qIdx+1)%questions.length);setSelected(null);setShowAnswer(false);}} style={{...btn(true),flex:1}}>Next →</button>
                        <button onClick={async()=>{await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:questions[qIdx]?.subject_id,question_text:questions[qIdx]?.question_text,correct_answer:(questions[qIdx]?.options||[])[Number(questions[qIdx]?.correct_answer)]});showToast("Added to Mistake Notebook ✅");}} style={{...btn(false),fontSize:12}}>❌ Add to Mistakes</button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={card}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>📈 Session Stats</div>
                    {[["Questions",questions.length],["Current",`Q${qIdx+1}`],["Answered",selected!==null?qIdx+1:qIdx]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:700,color:t.accent}}>{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS */}
        {page==="flashcards"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>🃏 Flashcards</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Spaced repetition for formulas, definitions & standards</p>
            <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
              {isAdmin&&<button onClick={()=>setShowAddFC(!showAddFC)} style={btn(true)}>+ Add Flashcard</button>}
              <span style={{fontSize:12,color:t.textMuted}}>{flashcards.length} cards</span>
            </div>
            {isAdmin&&showAddFC&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12}}>Add Flashcard (Admin Only)</div>
                <div style={{marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject</label><select value={newFC.subject} onChange={e=>setNewFC({...newFC,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Front (Question/Term)</label><textarea value={newFC.front} onChange={e=>setNewFC({...newFC,front:e.target.value})} placeholder="e.g. What is goodwill?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Back (Answer/Definition)</label><textarea value={newFC.back} onChange={e=>setNewFC({...newFC,back:e.target.value})} placeholder="e.g. Goodwill is the excess of..." rows={3} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}><button onClick={handleAddFlashcard} style={btn(true)}>Save</button><button onClick={()=>setShowAddFC(false)} style={btn(false)}>Cancel</button></div>
              </div>
            )}
            {flashcards.length===0?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>🃏</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No flashcards yet</div>
                {isAdmin&&<button onClick={()=>setShowAddFC(true)} style={{...btn(true),marginTop:8}}>+ Add First Flashcard</button>}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
                <div>
                  <div onClick={()=>setFcFlipped(!fcFlipped)} style={{background:fcFlipped?t.accent:t.card,border:`2px solid ${t.accentLight}`,borderRadius:16,padding:"48px 32px",textAlign:"center",cursor:"pointer",minHeight:220,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginBottom:16,transition:"background 0.3s"}}>
                    <div style={{fontSize:11,color:fcFlipped?"rgba(255,255,255,0.6)":t.textMuted,marginBottom:12,letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>{fcFlipped?"Answer":"Question"}</div>
                    <p className="serif" style={{fontSize:18,fontWeight:400,color:fcFlipped?"#fff":t.text,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{fcFlipped?flashcards[fcIdx]?.back_text:flashcards[fcIdx]?.front_text}</p>
                    {!fcFlipped&&<div style={{fontSize:12,color:t.textMuted,marginTop:16}}>tap to reveal answer</div>}
                  </div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
                    <button onClick={()=>{setFcIdx((fcIdx-1+flashcards.length)%flashcards.length);setFcFlipped(false);}} style={btn(false)}>← Prev</button>
                    <button onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={btn(true)}>Next →</button>
                  </div>
                  <div style={{textAlign:"center",fontSize:12,color:t.textMuted,marginBottom:12}}>Card {fcIdx+1} of {flashcards.length}</div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    {["😕 Hard","😐 Medium","😊 Easy"].map(r=><button key={r} onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{r}</button>)}
                  </div>
                </div>
                <div>
                  <div style={card}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>All Cards</div>
                    <div style={{maxHeight:400,overflowY:"auto"}}>
                      {flashcards.map((fc,i)=>(
                        <div key={i} onClick={()=>{setFcIdx(i);setFcFlipped(false);}} style={{padding:"8px 10px",borderRadius:6,marginBottom:6,background:i===fcIdx?t.accentLight:t.highlight,border:`1px solid ${i===fcIdx?t.accentLight:t.border}`,cursor:"pointer",fontSize:12,color:i===fcIdx?t.accentText:t.text}}>
                          <div style={{fontWeight:600,marginBottom:2}}>{fc.front_text?.length>45?fc.front_text.slice(0,45)+"...":fc.front_text}</div>
                          <div style={{fontSize:10,color:t.textMuted}}>Subject ID: {fc.subject_id}</div>
                        </div>
                      ))}
                    </div>
                    {isAdmin&&<button onClick={()=>setShowAddFC(true)} style={{...btn(true),width:"100%",fontSize:12,marginTop:8}}>+ Add Card</button>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MOCK EXAM */}
        {page==="mockexam"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📝 Mock Exam</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Simulate actual board exam conditions</p>
            {!examStarted&&!examDone&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:20}}>
                  {SUBJECTS.map((sub,i)=>(
                    <div key={sub} style={{...card,textAlign:"center",padding:"24px 16px",borderTop:`3px solid ${t.subjectColors[i]}`}}>
                      <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>{sub}</div>
                      <div style={{fontSize:12,color:t.textMuted,marginBottom:12}}>20 questions · 45 mins</div>
                      <button onClick={()=>startExam(sub)} style={{...btn(true),width:"100%",fontSize:12}}>Start Exam</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {examStarted&&!examDone&&(
              <div>
                <div style={{...card,background:t.accent,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px"}}>
                  <span style={{color:"#fff",fontWeight:700}}>{examSubject} Mock Exam</span>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{color:"#fff",background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",fontSize:13}}>{examQuestions.length} Questions</span>
                    <button onClick={submitExam} style={{...btn(false),background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",fontSize:12}}>Submit</button>
                  </div>
                </div>
                {examQuestions.map((mq,qi)=>(
                  <div key={mq.id} style={{...card,marginBottom:12}}>
                    <div style={{fontWeight:700,color:t.text,marginBottom:10,fontSize:14}}>{qi+1}. {mq.question_text}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {(mq.options||[]).map((opt,oi)=>(
                        <div key={oi} onClick={()=>setExamAnswers({...examAnswers,[qi]:oi})} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${examAnswers[qi]===oi?t.accent:t.border}`,background:examAnswers[qi]===oi?t.accentLight:t.surface,cursor:"pointer",fontSize:13,color:t.text}}>
                          <span style={{fontWeight:700,marginRight:6}}>{String.fromCharCode(65+oi)}.</span>{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitExam} style={{...btn(true),padding:"12px 32px",fontSize:14}}>Submit Exam</button>
              </div>
            )}
            {examDone&&(
              <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:16}}>🎉</div>
                <h2 style={{marginBottom:8}}>Exam Complete!</h2>
                <div style={{...card,textAlign:"left",marginBottom:16}}>
                  {[["Subject",examSubject],["Total Questions",examQuestions.length],["Answered",Object.keys(examAnswers).length]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`,fontSize:14}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:700,color:t.accent}}>{v}</span></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button onClick={()=>setExamDone(false)} style={{...btn(true),padding:"12px 28px"}}>Take Another</button>
                  <button onClick={()=>s("progress")} style={{...btn(false),padding:"12px 28px"}}>View Progress</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISCUSSIONS */}
        {page==="discussions"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>💬 Discussions</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Ask questions, share insights, upvote answers</p>
            {!activeDiscussion?(
              <>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                  <button onClick={()=>setShowAddD(!showAddD)} style={btn(true)}>+ Ask Question</button>
                  <span style={{fontSize:12,color:t.textMuted}}>{discussions.length} discussions</span>
                </div>
                {showAddD&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:12}}>Ask a Question</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject</label><select value={newD.subject} onChange={e=>setNewD({...newD,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    </div>
                    <div style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Your Question</label><textarea value={newD.question} onChange={e=>setNewD({...newD,question:e.target.value})} placeholder="e.g. How do we compute goodwill under PFRS 3?" rows={3} style={{...inp,resize:"vertical"}}/></div>
                    <div style={{display:"flex",gap:8}}><button onClick={handleAddDiscussion} style={btn(true)}>Post Question</button><button onClick={()=>setShowAddD(false)} style={btn(false)}>Cancel</button></div>
                  </div>
                )}
                {discussions.length===0?(
                  <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:40,marginBottom:12}}>💬</div>
                    <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No discussions yet</div>
                    <button onClick={()=>setShowAddD(true)} style={{...btn(true),marginTop:8}}>Ask the First Question</button>
                  </div>
                ):discussions.map(d=>(
                  <div key={d.id} style={{...card,cursor:"pointer"}} onClick={()=>setActiveDiscussion({...d,replies:[]})}>
                    <div style={{display:"flex",gap:10,marginBottom:8}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>?</div>
                      <div><div style={{fontWeight:600,fontSize:13,color:t.text}}>{d.title}</div><div style={{fontSize:11,color:t.textMuted,marginTop:2}}>Subject ID: {d.subject_id} · {fmtDate(d.created_at)}</div></div>
                    </div>
                    <p style={{fontSize:13,color:t.textMuted,paddingLeft:46,margin:0,lineHeight:1.5}}>{d.body?.slice(0,150)}{d.body?.length>150?"...":""}</p>
                  </div>
                ))}
              </>
            ):(
              <div>
                <button onClick={()=>setActiveDiscussion(null)} style={{...btn(false),marginBottom:16,fontSize:12}}>← Back to Discussions</button>
                <div style={card}>
                  <h2 style={{fontSize:16,marginBottom:4}}>{activeDiscussion.title}</h2>
                  <p style={{fontSize:14,color:t.textMuted,marginBottom:16,lineHeight:1.6}}>{activeDiscussion.body}</p>
                  <div style={{borderTop:`1px solid ${t.border}`,paddingTop:16}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Replies</div>
                    {(activeDiscussion.replies||[]).map((r,i)=>(
                      <div key={i} style={{background:t.highlight,borderRadius:8,padding:"12px 14px",marginBottom:8,border:`1px solid ${r.is_verified?"#A5D6A7":t.border}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <div style={{width:28,height:28,borderRadius:"50%",background:t.badge,color:t.badgeText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>U</div>
                          {r.is_verified&&<span style={{background:"#E8F5E9",color:"#2E7D32",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}>✓ Verified</span>}
                          {isAdmin&&!r.is_verified&&<button onClick={()=>handleVerifyReply(r.id)} style={{...btn(true),fontSize:10,padding:"2px 8px"}}>Verify Answer</button>}
                        </div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.6,margin:0}}>{r.body}</p>
                      </div>
                    ))}
                    <div style={{marginTop:12}}>
                      <textarea value={newReply} onChange={e=>setNewReply(e.target.value)} placeholder="Write your answer..." rows={3} style={{...inp,marginBottom:8,resize:"vertical"}}/>
                      <button onClick={handleAddReply} style={btn(true)}>Post Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NOTES VAULT */}
        {page==="notes"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📖 Notes Vault</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Your personal study notes, organized by subject</p>
            {!activeNote?(
              <>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                  <button onClick={()=>setShowAddNote(!showAddNote)} style={btn(true)}>+ New Note</button>
                  <span style={{fontSize:12,color:t.textMuted}}>{notes.length} notes</span>
                </div>
                {showAddNote&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:12}}>Create New Note</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Title</label><input value={newNote.title} onChange={e=>setNewNote({...newNote,title:e.target.value})} placeholder="e.g. PFRS 16 Summary" style={inp}/></div>
                      <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject</label><select value={newNote.subject} onChange={e=>setNewNote({...newNote,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    </div>
                    <div style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Content</label><textarea value={newNote.body} onChange={e=>setNewNote({...newNote,body:e.target.value})} placeholder="Start writing your notes here..." rows={5} style={{...inp,resize:"vertical"}}/></div>
                    <div style={{display:"flex",gap:8}}><button onClick={handleAddNote} style={btn(true)}>Save Note</button><button onClick={()=>setShowAddNote(false)} style={btn(false)}>Cancel</button></div>
                  </div>
                )}
                {notes.length===0?(
                  <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:40,marginBottom:12}}>📖</div>
                    <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No notes yet</div>
                    <button onClick={()=>setShowAddNote(true)} style={{...btn(true),marginTop:8}}>Create First Note</button>
                  </div>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                    {notes.map(n=>(
                      <div key={n.id} onClick={()=>setActiveNote(n)} style={{...card,cursor:"pointer",borderLeft:`3px solid ${t.accent}`,padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600}}>Subject {n.subject_id}</span><span style={{fontSize:10,color:t.textMuted}}>{fmtDate(n.created_at)}</span></div>
                        <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>{n.title}</div>
                        <div style={{fontSize:12,color:t.textMuted,lineHeight:1.5}}>{n.body?.slice(0,100)}{n.body?.length>100?"...":""}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ):(
              <div>
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <button onClick={()=>{setActiveNote(null);setEditingNote(false);}} style={{...btn(false),fontSize:12}}>← Back</button>
                  {!editingNote&&<button onClick={()=>setEditingNote(true)} style={{...btn(false),fontSize:12}}>✏️ Edit</button>}
                  <button onClick={()=>handleDeleteNote(activeNote.id)} style={{...btn(false,true),fontSize:12,marginLeft:"auto"}}>🗑 Delete</button>
                </div>
                <div style={card}>
                  {editingNote?(
                    <>
                      <input value={activeNote.title} onChange={e=>setActiveNote({...activeNote,title:e.target.value})} style={{...inp,marginBottom:12,fontSize:16,fontWeight:700}}/>
                      <textarea value={activeNote.body} onChange={e=>setActiveNote({...activeNote,body:e.target.value})} rows={12} style={{...inp,resize:"vertical",lineHeight:1.7}}/>
                      <div style={{display:"flex",gap:8,marginTop:12}}><button onClick={handleSaveNote} style={btn(true)}>Save</button><button onClick={()=>setEditingNote(false)} style={btn(false)}>Cancel</button></div>
                    </>
                  ):(
                    <>
                      <h2 style={{fontSize:20,marginBottom:16}}>{activeNote.title}</h2>
                      <div className="serif" style={{fontSize:15,color:t.text,lineHeight:1.9,whiteSpace:"pre-wrap",fontStyle:"italic"}}>{activeNote.body||"No content yet. Click Edit to add content."}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MISTAKE NOTEBOOK */}
        {page==="mistakes"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>❌ Mistake Notebook</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Review your wrong answers and learn from mistakes</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowAddM(!showAddM)} style={btn(true)}>+ Add Mistake</button>
              <span style={{fontSize:12,color:t.textMuted}}>{mistakes.length} mistakes logged</span>
            </div>
            {showAddM&&(
              <div style={{...card,borderLeft:`3px solid #c62828`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12}}>Log a Mistake</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject</label><select value={newM.subject} onChange={e=>setNewM({...newM,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
                <div style={{marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Question / Topic</label><textarea value={newM.q} onChange={e=>setNewM({...newM,q:e.target.value})} placeholder="What was the question?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:10}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Correct Answer</label><textarea value={newM.correct} onChange={e=>setNewM({...newM,correct:e.target.value})} placeholder="The correct answer is..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Personal Note</label><textarea value={newM.note} onChange={e=>setNewM({...newM,note:e.target.value})} placeholder="Why did I get this wrong?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}><button onClick={handleAddMistake} style={btn(true)}>Save Mistake</button><button onClick={()=>setShowAddM(false)} style={btn(false)}>Cancel</button></div>
              </div>
            )}
            {mistakes.length===0&&!showAddM?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No mistakes logged yet!</div>
                <div style={{fontSize:13,color:t.textMuted}}>Add wrong answers to review later.</div>
              </div>
            ):mistakes.map(m=>(
              <div key={m.id} style={{...card,borderLeft:`3px solid #ef9a9a`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{fontWeight:700,color:t.text,fontSize:13,flex:1,marginRight:8}}>❌ {m.question_text||"Untitled"}</div>
                  <button onClick={()=>handleDeleteMistake(m.id)} style={{...btn(false,true),fontSize:10,padding:"3px 8px",flexShrink:0}}>Remove</button>
                </div>
                {m.correct_answer&&<div style={{background:"#E8F5E9",borderRadius:6,padding:"8px 12px",marginBottom:6,fontSize:12,color:"#2E7D32"}}><strong>✅ Correct:</strong> {m.correct_answer}</div>}
                {m.personal_note&&<div style={{background:t.highlight,borderRadius:6,padding:"8px 12px",fontSize:12,color:t.text}}>📝 {m.personal_note}</div>}
                <div style={{fontSize:10,color:t.textMuted,marginTop:6}}>{fmtDate(m.created_at)}</div>
              </div>
            ))}
          </div>
        )}

        {/* STUDY GROUPS */}
        {page==="groups"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>👥 Study Groups</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Collaborate with fellow CPA reviewees</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowAddGroup(!showAddGroup)} style={btn(true)}>+ Create Group</button>
              <span style={{fontSize:12,color:t.textMuted}}>{groups.length} groups</span>
            </div>
            {showAddGroup&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12}}>Create Study Group</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Group Name</label><input value={newGroup.name} onChange={e=>setNewGroup({...newGroup,name:e.target.value})} placeholder="e.g. FAR Warriors" style={inp}/></div>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Subject Focus</label><select value={newGroup.subject} onChange={e=>setNewGroup({...newGroup,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Type</label><select value={newGroup.type} onChange={e=>setNewGroup({...newGroup,type:e.target.value})} style={inp}><option value="public">Public</option><option value="private">Private</option></select></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Description</label><textarea value={newGroup.description} onChange={e=>setNewGroup({...newGroup,description:e.target.value})} placeholder="What is this group about?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}><button onClick={handleAddGroup} style={btn(true)}>Create Group</button><button onClick={()=>setShowAddGroup(false)} style={btn(false)}>Cancel</button></div>
              </div>
            )}
            {groups.length===0?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>👥</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No groups yet</div>
                <button onClick={()=>setShowAddGroup(true)} style={{...btn(true),marginTop:8}}>Create First Group</button>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
                {groups.map(g=>(
                  <div key={g.id} style={{...card,borderTop:`3px solid ${t.accentLight}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{fontWeight:700,color:t.text,fontSize:14}}>{g.name}</div>
                      <span style={{background:g.type==="public"?t.badge:"#FFF3E0",color:g.type==="public"?t.badgeText:"#E65100",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600,textTransform:"capitalize"}}>{g.type}</span>
                    </div>
                    <div style={{fontSize:12,color:t.textMuted,marginBottom:6}}>Subject {g.subject_id} · {g.member_count} member{g.member_count!==1?"s":""}</div>
                    {g.description&&<p style={{fontSize:12,color:t.text,marginBottom:10,lineHeight:1.5}}>{g.description}</p>}
                    <button style={{...btn(true),width:"100%",fontSize:12}}>Join Group</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {page==="progress"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📊 Progress Analytics</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Track your mastery across all subjects and topics</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[["📝","Mock Exams","Track attempts","mockexam"],["❓","Questions","See your stats","qbank"],["🃏","Flashcards","Review progress","flashcards"],["❌","Mistakes","Review errors","mistakes"]].map(([icon,title,desc,pg])=>(
                <div key={title} onClick={()=>s(pg)} style={{...card,textAlign:"center",padding:"20px",cursor:"pointer"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
                  <div style={{fontWeight:700,color:t.text,fontSize:13,marginBottom:2}}>{title}</div>
                  <div style={{fontSize:11,color:t.textMuted}}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>Subject Overview</div>
              {SUBJECTS.map((sub,i)=>(
                <div key={sub} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{fontWeight:600}}>{sub}</span><span style={{color:t.accent,fontWeight:700}}>—</span></div>
                  <div style={{background:t.border,borderRadius:6,height:8}}><div style={{width:"0%",background:t.subjectColors[i],borderRadius:6,height:8}}/></div>
                </div>
              ))}
              <p style={{fontSize:12,color:t.textMuted,marginTop:8,fontStyle:"italic"}}>Progress tracking will populate as you answer questions and take exams.</p>
            </div>
          </div>
        )}

        {/* PLANNER */}
        {page==="planner"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📅 Study Planner</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Plan your path to board exam success</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={card}>
                <div style={{fontWeight:700,marginBottom:12,fontSize:15}}>🎯 Set Target Exam Date</div>
                <div style={{marginBottom:14}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Board Exam Date</label><input type="date" style={inp}/></div>
                <div style={{marginBottom:14}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Study Hours Available Per Day</label><select style={inp}><option>2 hours</option><option>4 hours</option><option>6 hours</option><option>8 hours</option></select></div>
                <div style={{marginBottom:14}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600}}>Weakest Subject</label><select style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <button style={{...btn(true),width:"100%"}}>Generate Study Plan</button>
              </div>
              <div style={card}>
                <div style={{fontWeight:700,marginBottom:12,fontSize:15}}>📋 Daily Tasks</div>
                {["Review FAR – Leases","Practice TAX MCQs x20","Read MAS Standard Costing","Flashcards – AFAR","Mock Exam Review"].map((task,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                    <input type="checkbox"/><span style={{fontSize:13,color:t.text}}>{task}</span>
                  </div>
                ))}
                <p style={{fontSize:12,color:t.textMuted,marginTop:12,fontStyle:"italic"}}>Set your exam date above to generate a personalized plan.</p>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {page==="leaderboard"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>🏆 Leaderboard</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Top contributors this month</p>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>🌟 Top Students</div>
              <div style={{textAlign:"center",padding:"32px",background:t.highlight,borderRadius:10}}>
                <div style={{fontSize:32,marginBottom:8}}>🏆</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>Leaderboard coming soon!</div>
                <p style={{fontSize:13,color:t.textMuted}}>Rankings will populate as students answer questions, upload materials, and participate in discussions.</p>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile"&&(
          <div style={{maxWidth:600}}>
            <h1 style={{fontSize:22,marginBottom:4}}>👤 My Profile</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Manage your account information</p>
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:24}}>{(profile?.full_name||user?.email||"?")[0].toUpperCase()}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:18}}>{profile?.full_name||"No name set"}</div>
                  <div style={{fontSize:13,color:t.textMuted}}>{user?.email}</div>
                  <div style={{display:"flex",gap:6,marginTop:4}}>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{profile?.role||"student"}</span>
                    <span style={{background:profile?.is_approved?"#E8F5E9":"#FFF3E0",color:profile?.is_approved?"#2E7D32":"#E65100",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600}}>{profile?.is_approved?"✓ Approved":"⏳ Pending"}</span>
                  </div>
                </div>
                <button onClick={()=>setEditingProfile(!editingProfile)} style={{...btn(editingProfile),marginLeft:"auto"}}>{editingProfile?"Cancel":"✏️ Edit"}</button>
              </div>
              {editingProfile?(
                <div>
                  {[["Full Name","full_name","e.g. Juls Domingo"],["School","school","e.g. UST, DLSU"],["Year Level","year_level","e.g. 4th Year, Graduate"]].map(([label,field,ph])=>(
                    <div key={field} style={{marginBottom:14}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</label><input value={editForm[field]||""} onChange={e=>setEditForm({...editForm,[field]:e.target.value})} placeholder={ph} style={inp}/></div>
                  ))}
                  <button onClick={handleSaveProfile} disabled={savingProfile} style={{...btn(true),padding:"10px 24px"}}>{savingProfile?"Saving...":"Save Changes"}</button>
                </div>
              ):(
                <div>
                  {[["Full Name",profile?.full_name||"—"],["Email",user?.email],["School",profile?.school||"—"],["Year Level",profile?.year_level||"—"],["Role",profile?.role||"student"],["Member Since",fmtDate(profile?.created_at)]].map(([label,val])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted,fontWeight:600}}>{label}</span><span style={{fontWeight:500,color:t.text,textTransform:label==="Role"?"capitalize":"none"}}>{val}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:10,fontSize:14}}>🔒 Account Security</div>
              <p style={{fontSize:13,color:t.textMuted,marginBottom:12}}>To change your password, sign out and use the forgot password option on the login page.</p>
              <button onClick={handleLogout} style={btn(false,true)}>Sign Out</button>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {page==="admin"&&isAdmin&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>🛡️ Admin Panel</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Manage payments, users, and content</p>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:4,fontSize:15}}>💳 Pending Payments</div>
              <div style={{fontSize:12,color:t.textMuted,marginBottom:16}}>{pendingPayments.length} pending verification{pendingPayments.length!==1?"s":""}</div>
              {pendingPayments.length===0?(
                <div style={{textAlign:"center",padding:"32px",background:t.highlight,borderRadius:10}}>
                  <div style={{fontSize:32,marginBottom:8}}>✅</div>
                  <div style={{color:t.textMuted,fontSize:14}}>No pending payments</div>
                </div>
              ):pendingPayments.map(p=>(
                <div key={p.id} style={{...card,borderLeft:`3px solid ${t.accent}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontWeight:700,fontSize:13}}>User: {p.user_id?.slice(0,12)}...</div><div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{fmtDate(p.created_at)}</div></div>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"3px 10px",fontSize:11,fontWeight:700}}>₱{p.amount}</span>
                  </div>
                  <div style={{fontSize:13,color:t.text,marginBottom:10}}><strong>Ref #:</strong> {p.reference_number} · <strong>Via:</strong> {p.payment_method}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>handleApprovePayment(p)} style={{...btn(true),fontSize:12,padding:"6px 16px"}}>✅ Approve Access</button>
                    <button onClick={async()=>{await supabase.from("user_payments").update({status:"rejected"}).eq("id",p.id);showToast("Rejected.");fetchPendingPayments();}} style={{...btn(false,true),fontSize:12,padding:"6px 16px"}}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:12,fontSize:15}}>⚡ Quick Approve User by ID</div>
              <p style={{fontSize:12,color:t.textMuted,marginBottom:10}}>Go to Supabase → Authentication → Users to find the user ID, then run in SQL Editor:</p>
              <div style={{background:"#1e1e1e",borderRadius:8,padding:"12px 16px",fontSize:12,color:"#a8ff78",fontFamily:"monospace",lineHeight:1.8}}>
                UPDATE profiles SET is_approved = true, role = 'student'<br/>
                WHERE id = 'paste-user-id-here';
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}