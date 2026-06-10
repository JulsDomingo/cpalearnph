import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const LOGO_URL = "https://gxijcltazyshbmsfjbdf.supabase.co/storage/v1/object/public/avatars/CPALearn-removebg-preview.png";
const MARIBANK_QR = "https://gxijcltazyshbmsfjbdf.supabase.co/storage/v1/object/public/avatars/maribank.jpeg";

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Sorts+Mill+Goudy:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Montserrat',sans-serif;}
h1,h2,h3{font-family:'Montserrat',sans-serif;font-weight:800;letter-spacing:-0.5px;}
.serif{font-family:'Sorts Mill Goudy',serif;}
input,textarea,select,button{font-family:'Montserrat',sans-serif;}
.note-editor{outline:none;min-height:300px;padding:16px;font-size:14px;line-height:1.9;word-break:break-word;}
.note-editor table{border-collapse:collapse;width:100%;margin:12px 0;}
.note-editor table td,.note-editor table th{border:1px solid #ccc;padding:8px 10px;min-width:60px;}
.note-editor table th{background:#f5f5f5;font-weight:700;}
.note-editor hr{border:none;border-top:2px solid #ddd;margin:16px 0;}
@media print{
  body *{visibility:hidden;}
  .print-zone,.print-zone *{visibility:visible;}
  .print-zone{position:fixed;top:0;left:0;width:100%;padding:32px;background:white;}
  .no-print{display:none!important;}
}
`;

const PASTEL={name:"pastel",bg:"#FDF6FB",surface:"#FFF0F7",card:"#FFFFFF",sidebar:"#F9E8F5",sidebarBorder:"#EEC8E8",accent:"#D46FAC",accentLight:"#F7C8E8",accentText:"#A3347A",text:"#3D1F35",textMuted:"#9B6A87",border:"#EDD5E8",badge:"#F4DAEF",badgeText:"#8B3B72",highlight:"#FDE8F5",navActive:"#F7C8E8",navActiveText:"#8B3B72",subjectColors:["#F8B4D9","#C3B1E1","#B5EAD7","#FFDAC1","#B5D5F5","#F9C9C9","#CBE4C4"],subjectText:["#8B3B72","#5B3E8F","#2A7D5A","#A85D00","#1A5FAD","#9B2828","#3D6B2A"]};
const EARTHY={name:"earthy",bg:"#F5F0E8",surface:"#EDE5D8",card:"#FDFAF5",sidebar:"#EAE0CE",sidebarBorder:"#C8B89A",accent:"#7C6248",accentLight:"#D4BFA0",accentText:"#5C3D1E",text:"#2C1F0E",textMuted:"#7A6248",border:"#D4C4A8",badge:"#E8DCC8",badgeText:"#5C3D1E",highlight:"#F0E8D5",navActive:"#D4BFA0",navActiveText:"#5C3D1E",subjectColors:["#D4A574","#B5C99A","#A8C4C8","#D4B896","#C4A8B8","#B8C4A0","#C8B084"],subjectText:["#5C3D1E","#3A5A1E","#1E4A50","#5C3D1E","#4A2848","#2A4A1E","#4A3808"]};

const SUBJECTS=["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"];
const SUBJECT_ID={"FAR":1,"AFAR":2,"MAS":3,"RFBT":4,"TAX":5,"Auditing Theory":6,"Auditing Problems":7};
const ID_SUBJECT={1:"FAR",2:"AFAR",3:"MAS",4:"RFBT",5:"TAX",6:"Auditing Theory",7:"Auditing Problems"};
const DEFAULT_TOPICS={FAR:["Cash & Cash Equivalents","Receivables","Inventories","PPE","Intangibles","Investments","Liabilities","Equity","Revenue Recognition","Leases"],AFAR:["Business Combination","Consolidation","Foreign Currency","Joint Arrangement","Government Accounting","Liquidation","Installment Sales"],MAS:["Cost Concepts","CVP Analysis","Budgeting","Standard Costing","Variance Analysis","Decision Making","Transfer Pricing","Performance Evaluation"],RFBT:["Law on Obligations","Law on Contracts","Sales","Agency","Partnership","Corporation","Negotiable Instruments","Insurance"],TAX:["Income Tax - Individuals","Income Tax - Corporate","VAT","Other Percentage Taxes","Excise Tax","Estate Tax","Donor's Tax","Tax Remedies"],"Auditing Theory":["Audit Concepts","Professional Standards","Audit Risk","Internal Control","Audit Evidence","Audit Sampling","Audit Reports","Ethics"],"Auditing Problems":["Cash Audit","Receivables Audit","Inventory Audit","PPE Audit","Liabilities Audit","Equity Audit","Revenue Audit","Expense Audit"]};
const FILE_ICONS={"pdf":"📄","doc":"📝","docx":"📝","xls":"📊","xlsx":"📊","ppt":"📋","pptx":"📋","png":"🖼","jpg":"🖼","jpeg":"🖼","gif":"🖼","default":"📁"};
const getIcon=(n)=>{const e=n?.split(".").pop()?.toLowerCase();return FILE_ICONS[e]||FILE_ICONS.default;};
const fmtSize=(b)=>{if(!b)return"";if(b<1048576)return(b/1024).toFixed(1)+"KB";return(b/1048576).toFixed(1)+"MB";};
const fmtDate=(d)=>d?new Date(d).toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"}):"—";
const fmtShortDate=(d)=>d?new Date(d).toLocaleDateString("en-PH",{month:"short",day:"numeric"}):"";
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const EXAM_TYPES=["Evaluation Exam","Quiz","Prelims","Midterms","Finals","Qualifying Exam","Comprehensive Exam","Board Exam"];
const ACTIVITY_TYPES=["Study","Review","Practice Exam","Flashcards","Rest","Workout","Personal Errands","Movie Break","Family Time","Reading","Other"];
const PAID_PAGES=["qbank","flashcards","mockexam","discussions","groups","leaderboard","progress"];

export default function App(){
  const [theme,setTheme]=useState(PASTEL);
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [toast,setToast]=useState(null);
  const [loginForm,setLoginForm]=useState({email:"",pass:""});
  const [loginError,setLoginError]=useState("");
  const [showRegister,setShowRegister]=useState(false);
  const [registerForm,setRegisterForm]=useState({name:"",email:"",pass:"",school:""});
  // payment
  const [payStep,setPayStep]=useState(1);
  const [payForm,setPayForm]=useState({ref:"",screenshotName:""});
  const [submittingPay,setSubmittingPay]=useState(false);
  const [pendingPayments,setPendingPayments]=useState([]);
  const [allUsers,setAllUsers]=useState([]);
  // profile edit
  const [editingProfile,setEditingProfile]=useState(false);
  const [editForm,setEditForm]=useState({});
  // subjects
  const [activeSubject,setActiveSubject]=useState("FAR");
  const [activeTopic,setActiveTopic]=useState(null);
  const [materials,setMaterials]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [showAddTopic,setShowAddTopic]=useState(false);
  const [newTopicName,setNewTopicName]=useState("");
  // questions
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [qFilter,setQFilter]=useState("All");
  const [showAddQ,setShowAddQ]=useState(false);
  const [newQ,setNewQ]=useState({subject:"FAR",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});
  // flashcards
  const [flashcards,setFlashcards]=useState([]);
  const [fcIdx,setFcIdx]=useState(0);
  const [fcFlipped,setFcFlipped]=useState(false);
  const [showAddFC,setShowAddFC]=useState(false);
  const [newFC,setNewFC]=useState({subject:"FAR",front:"",back:""});
  // mock exam
  const [examStarted,setExamStarted]=useState(false);
  const [examAnswers,setExamAnswers]=useState({});
  const [examDone,setExamDone]=useState(false);
  const [examQuestions,setExamQuestions]=useState([]);
  const [examSubject,setExamSubject]=useState("FAR");
  const [examScore,setExamScore]=useState(0);
  const [examWrong,setExamWrong]=useState([]);
  const [showAddExamQ,setShowAddExamQ]=useState(false);
  const [examQSubjectFilter,setExamQSubjectFilter]=useState("FAR");
  // discussions
  const [discussions,setDiscussions]=useState([]);
  const [activeDiscussion,setActiveDiscussion]=useState(null);
  const [showAddD,setShowAddD]=useState(false);
  const [newD,setNewD]=useState({subject:"FAR",question:""});
  const [newReply,setNewReply]=useState("");
  // notes
  const [notes,setNotes]=useState([]);
  const [activeNote,setActiveNote]=useState(null);
  const [noteMode,setNoteMode]=useState("list");
  const [noteForm,setNoteForm]=useState({title:"",subject:"FAR",topic:"",body:"",is_shared:false});
  const editorRef=useRef(null);
  // mistakes
  const [mistakes,setMistakes]=useState([]);
  const [showAddM,setShowAddM]=useState(false);
  const [newM,setNewM]=useState({q:"",correct:"",note:"",subject:"FAR"});
  // groups
  const [groups,setGroups]=useState([]);
  const [showAddGroup,setShowAddGroup]=useState(false);
  const [newGroup,setNewGroup]=useState({name:"",subject:"FAR",type:"public",description:""});
  // planner
  const [plannerSetup,setPlannerSetup]=useState({targetDate:"",examType:"Board Exam",studyHoursPerDay:4,breakDays:["Sun"],priorities:["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"]});
  const [plannerBlocks,setPlannerBlocks]=useState([]);
  const [generatedPlan,setGeneratedPlan]=useState(null);
  const [showPlannerSetup,setShowPlannerSetup]=useState(true);
  const [customBlocks,setCustomBlocks]=useState([]);
  const [showAddBlock,setShowAddBlock]=useState(false);
  const [newBlock,setNewBlock]=useState({day:"Mon",startTime:"08:00",endTime:"09:00",activity:"Study",subject:"FAR",notes:""});
  const printRef=useRef(null);

  const t=theme;
  const isAdmin=profile?.role==="admin";
  const isPaid=isAdmin||profile?.is_approved;
  const card={background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:"18px 20px",marginBottom:12};
  const btn=(primary,danger)=>({background:primary?t.accent:danger?"#c62828":"transparent",color:primary||danger?"#fff":t.accentText,border:`1px solid ${primary?t.accent:danger?"#c62828":t.border}`,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:600,fontSize:13});
  const inp={width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,background:t.surface,color:t.text};
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const navItems=[
    {id:"dashboard",icon:"🏠",label:"Dashboard",free:true},
    {id:"subjects",icon:"📚",label:"Subjects",free:true},
    {id:"notes",icon:"📖",label:"Notes",free:true},
    {id:"planner",icon:"📅",label:"Planner",free:true},
    {id:"mistakes",icon:"❌",label:"Mistake Notebook",free:true},
    {id:"qbank",icon:"❓",label:"Question Bank",free:false},
    {id:"flashcards",icon:"🃏",label:"Flashcards",free:false},
    {id:"mockexam",icon:"📝",label:"Mock Exam",free:false},
    {id:"discussions",icon:"💬",label:"Discussions",free:false},
    {id:"groups",icon:"👥",label:"Study Groups",free:false},
    {id:"progress",icon:"📊",label:"Progress",free:false},
    {id:"leaderboard",icon:"🏆",label:"Leaderboard",free:false},
    {id:"profile",icon:"👤",label:"My Profile",free:true},
    ...(isAdmin?[{id:"admin",icon:"🛡️",label:"Admin Panel",free:true}]:[]),
  ];

  const s=(p)=>{
    if(PAID_PAGES.includes(p)&&!isPaid){showToast("Upgrade to full access to use this feature.","error");setPage("payment");setPayStep(1);return;}
    setPage(p);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session){setUser(session.user);loadProfile(session.user.id);}});
    supabase.auth.onAuthStateChange((_,session)=>{if(session){setUser(session.user);loadProfile(session.user.id);}else{setUser(null);setProfile(null);setPage("landing");}});
  },[]);

  const loadProfile=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){setProfile(data);setEditForm(data);}
    setPage("dashboard");
  };

  useEffect(()=>{if(page==="subjects"&&user)fetchMaterials();},[page,activeSubject]);
  useEffect(()=>{if(page==="qbank"&&isPaid)fetchQuestions();},[page,qFilter]);
  useEffect(()=>{if(page==="flashcards"&&isPaid)fetchFlashcards();},[page]);
  useEffect(()=>{if(page==="discussions"&&isPaid)fetchDiscussions();},[page]);
  useEffect(()=>{if(page==="notes"&&user)fetchNotes();},[page]);
  useEffect(()=>{if(page==="mistakes"&&user)fetchMistakes();},[page]);
  useEffect(()=>{if(page==="groups"&&isPaid)fetchGroups();},[page]);
  useEffect(()=>{if(page==="admin"&&isAdmin){fetchPendingPayments();fetchAllUsers();};},[page]);
  useEffect(()=>{if(activeDiscussion?.id)fetchReplies(activeDiscussion.id);},[activeDiscussion?.id]);

  const fetchMaterials=async()=>{
    let q=supabase.from("materials").select("*").order("created_at",{ascending:false}).eq("subject_id",SUBJECT_ID[activeSubject]||1);
    if(!isPaid)q=q.eq("uploaded_by",user?.id);
    else q=q.or(`visibility.eq.shared,uploaded_by.eq.${user?.id}`);
    const{data}=await q;setMaterials(data||[]);
  };
  const fetchQuestions=async()=>{let q=supabase.from("questions").select("*").eq("is_approved",true).order("created_at",{ascending:false});if(qFilter!=="All")q=q.eq("subject_id",SUBJECT_ID[qFilter]);const{data}=await q;setQuestions(data||[]);};
  const fetchFlashcards=async()=>{const{data}=await supabase.from("flashcards").select("*").eq("visibility","shared").order("created_at",{ascending:false});setFlashcards(data||[]);};
  const fetchDiscussions=async()=>{const{data}=await supabase.from("discussions").select("*").order("created_at",{ascending:false});setDiscussions(data||[]);};
  const fetchReplies=async(did)=>{const{data}=await supabase.from("discussion_replies").select("*").eq("discussion_id",did).order("created_at",{ascending:true});setActiveDiscussion(d=>({...d,replies:data||[]}));};
  const fetchNotes=async()=>{const{data}=await supabase.from("user_notes").select("*").order("updated_at",{ascending:false}).or(`user_id.eq.${user.id}${isPaid?",is_shared.eq.true":""}`);setNotes(data||[]);};
  const fetchMistakes=async()=>{const{data}=await supabase.from("mistake_notebook").select("*").eq("user_id",user.id).order("created_at",{ascending:false});setMistakes(data||[]);};
  const fetchGroups=async()=>{const{data}=await supabase.from("study_groups").select("*").order("created_at",{ascending:false});setGroups(data||[]);};
  const fetchPendingPayments=async()=>{const{data}=await supabase.from("user_payments").select("*").eq("status","pending").order("created_at",{ascending:false});setPendingPayments(data||[]);};
  const fetchAllUsers=async()=>{const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});setAllUsers(data||[]);};

  const handleLogin=async()=>{setLoginError("");const{error}=await supabase.auth.signInWithPassword({email:loginForm.email,password:loginForm.pass});if(error)setLoginError(error.message);};
  const handleRegister=async()=>{setLoginError("");if(!registerForm.name||!registerForm.email||!registerForm.pass){setLoginError("Fill in all required fields.");return;}const{error}=await supabase.auth.signUp({email:registerForm.email,password:registerForm.pass,options:{data:{full_name:registerForm.name,school:registerForm.school}}});if(error)setLoginError(error.message);else{showToast("Account created! Explore the free features or upgrade for full access.");setShowRegister(false);}};
  const handleLogout=async()=>{await supabase.auth.signOut();};

  const handleUpload=async(files)=>{
    if(!files?.length)return;setUploading(true);
    for(const file of files){
      const path=`${activeSubject}/${Date.now()}_${file.name}`;
      const{error:upErr}=await supabase.storage.from("materials").upload(path,file,{cacheControl:"3600",upsert:false});
      if(upErr){showToast(`Failed: ${file.name}`,"error");continue;}
      const{data:urlData}=supabase.storage.from("materials").getPublicUrl(path);
      await supabase.from("materials").insert({subject_id:SUBJECT_ID[activeSubject]||1,uploaded_by:user.id,title:file.name.replace(/\.[^/.]+$/,""),file_url:urlData.publicUrl,file_type:file.name.split(".").pop(),file_size_kb:Math.round(file.size/1024),visibility:isPaid?"shared":"private",is_approved:isAdmin});
      showToast(`✅ ${file.name} uploaded!`);
    }
    setUploading(false);fetchMaterials();
  };

  // ── RICH TEXT EDITOR ──
  const execCmd=(cmd,val=null)=>{document.execCommand(cmd,false,val);editorRef.current?.focus();};
  const insertTable=()=>{
    const rows=parseInt(prompt("Number of rows:",3)||3);
    const cols=parseInt(prompt("Number of columns:",3)||3);
    let html="<table><tr>"+(Array(cols).fill("<th>Header</th>").join(""))+"</tr>";
    for(let r=0;r<rows-1;r++){html+="<tr>"+(Array(cols).fill("<td>Cell</td>").join(""))+"</tr>";}
    html+="</table>";
    execCmd("insertHTML",html);
  };
  const insertHR=()=>execCmd("insertHTML","<hr/><p></p>");

  const saveNote=async()=>{
    const body=editorRef.current?.innerHTML||"";
    if(!noteForm.title){showToast("Add a title","error");return;}
    if(activeNote?.id){
      await supabase.from("user_notes").update({title:noteForm.title,subject_id:SUBJECT_ID[noteForm.subject]||null,body,is_shared:noteForm.is_shared&&isPaid,updated_at:new Date().toISOString()}).eq("id",activeNote.id);
      showToast("Note saved! ✅");setActiveNote({...activeNote,title:noteForm.title,body,is_shared:noteForm.is_shared});
    } else {
      const{data}=await supabase.from("user_notes").insert({user_id:user.id,subject_id:SUBJECT_ID[noteForm.subject]||null,title:noteForm.title,body,is_shared:noteForm.is_shared&&isPaid}).select().single();
      setActiveNote(data);
    }
    fetchNotes();
  };

  const printNote=()=>{
    const body=editorRef.current?.innerHTML||activeNote?.body||"";
    const win=window.open("","_blank");
    win.document.write(`<html><head><title>${noteForm.title}</title>
    <style>body{font-family:'Montserrat',sans-serif;padding:40px;max-width:800px;margin:0 auto;}
    table{border-collapse:collapse;width:100%;margin:12px 0;}td,th{border:1px solid #999;padding:8px 10px;}th{background:#f0f0f0;}
    hr{border:none;border-top:2px solid #333;margin:16px 0;}
    .hdr{text-align:center;border-bottom:2px solid #D46FAC;padding-bottom:16px;margin-bottom:24px;}
    .ftr{margin-top:40px;padding-top:12px;border-top:1px solid #ccc;font-size:12px;color:#888;}
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    </style></head><body>
    <div class="hdr"><img src="${LOGO_URL}" style="height:40px;margin-bottom:6px;"/><br/>
    <strong style="font-size:18px;color:#D46FAC;">CPALearn PH</strong><br/>
    <span style="font-size:13px;color:#888;">${noteForm.subject||"—"}${noteForm.topic?` · ${noteForm.topic}`:""}</span><br/>
    <span style="font-size:12px;color:#888;">Date Generated: ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</span></div>
    <h2 style="margin-bottom:16px;">${noteForm.title}</h2>
    <div>${body}</div>
    <div class="ftr">Prepared by: ${profile?.full_name||user?.email}</div>
    </body></html>`);
    win.document.close();setTimeout(()=>win.print(),500);
  };

  // ── MOCK EXAM ──
  const startExam=async(subj)=>{
    setExamSubject(subj);
    const{data}=await supabase.from("questions").select("*").eq("subject_id",SUBJECT_ID[subj]).eq("is_approved",true).limit(60);
    if(!data||data.length===0){showToast(`No questions available for ${subj} yet. Admin needs to add questions first.`,"error");return;}
    // Shuffle questions
    const shuffled=[...data].sort(()=>Math.random()-0.5);
    setExamQuestions(shuffled);setExamAnswers({});setExamStarted(true);setExamDone(false);setExamWrong([]);
  };

  const submitExam=async()=>{
    let correct=0;const wrongList=[];
    examQuestions.forEach((q,i)=>{
      const isCorrect=String(examAnswers[i])===String(q.correct_answer);
      if(isCorrect)correct++;
      else wrongList.push(q);
    });
    setExamScore(correct);setExamWrong(wrongList);

    // Save attempt
    await supabase.from("exam_attempts").insert({user_id:user.id,answers:examAnswers,score:(correct/examQuestions.length)*100,total_questions:examQuestions.length,completed_at:new Date().toISOString()});

    // Auto-add wrong answers to mistake notebook
    // First check existing mistakes for this user
    const{data:existing}=await supabase.from("mistake_notebook").select("question_text").eq("user_id",user.id);
    const existingQs=new Set((existing||[]).map(m=>m.question_text));

    for(const q of wrongList){
      if(!existingQs.has(q.question_text)){
        // New mistake — add it
        await supabase.from("mistake_notebook").insert({
          user_id:user.id,
          subject_id:q.subject_id,
          question_text:q.question_text,
          correct_answer:(q.options||[])[Number(q.correct_answer)],
          personal_note:"Added from Mock Exam",
        });
      }
    }

    // Remove mistakes that were answered correctly this time
    const correctQuestions=examQuestions.filter((q,i)=>String(examAnswers[i])===String(q.correct_answer));
    for(const q of correctQuestions){
      await supabase.from("mistake_notebook").delete().eq("user_id",user.id).eq("question_text",q.question_text);
    }

    setExamDone(true);setExamStarted(false);
  };

  // ── STUDY PLANNER GENERATOR ──
  const generatePlan=()=>{
    if(!plannerSetup.targetDate){showToast("Please set a target exam date","error");return;}
    const today=new Date();
    const target=new Date(plannerSetup.targetDate);
    const daysLeft=Math.floor((target-today)/(1000*60*60*24));
    if(daysLeft<=0){showToast("Target date must be in the future","error");return;}

    const studyDays=DAYS.filter(d=>!plannerSetup.breakDays.includes(d));
    const totalStudyDays=Math.floor(daysLeft*(studyDays.length/7));
    const priorities=plannerSetup.priorities;
    // Allocate days per subject based on priority (higher priority = more days)
    const weights=priorities.map((_,i)=>priorities.length-i);
    const totalWeight=weights.reduce((a,b)=>a+b,0);
    const daysPerSubject=priorities.map((sub,i)=>({subject:sub,days:Math.max(1,Math.floor((weights[i]/totalWeight)*totalStudyDays))}));

    // Build weekly schedule
    const plan=[];
    let currentDate=new Date(today);
    let subjectIdx=0;let dayCount=0;

    while(currentDate<=target&&subjectIdx<priorities.length){
      const dayName=DAYS[currentDate.getDay()];
      if(!plannerSetup.breakDays.includes(dayName)){
        const sub=priorities[subjectIdx];
        const allocated=daysPerSubject.find(d=>d.subject===sub);
        plan.push({
          date:new Date(currentDate),
          day:dayName,
          subject:sub,
          activity:"Study",
          timeBlocks:generateTimeBlocks(plannerSetup.studyHoursPerDay,sub,customBlocks.filter(b=>b.day===dayName)),
        });
        dayCount++;
        if(allocated&&dayCount>=allocated.days){subjectIdx++;dayCount=0;}
      } else {
        plan.push({date:new Date(currentDate),day:dayName,subject:"Rest",activity:"Rest",timeBlocks:[{time:"All Day",activity:"Rest/Personal Time",notes:"Recharge for the week ahead!"}]});
      }
      currentDate.setDate(currentDate.getDate()+1);
    }

    setGeneratedPlan({plan,daysLeft,totalStudyDays,daysPerSubject,studyDays});
    setShowPlannerSetup(false);
  };

  const generateTimeBlocks=(hours,subject,custom)=>{
    const blocks=[];
    let start=8;// 8 AM default
    // Add study blocks
    const studyEnd=start+hours;
    blocks.push({time:`${start}:00 AM – ${studyEnd<=12?studyEnd+":00 AM":studyEnd-12+":00 PM"}`,activity:`📚 Study – ${subject}`,notes:`Focus on ${DEFAULT_TOPICS[subject]?.[Math.floor(Math.random()*DEFAULT_TOPICS[subject].length)]||subject}`});
    blocks.push({time:`${studyEnd<=12?studyEnd+":00 AM":(studyEnd-12)+":00 PM"} – ${(studyEnd+1)<=12?(studyEnd+1)+":00 AM":(studyEnd+1-12)+":00 PM"}`,activity:"☕ Break",notes:"Rest, eat, recharge"});
    blocks.push({time:`${(studyEnd+1)<=12?(studyEnd+1)+":00 AM":(studyEnd+1-12)+":00 PM"} – ${(studyEnd+2)<=12?(studyEnd+2)+":00 AM":(studyEnd+2-12)+":00 PM"}`,activity:`❓ Practice MCQs – ${subject}`,notes:"From Question Bank"});
    // Add custom blocks
    custom.forEach(c=>blocks.push({time:`${c.startTime} – ${c.endTime}`,activity:`${c.activity}${c.subject&&c.activity==="Study"?" – "+c.subject:""}`,notes:c.notes||""}));
    return blocks;
  };

  const printPlan=()=>{
    if(!generatedPlan)return;
    const win=window.open("","_blank");
    const rows=generatedPlan.plan.slice(0,14).map(day=>`
      <tr style="background:${day.subject==="Rest"?"#f9f9f9":"white"}">
        <td style="font-weight:700;white-space:nowrap;">${day.date.toLocaleDateString("en-PH",{month:"short",day:"numeric"})}<br/><small>${day.day}</small></td>
        <td style="color:${day.subject==="Rest"?"#888":"#D46FAC"};font-weight:600;">${day.subject}</td>
        <td>${day.timeBlocks.map(b=>`<div style="margin-bottom:6px;"><strong>${b.time}</strong><br/>${b.activity}${b.notes?`<br/><small style="color:#888;">${b.notes}</small>`:""}</div>`).join("")}</td>
      </tr>
    `).join("");
    win.document.write(`<html><head><title>CPALearn PH — Study Plan</title>
    <style>body{font-family:'Montserrat',sans-serif;padding:32px;}table{width:100%;border-collapse:collapse;font-size:12px;}td{border:1px solid #ddd;padding:8px;vertical-align:top;}
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');</style></head><body>
    <div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #D46FAC;">
      <img src="${LOGO_URL}" style="height:40px;margin-bottom:6px;"/><br/>
      <strong style="font-size:18px;color:#D46FAC;">CPALearn PH — Study Plan</strong><br/>
      <span style="font-size:13px;color:#888;">${profile?.full_name||user?.email} · Target: ${plannerSetup.examType} on ${new Date(plannerSetup.targetDate).toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</span><br/>
      <span style="font-size:12px;color:#888;">${generatedPlan.daysLeft} days remaining · ${generatedPlan.totalStudyDays} study days · ${plannerSetup.studyHoursPerDay}h/day</span>
    </div>
    <table><tr style="background:#D46FAC;color:white;"><th>Date</th><th>Subject</th><th>Time Blocks</th></tr>${rows}</table>
    <div style="margin-top:24px;font-size:11px;color:#888;text-align:center;">Generated by CPALearn PH · ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</div>
    </body></html>`);
    win.document.close();setTimeout(()=>win.print(),500);
  };

  const handlePaymentSubmit=async()=>{
    if(!payForm.ref){showToast("Enter your reference number","error");return;}
    setSubmittingPay(true);
    await supabase.from("user_payments").insert({user_id:user.id,amount:99,currency:"PHP",payment_method:"MariBank InstaPay",reference_number:payForm.ref,status:"pending"});
    setPayStep(3);showToast("Payment submitted! ✅");setSubmittingPay(false);
  };

  const handleApprovePayment=async(p)=>{
    await supabase.from("user_payments").update({status:"verified",verified_at:new Date().toISOString()}).eq("id",p.id);
    await supabase.from("profiles").update({is_approved:true}).eq("id",p.user_id);
    showToast("User approved! ✅");fetchPendingPayments();fetchAllUsers();
  };

  // ── LANDING ──
  if(!user) return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",color:t.text}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#c62828":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13,fontWeight:600}}>{toast.msg}</div>}
      {page==="login"?(
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:420,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"44px 40px"}}>
            <div style={{textAlign:"center",marginBottom:24}}><img src={LOGO_URL} style={{height:52,marginBottom:8}} alt="CPALearn PH"/><h2 style={{color:t.accent,margin:"8px 0 4px",letterSpacing:"-1px"}}>{showRegister?"Create Account":"Welcome Back"}</h2><p className="serif" style={{color:t.textMuted,fontSize:14,fontStyle:"italic"}}>{showRegister?"Join the CPALE community":"Continue your review journey"}</p></div>
            {(showRegister?[["Full Name *","text",registerForm.name,(v)=>setRegisterForm({...registerForm,name:v}),"e.g. Juls Domingo"],["Email *","email",registerForm.email,(v)=>setRegisterForm({...registerForm,email:v}),"your@email.com"],["Password *","password",registerForm.pass,(v)=>setRegisterForm({...registerForm,pass:v}),"min. 6 characters"],["School","text",registerForm.school,(v)=>setRegisterForm({...registerForm,school:v}),"e.g. UST, DLSU"]]:[["Email","email",loginForm.email,(v)=>setLoginForm({...loginForm,email:v}),"your@email.com"],["Password","password",loginForm.pass,(v)=>setLoginForm({...loginForm,pass:v}),"••••••••"]]).map(([label,type,val,setter,ph])=>(
              <div key={label} style={{marginBottom:14}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{label}</label><input type={type} value={val} onChange={e=>setter(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(showRegister?handleRegister():handleLogin())} placeholder={ph} style={inp}/></div>
            ))}
            {loginError&&<div style={{color:"#c62828",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
            <button onClick={showRegister?handleRegister:handleLogin} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,marginTop:4,borderRadius:10}}>{showRegister?"Create Account":"Log In"}</button>
            <div style={{textAlign:"center",marginTop:14,fontSize:13,color:t.textMuted}}>{showRegister?"Already have an account? ":"Don't have an account? "}<span onClick={()=>{setShowRegister(!showRegister);setLoginError("");}} style={{color:t.accent,cursor:"pointer",fontWeight:700}}>{showRegister?"Log In":"Register"}</span></div>
            <div style={{textAlign:"center",marginTop:10}}><span onClick={()=>setPage("landing")} style={{fontSize:12,color:t.textMuted,cursor:"pointer"}}>← Back to home</span></div>
          </div>
        </div>
      ):(
        <>
          <div style={{position:"fixed",top:0,left:0,right:0,background:t.card,borderBottom:`1px solid ${t.border}`,padding:"12px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
            <img src={LOGO_URL} style={{height:36}} alt="CPALearn PH"/>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
              <button onClick={()=>{setShowRegister(false);setPage("login");}} style={btn(false)}>Log In</button>
              <button onClick={()=>{setShowRegister(true);setPage("login");}} style={btn(true)}>Register</button>
            </div>
          </div>
          <div style={{textAlign:"center",padding:"130px 20px 60px"}}>
            <div style={{display:"inline-block",background:t.badge,color:t.badgeText,borderRadius:20,padding:"5px 18px",fontSize:11,marginBottom:20,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>🇵🇭 For Filipino CPA Candidates</div>
            <h1 style={{fontSize:52,fontWeight:800,color:t.text,marginBottom:16,lineHeight:1.15,letterSpacing:"-2px"}}>Your All-in-One<br/><span style={{color:t.accent}}>CPALE Review</span> Platform</h1>
            <p className="serif" style={{fontSize:20,color:t.textMuted,maxWidth:560,margin:"0 auto 36px",lineHeight:1.7,fontStyle:"italic"}}>Study smarter with 7 subjects, collaborative notes, question banks, mock exams, and progress tracking — all in one place.</p>
            <button onClick={()=>{setShowRegister(true);setPage("login");}} style={{...btn(true),padding:"16px 40px",fontSize:16,borderRadius:12}}>Start Studying →</button>
            <p style={{fontSize:11,color:t.textMuted,marginTop:14,letterSpacing:"1px",textTransform:"uppercase"}}>One-time access fee · No subscriptions · No recurring charges</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:1000,margin:"0 auto 40px",padding:"0 40px"}}>
            {[["📚","Subjects","FREE — Upload & browse materials","free"],["📖","Notes","FREE — Rich text editor + print","free"],["📅","Planner","FREE — Personalized study schedule","free"],["❓","Question Bank","PAID — 60-item mock MCQs","paid"],["🃏","Flashcards","PAID — Spaced repetition","paid"],["📝","Mock Exams","PAID — Auto-graded 60-item exams","paid"],["💬","Discussions","PAID — Community Q&A","paid"],["📊","Progress","PAID — Analytics & tracking","paid"]].map(([icon,title,desc,tier])=>(
              <div key={title} style={{...card,textAlign:"center",padding:"22px 14px",borderTop:`3px solid ${tier==="free"?"#4CAF50":t.accent}`}}>
                <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
                <div style={{fontWeight:700,marginBottom:4,color:t.text,fontSize:13}}>{title}</div>
                <div style={{fontSize:11,color:tier==="free"?"#4CAF50":t.accent,fontWeight:600}}>{desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ── PAYMENT PAGE ──
  if(page==="payment") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT_STYLE}</style>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#c62828":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:999,fontSize:13,fontWeight:600}}>{toast.msg}</div>}
      <div style={{width:"100%",maxWidth:480,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"40px 36px"}}>
        {payStep===3?(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <h2 style={{color:t.accent,marginBottom:12}}>Payment Submitted!</h2>
            <p className="serif" style={{color:t.textMuted,lineHeight:1.8,fontStyle:"italic",marginBottom:20}}>Your payment is under review. You'll get full access within 24 hours after admin verification.</p>
            <div style={{background:t.highlight,borderRadius:10,padding:"14px",marginBottom:20,fontSize:13,color:t.text,lineHeight:1.8,textAlign:"left"}}>
              <div><strong>Reference #:</strong> {payForm.ref}</div>
              <div><strong>Method:</strong> MariBank InstaPay</div>
              <div><strong>Amount:</strong> ₱99</div>
            </div>
            <button onClick={()=>setPage("dashboard")} style={{...btn(true),width:"100%",padding:"12px",marginBottom:8}}>Continue with Free Access →</button>
            <button onClick={handleLogout} style={{...btn(false),width:"100%",fontSize:12}}>Log Out</button>
          </div>
        ):payStep===2?(
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <button onClick={()=>setPayStep(1)} style={{...btn(false),fontSize:12,padding:"5px 10px"}}>← Back</button>
              <h2 style={{color:t.accent,fontSize:18}}>Submit Payment Proof</h2>
            </div>
            <div style={{background:"#E8F5E9",borderRadius:10,padding:"12px 16px",marginBottom:18,fontSize:13,color:"#2E7D32",fontWeight:500}}>✅ You've sent <strong>₱99</strong> via MariBank InstaPay to Juliana Domingo</div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase"}}>InstaPay Reference Number *</label>
              <input value={payForm.ref} onChange={e=>setPayForm({...payForm,ref:e.target.value})} placeholder="e.g. 20240608123456789" style={inp}/>
              <p style={{fontSize:11,color:t.textMuted,marginTop:4}}>Find this in your MariBank transfer confirmation screen or SMS.</p>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase"}}>Screenshot (optional but recommended)</label>
              <label style={{display:"block",border:`2px dashed ${t.border}`,borderRadius:8,padding:"18px",textAlign:"center",cursor:"pointer",background:t.surface}}>
                <div style={{fontSize:28,marginBottom:4}}>{payForm.screenshotName?"✅":"📎"}</div>
                <div style={{fontSize:13,color:payForm.screenshotName?t.accent:t.textMuted,fontWeight:payForm.screenshotName?600:400}}>{payForm.screenshotName||"Click to upload screenshot"}</div>
                <input type="file" accept="image/*" onChange={e=>{if(e.target.files[0])setPayForm({...payForm,screenshotName:e.target.files[0].name});}} style={{display:"none"}}/>
              </label>
            </div>
            <button onClick={handlePaymentSubmit} disabled={submittingPay||!payForm.ref} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,opacity:!payForm.ref?0.5:1,borderRadius:10}}>{submittingPay?"Submitting...":"Submit for Verification"}</button>
            <button onClick={()=>setPage("dashboard")} style={{...btn(false),width:"100%",marginTop:8,fontSize:12}}>Continue with Free Access</button>
          </>
        ):(
          <>
            <div style={{textAlign:"center",marginBottom:22}}>
              <img src={LOGO_URL} style={{height:44,marginBottom:8}} alt="CPALearn PH"/>
              <h2 style={{color:t.accent,margin:"8px 0 4px",fontSize:20}}>Unlock Full Access</h2>
              <p className="serif" style={{color:t.textMuted,fontSize:13,fontStyle:"italic"}}>One-time · No subscriptions · No recurring charges</p>
            </div>
            <div style={{background:t.accentLight,borderRadius:12,padding:"18px",textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:42,fontWeight:800,color:t.accentText,letterSpacing:"-2px"}}>₱99</div>
              <div style={{fontSize:11,color:t.accentText,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginTop:4}}>Lifetime Access</div>
            </div>
            <div style={{background:t.surface,borderRadius:12,padding:"18px",textAlign:"center",marginBottom:18,border:`1px solid ${t.border}`}}>
              <div style={{fontWeight:700,color:t.text,marginBottom:12,fontSize:14}}>📱 Scan to Pay — MariBank InstaPay</div>
              <img src={MARIBANK_QR} alt="MariBank QR" style={{width:190,height:190,borderRadius:10,margin:"0 auto",display:"block",objectFit:"contain"}}/>
              <p style={{fontSize:12,color:t.textMuted,marginTop:10,lineHeight:1.6}}>Open any banking app → Scan QR → Send <strong>₱99</strong><br/>InstaPay transfers are <strong>FREE</strong> from any bank</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:18}}>
              {["❓ Question Bank","🃏 Flashcards","📝 Mock Exams (60 items)","💬 Discussions","👥 Study Groups","📊 Progress Analytics","🏆 Leaderboard","📖 Public Notes"].map(f=>(
                <div key={f} style={{background:t.highlight,borderRadius:6,padding:"6px 10px",fontSize:11,color:t.text,fontWeight:500}}>✅ {f}</div>
              ))}
            </div>
            <button onClick={()=>setPayStep(2)} style={{...btn(true),width:"100%",padding:"13px",fontSize:14,borderRadius:10}}>I've Already Paid →</button>
            <button onClick={()=>setPage("dashboard")} style={{...btn(false),width:"100%",marginTop:8,fontSize:12,color:t.textMuted}}>Continue with Free Access</button>
            <button onClick={handleLogout} style={{...btn(false),width:"100%",marginTop:6,fontSize:11,color:t.textMuted}}>Log Out</button>
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
        <div style={{padding:"8px 16px 14px",borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8,textAlign:"center"}}>
          <img src={LOGO_URL} style={{height:32}} alt="CPALearn PH"/>
        </div>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>s(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",background:page===n.id?t.navActive:"transparent",color:page===n.id?t.navActiveText:t.textMuted,border:"none",cursor:"pointer",textAlign:"left",fontSize:12,fontWeight:page===n.id?700:500,borderLeft:page===n.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
            <span style={{fontSize:14}}>{n.icon}</span>
            <span style={{flex:1}}>{n.label}</span>
            {!n.free&&!isPaid&&<span style={{fontSize:9,background:t.accent,color:"#fff",borderRadius:6,padding:"1px 5px",fontWeight:700}}>PRO</span>}
          </button>
        ))}
        {!isPaid&&!isAdmin&&(
          <div style={{margin:"8px 12px",background:t.accentLight,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:11,color:t.accentText,fontWeight:700,marginBottom:4}}>🔓 Upgrade</div>
            <div style={{fontSize:10,color:t.accentText,marginBottom:6}}>Unlock all features for ₱99</div>
            <button onClick={()=>{setPage("payment");setPayStep(1);}} style={{...btn(true),width:"100%",fontSize:10,padding:"5px 0"}}>Pay ₱99 →</button>
          </div>
        )}
        <div style={{marginTop:"auto",padding:"12px 16px",borderTop:`1px solid ${t.sidebarBorder}`}}>
          <div style={{fontSize:10,color:t.textMuted,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600}}>{profile?.full_name||user?.email}</div>
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            <span style={{fontSize:9,color:t.accent,textTransform:"uppercase",fontWeight:700}}>{profile?.role||"student"}</span>
            {isPaid?<span style={{fontSize:9,background:"#E8F5E9",color:"#2E7D32",borderRadius:6,padding:"1px 5px",fontWeight:700}}>FULL</span>:<span style={{fontSize:9,background:"#FFF3E0",color:"#E65100",borderRadius:6,padding:"1px 5px",fontWeight:700}}>FREE</span>}
          </div>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),width:"100%",fontSize:11,padding:"5px 0",marginBottom:4}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={handleLogout} style={{...btn(false),width:"100%",fontSize:11,padding:"5px 0",color:t.textMuted}}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{marginLeft:210,flex:1,padding:"24px 28px",overflowX:"hidden"}}>

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <h1 style={{fontSize:24,marginBottom:4}}>Good day, {profile?.full_name?.split(" ")[0]||"Reviewee"}! 👋</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:15,fontStyle:"italic"}}>Ready to ace the board exam?</p>
            {!isPaid&&!isAdmin&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,background:t.accentLight,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,color:t.accentText,fontSize:14,marginBottom:2}}>🔓 Unlock Full Access — ₱99 one-time</div><div style={{fontSize:12,color:t.accentText}}>Question Bank · Flashcards · 60-item Mock Exams · Discussions · Progress · and more</div></div>
                <button onClick={()=>{setPage("payment");setPayStep(1);}} style={{...btn(true),whiteSpace:"nowrap",marginLeft:16}}>Pay ₱99 →</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:20}}>
              {navItems.filter(n=>!["dashboard","profile","admin"].includes(n.id)).map(n=>(
                <div key={n.id} onClick={()=>s(n.id)} style={{...card,textAlign:"center",padding:"18px 10px",cursor:"pointer",opacity:(!n.free&&!isPaid)?0.65:1,position:"relative"}}>
                  {!n.free&&!isPaid&&<div style={{position:"absolute",top:8,right:8,fontSize:9,background:t.accent,color:"#fff",borderRadius:6,padding:"1px 5px",fontWeight:700}}>PRO</div>}
                  <div style={{fontSize:26,marginBottom:6}}>{n.icon}</div>
                  <div style={{fontWeight:600,color:t.text,fontSize:11}}>{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {page==="subjects"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📚 Subject Library</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>{isPaid?"Browse, upload & download public materials":"Upload your own private materials"}</p>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {SUBJECTS.map((s2,i)=>(
                <button key={s2} onClick={()=>{setActiveSubject(s2);setActiveTopic(null);}} style={{background:activeSubject===s2?t.subjectColors[i]:t.badge,color:activeSubject===s2?t.subjectText[i]:t.badgeText,border:`1px solid ${t.border}`,borderRadius:20,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:activeSubject===s2?700:500}}>{s2}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"185px 1fr",gap:16}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:11,color:t.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Topics</div>
                  {isAdmin&&<button onClick={()=>setShowAddTopic(!showAddTopic)} style={{...btn(true),fontSize:10,padding:"3px 8px"}}>+</button>}
                </div>
                {isAdmin&&showAddTopic&&(
                  <div style={{marginBottom:8}}>
                    <input value={newTopicName} onChange={e=>setNewTopicName(e.target.value)} placeholder="Topic name" style={{...inp,marginBottom:4,fontSize:12}}/>
                    <button onClick={async()=>{if(newTopicName){await supabase.from("topics").insert({subject_id:SUBJECT_ID[activeSubject],name:newTopicName});showToast("Topic added!");setNewTopicName("");setShowAddTopic(false);}}} style={{...btn(true),width:"100%",fontSize:12,padding:"6px"}}>Save</button>
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
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleUpload(e.dataTransfer.files);}} style={{border:`2px dashed ${dragOver?t.accent:t.border}`,borderRadius:12,padding:"18px",textAlign:"center",background:dragOver?t.highlight:t.surface,marginBottom:14}}>
                  <div style={{fontSize:26,marginBottom:4}}>📂</div>
                  <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:13}}>{uploading?"Uploading...":"Drag & drop files here"}</div>
                  <div style={{fontSize:11,color:t.textMuted,marginBottom:10}}>PDF, Word, Excel, PowerPoint, Images</div>
                  <label style={{...btn(true),display:"inline-block",cursor:"pointer",padding:"7px 18px",fontSize:12}}>📎 Choose Files<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif" onChange={e=>handleUpload(e.target.files)} style={{display:"none"}}/></label>
                </div>
                {materials.length===0?(
                  <div style={{textAlign:"center",padding:"40px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:36,marginBottom:10}}>📭</div>
                    <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No materials yet</div>
                    <div style={{fontSize:12,color:t.textMuted}}>Upload the first file for {activeSubject}!</div>
                  </div>
                ):materials.map(mat=>(
                  <div key={mat.id} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                    <span style={{fontSize:24,flexShrink:0}}>{getIcon(mat.title+"."+mat.file_type)}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mat.title}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{mat.file_type?.toUpperCase()} · {fmtSize(mat.file_size_kb*1024)} · {fmtDate(mat.created_at)}{mat.is_approved?<span style={{color:"#4CAF50",marginLeft:6}}>✓</span>:<span style={{color:"#FF9800",marginLeft:6}}>⏳</span>}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>window.open(mat.file_url,"_blank")} style={{...btn(true),fontSize:11,padding:"5px 12px"}}>⬇ Download</button>
                      {(isAdmin||mat.uploaded_by===user?.id)&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("materials").delete().eq("id",mat.id);fetchMaterials();}} style={{...btn(false,true),fontSize:11,padding:"5px 10px"}}>🗑</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES */}
        {page==="notes"&&(
          <div>
            {noteMode==="list"&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div><h1 style={{fontSize:22,marginBottom:4}}>📖 Notes Vault</h1><p className="serif" style={{color:t.textMuted,fontSize:14,fontStyle:"italic"}}>Rich text notes with tables, formatting, and print</p></div>
                  <button onClick={()=>{setActiveNote(null);setNoteForm({title:"",subject:"FAR",topic:"",body:"",is_shared:false});setNoteMode("edit");}} style={btn(true)}>+ New Note</button>
                </div>
                {notes.length===0?(
                  <div style={{textAlign:"center",padding:"60px",background:t.highlight,borderRadius:12}}>
                    <div style={{fontSize:48,marginBottom:12}}>📖</div>
                    <div style={{fontWeight:700,color:t.text,marginBottom:8,fontSize:16}}>No notes yet</div>
                    <button onClick={()=>{setActiveNote(null);setNoteForm({title:"",subject:"FAR",topic:"",body:"",is_shared:false});setNoteMode("edit");}} style={btn(true)}>Create First Note</button>
                  </div>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
                    {notes.map(n=>(
                      <div key={n.id} style={{...card,cursor:"pointer",borderLeft:`3px solid ${n.user_id===user.id?t.accent:t.border}`,padding:"14px 16px"}} onClick={()=>{setActiveNote(n);setNoteForm({title:n.title,subject:ID_SUBJECT[n.subject_id]||"FAR",topic:"",body:n.body||"",is_shared:n.is_shared||false});setNoteMode("view");}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600}}>{ID_SUBJECT[n.subject_id]||"General"}</span>
                          {n.is_shared&&<span style={{background:"#E8F5E9",color:"#2E7D32",borderRadius:10,padding:"2px 6px",fontSize:9,fontWeight:700}}>PUBLIC</span>}
                        </div>
                        <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>{n.title}</div>
                        <div style={{fontSize:11,color:t.textMuted,lineHeight:1.5,overflow:"hidden",maxHeight:36}} dangerouslySetInnerHTML={{__html:(n.body||"").replace(/<[^>]*>/g," ").slice(0,80)+"..."}}/>
                        <div style={{fontSize:10,color:t.textMuted,marginTop:8}}>{fmtDate(n.updated_at||n.created_at)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {(noteMode==="edit"||noteMode==="view")&&(
              <div>
                <div className="no-print" style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                  <button onClick={()=>setNoteMode("list")} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>← Back</button>
                  {noteMode==="view"&&activeNote?.user_id===user.id&&<button onClick={()=>setNoteMode("edit")} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>✏️ Edit</button>}
                  {noteMode==="edit"&&<button onClick={saveNote} style={{...btn(true),fontSize:12,padding:"5px 14px"}}>💾 Save</button>}
                  <button onClick={printNote} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>🖨 Print</button>
                  {activeNote?.user_id===user.id&&<button onClick={async()=>{if(window.confirm("Delete this note?"))await supabase.from("user_notes").delete().eq("id",activeNote.id);setNoteMode("list");fetchNotes();}} style={{...btn(false,true),fontSize:12,padding:"5px 12px",marginLeft:"auto"}}>🗑 Delete</button>}
                </div>
                {noteMode==="edit"&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:12,alignItems:"end"}}>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Title</label><input value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})} placeholder="Note title..." style={inp}/></div>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={noteForm.subject} onChange={e=>setNoteForm({...noteForm,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Topic</label><input value={noteForm.topic} onChange={e=>setNoteForm({...noteForm,topic:e.target.value})} placeholder="e.g. Leases" style={inp}/></div>
                    {isPaid&&<label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:t.textMuted,cursor:"pointer",whiteSpace:"nowrap",paddingBottom:4}}><input type="checkbox" checked={noteForm.is_shared} onChange={e=>setNoteForm({...noteForm,is_shared:e.target.checked})}/>Share publicly</label>}
                  </div>
                )}
                {noteMode==="view"&&(
                  <div style={{marginBottom:12}}>
                    <h2 style={{fontSize:20,color:t.text,marginBottom:4}}>{activeNote?.title}</h2>
                    <div style={{fontSize:12,color:t.textMuted}}>{ID_SUBJECT[activeNote?.subject_id]||"General"} · {fmtDate(activeNote?.updated_at||activeNote?.created_at)}</div>
                  </div>
                )}
                {noteMode==="edit"&&(
                  <div style={{background:t.surface,padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,marginBottom:8,display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                    {[["B","bold"],["I","italic"],["U","underline"],["S","strikeThrough"]].map(([l,c])=>(
                      <button key={c} onMouseDown={e=>{e.preventDefault();execCmd(c);}} style={{...btn(false),padding:"3px 10px",fontSize:12,fontWeight:l==="B"?700:l==="I"?400:500,fontStyle:l==="I"?"italic":"normal",textDecoration:l==="U"?"underline":l==="S"?"line-through":"none",minWidth:30}}>{l}</button>
                    ))}
                    <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
                    <select onMouseDown={e=>e.stopPropagation()} onChange={e=>execCmd("fontName",e.target.value)} style={{...inp,width:"auto",padding:"3px 6px",fontSize:11}}>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Arial">Arial</option>
                      <option value="Courier New">Courier</option>
                    </select>
                    <select onMouseDown={e=>e.stopPropagation()} onChange={e=>execCmd("fontSize",e.target.value)} style={{...inp,width:"auto",padding:"3px 6px",fontSize:11}}>
                      {[1,2,3,4,5,6,7].map(s=><option key={s} value={s}>{[10,12,14,16,18,22,26][s-1]}px</option>)}
                    </select>
                    <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
                    {["#3D1F35","#D46FAC","#c62828","#2A7D5A","#1A5FAD","#A85D00","#000"].map(c=>(
                      <div key={c} onMouseDown={e=>{e.preventDefault();execCmd("foreColor",c);}} style={{width:16,height:16,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${t.border}`,flexShrink:0}}/>
                    ))}
                    <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
                    {[["H1","formatBlock","h2"],["H2","formatBlock","h3"],["•","insertUnorderedList",null],["1.","insertOrderedList",null]].map(([l,c,v])=>(
                      <button key={l} onMouseDown={e=>{e.preventDefault();execCmd(c,v);}} style={{...btn(false),padding:"3px 8px",fontSize:11,minWidth:28}}>{l}</button>
                    ))}
                    <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
                    <button onMouseDown={e=>{e.preventDefault();insertTable();}} style={{...btn(false),padding:"3px 10px",fontSize:11}}>⊞ Table</button>
                    <button onMouseDown={e=>{e.preventDefault();insertHR();}} style={{...btn(false),padding:"3px 10px",fontSize:11}}>— Line</button>
                    <button onMouseDown={e=>{e.preventDefault();execCmd("removeFormat");}} style={{...btn(false),padding:"3px 10px",fontSize:11}}>✕ Clear</button>
                  </div>
                )}
                <div className="print-zone" style={{background:"white",borderRadius:10,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",background:t.highlight,borderBottom:`1px solid ${t.border}`,fontSize:12,color:t.textMuted,display:"flex",gap:16}}>
                    <span><strong>CPALearn PH</strong> · {noteForm.subject}</span>
                    {noteForm.topic&&<span>· {noteForm.topic}</span>}
                    <span style={{marginLeft:"auto"}}>Generated: {new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}</span>
                  </div>
                  {noteMode==="edit"?(
                    <div ref={editorRef} contentEditable suppressContentEditableWarning className="note-editor" style={{padding:"20px",minHeight:400,color:t.text}} dangerouslySetInnerHTML={{__html:noteForm.body}} onInput={()=>{}}/>
                  ):(
                    <div className="note-editor" style={{padding:"20px",minHeight:200,color:t.text}} dangerouslySetInnerHTML={{__html:activeNote?.body||"<p style='color:#999;font-style:italic;'>Empty note.</p>"}}/>
                  )}
                  <div style={{padding:"10px 16px",borderTop:`1px solid ${t.border}`,fontSize:11,color:t.textMuted,background:t.highlight}}>
                    Prepared by: <strong>{profile?.full_name||user?.email}</strong> · {fmtDate(activeNote?.updated_at||new Date())}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLANNER */}
        {page==="planner"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>📅 Study Planner</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Personalized study schedule with custom time blocks — free for all users</p>

            {showPlannerSetup?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:14,fontSize:15}}>🎯 Exam Setup</div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Exam Type</label>
                    <select value={plannerSetup.examType} onChange={e=>setPlannerSetup({...plannerSetup,examType:e.target.value})} style={inp}>
                      {EXAM_TYPES.map(et=><option key={et}>{et}</option>)}
                    </select>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Target Exam Date</label>
                    <input type="date" value={plannerSetup.targetDate} onChange={e=>setPlannerSetup({...plannerSetup,targetDate:e.target.value})} style={inp}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Study Hours Per Day</label>
                    <select value={plannerSetup.studyHoursPerDay} onChange={e=>setPlannerSetup({...plannerSetup,studyHoursPerDay:Number(e.target.value)})} style={inp}>
                      {[1,2,3,4,5,6,7,8].map(h=><option key={h} value={h}>{h} hour{h>1?"s":""}</option>)}
                    </select>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Rest Days (no study)</label>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {DAYS.map(d=>(
                        <label key={d} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer",background:plannerSetup.breakDays.includes(d)?t.accentLight:t.surface,padding:"4px 10px",borderRadius:6,border:`1px solid ${plannerSetup.breakDays.includes(d)?t.accent:t.border}`}}>
                          <input type="checkbox" checked={plannerSetup.breakDays.includes(d)} onChange={e=>{setPlannerSetup({...plannerSetup,breakDays:e.target.checked?[...plannerSetup.breakDays,d]:plannerSetup.breakDays.filter(x=>x!==d)});}}/>
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:14,fontSize:15}}>📊 Subject Priority</div>
                  <p style={{fontSize:12,color:t.textMuted,marginBottom:12}}>Drag to reorder — top = most time allocated</p>
                  {plannerSetup.priorities.map((sub,i)=>(
                    <div key={sub} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:t.highlight,borderRadius:8,marginBottom:6,border:`1px solid ${t.border}`}}>
                      <span style={{fontSize:12,color:t.textMuted,fontWeight:700,width:20}}>{i+1}.</span>
                      <span style={{flex:1,fontSize:13,fontWeight:500,color:t.text}}>{sub}</span>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>{if(i===0)return;const p=[...plannerSetup.priorities];[p[i-1],p[i]]=[p[i],p[i-1]];setPlannerSetup({...plannerSetup,priorities:p});}} disabled={i===0} style={{...btn(false),padding:"2px 8px",fontSize:11,opacity:i===0?0.3:1}}>↑</button>
                        <button onClick={()=>{if(i===plannerSetup.priorities.length-1)return;const p=[...plannerSetup.priorities];[p[i+1],p[i]]=[p[i],p[i+1]];setPlannerSetup({...plannerSetup,priorities:p});}} disabled={i===plannerSetup.priorities.length-1} style={{...btn(false),padding:"2px 8px",fontSize:11,opacity:i===plannerSetup.priorities.length-1?0.3:1}}>↓</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:15}}>➕ Add Custom Time Blocks</div>
                  <p style={{fontSize:12,color:t.textMuted,marginBottom:12}}>Add personal activities (workout, errands, movies, etc.) to factor into your schedule</p>
                  <button onClick={()=>setShowAddBlock(!showAddBlock)} style={{...btn(true),marginBottom:12,fontSize:12}}>+ Add Time Block</button>
                  {showAddBlock&&(
                    <div style={{background:t.highlight,borderRadius:8,padding:"12px",marginBottom:12}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Day</label>
                          <select value={newBlock.day} onChange={e=>setNewBlock({...newBlock,day:e.target.value})} style={inp}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Activity</label>
                          <select value={newBlock.activity} onChange={e=>setNewBlock({...newBlock,activity:e.target.value})} style={inp}>{ACTIVITY_TYPES.map(a=><option key={a}>{a}</option>)}</select></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Start Time</label>
                          <input type="time" value={newBlock.startTime} onChange={e=>setNewBlock({...newBlock,startTime:e.target.value})} style={inp}/></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>End Time</label>
                          <input type="time" value={newBlock.endTime} onChange={e=>setNewBlock({...newBlock,endTime:e.target.value})} style={inp}/></div>
                      </div>
                      <div style={{marginBottom:8}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Notes (optional)</label>
                        <input value={newBlock.notes} onChange={e=>setNewBlock({...newBlock,notes:e.target.value})} placeholder="e.g. Morning run, 30 mins" style={inp}/></div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>{setCustomBlocks([...customBlocks,{...newBlock}]);setShowAddBlock(false);setNewBlock({day:"Mon",startTime:"08:00",endTime:"09:00",activity:"Study",subject:"FAR",notes:""});showToast("Block added!");}} style={btn(true)}>Add</button>
                        <button onClick={()=>setShowAddBlock(false)} style={btn(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {customBlocks.length>0&&(
                    <div>
                      {customBlocks.map((b,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:t.surface,borderRadius:6,marginBottom:4,border:`1px solid ${t.border}`,fontSize:12}}>
                          <span style={{fontWeight:600,color:t.accent}}>{b.day}</span>
                          <span style={{color:t.textMuted}}>{b.startTime}–{b.endTime}</span>
                          <span style={{flex:1,color:t.text}}>{b.activity}</span>
                          <button onClick={()=>setCustomBlocks(customBlocks.filter((_,j)=>j!==i))} style={{...btn(false,true),fontSize:10,padding:"2px 6px"}}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{...card,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"40px"}}>
                  <div style={{fontSize:48,marginBottom:12}}>🚀</div>
                  <h3 style={{fontSize:16,marginBottom:8,color:t.text}}>Ready to generate your plan?</h3>
                  <p style={{fontSize:13,color:t.textMuted,marginBottom:20,lineHeight:1.6}}>Your personalized study schedule will be generated based on your settings, priorities, and custom blocks.</p>
                  <button onClick={generatePlan} style={{...btn(true),padding:"14px 32px",fontSize:15,borderRadius:12}}>Generate Study Plan 📅</button>
                </div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>setShowPlannerSetup(true)} style={{...btn(false),fontSize:12}}>← Edit Setup</button>
                  <button onClick={printPlan} style={{...btn(true),fontSize:12}}>🖨 Print PDF</button>
                  <div style={{marginLeft:"auto",fontSize:13,color:t.textMuted}}>
                    <strong style={{color:t.accent}}>{generatedPlan?.daysLeft}</strong> days to {plannerSetup.examType} · <strong style={{color:t.accent}}>{generatedPlan?.totalStudyDays}</strong> study days
                  </div>
                </div>

                {/* Summary */}
                <div style={{...card,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:14}}>📊 Subject Allocation</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {generatedPlan?.daysPerSubject?.map((d,i)=>(
                      <div key={d.subject} style={{background:t.subjectColors[i%7],borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                        <div style={{fontWeight:700,color:t.subjectText[i%7],fontSize:13}}>{d.subject}</div>
                        <div style={{fontSize:11,color:t.subjectText[i%7],opacity:0.8}}>{d.days} days</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Table */}
                <div style={{...card,padding:0,overflow:"hidden"}}>
                  <div style={{padding:"14px 20px",background:t.highlight,borderBottom:`1px solid ${t.border}`,fontWeight:700,fontSize:14}}>📅 Your Study Schedule</div>
                  <div style={{maxHeight:500,overflowY:"auto"}}>
                    {generatedPlan?.plan?.slice(0,30).map((day,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"100px 120px 1fr",gap:0,borderBottom:`1px solid ${t.border}`,background:day.subject==="Rest"?t.surface:"white"}}>
                        <div style={{padding:"12px 14px",borderRight:`1px solid ${t.border}`,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                          <div style={{fontWeight:700,fontSize:13,color:t.text}}>{fmtShortDate(day.date)}</div>
                          <div style={{fontSize:11,color:t.textMuted}}>{day.day}</div>
                        </div>
                        <div style={{padding:"12px 14px",borderRight:`1px solid ${t.border}`,display:"flex",alignItems:"center"}}>
                          <span style={{fontWeight:700,fontSize:12,color:day.subject==="Rest"?t.textMuted:t.accent}}>{day.subject}</span>
                        </div>
                        <div style={{padding:"10px 14px"}}>
                          {day.timeBlocks.map((tb,j)=>(
                            <div key={j} style={{marginBottom:6,fontSize:12}}>
                              <span style={{color:t.textMuted,marginRight:6}}>{tb.time}</span>
                              <span style={{fontWeight:500,color:t.text}}>{tb.activity}</span>
                              {tb.notes&&<span style={{color:t.textMuted,fontSize:11}}> — {tb.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {generatedPlan?.plan?.length>30&&<div style={{padding:"12px 20px",background:t.highlight,fontSize:12,color:t.textMuted,textAlign:"center"}}>Showing first 30 days · Print PDF for full schedule ({generatedPlan.plan.length} days total)</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUESTION BANK */}
        {page==="qbank"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>❓ Question Bank</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Practice MCQs with explanations</p>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              {["All",...SUBJECTS].map(f=>(
                <button key={f} onClick={()=>{setQFilter(f);setQIdx(0);setSelected(null);setShowAnswer(false);}} style={{...btn(qFilter===f),fontSize:11,padding:"5px 12px"}}>{f}</button>
              ))}
              {isAdmin&&<button onClick={()=>setShowAddQ(!showAddQ)} style={{...btn(true),marginLeft:"auto",fontSize:12}}>+ Add Question</button>}
            </div>
            {isAdmin&&showAddQ&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12}}>Add Question (Admin Only)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newQ.subject} onChange={e=>setNewQ({...newQ,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Difficulty</label><select value={newQ.difficulty} onChange={e=>setNewQ({...newQ,difficulty:e.target.value})} style={inp}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                </div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Question</label><textarea value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} placeholder="Enter question..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{fontWeight:600,fontSize:11,color:t.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>Options — click radio to mark correct answer:</div>
                {newQ.options.map((opt,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                    <input type="radio" name="correct" checked={newQ.answer===i} onChange={()=>setNewQ({...newQ,answer:i})}/>
                    <span style={{fontSize:12,fontWeight:700,color:newQ.answer===i?t.accent:t.textMuted,width:20}}>{String.fromCharCode(65+i)}.</span>
                    <input value={opt} onChange={e=>{const o=[...newQ.options];o[i]=e.target.value;setNewQ({...newQ,options:o});}} placeholder={`Option ${String.fromCharCode(65+i)}`} style={{...inp,flex:1,borderColor:newQ.answer===i?t.accent:t.border}}/>
                  </div>
                ))}
                <div style={{marginTop:8,marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Explanation</label><textarea value={newQ.explanation} onChange={e=>setNewQ({...newQ,explanation:e.target.value})} placeholder="Explain the correct answer in detail..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{if(!newQ.question||newQ.options.some(o=>!o)){showToast("Fill in all fields","error");return;}await supabase.from("questions").insert({subject_id:SUBJECT_ID[newQ.subject],created_by:user.id,question_text:newQ.question,question_type:"mcq",options:newQ.options,correct_answer:String(newQ.answer),explanation:newQ.explanation,difficulty:newQ.difficulty,is_approved:true});showToast("Question added! ✅");setShowAddQ(false);setNewQ({subject:"FAR",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});fetchQuestions();}} style={btn(true)}>Save Question</button>
                  <button onClick={()=>setShowAddQ(false)} style={btn(false)}>Cancel</button>
                </div>
              </div>
            )}
            {questions.length===0?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No questions yet</div>
                {isAdmin?<button onClick={()=>setShowAddQ(true)} style={{...btn(true),marginTop:8}}>+ Add First Question</button>:<p style={{fontSize:13,color:t.textMuted,marginTop:4}}>Admin is adding questions. Check back soon!</p>}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16}}>
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"3px 12px",fontSize:11,fontWeight:600}}>Q {qIdx+1} / {questions.length}</div>
                    <span style={{fontSize:11,color:t.textMuted,background:t.surface,borderRadius:6,padding:"3px 10px",fontWeight:600,textTransform:"uppercase"}}>{questions[qIdx]?.difficulty}</span>
                  </div>
                  <p style={{fontWeight:700,color:t.text,fontSize:15,lineHeight:1.6,marginBottom:16}}>{questions[qIdx]?.question_text}</p>
                  {(questions[qIdx]?.options||[]).map((opt,i)=>(
                    <div key={i} onClick={()=>!showAnswer&&setSelected(i)} style={{padding:"10px 14px",borderRadius:8,marginBottom:8,border:`1.5px solid ${selected===i?(showAnswer?i===Number(questions[qIdx]?.correct_answer)?"#4CAF50":"#c62828":t.accent):t.border}`,background:selected===i?(showAnswer?i===Number(questions[qIdx]?.correct_answer)?"#E8F5E9":"#FFEBEE":t.accentLight):t.surface,cursor:showAnswer?"default":"pointer",fontSize:13,color:t.text,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:24,height:24,borderRadius:"50%",border:`1.5px solid ${selected===i?t.accent:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,background:selected===i?t.accent:"transparent",color:selected===i?"#fff":t.textMuted}}>{String.fromCharCode(65+i)}</span>{opt}
                    </div>
                  ))}
                  {!showAnswer&&<button disabled={selected===null} onClick={()=>setShowAnswer(true)} style={{...btn(true),width:"100%",opacity:selected===null?0.5:1,marginTop:4}}>Check Answer</button>}
                  {showAnswer&&(
                    <div>
                      <div style={{background:t.highlight,border:`1px solid ${t.accentLight}`,borderRadius:8,padding:"14px",marginTop:8}}>
                        <div style={{fontWeight:700,color:t.accent,marginBottom:6,fontSize:13}}>💡 Explanation</div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.7,margin:0}}>{questions[qIdx]?.explanation||"No explanation provided."}</p>
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:10}}>
                        <button onClick={()=>{setQIdx((qIdx+1)%questions.length);setSelected(null);setShowAnswer(false);}} style={{...btn(true),flex:1}}>Next →</button>
                        <button onClick={async()=>{await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:questions[qIdx]?.subject_id,question_text:questions[qIdx]?.question_text,correct_answer:(questions[qIdx]?.options||[])[Number(questions[qIdx]?.correct_answer)]});showToast("Added to Mistake Notebook ✅");}} style={{...btn(false),fontSize:12}}>❌ Mistakes</button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={card}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>Session</div>
                    {[["Total",questions.length],["Current",`Q${qIdx+1}`],["Filter",qFilter]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:700,color:t.accent}}>{v}</span></div>
                    ))}
                    <button onClick={()=>{setQIdx(0);setSelected(null);setShowAnswer(false);}} style={{...btn(false),width:"100%",fontSize:11,marginTop:8}}>↺ Restart</button>
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
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newFC.subject} onChange={e=>setNewFC({...newFC,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Front (Question/Term)</label><textarea value={newFC.front} onChange={e=>setNewFC({...newFC,front:e.target.value})} placeholder="e.g. What is goodwill?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Back (Answer/Definition)</label><textarea value={newFC.back} onChange={e=>setNewFC({...newFC,back:e.target.value})} placeholder="e.g. Goodwill is the excess of..." rows={3} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{if(!newFC.front||!newFC.back){showToast("Fill both sides","error");return;}await supabase.from("flashcards").insert({subject_id:SUBJECT_ID[newFC.subject],created_by:user.id,front_text:newFC.front,back_text:newFC.back,visibility:"shared"});showToast("Flashcard added! ✅");setShowAddFC(false);setNewFC({subject:"FAR",front:"",back:""});fetchFlashcards();}} style={btn(true)}>Save</button>
                  <button onClick={()=>setShowAddFC(false)} style={btn(false)}>Cancel</button>
                </div>
              </div>
            )}
            {flashcards.length===0?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>🃏</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No flashcards yet</div>
                {isAdmin?<button onClick={()=>setShowAddFC(true)} style={{...btn(true),marginTop:8}}>+ Add First Flashcard</button>:<p style={{fontSize:13,color:t.textMuted,marginTop:4}}>Admin is adding flashcards. Check back soon!</p>}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16}}>
                <div>
                  <div onClick={()=>setFcFlipped(!fcFlipped)} style={{background:fcFlipped?t.accent:t.card,border:`2px solid ${t.accentLight}`,borderRadius:16,padding:"48px 32px",textAlign:"center",cursor:"pointer",minHeight:240,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginBottom:16,transition:"background 0.3s",userSelect:"none"}}>
                    <div style={{fontSize:11,color:fcFlipped?"rgba(255,255,255,0.6)":t.textMuted,marginBottom:12,letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>{fcFlipped?"Answer":"Question"} · {ID_SUBJECT[flashcards[fcIdx]?.subject_id]||"—"}</div>
                    <p className="serif" style={{fontSize:18,color:fcFlipped?"#fff":t.text,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{fcFlipped?flashcards[fcIdx]?.back_text:flashcards[fcIdx]?.front_text}</p>
                    {!fcFlipped&&<div style={{fontSize:11,color:t.textMuted,marginTop:16}}>tap to reveal answer</div>}
                  </div>
                  <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:10}}>
                    <button onClick={()=>{setFcIdx((fcIdx-1+flashcards.length)%flashcards.length);setFcFlipped(false);}} style={btn(false)}>← Prev</button>
                    <span style={{fontSize:12,color:t.textMuted,padding:"8px 16px"}}>Card {fcIdx+1} / {flashcards.length}</span>
                    <button onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={btn(true)}>Next →</button>
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    {["😕 Hard","😐 Medium","😊 Easy"].map(r=><button key={r} onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{r}</button>)}
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>All Cards</div>
                  <div style={{maxHeight:400,overflowY:"auto"}}>
                    {flashcards.map((fc,i)=>(
                      <div key={i} onClick={()=>{setFcIdx(i);setFcFlipped(false);}} style={{padding:"8px 10px",borderRadius:6,marginBottom:5,background:i===fcIdx?t.accentLight:t.highlight,border:`1px solid ${i===fcIdx?t.accentLight:t.border}`,cursor:"pointer",fontSize:12,color:i===fcIdx?t.accentText:t.text}}>
                        <div style={{fontWeight:600,marginBottom:2}}>{fc.front_text?.length>45?fc.front_text.slice(0,45)+"...":fc.front_text}</div>
                        <div style={{fontSize:10,color:t.textMuted}}>{ID_SUBJECT[fc.subject_id]||"—"}</div>
                      </div>
                    ))}
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
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>60-item timed mock exam · Wrong answers auto-added to Mistake Notebook</p>

            {!examStarted&&!examDone&&(
              <div>
                {isAdmin&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:8,fontSize:14}}>🛡️ Admin: Add Questions for Mock Exam</div>
                    <p style={{fontSize:13,color:t.textMuted,marginBottom:12}}>Mock exams are automatically generated from your Question Bank. Add questions to the Question Bank and they'll appear here.</p>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <select value={examQSubjectFilter} onChange={e=>setExamQSubjectFilter(e.target.value)} style={{...inp,width:"auto"}}>
                        {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                      </select>
                      <button onClick={async()=>{const{data}=await supabase.from("questions").select("count").eq("subject_id",SUBJECT_ID[examQSubjectFilter]).eq("is_approved",true);showToast(`${examQSubjectFilter}: ${data?.[0]?.count||0} approved questions available`);}} style={btn(false)}>Check Count</button>
                      <button onClick={()=>s("qbank")} style={btn(true)}>+ Add Questions →</button>
                    </div>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                  {SUBJECTS.map((sub,i)=>(
                    <div key={sub} style={{...card,textAlign:"center",padding:"24px 16px",borderTop:`3px solid ${t.subjectColors[i]}`}}>
                      <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>{sub}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginBottom:12}}>Up to 60 questions · Shuffled</div>
                      <button onClick={()=>startExam(sub)} style={{...btn(true),width:"100%",fontSize:12}}>Start Exam</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {examStarted&&!examDone&&(
              <div>
                <div style={{...card,background:t.accent,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",position:"sticky",top:0,zIndex:10}}>
                  <div>
                    <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{examSubject} Mock Exam</span>
                    <span style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginLeft:12}}>{examQuestions.length} questions</span>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{Object.keys(examAnswers).length}/{examQuestions.length} answered</span>
                    <button onClick={submitExam} style={{background:"white",color:t.accent,border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>Submit Exam →</button>
                  </div>
                </div>
                {examQuestions.map((mq,qi)=>(
                  <div key={mq.id} style={{...card,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontWeight:700,color:t.text,fontSize:14,flex:1,marginRight:10}}>{qi+1}. {mq.question_text}</div>
                      {examAnswers[qi]!==undefined&&<span style={{fontSize:10,color:"#4CAF50",fontWeight:700,flexShrink:0}}>✓ Answered</span>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {(mq.options||[]).map((opt,oi)=>(
                        <div key={oi} onClick={()=>setExamAnswers({...examAnswers,[qi]:oi})} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${examAnswers[qi]===oi?t.accent:t.border}`,background:examAnswers[qi]===oi?t.accentLight:t.surface,cursor:"pointer",fontSize:13,color:t.text}}>
                          <span style={{fontWeight:700,marginRight:6}}>{String.fromCharCode(65+oi)}.</span>{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <button onClick={submitExam} style={{...btn(true),padding:"14px 40px",fontSize:15}}>Submit Exam →</button>
                </div>
              </div>
            )}

            {examDone&&(
              <div style={{maxWidth:520,margin:"0 auto"}}>
                <div style={{textAlign:"center",marginBottom:24}}>
                  <div style={{fontSize:56,marginBottom:12}}>{examScore/examQuestions.length>=0.75?"🎉":"📚"}</div>
                  <h2 style={{fontSize:24,color:t.text,marginBottom:4}}>{examScore/examQuestions.length>=0.75?"Passed!":"Keep Studying!"}</h2>
                  <p className="serif" style={{color:t.textMuted,fontStyle:"italic"}}>{examScore/examQuestions.length>=0.75?"Great job! You're on track.":"Don't give up. Review your mistakes and try again!"}</p>
                </div>
                <div style={card}>
                  {[["Subject",examSubject],["Score",`${examScore} / ${examQuestions.length}`],["Percentage",`${((examScore/examQuestions.length)*100).toFixed(1)}%`],["Passing Mark","75% (45/60)"],["Result",examScore/examQuestions.length>=0.75?"✅ PASSED":"❌ FAILED"],["Wrong Answers",examWrong.length+" (added to Mistake Notebook)"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}>
                      <span style={{color:t.textMuted,fontWeight:600}}>{k}</span>
                      <span style={{fontWeight:700,color:k==="Result"?(examScore/examQuestions.length>=0.75?"#4CAF50":"#c62828"):t.accent}}>{v}</span>
                    </div>
                  ))}
                </div>
                {examWrong.length>0&&(
                  <div style={{...card,borderLeft:`3px solid #ef9a9a`,marginTop:0}}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>❌ Wrong Answers ({examWrong.length}) — Added to Mistake Notebook</div>
                    {examWrong.slice(0,3).map((q,i)=>(
                      <div key={i} style={{fontSize:12,color:t.textMuted,padding:"4px 0",borderBottom:`1px solid ${t.border}`}}>{i+1}. {q.question_text?.slice(0,80)}...</div>
                    ))}
                    {examWrong.length>3&&<div style={{fontSize:11,color:t.textMuted,marginTop:4}}>+{examWrong.length-3} more in Mistake Notebook</div>}
                  </div>
                )}
                <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:16}}>
                  <button onClick={()=>setExamDone(false)} style={{...btn(true),padding:"12px 28px"}}>Take Another</button>
                  <button onClick={()=>s("mistakes")} style={{...btn(false),padding:"12px 28px"}}>Review Mistakes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISCUSSIONS */}
        {page==="discussions"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>💬 Discussions</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Ask questions, share insights, get verified answers</p>
            {!activeDiscussion?(
              <>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                  <button onClick={()=>setShowAddD(!showAddD)} style={btn(true)}>+ Ask Question</button>
                  <span style={{fontSize:12,color:t.textMuted}}>{discussions.length} discussions</span>
                </div>
                {showAddD&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:12}}>Post a Question</div>
                    <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newD.subject} onChange={e=>setNewD({...newD,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Your Question</label><textarea value={newD.question} onChange={e=>setNewD({...newD,question:e.target.value})} placeholder="e.g. How do we compute goodwill under PFRS 3?" rows={3} style={{...inp,resize:"vertical"}}/></div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={async()=>{if(!newD.question){showToast("Enter a question","error");return;}await supabase.from("discussions").insert({subject_id:SUBJECT_ID[newD.subject],user_id:user.id,title:newD.question.slice(0,100),body:newD.question});showToast("Posted! ✅");setShowAddD(false);setNewD({subject:"FAR",question:""});fetchDiscussions();}} style={btn(true)}>Post</button>
                      <button onClick={()=>setShowAddD(false)} style={btn(false)}>Cancel</button>
                    </div>
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
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>Q</div>
                      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:t.text,marginBottom:2}}>{d.title}</div><div style={{fontSize:11,color:t.textMuted}}>{ID_SUBJECT[d.subject_id]||"—"} · {fmtDate(d.created_at)}</div></div>
                      <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:600,flexShrink:0}}>View →</span>
                    </div>
                  </div>
                ))}
              </>
            ):(
              <div>
                <button onClick={()=>setActiveDiscussion(null)} style={{...btn(false),marginBottom:14,fontSize:12}}>← Back</button>
                <div style={card}>
                  <h2 style={{fontSize:16,marginBottom:16,color:t.text}}>{activeDiscussion.title}</h2>
                  <div style={{borderTop:`1px solid ${t.border}`,paddingTop:16}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Replies ({(activeDiscussion.replies||[]).length})</div>
                    {(activeDiscussion.replies||[]).length===0&&<p style={{fontSize:13,color:t.textMuted,fontStyle:"italic",marginBottom:16}}>No replies yet. Be the first to answer!</p>}
                    {(activeDiscussion.replies||[]).map((r,i)=>(
                      <div key={i} style={{background:t.highlight,borderRadius:8,padding:"12px 14px",marginBottom:10,border:`1px solid ${r.is_verified?"#A5D6A7":t.border}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                          {r.is_verified&&<span style={{background:"#E8F5E9",color:"#2E7D32",borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:700}}>✓ Verified Answer</span>}
                          {isAdmin&&!r.is_verified&&<button onClick={async()=>{await supabase.from("discussion_replies").update({is_verified:true}).eq("id",r.id);fetchReplies(activeDiscussion.id);showToast("Verified! ✅");}} style={{...btn(true),fontSize:10,padding:"3px 10px"}}>Verify</button>}
                        </div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.7,margin:0}}>{r.body}</p>
                      </div>
                    ))}
                    <div style={{marginTop:14}}>
                      <textarea value={newReply} onChange={e=>setNewReply(e.target.value)} placeholder="Write your answer..." rows={3} style={{...inp,marginBottom:8,resize:"vertical"}}/>
                      <button onClick={async()=>{if(!newReply)return;await supabase.from("discussion_replies").insert({discussion_id:activeDiscussion.id,user_id:user.id,body:newReply,is_verified:false});setNewReply("");fetchReplies(activeDiscussion.id);}} style={btn(true)}>Post Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MISTAKES */}
        {page==="mistakes"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>❌ Mistake Notebook</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Wrong exam answers auto-tracked · Removed when answered correctly</p>
            <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
              <button onClick={()=>setShowAddM(!showAddM)} style={btn(true)}>+ Add Manually</button>
              <span style={{fontSize:12,color:t.textMuted}}>{mistakes.length} mistakes</span>
            </div>
            {showAddM&&(
              <div style={{...card,borderLeft:`3px solid #c62828`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12}}>Add Mistake Manually</div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newM.subject} onChange={e=>setNewM({...newM,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Question</label><textarea value={newM.q} onChange={e=>setNewM({...newM,q:e.target.value})} placeholder="What was the question?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Correct Answer</label><textarea value={newM.correct} onChange={e=>setNewM({...newM,correct:e.target.value})} placeholder="The correct answer is..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Personal Note</label><textarea value={newM.note} onChange={e=>setNewM({...newM,note:e.target.value})} placeholder="Why did I get this wrong?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{if(!newM.q){showToast("Enter question","error");return;}await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:SUBJECT_ID[newM.subject],question_text:newM.q,correct_answer:newM.correct,personal_note:newM.note});showToast("Saved! ✅");setShowAddM(false);setNewM({q:"",correct:"",note:"",subject:"FAR"});fetchMistakes();}} style={btn(true)}>Save</button>
                  <button onClick={()=>setShowAddM(false)} style={btn(false)}>Cancel</button>
                </div>
              </div>
            )}
            {mistakes.length===0&&!showAddM?(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                <div style={{fontSize:40,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No mistakes yet!</div>
                <div style={{fontSize:13,color:t.textMuted}}>Take a mock exam and wrong answers will appear here automatically.</div>
              </div>
            ):mistakes.map(m=>(
              <div key={m.id} style={{...card,borderLeft:`3px solid #ef9a9a`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1,marginRight:8}}>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"1px 8px",fontSize:10,fontWeight:600,marginRight:6}}>{ID_SUBJECT[m.subject_id]||"—"}</span>
                    <div style={{fontWeight:700,color:t.text,fontSize:13,marginTop:6}}>{m.question_text}</div>
                  </div>
                  <button onClick={async()=>{await supabase.from("mistake_notebook").delete().eq("id",m.id);fetchMistakes();}} style={{...btn(false,true),fontSize:10,padding:"3px 8px",flexShrink:0}}>Remove</button>
                </div>
                {m.correct_answer&&<div style={{background:"#E8F5E9",borderRadius:6,padding:"8px 12px",marginBottom:6,fontSize:12,color:"#2E7D32"}}><strong>✅ Correct Answer:</strong> {m.correct_answer}</div>}
                {m.personal_note&&<div style={{background:t.highlight,borderRadius:6,padding:"8px 12px",fontSize:12,color:t.text}}>📝 {m.personal_note}</div>}
                <div style={{fontSize:10,color:t.textMuted,marginTop:6}}>{fmtDate(m.created_at)}</div>
              </div>
            ))}
          </div>
        )}

        {/* GROUPS */}
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
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Group Name</label><input value={newGroup.name} onChange={e=>setNewGroup({...newGroup,name:e.target.value})} placeholder="e.g. FAR Warriors" style={inp}/></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newGroup.subject} onChange={e=>setNewGroup({...newGroup,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Type</label><select value={newGroup.type} onChange={e=>setNewGroup({...newGroup,type:e.target.value})} style={inp}><option value="public">Public</option><option value="private">Private</option></select></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Description</label><textarea value={newGroup.description} onChange={e=>setNewGroup({...newGroup,description:e.target.value})} placeholder="What is this group about?" rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{if(!newGroup.name){showToast("Enter group name","error");return;}await supabase.from("study_groups").insert({name:newGroup.name,subject_id:SUBJECT_ID[newGroup.subject],created_by:user.id,type:newGroup.type,description:newGroup.description,member_count:1});showToast("Group created! ✅");setShowAddGroup(false);setNewGroup({name:"",subject:"FAR",type:"public",description:""});fetchGroups();}} style={btn(true)}>Create</button>
                  <button onClick={()=>setShowAddGroup(false)} style={btn(false)}>Cancel</button>
                </div>
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
                    <div style={{fontSize:12,color:t.textMuted,marginBottom:6}}>{ID_SUBJECT[g.subject_id]||"General"} · {g.member_count} member{g.member_count!==1?"s":""}</div>
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
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Track your mastery across all subjects</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[["❓","Questions","qbank"],["🃏","Flashcards","flashcards"],["📝","Mock Exams","mockexam"],["❌","Mistakes","mistakes"]].map(([icon,title,pg])=>(
                <div key={title} onClick={()=>s(pg)} style={{...card,textAlign:"center",padding:"20px",cursor:"pointer"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
                  <div style={{fontWeight:700,color:t.text,fontSize:13}}>{title}</div>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,fontSize:14}}>Subject Overview</div>
              {SUBJECTS.map((sub,i)=>(
                <div key={sub} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{fontWeight:600}}>{sub}</span><span style={{color:t.textMuted,fontSize:11}}>Complete exams to track progress</span></div>
                  <div style={{background:t.border,borderRadius:6,height:8}}><div style={{width:"0%",background:t.subjectColors[i],borderRadius:6,height:8}}/></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {page==="leaderboard"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>🏆 Leaderboard</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Top contributors and highest scorers</p>
            <div style={{...card,textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏆</div>
              <div style={{fontWeight:700,color:t.text,marginBottom:8,fontSize:16}}>Coming Soon!</div>
              <p style={{fontSize:13,color:t.textMuted,maxWidth:400,margin:"0 auto",lineHeight:1.7}}>Rankings will populate as students answer questions, take exams, upload materials, and participate in discussions. Keep studying!</p>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile"&&(
          <div style={{maxWidth:580}}>
            <h1 style={{fontSize:22,marginBottom:4}}>👤 My Profile</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Manage your account information</p>
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:24}}>{(profile?.full_name||user?.email||"?")[0].toUpperCase()}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:18,color:t.text}}>{profile?.full_name||"No name set"}</div>
                  <div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{user?.email}</div>
                  <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 10px",fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{profile?.role||"student"}</span>
                    <span style={{background:isPaid?"#E8F5E9":"#FFF3E0",color:isPaid?"#2E7D32":"#E65100",borderRadius:10,padding:"2px 10px",fontSize:10,fontWeight:700}}>{isPaid?"✓ Full Access":"Free Account"}</span>
                  </div>
                </div>
                <button onClick={()=>setEditingProfile(!editingProfile)} style={btn(editingProfile)}>{editingProfile?"Cancel":"✏️ Edit"}</button>
              </div>
              {editingProfile?(
                <div>
                  {[["Full Name","full_name","e.g. Juls Domingo"],["School","school","e.g. UST, DLSU"],["Year Level","year_level","e.g. 4th Year, Graduate"]].map(([label,field,ph])=>(
                    <div key={field} style={{marginBottom:14}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</label><input value={editForm[field]||""} onChange={e=>setEditForm({...editForm,[field]:e.target.value})} placeholder={ph} style={inp}/></div>
                  ))}
                  <button onClick={async()=>{const{error}=await supabase.from("profiles").update({full_name:editForm.full_name,school:editForm.school,year_level:editForm.year_level,updated_at:new Date().toISOString()}).eq("id",user.id);if(!error){setProfile({...profile,...editForm});setEditingProfile(false);showToast("Profile updated! ✅");}}} style={{...btn(true),padding:"10px 24px"}}>Save Changes</button>
                </div>
              ):(
                <div>
                  {[["Full Name",profile?.full_name||"—"],["Email",user?.email],["School",profile?.school||"—"],["Year Level",profile?.year_level||"—"],["Role",profile?.role||"student"],["Access",isPaid?"Full Access (Paid)":"Free Account"],["Member Since",fmtDate(profile?.created_at)]].map(([label,val])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted,fontWeight:600}}>{label}</span><span style={{fontWeight:500,color:t.text,textTransform:label==="Role"?"capitalize":"none"}}>{val}</span></div>
                  ))}
                </div>
              )}
            </div>
            {!isPaid&&<div style={{...card,borderLeft:`3px solid ${t.accent}`,background:t.highlight}}>
              <div style={{fontWeight:700,color:t.accentText,marginBottom:4}}>🔓 Upgrade to Full Access</div>
              <div style={{fontSize:13,color:t.accentText,marginBottom:10}}>Unlock Question Bank, Flashcards, Mock Exams, Discussions & more for just ₱99 one-time.</div>
              <button onClick={()=>{setPage("payment");setPayStep(1);}} style={btn(true)}>Pay ₱99 →</button>
            </div>}
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:8,fontSize:14}}>🔒 Account Security</div>
              <p style={{fontSize:13,color:t.textMuted,marginBottom:12}}>To change your password, sign out and use the forgot password option.</p>
              <button onClick={handleLogout} style={btn(false,true)}>Sign Out</button>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {page==="admin"&&isAdmin&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>🛡️ Admin Panel</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Manage users, payments, and content</p>

            {/* PENDING PAYMENTS */}
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div><div style={{fontWeight:700,fontSize:15}}>💳 Pending Payments</div><div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{pendingPayments.length} awaiting verification</div></div>
                <button onClick={fetchPendingPayments} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>↺ Refresh</button>
              </div>
              {pendingPayments.length===0?(
                <div style={{textAlign:"center",padding:"24px",background:t.highlight,borderRadius:10}}>
                  <div style={{fontSize:28,marginBottom:6}}>✅</div>
                  <div style={{color:t.textMuted,fontSize:13}}>No pending payments</div>
                </div>
              ):pendingPayments.map(p=>(
                <div key={p.id} style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:t.text}}>User ID: {p.user_id?.slice(0,16)}...</div>
                      <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>Submitted: {fmtDate(p.created_at)}</div>
                    </div>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"4px 12px",fontSize:13,fontWeight:700}}>₱{p.amount}</span>
                  </div>
                  <div style={{background:t.highlight,borderRadius:8,padding:"10px 12px",marginBottom:12,fontSize:13,color:t.text}}>
                    <div><strong>Reference #:</strong> {p.reference_number}</div>
                    <div><strong>Method:</strong> {p.payment_method}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>handleApprovePayment(p)} style={{...btn(true),fontSize:13,padding:"8px 20px"}}>✅ Approve Access</button>
                    <button onClick={async()=>{await supabase.from("user_payments").update({status:"rejected"}).eq("id",p.id);showToast("Rejected.");fetchPendingPayments();}} style={{...btn(false,true),fontSize:13,padding:"8px 16px"}}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ALL USERS */}
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div><div style={{fontWeight:700,fontSize:15}}>👥 All Registered Users</div><div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{allUsers.length} total users</div></div>
                <button onClick={fetchAllUsers} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>↺ Refresh</button>
              </div>
              {allUsers.length===0?(
                <div style={{textAlign:"center",padding:"24px",background:t.highlight,borderRadius:10}}>
                  <div style={{color:t.textMuted,fontSize:13}}>No users yet</div>
                </div>
              ):(
                <div style={{maxHeight:400,overflowY:"auto"}}>
                  {allUsers.map(u=>(
                    <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{(u.full_name||"?")[0].toUpperCase()}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.full_name||"No name"}</div>
                        <div style={{fontSize:11,color:t.textMuted}}>{u.school||"—"} · Joined {fmtDate(u.created_at)}</div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <span style={{background:u.is_approved?"#E8F5E9":"#FFF3E0",color:u.is_approved?"#2E7D32":"#E65100",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700}}>{u.is_approved?"✓ Paid":"Free"}</span>
                        <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600,textTransform:"capitalize"}}>{u.role||"student"}</span>
                        {!u.is_approved&&u.role!=="admin"&&(
                          <button onClick={async()=>{await supabase.from("profiles").update({is_approved:true}).eq("id",u.id);showToast("User approved! ✅");fetchAllUsers();}} style={{...btn(true),fontSize:10,padding:"3px 10px"}}>Approve</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK SQL */}
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:8,fontSize:14}}>⚡ Manual Approval via SQL</div>
              <div style={{background:"#1a1a2e",borderRadius:8,padding:"14px 16px",fontSize:12,color:"#a8ff78",fontFamily:"monospace",lineHeight:1.9}}>
                UPDATE profiles<br/>
                SET is_approved = true<br/>
                WHERE id = 'paste-user-uuid-here';
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}