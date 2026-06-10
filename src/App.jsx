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
body{font-family:'Montserrat','Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;}
h1,h2,h3{font-family:'Montserrat','Segoe UI',Arial,sans-serif;font-weight:800;letter-spacing:-0.5px;}
.serif{font-family:'Sorts Mill Goudy',Georgia,serif;}
input,textarea,select,button,p,span,div,label{font-family:'Montserrat','Segoe UI',Arial,sans-serif;}
.note-editor{outline:none;min-height:300px;padding:16px;font-size:14px;line-height:1.9;word-break:break-word;}
.note-editor table{border-collapse:collapse;width:100%;margin:12px 0;}
.note-editor td,.note-editor th{border:1px solid #ccc;padding:8px 10px;min-width:60px;}
.note-editor th{background:#f5f5f5;font-weight:700;}
.note-editor hr{border:none;border-top:2px solid #ddd;margin:16px 0;}
.note-editor h2{font-size:18px;font-weight:800;margin:12px 0 6px;}
.note-editor h3{font-size:15px;font-weight:700;margin:10px 0 4px;}
.note-editor ul,.note-editor ol{padding-left:24px;margin:8px 0;}
.note-editor li{margin-bottom:4px;}
`;

const PASTEL={name:"pastel",bg:"#FDF6FB",surface:"#FFF0F7",card:"#FFFFFF",sidebar:"#F9E8F5",sidebarBorder:"#EEC8E8",accent:"#D46FAC",accentLight:"#F7C8E8",accentText:"#A3347A",text:"#3D1F35",textMuted:"#9B6A87",border:"#EDD5E8",badge:"#F4DAEF",badgeText:"#8B3B72",highlight:"#FDE8F5",navActive:"#F7C8E8",navActiveText:"#8B3B72",subjectColors:["#F8B4D9","#C3B1E1","#B5EAD7","#FFDAC1","#B5D5F5","#F9C9C9","#CBE4C4"],subjectText:["#8B3B72","#5B3E8F","#2A7D5A","#A85D00","#1A5FAD","#9B2828","#3D6B2A"]};
const EARTHY={name:"earthy",bg:"#F5F0E8",surface:"#EDE5D8",card:"#FDFAF5",sidebar:"#EAE0CE",sidebarBorder:"#C8B89A",accent:"#7C6248",accentLight:"#D4BFA0",accentText:"#5C3D1E",text:"#2C1F0E",textMuted:"#7A6248",border:"#D4C4A8",badge:"#E8DCC8",badgeText:"#5C3D1E",highlight:"#F0E8D5",navActive:"#D4BFA0",navActiveText:"#5C3D1E",subjectColors:["#D4A574","#B5C99A","#A8C4C8","#D4B896","#C4A8B8","#B8C4A0","#C8B084"],subjectText:["#5C3D1E","#3A5A1E","#1E4A50","#5C3D1E","#4A2848","#2A4A1E","#4A3808"]};

const SUBJECTS=["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"];
const SUBJECT_ID={"FAR":1,"AFAR":2,"MAS":3,"RFBT":4,"TAX":5,"Auditing Theory":6,"Auditing Problems":7};
const ID_SUBJECT={1:"FAR",2:"AFAR",3:"MAS",4:"RFBT",5:"TAX",6:"Auditing Theory",7:"Auditing Problems"};
const TOPICS={
  FAR:["Introduction to Accountancy & Preface to PFRS","Conceptual Framework","Cash and Cash Equivalents","Receivables","Inventories","Biological Assets","PPE","Government Grants","Borrowing Costs","Depletion of Mineral Resources","Intangible Assets","Impairment of Assets","Investment in Debt Securities","Investment Properties","Funds and Other Investments","Current Liabilities","Notes Payable","Bonds Payable","Compound Financial Instruments","Provisions","Employee Benefits","Income Taxes","Leases","Shareholders Equity","Share-based Payments","Book Value Per Share","Earnings per Share","Financial Statements","Statement of Cash Flows","Operating Segments","Non-Current Asset Held for Sale","Events after the Reporting Period","Related Parties","Interim Financial Reporting","Accounting Changes and Error Correction","Cash to Accrual Basis","Accounting Process","SMEs"],
  AFAR:["Partnership Accounting","Corporate Liquidation","Revenue Recognition","Decentralized Operations","Business Combination","Separate and Consolidated FS","Joint Arrangements","Forex and Hyperinflation","Derivatives and Hedge Accounting","Not-for-Profit Organizations","Government Accounting","Insurance Contracts","Service Concession Arrangement"],
  MAS:["Basic Consideration in MAS","Variable and Absorption Costing","CVP-BEP","Financial Statement Analysis","Budgeting","Standard Cost Variance Analysis","Performance Evaluation","Pricing","Relevant Costing","Quantitative Techniques","Financial Markets","Working Capital Management","Short-Term Financing","Long-Term Financing","Capital Budgeting","Risk and Leverage","Economics","Strategic Costing"],
  RFBT:["Obligations","Contracts","Sales","Credit Transactions","Anti-Bouncing Checks Law","Consumer Protection Act and Lemon Law","Financial Rehabilitation and Insolvency Act","Philippine Competition Act","Government Procurement Law","Partnership","Law on Corporations","Insurance","Cooperatives","AMLA","Intellectual Property Law","Data Privacy Act","E-Commerce Act","Ease of Doing Business Act","Labor Law","Social Security Law"],
  TAX:["Fundamental Principles of Taxation","Taxes, Tax Laws and Tax Administration","Fundamental Principles of Income Taxation","Final Income Taxation","Capital Gains Taxation","Regular Income Tax","Compensation Income","Fringe Benefits","Dealings in Properties","Principles of Deductions","Itemized Deductions","Optional Standard Deductions","Individual Income Taxation","Corporate Income Taxation","Estate Tax","Donor's Tax","Consumption Tax","VAT on Importation","Introduction to Business Taxation","Specific Percentage Tax","Value Added Tax","Excise Tax and Documentary Stamp Tax","Tax Remedies","Local Taxation","Preferential Taxation"],
  "Auditing Theory":["The Accountancy Profession","Code of Ethics for Professional Accountants","Fundamentals of Assurance Services","Introduction to Auditing","Preliminary Engagement Activities","Audit Planning","Study and Evaluation of Internal Control","Auditing in IT Environment","Transaction Cycles","Fraud, Error, and Non-Compliance","Evidence and Substantive Testing","Approaches of Gathering Evidence and Audit Sampling","Completing the Audit","Audit Documentation and Communication with TCWG","System of Quality Control","Audit Reporting (General-Purpose FS)","Other Engagements"],
  "Auditing Problems":["Single Entry System","Correction of Errors","Shareholders Equity","Share-Based Payment","Audit of Cash","Receivables","Inventories and Agriculture","Investment in Equity Securities","Investment in Debt Securities","Notes and Bonds Payable","Property, Plant and Equipment","Intangible Assets","Investment Property","Revaluation and Impairment","Current Liabilities","Accounting for Income Tax","Employee Benefits","Statement of Cash Flows","Financial Statements","Lease"],
};

const FILE_ICONS={"pdf":"📄","doc":"📝","docx":"📝","xls":"📊","xlsx":"📊","ppt":"📋","pptx":"📋","png":"🖼","jpg":"🖼","jpeg":"🖼","gif":"🖼","youtube":"🎥","default":"📁"};
const getIcon=(n)=>{const e=n?.split(".").pop()?.toLowerCase();return FILE_ICONS[e]||FILE_ICONS.default;};
const fmtSize=(b)=>{if(!b)return"";if(b<1048576)return(b/1024).toFixed(1)+"KB";return(b/1048576).toFixed(1)+"MB";};
const fmtDate=(d)=>d?new Date(d).toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"}):"—";
const fmtShort=(d)=>d?new Date(d).toLocaleDateString("en-PH",{month:"short",day:"numeric"}):"";
const getYtId=(url)=>{const r=url?.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);return r?r[1]:null;};

const PAID_PAGES=["qbank","flashcards","mockexam","discussions","groups","leaderboard","progress"];
const EXAM_TYPES=["Board Exam","Evaluation Exam","Quiz","Prelims","Midterms","Finals","Qualifying Exam","Comprehensive Exam"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const ACTIVITIES=["Study","Review","Practice Exam","Flashcards","Rest","Workout","Personal Errands","Movie Break","Family Time","Reading","Other"];
const HIGHLIGHTERS=[{c:"#FFD6E7",l:"Pink"},{c:"#D6E4FF",l:"Blue"},{c:"#D6FFE4",l:"Green"},{c:"#FFF3D6",l:"Yellow"},{c:"#EDD6FF",l:"Purple"},{c:"#F5E6D3",l:"Tan"},{c:"#D4E6C3",l:"Sage"},{c:"#F0D9C0",l:"Sand"},{c:"#FFFF00",l:"Bright Yellow"},{c:"#90EE90",l:"Bright Green"},{c:"#ADD8E6",l:"Bright Blue"}];

export default function App() {
  const [theme,setTheme]=useState(PASTEL);
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [toast,setToast]=useState(null);
  // auth
  const [loginForm,setLoginForm]=useState({email:"",pass:""});
  const [loginError,setLoginError]=useState("");
  const [showRegister,setShowRegister]=useState(false);
  const [regForm,setRegForm]=useState({name:"",email:"",pass:"",school:""});
  // payment
  const [payStep,setPayStep]=useState(1);
  const [payForm,setPayForm]=useState({ref:"",screenshotName:""});
  const [submittingPay,setSubmittingPay]=useState(false);
  // admin
  const [pendingPayments,setPendingPayments]=useState([]);
  const [allUsers,setAllUsers]=useState([]);
  // profile
  const [editingProfile,setEditingProfile]=useState(false);
  const [editForm,setEditForm]=useState({});
  // subjects
  const [activeSub,setActiveSub]=useState("FAR");
  const [activeTopic,setActiveTopic]=useState(null);
  const [materials,setMaterials]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  // qbank
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAns,setShowAns]=useState(false);
  const [qFilter,setQFilter]=useState("All");
  const [showAddQ,setShowAddQ]=useState(false);
  const [newQ,setNewQ]=useState({subject:"FAR",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});
  // flashcards
  const [flashcards,setFlashcards]=useState([]);
  const [fcIdx,setFcIdx]=useState(0);
  const [fcFlipped,setFcFlipped]=useState(false);
  const [showAddFC,setShowAddFC]=useState(false);
  const [newFC,setNewFC]=useState({subject:"FAR",front:"",back:""});
  // exam
  const [examStarted,setExamStarted]=useState(false);
  const [examAnswers,setExamAnswers]=useState({});
  const [examDone,setExamDone]=useState(false);
  const [examQs,setExamQs]=useState([]);
  const [examSub,setExamSub]=useState("FAR");
  const [examScore,setExamScore]=useState(0);
  const [examWrong,setExamWrong]=useState([]);
  // discussions
  const [discussions,setDiscussions]=useState([]);
  const [activeDisc,setActiveDisc]=useState(null);
  const [showAddD,setShowAddD]=useState(false);
  const [newD,setNewD]=useState({subject:"FAR",question:""});
  const [newReply,setNewReply]=useState("");
  // notes
  const [notes,setNotes]=useState([]);
  const [noteFiles,setNoteFiles]=useState([]);
  const [videos,setVideos]=useState([]);
  const [noteTab,setNoteTab]=useState("written");
  const [noteMode,setNoteMode]=useState("list");
  const [activeNote,setActiveNote]=useState(null);
  const [noteForm,setNoteForm]=useState({title:"",subject:"FAR",topic:"",body:"",is_shared:false});
  const [showAddVideo,setShowAddVideo]=useState(false);
  const [newVideo,setNewVideo]=useState({title:"",url:"",subject:"FAR",topic:"",description:""});
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
  const [planSetup,setPlanSetup]=useState({targetDate:"",examType:"Board Exam",hoursPerDay:4,breakDays:["Sun"],priorities:[...SUBJECTS]});
  const [customBlocks,setCustomBlocks]=useState([]);
  const [showAddBlock,setShowAddBlock]=useState(false);
  const [newBlock,setNewBlock]=useState({day:"Mon",startTime:"08:00",endTime:"09:00",activity:"Study",notes:""});
  const [generatedPlan,setGeneratedPlan]=useState(null);
  const [showPlanSetup,setShowPlanSetup]=useState(true);

  const t=theme;
  const isAdmin=profile?.role==="admin";
  const isPaid=isAdmin||profile?.is_approved;
  const card={background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:"18px 20px",marginBottom:12};
  const btn=(primary,danger)=>({background:primary?t.accent:danger?"#c62828":"transparent",color:primary||danger?"#fff":t.accentText,border:`1px solid ${primary?t.accent:danger?"#c62828":t.border}`,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontWeight:600,fontSize:13});
  const inp={width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:13,background:t.surface,color:t.text};
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const go=(p)=>{
    if(PAID_PAGES.includes(p)&&!isPaid){showToast("Upgrade to full access to use this feature.","error");setPage("payment");setPayStep(1);return;}
    setPage(p);
  };

  const navItems=[
    {id:"dashboard",icon:"🏠",label:"Dashboard",free:true},
    {id:"subjects",icon:"📚",label:"Subjects",free:true},
    {id:"notes",icon:"📖",label:"Notes",free:true},
    {id:"planner",icon:"📅",label:"Planner",free:true},
    {id:"mistakes",icon:"❌",label:"Mistakes",free:true},
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

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session){setUser(session.user);loadProfile(session.user.id);}});
    supabase.auth.onAuthStateChange((_,session)=>{if(session){setUser(session.user);loadProfile(session.user.id);}else{setUser(null);setProfile(null);setPage("landing");}});
  },[]);

  const loadProfile=async(uid)=>{
    const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
    if(data){setProfile(data);setEditForm(data);}
    setPage("dashboard");
  };

  useEffect(()=>{if(page==="subjects"&&user)fetchMaterials();},[page,activeSub]);
  useEffect(()=>{if(page==="qbank"&&isPaid)fetchQuestions();},[page,qFilter]);
  useEffect(()=>{if(page==="flashcards"&&isPaid)fetchFlashcards();},[page]);
  useEffect(()=>{if(page==="discussions"&&isPaid)fetchDiscussions();},[page]);
  useEffect(()=>{if(page==="notes"&&user){fetchNotes();fetchNoteFiles();fetchVideos();};},[page]);
  useEffect(()=>{if(page==="mistakes"&&user)fetchMistakes();},[page]);
  useEffect(()=>{if(page==="groups"&&isPaid)fetchGroups();},[page]);
  useEffect(()=>{if(page==="admin"&&isAdmin){fetchPendingPayments();fetchAllUsers();};},[page]);
  useEffect(()=>{if(activeDisc?.id)fetchReplies(activeDisc.id);},[activeDisc?.id]);

  const fetchMaterials=async()=>{
    let q=supabase.from("materials").select("*").eq("subject_id",SUBJECT_ID[activeSub]||1).not("file_type","eq","youtube").order("created_at",{ascending:false});
    if(!isPaid)q=q.eq("uploaded_by",user?.id);
    else q=q.or(`visibility.eq.shared,uploaded_by.eq.${user?.id}`);
    const{data}=await q;setMaterials(data||[]);
  };
  const fetchQuestions=async()=>{
    let q=supabase.from("questions").select("*").eq("is_approved",true).order("created_at",{ascending:false});
    if(qFilter!=="All")q=q.eq("subject_id",SUBJECT_ID[qFilter]);
    const{data}=await q;setQuestions(data||[]);
  };
  const fetchFlashcards=async()=>{const{data}=await supabase.from("flashcards").select("*").eq("visibility","shared").order("created_at",{ascending:false});setFlashcards(data||[]);};
  const fetchDiscussions=async()=>{const{data}=await supabase.from("discussions").select("*").order("created_at",{ascending:false});setDiscussions(data||[]);};
  const fetchReplies=async(did)=>{const{data}=await supabase.from("discussion_replies").select("*").eq("discussion_id",did).order("created_at",{ascending:true});setActiveDisc(d=>({...d,replies:data||[]}));};
  const fetchNotes=async()=>{const{data}=await supabase.from("user_notes").select("*").order("updated_at",{ascending:false}).or(`user_id.eq.${user.id}${isPaid?",is_shared.eq.true":""}`);setNotes(data||[]);};
  const fetchNoteFiles=async()=>{
    let q=supabase.from("materials").select("*").not("file_type","eq","youtube").order("created_at",{ascending:false});
    if(!isPaid)q=q.eq("uploaded_by",user?.id);
    else q=q.or(`visibility.eq.shared,uploaded_by.eq.${user?.id}`);
    const{data}=await q;setNoteFiles(data||[]);
  };
  const fetchVideos=async()=>{const{data}=await supabase.from("materials").select("*").eq("file_type","youtube").eq("visibility","shared").order("created_at",{ascending:false});setVideos(data||[]);};
  const fetchMistakes=async()=>{const{data}=await supabase.from("mistake_notebook").select("*").eq("user_id",user.id).order("created_at",{ascending:false});setMistakes(data||[]);};
  const fetchGroups=async()=>{const{data}=await supabase.from("study_groups").select("*").order("created_at",{ascending:false});setGroups(data||[]);};
  const fetchPendingPayments=async()=>{const{data}=await supabase.from("user_payments").select("*").eq("status","pending").order("created_at",{ascending:false});setPendingPayments(data||[]);};
  const fetchAllUsers=async()=>{const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});setAllUsers(data||[]);};

  const handleLogin=async()=>{setLoginError("");const{error}=await supabase.auth.signInWithPassword({email:loginForm.email,password:loginForm.pass});if(error)setLoginError(error.message);};
  const handleRegister=async()=>{setLoginError("");if(!regForm.name||!regForm.email||!regForm.pass){setLoginError("Fill in all required fields.");return;}const{error}=await supabase.auth.signUp({email:regForm.email,password:regForm.pass,options:{data:{full_name:regForm.name,school:regForm.school}}});if(error)setLoginError(error.message);else{showToast("Account created!");setShowRegister(false);}};
  const handleLogout=async()=>{await supabase.auth.signOut();};

  const handleUpload=async(files)=>{
    if(!files?.length)return;setUploading(true);
    for(const file of files){
      const path=`${activeSub}/${Date.now()}_${file.name}`;
      const{error:upErr}=await supabase.storage.from("materials").upload(path,file,{cacheControl:"3600",upsert:false});
      if(upErr){showToast(`Failed: ${file.name}`,"error");continue;}
      const{data:urlData}=supabase.storage.from("materials").getPublicUrl(path);
      await supabase.from("materials").insert({subject_id:SUBJECT_ID[activeSub]||1,uploaded_by:user.id,title:file.name.replace(/\.[^/.]+$/,""),file_url:urlData.publicUrl,file_type:file.name.split(".").pop(),file_size_kb:Math.round(file.size/1024),visibility:isPaid?"shared":"private",is_approved:isAdmin});
      showToast(`✅ ${file.name} uploaded!`);
    }
    setUploading(false);fetchMaterials();
  };

  const handlePaySubmit=async()=>{
    if(!payForm.ref){showToast("Enter reference number","error");return;}
    setSubmittingPay(true);
    await supabase.from("user_payments").insert({user_id:user.id,amount:99,currency:"PHP",payment_method:"MariBank InstaPay",reference_number:payForm.ref,status:"pending"});
    setPayStep(3);showToast("Submitted! ✅");setSubmittingPay(false);
  };

  const handleApprove=async(p)=>{
    await supabase.from("user_payments").update({status:"verified",verified_at:new Date().toISOString()}).eq("id",p.id);
    await supabase.from("profiles").update({is_approved:true}).eq("id",p.user_id);
    showToast("User approved! ✅");fetchPendingPayments();fetchAllUsers();
  };

  // ── NOTE EDITOR ──
  const execCmd=(cmd,val=null)=>{document.execCommand(cmd,false,val);editorRef.current?.focus();};
  const insertTable=()=>{
    const rows=parseInt(prompt("Rows:",3)||3);
    const cols=parseInt(prompt("Columns:",3)||3);
    if(isNaN(rows)||isNaN(cols))return;
    let html="<table><tr>"+Array(cols).fill(0).map((_,i)=>`<th contenteditable='true'>Header ${i+1}</th>`).join("")+"</tr>";
    for(let r=0;r<rows-1;r++)html+="<tr>"+Array(cols).fill(0).map(()=>`<td contenteditable='true'>Cell</td>`).join("")+"</tr>";
    html+="</table><p><br/></p>";
    execCmd("insertHTML",html);
  };
  const tableOp=(op)=>{
    const sel=window.getSelection();if(!sel||sel.rangeCount===0)return;
    let node=sel.anchorNode;
    while(node&&node!==editorRef.current){if(node.nodeName==="TD"||node.nodeName==="TH")break;node=node.parentNode;}
    if(!node||(node.nodeName!=="TD"&&node.nodeName!=="TH")){showToast("Click inside a table cell first","error");return;}
    const row=node.parentNode;
    const table=row.parentNode.nodeName==="TBODY"?row.parentNode.parentNode:row.parentNode;
    const ci=node.cellIndex;const rows=table.rows;
    if(op==="addCol"){for(let i=0;i<rows.length;i++){const c=i===0?document.createElement("th"):document.createElement("td");c.contentEditable="true";c.textContent=i===0?"Header":"Cell";rows[i].insertBefore(c,rows[i].cells[ci+1]||null);}}
    else if(op==="delCol"){if(rows[0].cells.length<=1){showToast("Can't delete last column","error");return;}for(let i=0;i<rows.length;i++)if(rows[i].cells[ci])rows[i].deleteCell(ci);}
    else if(op==="addRow"){const nr=table.insertRow(row.rowIndex+1);for(let i=0;i<row.cells.length;i++){const c=nr.insertCell();c.contentEditable="true";c.textContent="Cell";}}
    else if(op==="delRow"){if(rows.length<=1){showToast("Can't delete last row","error");return;}table.deleteRow(row.rowIndex);}
  };
  const deleteEl=()=>{
    const sel=window.getSelection();if(!sel||sel.rangeCount===0)return;
    let node=sel.anchorNode;
    while(node&&node!==editorRef.current){if(node.nodeName==="TABLE"||node.nodeName==="HR"){node.parentNode.removeChild(node);return;}node=node.parentNode;}
    showToast("Click inside table or on line first","error");
  };
  const insert2Col=()=>execCmd("insertHTML",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0;"><div style="border:1px solid #ddd;border-radius:6px;padding:12px;min-height:60px;" contenteditable="true">Column 1</div><div style="border:1px solid #ddd;border-radius:6px;padding:12px;min-height:60px;" contenteditable="true">Column 2</div></div><p><br/></p>`);
  const insert3Col=()=>execCmd("insertHTML",`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:12px 0;"><div style="border:1px solid #ddd;border-radius:6px;padding:12px;min-height:60px;" contenteditable="true">Column 1</div><div style="border:1px solid #ddd;border-radius:6px;padding:12px;min-height:60px;" contenteditable="true">Column 2</div><div style="border:1px solid #ddd;border-radius:6px;padding:12px;min-height:60px;" contenteditable="true">Column 3</div></div><p><br/></p>`);

  const saveNote=async()=>{
    const body=editorRef.current?.innerHTML||"";
    if(!noteForm.title){showToast("Add a title","error");return;}
    if(activeNote?.id){
      await supabase.from("user_notes").update({title:noteForm.title,subject_id:SUBJECT_ID[noteForm.subject]||null,body,is_shared:noteForm.is_shared&&isPaid,updated_at:new Date().toISOString()}).eq("id",activeNote.id);
    } else {
      const{data}=await supabase.from("user_notes").insert({user_id:user.id,subject_id:SUBJECT_ID[noteForm.subject]||null,title:noteForm.title,body,is_shared:noteForm.is_shared&&isPaid}).select().single();
      setActiveNote(data);
    }
    showToast("Saved! ✅");fetchNotes();
  };

  const printNote=()=>{
    const body=editorRef.current?.innerHTML||activeNote?.body||"";
    const win=window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>${noteForm.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <style>*{box-sizing:border-box;}body{font-family:'Montserrat','Segoe UI',Arial,sans-serif;padding:48px;max-width:800px;margin:0 auto;color:#1a1a1a;font-size:13px;line-height:1.8;}.hdr{text-align:center;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #D46FAC;}.hdr img{height:44px;margin-bottom:8px;}.brand{font-size:20px;font-weight:800;color:#D46FAC;display:block;margin-bottom:4px;}.meta{font-size:12px;color:#888;}h1{font-size:20px;font-weight:800;margin-bottom:16px;}h2{font-size:16px;font-weight:700;margin:16px 0 8px;}h3{font-size:14px;font-weight:600;margin:12px 0 6px;}p{margin-bottom:8px;}table{border-collapse:collapse;width:100%;margin:12px 0;font-size:12px;}td,th{border:1px solid #999;padding:8px 10px;}th{background:#f0f0f0;font-weight:700;}hr{border:none;border-top:2px solid #ddd;margin:16px 0;}ul,ol{padding-left:24px;margin:8px 0;}li{margin-bottom:3px;}img{max-width:100%;border-radius:4px;margin:8px 0;}.ftr{margin-top:32px;padding-top:12px;border-top:1px solid #ccc;font-size:11px;color:#888;display:flex;justify-content:space-between;}</style>
    </head><body>
    <div class="hdr"><img src="${LOGO_URL}" alt="CPALearn PH"/><span class="brand">CPALearn PH</span><div class="meta">${noteForm.subject||"—"}${noteForm.topic?` · ${noteForm.topic}`:""}<br/>Date Generated: ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</div></div>
    <h1>${noteForm.title||"Untitled"}</h1>
    <div>${body}</div>
    <div class="ftr"><span>Prepared by: <strong>${profile?.full_name||user?.email}</strong></span><span>CPALearn PH</span></div>
    </body></html>`);
    win.document.close();setTimeout(()=>win.print(),1200);
  };

  // ── MOCK EXAM ──
  const startExam=async(sub)=>{
    setExamSub(sub);
    const{data}=await supabase.from("questions").select("*").eq("subject_id",SUBJECT_ID[sub]).eq("is_approved",true).limit(60);
    if(!data||data.length===0){showToast(`No questions for ${sub} yet.`,"error");return;}
    setExamQs([...data].sort(()=>Math.random()-0.5));
    setExamAnswers({});setExamStarted(true);setExamDone(false);setExamWrong([]);
  };

  const submitExam=async()=>{
    let correct=0;const wrong=[];
    examQs.forEach((q,i)=>{if(String(examAnswers[i])===String(q.correct_answer))correct++;else wrong.push(q);});
    setExamScore(correct);setExamWrong(wrong);
    await supabase.from("exam_attempts").insert({user_id:user.id,answers:examAnswers,score:(correct/examQs.length)*100,total_questions:examQs.length,completed_at:new Date().toISOString()});
    const{data:existing}=await supabase.from("mistake_notebook").select("question_text").eq("user_id",user.id);
    const existingSet=new Set((existing||[]).map(m=>m.question_text));
    for(const q of wrong){if(!existingSet.has(q.question_text))await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:q.subject_id,question_text:q.question_text,correct_answer:(q.options||[])[Number(q.correct_answer)],personal_note:"From Mock Exam"});}
    for(const q of examQs.filter((_,i)=>String(examAnswers[i])===String(_.correct_answer)))await supabase.from("mistake_notebook").delete().eq("user_id",user.id).eq("question_text",q.question_text);
    setExamDone(true);setExamStarted(false);
  };

  // ── PLANNER ──
  const generatePlan=()=>{
    if(!planSetup.targetDate){showToast("Set a target exam date","error");return;}
    const today=new Date();const target=new Date(planSetup.targetDate);
    const daysLeft=Math.floor((target-today)/(1000*60*60*24));
    if(daysLeft<=0){showToast("Target date must be in the future","error");return;}
    const studyDays=DAYS.filter(d=>!planSetup.breakDays.includes(d));
    const totalStudyDays=Math.floor(daysLeft*(studyDays.length/7));
    const weights=planSetup.priorities.map((_,i)=>planSetup.priorities.length-i);
    const totalW=weights.reduce((a,b)=>a+b,0);
    const daysPerSub=planSetup.priorities.map((sub,i)=>({subject:sub,days:Math.max(1,Math.floor((weights[i]/totalW)*totalStudyDays))}));
    const plan=[];let cur=new Date(today);let sIdx=0;let dCount=0;
    while(cur<=target&&sIdx<planSetup.priorities.length){
      const dayName=DAYS[cur.getDay()];
      if(!planSetup.breakDays.includes(dayName)){
        const sub=planSetup.priorities[sIdx];
        const alloc=daysPerSub.find(d=>d.subject===sub);
        const customDay=customBlocks.filter(b=>b.day===dayName);
        const blocks=[{time:`8:00 AM – ${8+planSetup.hoursPerDay}:00 ${8+planSetup.hoursPerDay<12?"AM":"PM"}`,activity:`📚 Study – ${sub}`,notes:TOPICS[sub]?.[Math.floor(Math.random()*TOPICS[sub].length)]||""},
          {time:`${8+planSetup.hoursPerDay}:00 – ${9+planSetup.hoursPerDay}:00`,activity:"☕ Break",notes:"Rest & recharge"},
          {time:`${9+planSetup.hoursPerDay}:00 – ${10+planSetup.hoursPerDay}:00`,activity:`❓ Practice MCQs – ${sub}`,notes:"Question Bank"},
          ...customDay.map(c=>({time:`${c.startTime}–${c.endTime}`,activity:c.activity,notes:c.notes||""}))];
        plan.push({date:new Date(cur),day:dayName,subject:sub,blocks});
        dCount++;if(alloc&&dCount>=alloc.days){sIdx++;dCount=0;}
      } else {
        plan.push({date:new Date(cur),day:dayName,subject:"Rest",blocks:[{time:"All Day",activity:"🛋 Rest",notes:"Recharge!"}]});
      }
      cur.setDate(cur.getDate()+1);
    }
    setGeneratedPlan({plan,daysLeft,totalStudyDays,daysPerSub});setShowPlanSetup(false);
  };

  const printPlan=()=>{
    if(!generatedPlan)return;
    const win=window.open("","_blank");
    const rows=generatedPlan.plan.slice(0,30).map(day=>`<tr style="background:${day.subject==="Rest"?"#f9f9f9":"white"}"><td style="font-weight:700;white-space:nowrap;">${fmtShort(day.date)}<br/><small style="color:#888;">${day.day}</small></td><td style="color:${day.subject==="Rest"?"#888":"#D46FAC"};font-weight:600;">${day.subject}</td><td>${day.blocks.map(b=>`<div style="margin-bottom:6px;font-size:12px;"><strong>${b.time}</strong> ${b.activity}${b.notes?`<br/><span style="color:#888;font-size:11px;">${b.notes}</span>`:""}</div>`).join("")}</td></tr>`).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>CPALearn PH Study Plan</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>body{font-family:'Montserrat','Segoe UI',Arial,sans-serif;padding:32px;}table{width:100%;border-collapse:collapse;font-size:12px;}td{border:1px solid #ddd;padding:8px;vertical-align:top;}</style>
    </head><body>
    <div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #D46FAC;">
    <img src="${LOGO_URL}" style="height:40px;margin-bottom:6px;"/><br/>
    <strong style="font-size:18px;color:#D46FAC;">CPALearn PH — Study Plan</strong><br/>
    <span style="font-size:13px;color:#888;">${profile?.full_name||""} · ${planSetup.examType} · Target: ${new Date(planSetup.targetDate).toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</span><br/>
    <span style="font-size:12px;color:#888;">${generatedPlan.daysLeft} days remaining · ${generatedPlan.totalStudyDays} study days · ${planSetup.hoursPerDay}h/day</span></div>
    <table><tr style="background:#D46FAC;color:white;"><th>Date</th><th>Subject</th><th>Schedule</th></tr>${rows}</table>
    <div style="margin-top:16px;font-size:11px;color:#888;text-align:center;">Generated by CPALearn PH · ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</div>
    </body></html>`);
    win.document.close();setTimeout(()=>win.print(),1000);
  };

  // ── SHARED COMPONENTS ──
  const ToastEl=()=>toast?<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#c62828":t.accent,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:9999,fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>{toast.msg}</div>:null;

  const Sidebar=()=>(
    <div style={{width:210,background:t.sidebar,borderRight:`1px solid ${t.sidebarBorder}`,display:"flex",flexDirection:"column",padding:"16px 0",position:"fixed",top:0,bottom:0,left:0,zIndex:50,overflowY:"auto"}}>
      <div style={{padding:"8px 16px 14px",borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8,textAlign:"center",background:t.card}}>
        <img src={LOGO_URL} style={{height:52,width:"auto",maxWidth:"100%"}} alt="CPALearn PH"/>
      </div>
      {navItems.map(n=>(
        <button key={n.id} onClick={()=>go(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",background:page===n.id?t.navActive:"transparent",color:page===n.id?t.navActiveText:t.textMuted,border:"none",cursor:"pointer",textAlign:"left",fontSize:12,fontWeight:page===n.id?700:500,borderLeft:page===n.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
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
  );

  const NoteToolbar=()=>(
    <div style={{background:t.surface,padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,marginBottom:8,display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
      {[["B","bold"],["I","italic"],["U","underline"],["S","strikeThrough"]].map(([l,c])=>(
        <button key={c} onMouseDown={e=>{e.preventDefault();execCmd(c);}} style={{...btn(false),padding:"3px 10px",fontSize:12,fontWeight:l==="B"?700:400,fontStyle:l==="I"?"italic":"normal",textDecoration:l==="U"?"underline":l==="S"?"line-through":"none",minWidth:30}}>{l}</button>
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
      <span style={{fontSize:10,color:t.textMuted,fontWeight:600}}>A</span>
      {["#3D1F35","#D46FAC","#c62828","#2A7D5A","#1A5FAD","#A85D00","#000"].map(c=>(
        <div key={c} onMouseDown={e=>{e.preventDefault();execCmd("foreColor",c);}} style={{width:16,height:16,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${t.border}`,flexShrink:0}}/>
      ))}
      <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
      <span style={{fontSize:10,color:t.textMuted,fontWeight:600}}>🖊</span>
      {HIGHLIGHTERS.map(h=>(
        <div key={h.c} onMouseDown={e=>{e.preventDefault();execCmd("hiliteColor",h.c);}} title={h.l} style={{width:16,height:16,borderRadius:3,background:h.c,cursor:"pointer",border:`1.5px solid ${t.border}`,flexShrink:0}}/>
      ))}
      <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
      {[["H1","formatBlock","h2"],["H2","formatBlock","h3"],["•","insertUnorderedList",null],["1.","insertOrderedList",null]].map(([l,c,v])=>(
        <button key={l} onMouseDown={e=>{e.preventDefault();execCmd(c,v);}} style={{...btn(false),padding:"3px 8px",fontSize:11,minWidth:28}}>{l}</button>
      ))}
      <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
      <button onMouseDown={e=>{e.preventDefault();insertTable();}} style={{...btn(false),padding:"3px 8px",fontSize:11}}>⊞Tbl</button>
      <button onMouseDown={e=>{e.preventDefault();tableOp("addCol");}} style={{...btn(false),padding:"3px 6px",fontSize:11}}>+Col</button>
      <button onMouseDown={e=>{e.preventDefault();tableOp("delCol");}} style={{...btn(false),padding:"3px 6px",fontSize:11}}>-Col</button>
      <button onMouseDown={e=>{e.preventDefault();tableOp("addRow");}} style={{...btn(false),padding:"3px 6px",fontSize:11}}>+Row</button>
      <button onMouseDown={e=>{e.preventDefault();tableOp("delRow");}} style={{...btn(false),padding:"3px 6px",fontSize:11}}>-Row</button>
      <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
      <button onMouseDown={e=>{e.preventDefault();insert2Col();}} style={{...btn(false),padding:"3px 8px",fontSize:11}}>⬜⬜2Col</button>
      <button onMouseDown={e=>{e.preventDefault();insert3Col();}} style={{...btn(false),padding:"3px 8px",fontSize:11}}>⬜⬜⬜3Col</button>
      <button onMouseDown={e=>{e.preventDefault();execCmd("insertHTML","<hr/><p><br/></p>");}} style={{...btn(false),padding:"3px 8px",fontSize:11}}>—Line</button>
      <div style={{width:1,background:t.border,margin:"0 3px",height:20}}/>
      <label onMouseDown={e=>e.stopPropagation()} style={{...btn(false),padding:"3px 8px",fontSize:11,cursor:"pointer",display:"inline-flex",alignItems:"center"}}>
        🖼Img
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>execCmd("insertHTML",`<img src="${ev.target.result}" style="max-width:100%;border-radius:6px;margin:8px 0;"/><p><br/></p>`);r.readAsDataURL(f);e.target.value="";}} style={{display:"none"}}/>
      </label>
      <button onMouseDown={e=>{e.preventDefault();deleteEl();}} style={{...btn(false,true),padding:"3px 8px",fontSize:11}}>🗑Del</button>
      <button onMouseDown={e=>{e.preventDefault();execCmd("removeFormat");}} style={{...btn(false),padding:"3px 8px",fontSize:11}}>✕Clr</button>
    </div>
  );

  // ── LANDING ──
  if(!user) return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",color:t.text}}>
      <style>{FONT_STYLE}</style>
      <ToastEl/>
      {page==="login"?(
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:420,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"44px 40px"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <img src={LOGO_URL} style={{height:52,marginBottom:8}} alt="CPALearn PH"/>
              <h2 style={{color:t.accent,margin:"8px 0 4px"}}>{showRegister?"Create Account":"Welcome Back"}</h2>
              <p className="serif" style={{color:t.textMuted,fontSize:14,fontStyle:"italic"}}>{showRegister?"Join the CPALE community":"Continue your review journey"}</p>
            </div>
            {(showRegister
              ?[["Full Name *","text",regForm.name,(v)=>setRegForm({...regForm,name:v}),"e.g. Juls Domingo"],["Email *","email",regForm.email,(v)=>setRegForm({...regForm,email:v}),"your@email.com"],["Password *","password",regForm.pass,(v)=>setRegForm({...regForm,pass:v}),"min. 6 characters"],["School","text",regForm.school,(v)=>setRegForm({...regForm,school:v}),"e.g. UST, DLSU"]]
              :[["Email","email",loginForm.email,(v)=>setLoginForm({...loginForm,email:v}),"your@email.com"],["Password","password",loginForm.pass,(v)=>setLoginForm({...loginForm,pass:v}),"••••••••"]]
            ).map(([label,type,val,setter,ph])=>(
              <div key={label} style={{marginBottom:14}}>
                <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{label}</label>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(showRegister?handleRegister():handleLogin())} placeholder={ph} style={inp}/>
              </div>
            ))}
            {loginError&&<div style={{color:"#c62828",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
            <button onClick={showRegister?handleRegister:handleLogin} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,marginTop:4,borderRadius:10}}>{showRegister?"Create Account":"Log In"}</button>
            <div style={{textAlign:"center",marginTop:14,fontSize:13,color:t.textMuted}}>
              {showRegister?"Already have an account? ":"Don't have an account? "}
              <span onClick={()=>{setShowRegister(!showRegister);setLoginError("");}} style={{color:t.accent,cursor:"pointer",fontWeight:700}}>{showRegister?"Log In":"Register"}</span>
            </div>
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
            <p className="serif" style={{fontSize:20,color:t.textMuted,maxWidth:560,margin:"0 auto 36px",lineHeight:1.7,fontStyle:"italic"}}>Study smarter with 7 subjects, collaborative notes, question banks, mock exams, and progress tracking.</p>
            <button onClick={()=>{setShowRegister(true);setPage("login");}} style={{...btn(true),padding:"16px 40px",fontSize:16,borderRadius:12}}>Start Studying →</button>
            <p style={{fontSize:11,color:t.textMuted,marginTop:14,letterSpacing:"1px",textTransform:"uppercase"}}>One-time access fee · No subscriptions · No recurring charges</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:1000,margin:"0 auto 60px",padding:"0 40px"}}>
            {[["📚","Subjects","FREE — Upload & browse"],["📖","Notes","FREE — Rich text + print"],["📅","Planner","FREE — Study schedule"],["❓","Questions","PAID — 60-item MCQs"],["🃏","Flashcards","PAID — Spaced repetition"],["📝","Mock Exams","PAID — Auto-graded"],["💬","Discussions","PAID — Community Q&A"],["📊","Progress","PAID — Analytics"]].map(([icon,title,desc])=>(
              <div key={title} style={{...card,textAlign:"center",padding:"22px 14px"}}>
                <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
                <div style={{fontWeight:700,marginBottom:4,color:t.text,fontSize:13}}>{title}</div>
                <div style={{fontSize:11,color:t.textMuted}}>{desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ── PAYMENT ──
  if(page==="payment") return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"Montserrat,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT_STYLE}</style>
      <ToastEl/>
      <div style={{width:"100%",maxWidth:480,background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"40px 36px"}}>
        {payStep===3?(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <h2 style={{color:t.accent,marginBottom:12}}>Payment Submitted!</h2>
            <p className="serif" style={{color:t.textMuted,lineHeight:1.8,fontStyle:"italic",marginBottom:20}}>Your payment is under review. You'll get full access within 24 hours.</p>
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
            <div style={{background:"#E8F5E9",borderRadius:10,padding:"12px 16px",marginBottom:18,fontSize:13,color:"#2E7D32",fontWeight:500}}>✅ You've sent ₱99 via MariBank InstaPay</div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase"}}>InstaPay Reference Number *</label>
              <input value={payForm.ref} onChange={e=>setPayForm({...payForm,ref:e.target.value})} placeholder="e.g. 20240608123456789" style={inp}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:5,fontWeight:600,textTransform:"uppercase"}}>Screenshot (optional)</label>
              <label style={{display:"block",border:`2px dashed ${t.border}`,borderRadius:8,padding:"18px",textAlign:"center",cursor:"pointer",background:t.surface}}>
                <div style={{fontSize:28,marginBottom:4}}>{payForm.screenshotName?"✅":"📎"}</div>
                <div style={{fontSize:13,color:payForm.screenshotName?t.accent:t.textMuted}}>{payForm.screenshotName||"Click to upload screenshot"}</div>
                <input type="file" accept="image/*" onChange={e=>{if(e.target.files[0])setPayForm({...payForm,screenshotName:e.target.files[0].name});}} style={{display:"none"}}/>
              </label>
            </div>
            <button onClick={handlePaySubmit} disabled={submittingPay||!payForm.ref} style={{...btn(true),width:"100%",padding:"12px",fontSize:14,opacity:!payForm.ref?0.5:1,borderRadius:10}}>{submittingPay?"Submitting...":"Submit for Verification"}</button>
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
              <div style={{width:190,height:190,borderRadius:10,margin:"0 auto",overflow:"hidden",position:"relative"}}>
                <img src={MARIBANK_QR} alt="MariBank QR" style={{width:"100%",position:"absolute",top:0,left:0,objectFit:"cover",objectPosition:"top"}}/>
              </div>
              <p style={{fontSize:12,color:t.textMuted,marginTop:10,lineHeight:1.6}}>Open any banking app → Scan QR → Send <strong>₱99</strong><br/>InstaPay transfers are <strong>FREE</strong> from any bank</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:18}}>
              {["❓ Question Bank","🃏 Flashcards","📝 Mock Exams","💬 Discussions","👥 Study Groups","📊 Progress","🏆 Leaderboard","📖 Public Notes"].map(f=>(
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
      <ToastEl/>
      <Sidebar/>
      <div style={{marginLeft:210,flex:1,padding:"24px 28px",overflowX:"hidden"}}>

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <h1 style={{fontSize:24,marginBottom:4,color:t.text}}>Good day, {profile?.full_name?.split(" ")[0]||"Reviewee"}! 👋</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:15,fontStyle:"italic"}}>Ready to ace the board exam?</p>
            {!isPaid&&!isAdmin&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,background:t.accentLight,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,color:t.accentText,fontSize:14,marginBottom:2}}>🔓 Unlock Full Access — ₱99 one-time</div><div style={{fontSize:12,color:t.accentText}}>Question Bank · Flashcards · 60-item Mock Exams · Discussions · Progress</div></div>
                <button onClick={()=>{setPage("payment");setPayStep(1);}} style={{...btn(true),whiteSpace:"nowrap",marginLeft:16}}>Pay ₱99 →</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:20}}>
              {navItems.filter(n=>!["dashboard","profile","admin"].includes(n.id)).map(n=>(
                <div key={n.id} onClick={()=>go(n.id)} style={{...card,textAlign:"center",padding:"18px 10px",cursor:"pointer",opacity:(!n.free&&!isPaid)?0.65:1,position:"relative"}}>
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
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>📚 Subject Library</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Browse, upload, and download study materials</p>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {SUBJECTS.map((s,i)=>(
                <button key={s} onClick={()=>{setActiveSub(s);setActiveTopic(null);}} style={{background:activeSub===s?t.subjectColors[i]:t.badge,color:activeSub===s?t.subjectText[i]:t.badgeText,border:`1px solid ${t.border}`,borderRadius:20,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:activeSub===s?700:500}}>{s}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"185px 1fr",gap:16}}>
              <div>
                <div style={{fontWeight:700,fontSize:11,color:t.textMuted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Topics</div>
                <div onClick={()=>setActiveTopic(null)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:!activeTopic?t.accentLight:t.highlight,fontSize:12,color:!activeTopic?t.accentText:t.text,cursor:"pointer",fontWeight:!activeTopic?700:500}}>All Topics</div>
                {(TOPICS[activeSub]||[]).map(topic=>(
                  <div key={topic} onClick={()=>setActiveTopic(activeTopic===topic?null:topic)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:activeTopic===topic?t.accentLight:t.highlight,fontSize:12,color:activeTopic===topic?t.accentText:t.text,cursor:"pointer",fontWeight:activeTopic===topic?700:500}}>{topic}</div>
                ))}
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:15,color:t.text}}>{activeSub}{activeTopic?` — ${activeTopic}`:""}</div>
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
                    <div style={{fontSize:12,color:t.textMuted}}>Upload the first file for {activeSub}!</div>
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
                      {(isAdmin||mat.uploaded_by===user?.id)&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("materials").delete().eq("id",mat.id);showToast("Deleted.");fetchMaterials();}} style={{...btn(false,true),fontSize:11,padding:"5px 10px"}}>🗑</button>}
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
            {noteMode==="list"?(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div><h1 style={{fontSize:22,marginBottom:4,color:t.text}}>📖 Notes Vault</h1><p className="serif" style={{color:t.textMuted,fontSize:14,fontStyle:"italic"}}>Written notes, uploaded files, and video lectures</p></div>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:20,alignItems:"center"}}>
                  {[["written","✏️ Written"],["files","📁 Files"],["videos","🎥 Videos"]].map(([tab,label])=>(
                    <button key={tab} onClick={()=>setNoteTab(tab)} style={{...btn(noteTab===tab),fontSize:12,padding:"7px 16px"}}>{label}</button>
                  ))}
                  {noteTab==="written"&&<button onClick={()=>{setActiveNote(null);setNoteForm({title:"",subject:"FAR",topic:"",body:"",is_shared:false});setNoteMode("edit");}} style={{...btn(false),marginLeft:"auto",fontSize:12}}>+ New Note</button>}
                  {noteTab==="files"&&(
                    <label style={{...btn(false),marginLeft:"auto",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                      + Upload File
                      <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={async e=>{
                        const subject=prompt("Subject?","FAR")||"FAR";
                        const shared=window.confirm("Share publicly?");
                        const allowDl=shared?window.confirm("Allow download?"):false;
                        const files=e.target.files;if(!files?.length)return;
                        for(const file of files){
                          const path=`notes/${user.id}/${Date.now()}_${file.name}`;
                          const{error:upErr}=await supabase.storage.from("materials").upload(path,file,{cacheControl:"3600",upsert:false});
                          if(upErr){showToast(`Failed: ${file.name}`,"error");continue;}
                          const{data:urlData}=supabase.storage.from("materials").getPublicUrl(path);
                          await supabase.from("materials").insert({subject_id:SUBJECT_ID[subject]||1,uploaded_by:user.id,title:file.name.replace(/\.[^/.]+$/,""),file_url:urlData.publicUrl,file_type:file.name.split(".").pop(),file_size_kb:Math.round(file.size/1024),visibility:shared?"shared":"private",is_approved:isAdmin,tags:allowDl?["allow_download"]:[]});
                          showToast(`✅ ${file.name} uploaded!`);
                        }
                        fetchNoteFiles();e.target.value="";
                      }} style={{display:"none"}}/>
                    </label>
                  )}
                  {noteTab==="videos"&&isPaid&&<button onClick={()=>setShowAddVideo(!showAddVideo)} style={{...btn(false),marginLeft:"auto",fontSize:12}}>+ Add Video</button>}
                </div>

                {noteTab==="written"&&(
                  notes.length===0?(
                    <div style={{textAlign:"center",padding:"60px",background:t.highlight,borderRadius:12}}>
                      <div style={{fontSize:48,marginBottom:12}}>📖</div>
                      <div style={{fontWeight:700,color:t.text,marginBottom:8}}>No notes yet</div>
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
                          <div style={{fontSize:11,color:t.textMuted,overflow:"hidden",maxHeight:36}} dangerouslySetInnerHTML={{__html:(n.body||"").replace(/<[^>]*>/g," ").slice(0,80)+"..."}}/>
                          <div style={{fontSize:10,color:t.textMuted,marginTop:8}}>{fmtDate(n.updated_at||n.created_at)}</div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {noteTab==="files"&&(
                  noteFiles.length===0?(
                    <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                      <div style={{fontSize:40,marginBottom:12}}>📁</div>
                      <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No files yet</div>
                      <div style={{fontSize:13,color:t.textMuted}}>Upload PDFs, Word docs, PowerPoints, images</div>
                    </div>
                  ):noteFiles.map(f=>(
                    <div key={f.id} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                      <span style={{fontSize:24,flexShrink:0}}>{getIcon(f.title+"."+f.file_type)}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:13,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.title}</div>
                        <div style={{fontSize:11,color:t.textMuted,marginTop:2,display:"flex",gap:8}}>
                          <span>{f.file_type?.toUpperCase()} · {fmtSize(f.file_size_kb*1024)}</span>
                          <span>{ID_SUBJECT[f.subject_id]||"—"}</span>
                          {f.visibility==="shared"&&<span style={{color:"#4CAF50",fontWeight:600}}>PUBLIC</span>}
                          {f.tags?.includes("allow_download")&&<span style={{color:"#1A5FAD",fontWeight:600}}>↓ Download OK</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button onClick={()=>window.open(f.file_url,"_blank")} style={{...btn(true),fontSize:11,padding:"5px 12px"}}>👁 View</button>
                        {(f.tags?.includes("allow_download")||isAdmin||f.uploaded_by===user.id)&&(
                          <a href={f.file_url} download target="_blank" rel="noreferrer" style={{...btn(false),fontSize:11,padding:"5px 12px",textDecoration:"none",display:"inline-flex",alignItems:"center"}}>⬇</a>
                        )}
                        {(isAdmin||f.uploaded_by===user.id)&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("materials").delete().eq("id",f.id);fetchNoteFiles();}} style={{...btn(false,true),fontSize:11,padding:"5px 10px"}}>🗑</button>}
                      </div>
                    </div>
                  ))
                )}

                {noteTab==="videos"&&(
                  <div>
                    {showAddVideo&&(
                      <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                        <div style={{fontWeight:700,marginBottom:12}}>Add YouTube Lecture</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                          <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Title</label><input value={newVideo.title} onChange={e=>setNewVideo({...newVideo,title:e.target.value})} placeholder="e.g. FAR Leases Full Lecture" style={inp}/></div>
                          <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newVideo.subject} onChange={e=>setNewVideo({...newVideo,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                          <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Topic</label><input value={newVideo.topic} onChange={e=>setNewVideo({...newVideo,topic:e.target.value})} placeholder="e.g. Leases" style={inp}/></div>
                          <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>YouTube URL</label><input value={newVideo.url} onChange={e=>setNewVideo({...newVideo,url:e.target.value})} placeholder="https://youtube.com/watch?v=..." style={inp}/></div>
                        </div>
                        <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Description</label><textarea value={newVideo.description} onChange={e=>setNewVideo({...newVideo,description:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                        {newVideo.url&&getYtId(newVideo.url)&&<img src={`https://img.youtube.com/vi/${getYtId(newVideo.url)}/mqdefault.jpg`} style={{width:160,borderRadius:6,marginBottom:10}} alt="thumbnail"/>}
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={async()=>{
                            if(!newVideo.title||!newVideo.url){showToast("Enter title and URL","error");return;}
                            const ytId=getYtId(newVideo.url);if(!ytId){showToast("Invalid YouTube URL","error");return;}
                            await supabase.from("materials").insert({subject_id:SUBJECT_ID[newVideo.subject]||1,uploaded_by:user.id,title:newVideo.title,description:newVideo.description,file_url:newVideo.url,file_type:"youtube",visibility:"shared",is_approved:isAdmin,tags:[newVideo.topic]});
                            showToast("Video added! ✅");setShowAddVideo(false);setNewVideo({title:"",url:"",subject:"FAR",topic:"",description:""});fetchVideos();
                          }} style={btn(true)}>Add Video</button>
                          <button onClick={()=>setShowAddVideo(false)} style={btn(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                    {videos.length===0&&!showAddVideo?(
                      <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12}}>
                        <div style={{fontSize:40,marginBottom:12}}>🎥</div>
                        <div style={{fontWeight:700,color:t.text,marginBottom:4}}>No videos yet</div>
                        {isPaid&&<button onClick={()=>setShowAddVideo(true)} style={{...btn(true),marginTop:8}}>+ Add First Video</button>}
                      </div>
                    ):(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                        {videos.map(v=>{
                          const ytId=getYtId(v.file_url);
                          return(
                            <div key={v.id} style={{...card,padding:"14px"}}>
                              {ytId?(
                                <div style={{position:"relative",paddingBottom:"56.25%",height:0,marginBottom:10,borderRadius:8,overflow:"hidden"}}>
                                  <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allowFullScreen title={v.title}/>
                                </div>
                              ):(
                                <div style={{background:t.border,height:120,borderRadius:8,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>▶️</div>
                              )}
                              <div style={{fontWeight:700,fontSize:13,color:t.text,marginBottom:4}}>{v.title}</div>
                              <div style={{fontSize:11,color:t.textMuted,marginBottom:6}}>{ID_SUBJECT[v.subject_id]||"—"}{v.tags?.[0]?` · ${v.tags[0]}`:""}</div>
                              {v.description&&<p style={{fontSize:12,color:t.textMuted,lineHeight:1.5,marginBottom:8}}>{v.description}</p>}
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={()=>window.open(v.file_url,"_blank")} style={{...btn(true),fontSize:11,padding:"5px 12px",flex:1}}>▶ Watch on YouTube</button>
                                {(isAdmin||v.uploaded_by===user?.id)&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("materials").delete().eq("id",v.id);fetchVideos();}} style={{...btn(false,true),fontSize:11,padding:"5px 10px"}}>🗑</button>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            ):(
              <div>
                <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                  <button onClick={()=>setNoteMode("list")} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>← Back</button>
                  {noteMode==="view"&&activeNote?.user_id===user.id&&<button onClick={()=>setNoteMode("edit")} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>✏️ Edit</button>}
                  {noteMode==="edit"&&<button onClick={saveNote} style={{...btn(true),fontSize:12,padding:"5px 14px"}}>💾 Save</button>}
                  <button onClick={printNote} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>🖨 Print</button>
                  {activeNote?.user_id===user.id&&<button onClick={async()=>{if(window.confirm("Delete?"))await supabase.from("user_notes").delete().eq("id",activeNote.id);setNoteMode("list");fetchNotes();}} style={{...btn(false,true),fontSize:12,padding:"5px 12px",marginLeft:"auto"}}>🗑 Delete</button>}
                </div>
                {noteMode==="edit"&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:12,alignItems:"end"}}>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Title</label><input value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})} placeholder="Note title..." style={inp}/></div>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={noteForm.subject} onChange={e=>setNoteForm({...noteForm,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Topic</label><input value={noteForm.topic} onChange={e=>setNoteForm({...noteForm,topic:e.target.value})} placeholder="e.g. Leases" style={inp}/></div>
                    {isPaid&&<label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:t.textMuted,cursor:"pointer",whiteSpace:"nowrap",paddingBottom:4}}><input type="checkbox" checked={noteForm.is_shared} onChange={e=>setNoteForm({...noteForm,is_shared:e.target.checked})}/>Public</label>}
                  </div>
                )}
                {noteMode==="view"&&(
                  <div style={{marginBottom:12}}>
                    <h2 style={{fontSize:20,color:t.text,marginBottom:4}}>{activeNote?.title}</h2>
                    <div style={{fontSize:12,color:t.textMuted}}>{ID_SUBJECT[activeNote?.subject_id]||"General"} · {fmtDate(activeNote?.updated_at||activeNote?.created_at)}</div>
                  </div>
                )}
                {noteMode==="edit"&&<NoteToolbar/>}
                <div style={{background:"white",borderRadius:10,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                  <div style={{padding:"10px 16px",background:t.highlight,borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMuted,display:"flex",gap:16}}>
                    <span><strong>CPALearn PH</strong> · {noteForm.subject}{noteForm.topic?` · ${noteForm.topic}`:""}</span>
                    <span style={{marginLeft:"auto"}}>{new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}</span>
                  </div>
                  {noteMode==="edit"?(
                    <div ref={editorRef} contentEditable suppressContentEditableWarning className="note-editor" style={{padding:"20px",minHeight:400,color:t.text}} dangerouslySetInnerHTML={{__html:noteForm.body}} onInput={()=>{}}/>
                  ):(
                    <div className="note-editor" style={{padding:"20px",minHeight:200,color:t.text}} dangerouslySetInnerHTML={{__html:activeNote?.body||"<p style='color:#999;font-style:italic;'>Empty note.</p>"}}/>
                  )}
                  <div style={{padding:"10px 16px",borderTop:`1px solid ${t.border}`,fontSize:11,color:t.textMuted,background:t.highlight}}>
                    Prepared by: <strong>{profile?.full_name||user?.email}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLANNER */}
        {page==="planner"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>📅 Study Planner</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Personalized study schedule — free for all users</p>
            {showPlanSetup?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:14,fontSize:15,color:t.text}}>🎯 Exam Setup</div>
                  {[["Exam Type",<select value={planSetup.examType} onChange={e=>setPlanSetup({...planSetup,examType:e.target.value})} style={inp}>{EXAM_TYPES.map(et=><option key={et}>{et}</option>)}</select>],
                    ["Target Exam Date",<input type="date" value={planSetup.targetDate} onChange={e=>setPlanSetup({...planSetup,targetDate:e.target.value})} style={inp}/>],
                    ["Study Hours Per Day",<select value={planSetup.hoursPerDay} onChange={e=>setPlanSetup({...planSetup,hoursPerDay:Number(e.target.value)})} style={inp}>{[1,2,3,4,5,6,7,8].map(h=><option key={h} value={h}>{h}h</option>)}</select>]
                  ].map(([label,el])=>(
                    <div key={label} style={{marginBottom:12}}><label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>{label}</label>{el}</div>
                  ))}
                  <div>
                    <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Rest Days</label>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {DAYS.map(d=>(
                        <label key={d} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer",background:planSetup.breakDays.includes(d)?t.accentLight:t.surface,padding:"4px 10px",borderRadius:6,border:`1px solid ${planSetup.breakDays.includes(d)?t.accent:t.border}`}}>
                          <input type="checkbox" checked={planSetup.breakDays.includes(d)} onChange={e=>setPlanSetup({...planSetup,breakDays:e.target.checked?[...planSetup.breakDays,d]:planSetup.breakDays.filter(x=>x!==d)})}/>
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:15,color:t.text}}>📊 Subject Priority</div>
                  <p style={{fontSize:12,color:t.textMuted,marginBottom:12}}>Top = most study time allocated</p>
                  {planSetup.priorities.map((sub,i)=>(
                    <div key={sub} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",background:t.highlight,borderRadius:8,marginBottom:6,border:`1px solid ${t.border}`}}>
                      <span style={{fontSize:12,color:t.textMuted,fontWeight:700,width:20}}>{i+1}.</span>
                      <span style={{flex:1,fontSize:13,fontWeight:500,color:t.text}}>{sub}</span>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>{if(i===0)return;const p=[...planSetup.priorities];[p[i-1],p[i]]=[p[i],p[i-1]];setPlanSetup({...planSetup,priorities:p});}} disabled={i===0} style={{...btn(false),padding:"2px 8px",fontSize:11,opacity:i===0?0.3:1}}>↑</button>
                        <button onClick={()=>{if(i===planSetup.priorities.length-1)return;const p=[...planSetup.priorities];[p[i+1],p[i]]=[p[i],p[i+1]];setPlanSetup({...planSetup,priorities:p});}} disabled={i===planSetup.priorities.length-1} style={{...btn(false),padding:"2px 8px",fontSize:11,opacity:i===planSetup.priorities.length-1?0.3:1}}>↓</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:15,color:t.text}}>➕ Custom Time Blocks</div>
                  <button onClick={()=>setShowAddBlock(!showAddBlock)} style={{...btn(true),marginBottom:12,fontSize:12}}>+ Add Block</button>
                  {showAddBlock&&(
                    <div style={{background:t.highlight,borderRadius:8,padding:"12px",marginBottom:12}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Day</label><select value={newBlock.day} onChange={e=>setNewBlock({...newBlock,day:e.target.value})} style={inp}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Activity</label><select value={newBlock.activity} onChange={e=>setNewBlock({...newBlock,activity:e.target.value})} style={inp}>{ACTIVITIES.map(a=><option key={a}>{a}</option>)}</select></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Start</label><input type="time" value={newBlock.startTime} onChange={e=>setNewBlock({...newBlock,startTime:e.target.value})} style={inp}/></div>
                        <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>End</label><input type="time" value={newBlock.endTime} onChange={e=>setNewBlock({...newBlock,endTime:e.target.value})} style={inp}/></div>
                      </div>
                      <div style={{marginBottom:8}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Notes</label><input value={newBlock.notes} onChange={e=>setNewBlock({...newBlock,notes:e.target.value})} placeholder="e.g. Morning run" style={inp}/></div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>{setCustomBlocks([...customBlocks,{...newBlock}]);setShowAddBlock(false);showToast("Block added!");}} style={btn(true)}>Add</button>
                        <button onClick={()=>setShowAddBlock(false)} style={btn(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {customBlocks.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:t.surface,borderRadius:6,marginBottom:4,border:`1px solid ${t.border}`,fontSize:12}}>
                      <span style={{fontWeight:600,color:t.accent}}>{b.day}</span>
                      <span style={{color:t.textMuted}}>{b.startTime}–{b.endTime}</span>
                      <span style={{flex:1,color:t.text}}>{b.activity}</span>
                      <button onClick={()=>setCustomBlocks(customBlocks.filter((_,j)=>j!==i))} style={{...btn(false,true),fontSize:10,padding:"2px 6px"}}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{...card,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"40px"}}>
                  <div style={{fontSize:48,marginBottom:12}}>🚀</div>
                  <h3 style={{fontSize:16,marginBottom:8,color:t.text}}>Ready to generate?</h3>
                  <p style={{fontSize:13,color:t.textMuted,marginBottom:20,lineHeight:1.6}}>Your personalized study schedule will be generated based on your settings and priorities.</p>
                  <button onClick={generatePlan} style={{...btn(true),padding:"14px 32px",fontSize:15,borderRadius:12}}>Generate Study Plan 📅</button>
                </div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>setShowPlanSetup(true)} style={{...btn(false),fontSize:12}}>← Edit Setup</button>
                  <button onClick={printPlan} style={{...btn(true),fontSize:12}}>🖨 Print PDF</button>
                  <div style={{marginLeft:"auto",fontSize:13,color:t.textMuted}}><strong style={{color:t.accent}}>{generatedPlan?.daysLeft}</strong> days to {planSetup.examType} · <strong style={{color:t.accent}}>{generatedPlan?.totalStudyDays}</strong> study days</div>
                </div>
                <div style={{...card,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:14,color:t.text}}>📊 Subject Allocation</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {generatedPlan?.daysPerSub?.map((d,i)=>(
                      <div key={d.subject} style={{background:t.subjectColors[i%7],borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                        <div style={{fontWeight:700,color:t.subjectText[i%7],fontSize:13}}>{d.subject}</div>
                        <div style={{fontSize:11,color:t.subjectText[i%7],opacity:0.8}}>{d.days} days</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{...card,padding:0,overflow:"hidden"}}>
                  <div style={{padding:"14px 20px",background:t.highlight,borderBottom:`1px solid ${t.border}`,fontWeight:700,fontSize:14,color:t.text}}>📅 Your Study Schedule</div>
                  <div style={{maxHeight:500,overflowY:"auto"}}>
                    {generatedPlan?.plan?.slice(0,30).map((day,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"100px 120px 1fr",gap:0,borderBottom:`1px solid ${t.border}`,background:day.subject==="Rest"?t.surface:"white"}}>
                        <div style={{padding:"10px 14px",borderRight:`1px solid ${t.border}`}}>
                          <div style={{fontWeight:700,fontSize:13,color:t.text}}>{fmtShort(day.date)}</div>
                          <div style={{fontSize:11,color:t.textMuted}}>{day.day}</div>
                        </div>
                        <div style={{padding:"10px 14px",borderRight:`1px solid ${t.border}`,display:"flex",alignItems:"center"}}>
                          <span style={{fontWeight:700,fontSize:12,color:day.subject==="Rest"?t.textMuted:t.accent}}>{day.subject}</span>
                        </div>
                        <div style={{padding:"8px 14px"}}>
                          {day.blocks.map((b,j)=>(
                            <div key={j} style={{marginBottom:4,fontSize:12}}>
                              <span style={{color:t.textMuted,marginRight:6}}>{b.time}</span>
                              <span style={{fontWeight:500,color:t.text}}>{b.activity}</span>
                              {b.notes&&<span style={{color:t.textMuted,fontSize:11}}> — {b.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {generatedPlan?.plan?.length>30&&<div style={{padding:"10px 20px",background:t.highlight,fontSize:12,color:t.textMuted,textAlign:"center"}}>Showing first 30 days · Print for full schedule ({generatedPlan.plan.length} days)</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUESTION BANK */}
        {page==="qbank"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>❓ Question Bank</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Practice MCQs with detailed explanations</p>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              {["All",...SUBJECTS].map(f=>(
                <button key={f} onClick={()=>{setQFilter(f);setQIdx(0);setSelected(null);setShowAns(false);}} style={{...btn(qFilter===f),fontSize:11,padding:"5px 12px"}}>{f}</button>
              ))}
              {isAdmin&&<button onClick={()=>setShowAddQ(!showAddQ)} style={{...btn(true),marginLeft:"auto",fontSize:12}}>+ Add Question</button>}
            </div>
            {isAdmin&&showAddQ&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Add Question (Admin Only)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newQ.subject} onChange={e=>setNewQ({...newQ,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Difficulty</label><select value={newQ.difficulty} onChange={e=>setNewQ({...newQ,difficulty:e.target.value})} style={inp}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                </div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Question</label><textarea value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} placeholder="Enter question..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{fontWeight:600,fontSize:11,color:t.textMuted,marginBottom:6,textTransform:"uppercase"}}>Options — click radio to mark correct:</div>
                {newQ.options.map((opt,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                    <input type="radio" name="correct" checked={newQ.answer===i} onChange={()=>setNewQ({...newQ,answer:i})}/>
                    <span style={{fontSize:12,fontWeight:700,color:newQ.answer===i?t.accent:t.textMuted,width:20}}>{String.fromCharCode(65+i)}.</span>
                    <input value={opt} onChange={e=>{const o=[...newQ.options];o[i]=e.target.value;setNewQ({...newQ,options:o});}} placeholder={`Option ${String.fromCharCode(65+i)}`} style={{...inp,flex:1,borderColor:newQ.answer===i?t.accent:t.border}}/>
                  </div>
                ))}
                <div style={{marginTop:8,marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Explanation</label><textarea value={newQ.explanation} onChange={e=>setNewQ({...newQ,explanation:e.target.value})} placeholder="Explain the correct answer..." rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{
                    if(!newQ.question||newQ.options.some(o=>!o)){showToast("Fill in all fields","error");return;}
                    await supabase.from("questions").insert({subject_id:SUBJECT_ID[newQ.subject],created_by:user.id,question_text:newQ.question,question_type:"mcq",options:newQ.options,correct_answer:String(newQ.answer),explanation:newQ.explanation,difficulty:newQ.difficulty,is_approved:true});
                    showToast("Question added! ✅");setShowAddQ(false);setNewQ({subject:"FAR",question:"",options:["","","",""],answer:0,explanation:"",difficulty:"medium"});fetchQuestions();
                  }} style={btn(true)}>Save Question</button>
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
                    <div key={i} onClick={()=>!showAns&&setSelected(i)} style={{padding:"10px 14px",borderRadius:8,marginBottom:8,border:`1.5px solid ${selected===i?(showAns?i===Number(questions[qIdx]?.correct_answer)?"#4CAF50":"#c62828":t.accent):t.border}`,background:selected===i?(showAns?i===Number(questions[qIdx]?.correct_answer)?"#E8F5E9":"#FFEBEE":t.accentLight):t.surface,cursor:showAns?"default":"pointer",fontSize:13,color:t.text,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:24,height:24,borderRadius:"50%",border:`1.5px solid ${selected===i?t.accent:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,background:selected===i?t.accent:"transparent",color:selected===i?"#fff":t.textMuted}}>{String.fromCharCode(65+i)}</span>{opt}
                    </div>
                  ))}
                  {!showAns&&<button disabled={selected===null} onClick={()=>setShowAns(true)} style={{...btn(true),width:"100%",opacity:selected===null?0.5:1,marginTop:4}}>Check Answer</button>}
                  {showAns&&(
                    <div>
                      <div style={{background:t.highlight,border:`1px solid ${t.accentLight}`,borderRadius:8,padding:"14px",marginTop:8}}>
                        <div style={{fontWeight:700,color:t.accent,marginBottom:6,fontSize:13}}>💡 Explanation</div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.7,margin:0}}>{questions[qIdx]?.explanation||"No explanation provided."}</p>
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:10}}>
                        <button onClick={()=>{setQIdx((qIdx+1)%questions.length);setSelected(null);setShowAns(false);}} style={{...btn(true),flex:1}}>Next →</button>
                        <button onClick={async()=>{await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:questions[qIdx]?.subject_id,question_text:questions[qIdx]?.question_text,correct_answer:(questions[qIdx]?.options||[])[Number(questions[qIdx]?.correct_answer)]});showToast("Added to Mistakes ✅");}} style={{...btn(false),fontSize:12}}>❌ Mistakes</button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={card}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13,color:t.text}}>Session</div>
                    {[["Total",questions.length],["Current",`Q${qIdx+1}`],["Filter",qFilter]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:700,color:t.accent}}>{v}</span></div>
                    ))}
                    <button onClick={()=>{setQIdx(0);setSelected(null);setShowAns(false);}} style={{...btn(false),width:"100%",fontSize:11,marginTop:8}}>↺ Restart</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS */}
        {page==="flashcards"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>🃏 Flashcards</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Spaced repetition for formulas, definitions & standards</p>
            <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
              {isAdmin&&<button onClick={()=>setShowAddFC(!showAddFC)} style={btn(true)}>+ Add Flashcard</button>}
              <span style={{fontSize:12,color:t.textMuted}}>{flashcards.length} cards</span>
            </div>
            {isAdmin&&showAddFC&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Add Flashcard (Admin Only)</div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newFC.subject} onChange={e=>setNewFC({...newFC,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Front (Question/Term)</label><textarea value={newFC.front} onChange={e=>setNewFC({...newFC,front:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Back (Answer/Definition)</label><textarea value={newFC.back} onChange={e=>setNewFC({...newFC,back:e.target.value})} rows={3} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{
                    if(!newFC.front||!newFC.back){showToast("Fill both sides","error");return;}
                    await supabase.from("flashcards").insert({subject_id:SUBJECT_ID[newFC.subject],created_by:user.id,front_text:newFC.front,back_text:newFC.back,visibility:"shared"});
                    showToast("Flashcard added! ✅");setShowAddFC(false);setNewFC({subject:"FAR",front:"",back:""});fetchFlashcards();
                  }} style={btn(true)}>Save</button>
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
                    <span style={{fontSize:12,color:t.textMuted,padding:"8px 16px"}}>Card {fcIdx+1}/{flashcards.length}</span>
                    <button onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={btn(true)}>Next →</button>
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    {["😕 Hard","😐 Medium","😊 Easy"].map(r=><button key={r} onClick={()=>{setFcIdx((fcIdx+1)%flashcards.length);setFcFlipped(false);}} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{r}</button>)}
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontWeight:700,marginBottom:10,fontSize:13,color:t.text}}>All Cards</div>
                  <div style={{maxHeight:380,overflowY:"auto"}}>
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
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>📝 Mock Exam</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>60-item mock exam · Wrong answers auto-saved to Mistake Notebook</p>
            {!examStarted&&!examDone&&(
              <div>
                {isAdmin&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:6,fontSize:14,color:t.text}}>🛡️ Admin: Exams are auto-generated from Question Bank</div>
                    <p style={{fontSize:13,color:t.textMuted,marginBottom:10}}>Add questions to the Question Bank and they'll automatically appear in mock exams.</p>
                    <button onClick={()=>go("qbank")} style={{...btn(true),fontSize:12}}>+ Add Questions to Question Bank →</button>
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
                  <div><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{examSub} Mock Exam</span><span style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginLeft:12}}>{examQs.length} questions</span></div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{Object.keys(examAnswers).length}/{examQs.length} answered</span>
                    <button onClick={submitExam} style={{background:"white",color:t.accent,border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>Submit →</button>
                  </div>
                </div>
                {examQs.map((mq,qi)=>(
                  <div key={mq.id} style={{...card,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontWeight:700,color:t.text,fontSize:14,flex:1,marginRight:10}}>{qi+1}. {mq.question_text}</div>
                      {examAnswers[qi]!==undefined&&<span style={{fontSize:10,color:"#4CAF50",fontWeight:700,flexShrink:0}}>✓</span>}
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
                  <div style={{fontSize:56,marginBottom:12}}>{examScore/examQs.length>=0.75?"🎉":"📚"}</div>
                  <h2 style={{fontSize:24,color:t.text,marginBottom:4}}>{examScore/examQs.length>=0.75?"Passed!":"Keep Studying!"}</h2>
                  <p className="serif" style={{color:t.textMuted,fontStyle:"italic"}}>{examScore/examQs.length>=0.75?"Great job! You're on track.":"Review your mistakes and try again!"}</p>
                </div>
                <div style={card}>
                  {[["Subject",examSub],["Score",`${examScore} / ${examQs.length}`],["Percentage",`${((examScore/examQs.length)*100).toFixed(1)}%`],["Passing Mark","75%"],["Result",examScore/examQs.length>=0.75?"✅ PASSED":"❌ FAILED"],["Wrong Answers",`${examWrong.length} (saved to Mistake Notebook)`]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}>
                      <span style={{color:t.textMuted,fontWeight:600}}>{k}</span>
                      <span style={{fontWeight:700,color:k==="Result"?(examScore/examQs.length>=0.75?"#4CAF50":"#c62828"):t.accent}}>{v}</span>
                    </div>
                  ))}
                </div>
                {examWrong.length>0&&(
                  <div style={{...card,borderLeft:`3px solid #ef9a9a`}}>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13,color:t.text}}>❌ Wrong Answers — Saved to Mistake Notebook</div>
                    {examWrong.slice(0,3).map((q,i)=>(
                      <div key={i} style={{fontSize:12,color:t.textMuted,padding:"4px 0",borderBottom:`1px solid ${t.border}`}}>{i+1}. {q.question_text?.slice(0,80)}...</div>
                    ))}
                    {examWrong.length>3&&<div style={{fontSize:11,color:t.textMuted,marginTop:4}}>+{examWrong.length-3} more</div>}
                  </div>
                )}
                <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:16}}>
                  <button onClick={()=>setExamDone(false)} style={{...btn(true),padding:"12px 28px"}}>Take Another</button>
                  <button onClick={()=>go("mistakes")} style={{...btn(false),padding:"12px 28px"}}>Review Mistakes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISCUSSIONS */}
        {page==="discussions"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>💬 Discussions</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Ask questions, share insights, get verified answers</p>
            {!activeDisc?(
              <>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                  <button onClick={()=>setShowAddD(!showAddD)} style={btn(true)}>+ Ask Question</button>
                  <span style={{fontSize:12,color:t.textMuted}}>{discussions.length} discussions</span>
                </div>
                {showAddD&&(
                  <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Post a Question</div>
                    <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newD.subject} onChange={e=>setNewD({...newD,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                    <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Your Question</label><textarea value={newD.question} onChange={e=>setNewD({...newD,question:e.target.value})} placeholder="e.g. How do we compute goodwill under PFRS 3?" rows={3} style={{...inp,resize:"vertical"}}/></div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={async()=>{
                        if(!newD.question){showToast("Enter a question","error");return;}
                        await supabase.from("discussions").insert({subject_id:SUBJECT_ID[newD.subject],user_id:user.id,title:newD.question.slice(0,100),body:newD.question});
                        showToast("Posted! ✅");setShowAddD(false);setNewD({subject:"FAR",question:""});fetchDiscussions();
                      }} style={btn(true)}>Post</button>
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
                  <div key={d.id} style={{...card,cursor:"pointer"}} onClick={()=>setActiveDisc({...d,replies:[]})}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>Q</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,color:t.text,marginBottom:2}}>{d.title}</div>
                        <div style={{fontSize:11,color:t.textMuted}}>{ID_SUBJECT[d.subject_id]||"—"} · {fmtDate(d.created_at)}</div>
                      </div>
                      <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:600,flexShrink:0}}>View →</span>
                    </div>
                  </div>
                ))}
              </>
            ):(
              <div>
                <button onClick={()=>setActiveDisc(null)} style={{...btn(false),marginBottom:14,fontSize:12}}>← Back</button>
                <div style={card}>
                  <h2 style={{fontSize:16,marginBottom:16,color:t.text}}>{activeDisc.title}</h2>
                  <div style={{borderTop:`1px solid ${t.border}`,paddingTop:16}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:t.text}}>Replies ({(activeDisc.replies||[]).length})</div>
                    {(activeDisc.replies||[]).length===0&&<p style={{fontSize:13,color:t.textMuted,fontStyle:"italic",marginBottom:16}}>No replies yet. Be the first to answer!</p>}
                    {(activeDisc.replies||[]).map((r,i)=>(
                      <div key={i} style={{background:t.highlight,borderRadius:8,padding:"12px 14px",marginBottom:10,border:`1px solid ${r.is_verified?"#A5D6A7":t.border}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                          {r.is_verified&&<span style={{background:"#E8F5E9",color:"#2E7D32",borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:700}}>✓ Verified</span>}
                          {isAdmin&&!r.is_verified&&<button onClick={async()=>{await supabase.from("discussion_replies").update({is_verified:true}).eq("id",r.id);fetchReplies(activeDisc.id);showToast("Verified! ✅");}} style={{...btn(true),fontSize:10,padding:"3px 10px"}}>Verify</button>}
                        </div>
                        <p style={{fontSize:13,color:t.text,lineHeight:1.7,margin:0}}>{r.body}</p>
                      </div>
                    ))}
                    <div style={{marginTop:14}}>
                      <textarea value={newReply} onChange={e=>setNewReply(e.target.value)} placeholder="Write your answer..." rows={3} style={{...inp,marginBottom:8,resize:"vertical"}}/>
                      <button onClick={async()=>{
                        if(!newReply)return;
                        await supabase.from("discussion_replies").insert({discussion_id:activeDisc.id,user_id:user.id,body:newReply,is_verified:false});
                        setNewReply("");fetchReplies(activeDisc.id);
                      }} style={btn(true)}>Post Reply</button>
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
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>❌ Mistake Notebook</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Wrong exam answers auto-tracked · Removed when answered correctly</p>
            <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
              <button onClick={()=>setShowAddM(!showAddM)} style={btn(true)}>+ Add Manually</button>
              <span style={{fontSize:12,color:t.textMuted}}>{mistakes.length} mistakes</span>
            </div>
            {showAddM&&(
              <div style={{...card,borderLeft:`3px solid #c62828`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Add Mistake Manually</div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newM.subject} onChange={e=>setNewM({...newM,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Question</label><textarea value={newM.q} onChange={e=>setNewM({...newM,q:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:10}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Correct Answer</label><textarea value={newM.correct} onChange={e=>setNewM({...newM,correct:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Personal Note</label><textarea value={newM.note} onChange={e=>setNewM({...newM,note:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{
                    if(!newM.q){showToast("Enter question","error");return;}
                    await supabase.from("mistake_notebook").insert({user_id:user.id,subject_id:SUBJECT_ID[newM.subject],question_text:newM.q,correct_answer:newM.correct,personal_note:newM.note});
                    showToast("Saved! ✅");setShowAddM(false);setNewM({q:"",correct:"",note:"",subject:"FAR"});fetchMistakes();
                  }} style={btn(true)}>Save</button>
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
                {m.correct_answer&&<div style={{background:"#E8F5E9",borderRadius:6,padding:"8px 12px",marginBottom:6,fontSize:12,color:"#2E7D32"}}><strong>✅ Correct:</strong> {m.correct_answer}</div>}
                {m.personal_note&&<div style={{background:t.highlight,borderRadius:6,padding:"8px 12px",fontSize:12,color:t.text}}>📝 {m.personal_note}</div>}
                <div style={{fontSize:10,color:t.textMuted,marginTop:6}}>{fmtDate(m.created_at)}</div>
              </div>
            ))}
          </div>
        )}

        {/* GROUPS */}
        {page==="groups"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>👥 Study Groups</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:16,fontSize:14,fontStyle:"italic"}}>Collaborate with fellow CPA reviewees</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowAddGroup(!showAddGroup)} style={btn(true)}>+ Create Group</button>
              <span style={{fontSize:12,color:t.textMuted}}>{groups.length} groups</span>
            </div>
            {showAddGroup&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,marginBottom:16}}>
                <div style={{fontWeight:700,marginBottom:12,color:t.text}}>Create Study Group</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Name</label><input value={newGroup.name} onChange={e=>setNewGroup({...newGroup,name:e.target.value})} placeholder="e.g. FAR Warriors" style={inp}/></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Subject</label><select value={newGroup.subject} onChange={e=>setNewGroup({...newGroup,subject:e.target.value})} style={inp}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Type</label><select value={newGroup.type} onChange={e=>setNewGroup({...newGroup,type:e.target.value})} style={inp}><option value="public">Public</option><option value="private">Private</option></select></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>Description</label><textarea value={newGroup.description} onChange={e=>setNewGroup({...newGroup,description:e.target.value})} rows={2} style={{...inp,resize:"vertical"}}/></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={async()=>{
                    if(!newGroup.name){showToast("Enter group name","error");return;}
                    await supabase.from("study_groups").insert({name:newGroup.name,subject_id:SUBJECT_ID[newGroup.subject],created_by:user.id,type:newGroup.type,description:newGroup.description,member_count:1});
                    showToast("Group created! ✅");setShowAddGroup(false);setNewGroup({name:"",subject:"FAR",type:"public",description:""});fetchGroups();
                  }} style={btn(true)}>Create</button>
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
        {page==="progress"&&<ProgressPage user={user} profile={profile} t={t} card={card} btn={btn} go={go} supabase={supabase} TOPICS={TOPICS} SUBJECTS={SUBJECTS} ID_SUBJECT={ID_SUBJECT} SUBJECT_ID={SUBJECT_ID}/>}

        {/* LEADERBOARD */}
        {page==="leaderboard"&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>🏆 Leaderboard</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Top contributors and highest scorers</p>
            <div style={{...card,textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏆</div>
              <div style={{fontWeight:700,color:t.text,marginBottom:8,fontSize:16}}>Coming Soon!</div>
              <p style={{fontSize:13,color:t.textMuted,maxWidth:400,margin:"0 auto",lineHeight:1.7}}>Rankings will populate as students answer questions, take exams, and participate.</p>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile"&&(
          <div style={{maxWidth:580}}>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>👤 My Profile</h1>
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
                    <div key={field} style={{marginBottom:14}}>
                      <label style={{fontSize:10,color:t.textMuted,display:"block",marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>{label}</label>
                      <input value={editForm[field]||""} onChange={e=>setEditForm({...editForm,[field]:e.target.value})} placeholder={ph} style={inp}/>
                    </div>
                  ))}
                  <button onClick={async()=>{
                    await supabase.from("profiles").update({full_name:editForm.full_name,school:editForm.school,year_level:editForm.year_level,updated_at:new Date().toISOString()}).eq("id",user.id);
                    setProfile({...profile,...editForm});setEditingProfile(false);showToast("Profile updated! ✅");
                  }} style={{...btn(true),padding:"10px 24px"}}>Save Changes</button>
                </div>
              ):(
                <div>
                  {[["Full Name",profile?.full_name||"—"],["Email",user?.email],["School",profile?.school||"—"],["Year Level",profile?.year_level||"—"],["Role",profile?.role||"student"],["Access",isPaid?"Full Access (Paid)":"Free Account"],["Member Since",fmtDate(profile?.created_at)]].map(([label,val])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}>
                      <span style={{color:t.textMuted,fontWeight:600}}>{label}</span>
                      <span style={{fontWeight:500,color:t.text,textTransform:label==="Role"?"capitalize":"none"}}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isPaid&&(
              <div style={{...card,borderLeft:`3px solid ${t.accent}`,background:t.highlight}}>
                <div style={{fontWeight:700,color:t.accentText,marginBottom:4}}>🔓 Upgrade to Full Access</div>
                <div style={{fontSize:13,color:t.accentText,marginBottom:10}}>Unlock all features for ₱99 one-time.</div>
                <button onClick={()=>{setPage("payment");setPayStep(1);}} style={btn(true)}>Pay ₱99 →</button>
              </div>
            )}
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:8,fontSize:14,color:t.text}}>🔒 Security</div>
              <p style={{fontSize:13,color:t.textMuted,marginBottom:12}}>To change your password, sign out and use forgot password.</p>
              <button onClick={handleLogout} style={btn(false,true)}>Sign Out</button>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {page==="admin"&&isAdmin&&(
          <div>
            <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>🛡️ Admin Panel</h1>
            <p className="serif" style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic"}}>Manage users, payments, and content</p>
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div><div style={{fontWeight:700,fontSize:15,color:t.text}}>💳 Pending Payments</div><div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{pendingPayments.length} awaiting verification</div></div>
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
                      <div style={{fontWeight:700,fontSize:14,color:t.text}}>User ID: {p.user_id}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>Submitted: {fmtDate(p.created_at)}</div>
                    </div>
                    <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"4px 12px",fontSize:13,fontWeight:700}}>₱{p.amount}</span>
                  </div>
                  <div style={{background:t.highlight,borderRadius:8,padding:"10px 12px",marginBottom:12,fontSize:13,color:t.text}}>
                    <div><strong>Reference #:</strong> {p.reference_number}</div>
                    <div><strong>Method:</strong> {p.payment_method}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>handleApprove(p)} style={{...btn(true),fontSize:13,padding:"8px 20px"}}>✅ Approve Access</button>
                    <button onClick={async()=>{await supabase.from("user_payments").update({status:"rejected"}).eq("id",p.id);showToast("Rejected.");fetchPendingPayments();}} style={{...btn(false,true),fontSize:13,padding:"8px 16px"}}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div><div style={{fontWeight:700,fontSize:15,color:t.text}}>👥 All Registered Users</div><div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{allUsers.length} total</div></div>
                <button onClick={fetchAllUsers} style={{...btn(false),fontSize:12,padding:"5px 12px"}}>↺ Refresh</button>
              </div>
              <div style={{maxHeight:400,overflowY:"auto"}}>
                {allUsers.map(u=>(
                  <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{(u.full_name||"?")[0].toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.full_name||"No name"}</div>
                      <div style={{fontSize:11,color:t.textMuted}}>{u.school||"—"} · {fmtDate(u.created_at)}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <span style={{background:u.is_approved?"#E8F5E9":"#FFF3E0",color:u.is_approved?"#2E7D32":"#E65100",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700}}>{u.is_approved?"✓ Paid":"Free"}</span>
                      <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:600,textTransform:"capitalize"}}>{u.role||"student"}</span>
                      {!u.is_approved&&u.role!=="admin"&&(
                        <button onClick={async()=>{await supabase.from("profiles").update({is_approved:true}).eq("id",u.id);showToast("Approved! ✅");fetchAllUsers();}} style={{...btn(true),fontSize:10,padding:"3px 10px"}}>Approve</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:8,fontSize:14,color:t.text}}>⚡ Manual SQL Approval</div>
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

// ── PROGRESS PAGE ──
function ProgressPage({user,profile,t,card,btn,go,supabase,TOPICS,SUBJECTS,ID_SUBJECT,SUBJECT_ID}){
  const [loading,setLoading]=useState(true);
  const [examStats,setExamStats]=useState({});
  const [mistakeStats,setMistakeStats]=useState({});
  const [noteTopics,setNoteTopics]=useState({});
  const [qTotals,setQTotals]=useState({});
  const [expandedSub,setExpandedSub]=useState(null);

  useEffect(()=>{loadAll();},[]);

  const loadAll=async()=>{
    setLoading(true);
    const[{data:exams},{data:mistakes},{data:notes},{data:qs}]=await Promise.all([
      supabase.from("exam_attempts").select("*").eq("user_id",user.id),
      supabase.from("mistake_notebook").select("subject_id").eq("user_id",user.id),
      supabase.from("user_notes").select("subject_id,title,body").eq("user_id",user.id),
      supabase.from("questions").select("subject_id").eq("is_approved",true),
    ]);
    const es={};
    (exams||[]).forEach(e=>{if(!es[e.exam_subject])es[e.exam_subject]={scores:[],count:0};if(e.score!=null){es[e.exam_subject].scores.push(e.score);es[e.exam_subject].count++;}});
    setExamStats(es);
    const ms={};
    (mistakes||[]).forEach(m=>{const s=ID_SUBJECT[m.subject_id];if(s)ms[s]=(ms[s]||0)+1;});
    setMistakeStats(ms);
    const qt={};
    (qs||[]).forEach(q=>{const s=ID_SUBJECT[q.subject_id];if(s)qt[s]=(qt[s]||0)+1;});
    setQTotals(qt);
    const nt={};
    (notes||[]).forEach(n=>{const s=ID_SUBJECT[n.subject_id];if(s){if(!nt[s])nt[s]=new Set();const topics=TOPICS[s]||[];topics.forEach(topic=>{if((n.title||"").toLowerCase().includes(topic.toLowerCase().slice(0,8))||(n.body||"").toLowerCase().includes(topic.toLowerCase().slice(0,8)))nt[s].add(topic);});if(topics.length>0)nt[s].add("_note_"+n.title);}});
    setNoteTopics(nt);
    setLoading(false);
  };

  const getProgress=(sub)=>{
    const totalTopics=(TOPICS[sub]||[]).length;
    const examCount=examStats[sub]?.count||0;
    const scores=examStats[sub]?.scores||[];
    const avgScore=scores.length>0?scores.reduce((a,b)=>a+b,0)/scores.length:0;
    const totalQ=qTotals[sub]||0;
    const mistakes=mistakeStats[sub]||0;
    const accuracy=totalQ>0?Math.max(0,((totalQ-mistakes)/totalQ)*100):0;
    const coveredByNotes=noteTopics[sub]?[...noteTopics[sub]].filter(t=>!t.startsWith("_note_")).length:0;
    const hasNotes=noteTopics[sub]?[...noteTopics[sub]].filter(t=>t.startsWith("_note_")).length:0;
    const coveredTopics=Math.min(totalTopics,coveredByNotes+(examCount>0?Math.floor(totalTopics*0.3):0)+(hasNotes>0?Math.floor(totalTopics*0.1):0));
    const topicCov=totalTopics>0?(coveredTopics/totalTopics)*100:0;
    const overall=scores.length>0||totalQ>0||coveredTopics>0?(avgScore*0.5)+(accuracy*0.3)+(topicCov*0.2):0;
    return{overall:Math.round(overall),topicCov:Math.round(topicCov),accuracy:Math.round(accuracy),avgScore:Math.round(avgScore),coveredTopics,totalTopics,examCount,totalQ,mistakes};
  };

  const gradeInfo=(pct)=>{
    if(pct>=90)return{label:"Mastered",color:"#4CAF50"};
    if(pct>=75)return{label:"Proficient",color:"#8BC34A"};
    if(pct>=60)return{label:"Developing",color:"#FF9800"};
    if(pct>=40)return{label:"Needs Work",color:"#FF5722"};
    return{label:"Just Starting",color:"#9E9E9E"};
  };

  if(loading)return<div style={{textAlign:"center",padding:"60px",color:t.textMuted}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><div>Loading progress...</div></div>;

  const allProgress=SUBJECTS.map(s=>getProgress(s));
  const totalOverall=Math.round(allProgress.reduce((a,b)=>a+b.overall,0)/SUBJECTS.length);
  const {label:overallLabel,color:overallColor}=gradeInfo(totalOverall);

  return(
    <div>
      <h1 style={{fontSize:22,marginBottom:4,color:t.text}}>📊 Progress Analytics</h1>
      <p style={{color:t.textMuted,marginBottom:20,fontSize:14,fontStyle:"italic",fontFamily:"'Sorts Mill Goudy',Georgia,serif"}}>Your mastery across all 7 CPALE subjects</p>
      <div style={{...card,background:t.accentLight,borderLeft:`4px solid ${t.accent}`,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontWeight:800,fontSize:18,color:t.accentText}}>Overall CPALE Readiness</div><p style={{fontSize:13,color:t.accentText,marginTop:2,fontStyle:"italic",fontFamily:"Georgia,serif"}}>Based on exams (50%), questions (30%), topic coverage (20%)</p></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:48,fontWeight:800,color:t.accentText,letterSpacing:"-2px"}}>{totalOverall}%</div><div style={{fontSize:11,color:overallColor,fontWeight:700,textTransform:"uppercase"}}>{overallLabel}</div></div>
        </div>
        <div style={{background:"rgba(255,255,255,0.4)",borderRadius:8,height:12}}><div style={{width:`${totalOverall}%`,background:t.accent,borderRadius:8,height:12,transition:"width 0.5s"}}/></div>
      </div>
      <div style={{...card,marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:t.text}}>📋 Grading Scale</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["90–100%","Mastered","#4CAF50"],["75–89%","Proficient","#8BC34A"],["60–74%","Developing","#FF9800"],["40–59%","Needs Work","#FF5722"],["0–39%","Just Starting","#9E9E9E"]].map(([range,label,color])=>(
            <div key={label} style={{background:color+"22",border:`1px solid ${color}`,borderRadius:8,padding:"6px 12px",textAlign:"center"}}>
              <div style={{fontWeight:700,fontSize:12,color}}>{label}</div>
              <div style={{fontSize:10,color:t.textMuted}}>{range}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{fontWeight:700,fontSize:15,color:t.text,marginBottom:12}}>Subject Breakdown</div>
      {SUBJECTS.map((sub,i)=>{
        const p=getProgress(sub);
        const{label,color}=gradeInfo(p.overall);
        const isExp=expandedSub===sub;
        return(
          <div key={sub} style={{...card,marginBottom:10,border:`1px solid ${isExp?t.accent:t.border}`}}>
            <div onClick={()=>setExpandedSub(isExp?null:sub)} style={{cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:t.subjectColors[i],flexShrink:0}}/>
                  <div style={{fontWeight:700,fontSize:14,color:t.text}}>{sub}</div>
                  <span style={{background:color+"22",color,borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontWeight:800,fontSize:20,color}}>{p.overall}%</div>
                  <span style={{fontSize:12,color:t.textMuted}}>{isExp?"▲":"▼"}</span>
                </div>
              </div>
              <div style={{background:t.border,borderRadius:6,height:10,marginBottom:8}}><div style={{width:`${p.overall}%`,background:t.subjectColors[i],borderRadius:6,height:10,transition:"width 0.5s"}}/></div>
              <div style={{display:"flex",gap:16,fontSize:11,color:t.textMuted}}>
                <span>📝 Exam: <strong style={{color:t.text}}>{p.avgScore}%</strong></span>
                <span>❓ Accuracy: <strong style={{color:t.text}}>{p.accuracy}%</strong></span>
                <span>📖 Topics: <strong style={{color:t.text}}>{p.coveredTopics}/{p.totalTopics}</strong></span>
              </div>
            </div>
            {isExp&&(
              <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${t.border}`}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                  {[{label:"📝 Mock Exam",val:p.avgScore,weight:"50%",color:"#5C6BC0",detail:`${p.examCount} exam${p.examCount!==1?"s":""} taken`},
                    {label:"❓ Question Accuracy",val:p.accuracy,weight:"30%",color:"#26A69A",detail:`${p.totalQ} questions available`},
                    {label:"📖 Topic Coverage",val:p.topicCov,weight:"20%",color:"#FFA726",detail:`${p.coveredTopics} of ${p.totalTopics} covered`}
                  ].map(m=>(
                    <div key={m.label} style={{background:t.highlight,borderRadius:10,padding:"12px",textAlign:"center"}}>
                      <div style={{fontSize:11,color:t.textMuted,marginBottom:4,fontWeight:600}}>{m.label}</div>
                      <div style={{fontSize:24,fontWeight:800,color:m.color}}>{m.val}%</div>
                      <div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{m.detail}</div>
                      <div style={{fontSize:10,color:t.accent,fontWeight:600,marginTop:2}}>Weight: {m.weight}</div>
                      <div style={{background:t.border,borderRadius:4,height:4,marginTop:6}}><div style={{width:`${m.val}%`,background:m.color,borderRadius:4,height:4}}/></div>
                    </div>
                  ))}
                </div>
                <div style={{fontWeight:700,fontSize:13,color:t.text,marginBottom:8}}>Topics ({p.totalTopics} total)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6,maxHeight:200,overflowY:"auto"}}>
                  {(TOPICS[sub]||[]).map(topic=>{
                    const covered=noteTopics[sub]?[...noteTopics[sub]].some(nt=>!nt.startsWith("_note_")&&nt===topic):false;
                    return(
                      <div key={topic} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:covered?color+"15":t.surface,borderRadius:6,border:`1px solid ${covered?color:t.border}`,fontSize:11,color:t.text}}>
                        <span style={{fontSize:10,flexShrink:0}}>{covered?"✅":"⬜"}</span>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{topic}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button onClick={()=>go("mockexam")} style={{...btn(true),fontSize:12,padding:"6px 14px"}}>📝 Take Exam</button>
                  <button onClick={()=>go("qbank")} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>❓ Practice</button>
                  <button onClick={()=>go("notes")} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>📖 Add Notes</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{textAlign:"center",marginTop:8}}><button onClick={loadAll} style={{...btn(false),fontSize:12}}>↺ Refresh Progress</button></div>
    </div>
  );
}