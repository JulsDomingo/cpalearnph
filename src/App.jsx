import { useState } from "react";

const PASTEL = {
  name:"pastel",bg:"#FDF6FB",surface:"#FFF0F7",card:"#FFFFFF",sidebar:"#F9E8F5",sidebarBorder:"#EEC8E8",
  accent:"#D46FAC",accentLight:"#F7C8E8",accentText:"#A3347A",text:"#3D1F35",textMuted:"#9B6A87",
  border:"#EDD5E8",badge:"#F4DAEF",badgeText:"#8B3B72",progress:"#E991CC",highlight:"#FDE8F5",
  navActive:"#F7C8E8",navActiveText:"#8B3B72",
  subjectColors:["#F8B4D9","#C3B1E1","#B5EAD7","#FFDAC1","#B5D5F5","#F9C9C9","#CBE4C4"],
  subjectText:["#8B3B72","#5B3E8F","#2A7D5A","#A85D00","#1A5FAD","#9B2828","#3D6B2A"],
};
const EARTHY = {
  name:"earthy",bg:"#F5F0E8",surface:"#EDE5D8",card:"#FDFAF5",sidebar:"#EAE0CE",sidebarBorder:"#C8B89A",
  accent:"#7C6248",accentLight:"#D4BFA0",accentText:"#5C3D1E",text:"#2C1F0E",textMuted:"#7A6248",
  border:"#D4C4A8",badge:"#E8DCC8",badgeText:"#5C3D1E",progress:"#A68060",highlight:"#F0E8D5",
  navActive:"#D4BFA0",navActiveText:"#5C3D1E",
  subjectColors:["#D4A574","#B5C99A","#A8C4C8","#D4B896","#C4A8B8","#B8C4A0","#C8B084"],
  subjectText:["#5C3D1E","#3A5A1E","#1E4A50","#5C3D1E","#4A2848","#2A4A1E","#4A3808"],
};

const SUBJECTS=["FAR","AFAR","MAS","RFBT","TAX","Auditing Theory","Auditing Problems"];
const TOPICS={
  FAR:["Cash & Cash Equivalents","Receivables","Inventories","PPE","Intangibles","Investments","Liabilities","Equity","Revenue Recognition","Leases"],
  AFAR:["Business Combination","Consolidation","Foreign Currency","Joint Arrangement","Government Accounting","Liquidation","Installment Sales"],
  MAS:["Cost Concepts","CVP Analysis","Budgeting","Standard Costing","Variance Analysis","Decision Making","Transfer Pricing","Performance Evaluation"],
  RFBT:["Law on Obligations","Law on Contracts","Sales","Agency","Partnership","Corporation","Negotiable Instruments","Insurance"],
  TAX:["Income Tax - Individuals","Income Tax - Corporate","VAT","Other Percentage Taxes","Excise Tax","Estate Tax","Donor's Tax","Tax Remedies"],
  "Auditing Theory":["Audit Concepts","Professional Standards","Audit Risk","Internal Control","Audit Evidence","Audit Sampling","Audit Reports","Ethics"],
  "Auditing Problems":["Cash Audit","Receivables Audit","Inventory Audit","PPE Audit","Liabilities Audit","Equity Audit","Revenue Audit","Expense Audit"],
};
const MOCK_QUESTIONS=[
  {id:1,subject:"FAR",topic:"Inventories",q:"Under PAS 2, which cost formula is NOT allowed for inventory measurement?",options:["FIFO","Weighted Average","LIFO","Specific Identification"],answer:2,explanation:"PAS 2 prohibits LIFO. Acceptable formulas are FIFO, Weighted Average, and Specific Identification for items not ordinarily interchangeable."},
  {id:2,subject:"FAR",topic:"Leases",q:"Under PFRS 16, a lessee shall recognize a right-of-use asset and lease liability for:",options:["All leases except short-term and low-value","Only finance leases","Only operating leases","All leases without exception"],answer:0,explanation:"PFRS 16 requires ROU asset and lease liability for all leases, with optional exemptions for short-term leases (≤12 months) and low-value asset leases."},
  {id:3,subject:"TAX",topic:"Income Tax - Corporate",q:"The regular corporate income tax rate under CREATE Law is:",options:["30%","25%","20%","28%"],answer:1,explanation:"Under CREATE Act (RA 11534), RCIT was reduced from 30% to 25% effective July 1, 2020."},
  {id:4,subject:"MAS",topic:"CVP Analysis",q:"Contribution margin ratio is computed as:",options:["Net income / Sales","(Sales - Variable Costs) / Sales","Fixed Costs / Sales","(Sales - Total Costs) / Sales"],answer:1,explanation:"CMR = (Sales - Variable Costs) / Sales. It represents the percentage of each peso available to cover fixed costs and contribute to profit."},
  {id:5,subject:"AFAR",topic:"Business Combination",q:"Under PFRS 3, goodwill is measured as:",options:["Fair value of consideration minus book value of net assets","Consideration transferred plus NCI minus fair value of identifiable net assets","Purchase price minus par value of shares issued","Fair value of assets acquired minus liabilities assumed"],answer:1,explanation:"Goodwill = Consideration transferred + NCI + Previously held equity interest − Fair value of identifiable net assets acquired."},
  {id:6,subject:"Auditing Theory",topic:"Audit Risk",q:"Which component of audit risk can the auditor control?",options:["Inherent risk","Control risk","Detection risk","Business risk"],answer:2,explanation:"Detection risk is the risk that audit procedures will not detect a material misstatement. It is the component the auditor can control by adjusting the nature, timing, and extent of audit procedures."},
];
const FLASHCARDS=[
  {front:"What is the going concern assumption?",back:"An entity will continue to operate indefinitely, having neither the intention nor the need to liquidate or significantly curtail its operations.",subject:"FAR"},
  {front:"Define fair value under PFRS 13",back:"The price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.",subject:"FAR"},
  {front:"What is Control under PFRS 10?",back:"An investor controls an investee when it has power over the investee, exposure to variable returns, and the ability to use its power to affect those returns.",subject:"AFAR"},
  {front:"Distinguish revenue from gain",back:"Revenue arises from ordinary business activities (sales, fees, interest, dividends, royalties, rent). Gains arise from incidental transactions not part of ordinary activities.",subject:"FAR"},
  {front:"Formula: Break-even point in units",back:"Fixed Costs ÷ Contribution Margin per Unit",subject:"MAS"},
  {front:"What is inherent risk?",back:"The susceptibility of an assertion to material misstatement, assuming no related controls exist. It depends on the nature of the account and transaction.",subject:"Auditing Theory"},
  {front:"VAT threshold for compulsory registration (Philippines)",back:"Gross sales or receipts exceeding ₱3,000,000 in any 12-month period.",subject:"TAX"},
  {front:"PFRS 16 — Short-term lease exemption",back:"A lease with a lease term of 12 months or less at the commencement date. The lessee may elect not to recognize ROU asset and lease liability.",subject:"FAR"},
];
const DISCUSSIONS=[
  {id:1,user:"Ana Reyes",avatar:"AR",subject:"FAR",topic:"Leases",q:"Under PFRS 16, when do we use the incremental borrowing rate instead of the implicit rate?",answers:[{user:"Mark Santos",avatar:"MS",text:"We use the IBR when the implicit rate in the lease cannot be readily determined. The IBR is the rate the lessee would have to pay to borrow over a similar term, with similar collateral, an amount similar to the ROU asset.",upvotes:14,verified:true},{user:"Claire Go",avatar:"CG",text:"To add — in practice most lessees use the IBR because lessors rarely disclose information needed to compute the implicit rate.",upvotes:7,verified:false}],time:"2h ago"},
  {id:2,user:"Jose Mendoza",avatar:"JM",subject:"TAX",topic:"VAT",q:"What is the distinction between zero-rated and VAT-exempt transactions?",answers:[{user:"Bea Torres",avatar:"BT",text:"Zero-rated: subject to VAT at 0%, so input VAT is creditable/refundable. Exempt: not subject to VAT at all, so input VAT on related purchases is not creditable — it becomes part of cost.",upvotes:22,verified:true}],time:"5h ago"},
  {id:3,user:"Ryan Cruz",avatar:"RC",subject:"MAS",topic:"Standard Costing",q:"How do we compute material price variance vs. material quantity variance?",answers:[{user:"Juls D.",avatar:"JD",text:"MPV = (Actual Price − Standard Price) × Actual Quantity purchased. MQV = (Actual Quantity used − Standard Quantity allowed) × Standard Price.",upvotes:18,verified:true}],time:"1d ago"},
];
const PROGRESS={FAR:78,AFAR:65,MAS:82,RFBT:55,TAX:70,"Auditing Theory":60,"Auditing Problems":48};
const BADGES=[
  {icon:"🏆",label:"FAR Master",earned:true},{icon:"📊",label:"MAS Expert",earned:true},{icon:"⭐",label:"Top Contributor",earned:true},
  {icon:"🎯",label:"Tax Expert",earned:false},{icon:"🔥",label:"30-Day Streak",earned:false},{icon:"📚",label:"AFAR Pro",earned:false},
  {icon:"💬",label:"Discussion Star",earned:false},{icon:"🃏",label:"Flashcard Pro",earned:true},
];
const NOTES=[
  {id:1,title:"PFRS 16 Leases Summary",subject:"FAR",topic:"Leases",date:"Jun 3, 2025",preview:"Lessee recognizes ROU asset and lease liability. Exemptions: short-term leases and low-value assets..."},
  {id:2,title:"VAT Quick Reference",subject:"TAX",topic:"VAT",date:"Jun 1, 2025",preview:"Zero-rated vs exempt. Input VAT creditable only for zero-rated. Threshold: ₱3M..."},
  {id:3,title:"CVP Formulas",subject:"MAS",topic:"CVP Analysis",date:"May 28, 2025",preview:"BEP units = FC/CM. BEP sales = FC/CMR. Margin of safety = Actual − BEP..."},
];
const STUDY_GROUPS=[
  {id:1,name:"FAR Warriors",members:24,subject:"FAR",type:"Public",activity:"3 new notes today"},
  {id:2,name:"Tax Season Ready",members:15,subject:"TAX",type:"Public",activity:"Mock exam scheduled Fri"},
  {id:3,name:"Audit Aces",members:8,subject:"Auditing Theory",type:"Private",activity:"Discussion active"},
];

export default function App() {
  const [theme,setTheme]=useState(PASTEL);
  const [page,setPage]=useState("landing");
  const [loggedIn,setLoggedIn]=useState(false);
  const [activeSubject,setActiveSubject]=useState("FAR");
  const [activeTopic,setActiveTopic]=useState(null);
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [showAnswer,setShowAnswer]=useState(false);
  const [fcIdx,setFcIdx]=useState(0);
  const [fcFlipped,setFcFlipped]=useState(false);
  const [examStarted,setExamStarted]=useState(false);
  const [examAnswers,setExamAnswers]=useState({});
  const [examDone,setExamDone]=useState(false);
  const [activeTab,setActiveTab]=useState("notes");
  const [upvoted,setUpvoted]=useState({});
  const [searchVal,setSearchVal]=useState("");
  const [showSearch,setShowSearch]=useState(false);
  const [activeNote,setActiveNote]=useState(null);
  const [mistakeNotes,setMistakeNotes]=useState([]);
  const [showMistakeForm,setShowMistakeForm]=useState(false);
  const [newMistake,setNewMistake]=useState({q:"",correct:"",note:""});
  const [notifOpen,setNotifOpen]=useState(false);
  const [loginForm,setLoginForm]=useState({email:"",pass:""});
  const [loginError,setLoginError]=useState("");
  const [showRegister,setShowRegister]=useState(false);

  const t=theme;
  const s=(p)=>{setPage(p);setSelected(null);setShowAnswer(false);setShowSearch(false);};
  const card={background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:"16px 20px",marginBottom:12};
  const btn=(primary)=>({background:primary?t.accent:"transparent",color:primary?"#fff":t.accentText,border:`1px solid ${primary?t.accent:t.accentLight}`,borderRadius:8,padding:"8px 20px",cursor:"pointer",fontWeight:500,fontSize:14});

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

  const handleLogin=()=>{
    if(loginForm.email==="student@cpalearnph.com"&&loginForm.pass==="cpale2025"){
      setLoggedIn(true);s("dashboard");setLoginError("");
    } else if(loginForm.email.includes("@")&&loginForm.pass.length>=6){
      setLoggedIn(true);s("dashboard");setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try: student@cpalearnph.com / cpale2025");
    }
  };

  const searchResults=searchVal.length>1?[
    ...MOCK_QUESTIONS.filter(q=>q.q.toLowerCase().includes(searchVal.toLowerCase())||q.topic.toLowerCase().includes(searchVal.toLowerCase())).map(q=>({type:"Question",title:q.q,sub:q.subject,go:"qbank"})),
    ...FLASHCARDS.filter(f=>f.front.toLowerCase().includes(searchVal.toLowerCase())||f.back.toLowerCase().includes(searchVal.toLowerCase())).map(f=>({type:"Flashcard",title:f.front,sub:f.subject,go:"flashcards"})),
    ...NOTES.filter(n=>n.title.toLowerCase().includes(searchVal.toLowerCase())||n.preview.toLowerCase().includes(searchVal.toLowerCase())).map(n=>({type:"Note",title:n.title,sub:n.subject,go:"notes"})),
    ...DISCUSSIONS.flatMap(d=>d.answers.filter(a=>a.text.toLowerCase().includes(searchVal.toLowerCase())).map(()=>({type:"Discussion",title:d.q,sub:d.subject,go:"discussions"}))),
  ].slice(0,6):[];

  // LANDING
  if(page==="landing"&&!loggedIn) return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",color:t.text}}>
      <div style={{position:"fixed",top:0,left:0,right:0,background:t.card,borderBottom:`1px solid ${t.border}`,padding:"12px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🎓</span>
          <span style={{fontWeight:700,fontSize:18,color:t.accent}}>CPALearn PH</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),fontSize:12,padding:"6px 14px"}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={()=>setShowRegister(false)||setPage("login")} style={btn(false)}>Log In</button>
          <button onClick={()=>{setShowRegister(true);setPage("login")}} style={btn(true)}>Register</button>
        </div>
      </div>

      <div style={{paddingTop:80,textAlign:"center",padding:"120px 20px 60px"}}>
        <div style={{display:"inline-block",background:t.badge,color:t.badgeText,borderRadius:20,padding:"4px 16px",fontSize:12,marginBottom:16}}>🇵🇭 Built for Filipino CPA Candidates</div>
        <h1 style={{fontSize:48,fontWeight:700,color:t.text,margin:"0 0 16px",lineHeight:1.2}}>Your All-in-One<br/><span style={{color:t.accent}}>CPALE Review</span> Platform</h1>
        <p style={{fontSize:18,color:t.textMuted,maxWidth:560,margin:"0 auto 32px"}}>Study smarter with 7 subjects, collaborative notes, question banks, mock exams, and progress tracking — all in one place.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setShowRegister(true);setPage("login")}} style={{...btn(true),padding:"14px 32px",fontSize:16}}>Start Studying →</button>
          <button onClick={()=>s("subjects")} style={{...btn(false),padding:"14px 32px",fontSize:16}}>Explore Subjects</button>
        </div>
        <p style={{fontSize:13,color:t.textMuted,marginTop:12}}>One-time access fee to cover hosting. No subscriptions, no recurring charges.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,maxWidth:960,margin:"0 auto 60px",padding:"0 32px"}}>
        {[["📚","7 Subjects","FAR, AFAR, MAS, RFBT, TAX, Audit Theory & Problems"],["❓","Question Bank","MCQs with detailed explanations & solutions"],["🃏","Flashcards","Spaced repetition for formulas & concepts"],["📝","Mock Exams","Timed full-length board exam simulations"],["💬","Discussions","Ask & answer with the community"],["📊","Progress Tracking","Visual analytics by subject & topic"],["👥","Study Groups","Collaborate with fellow reviewees"],["❌","Mistake Notebook","Track and review your wrong answers"]].map(([icon,title,desc])=>(
          <div key={title} style={{...card,textAlign:"center",padding:"24px 16px"}}>
            <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
            <div style={{fontWeight:600,marginBottom:4,color:t.text}}>{title}</div>
            <div style={{fontSize:13,color:t.textMuted}}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{background:t.surface,padding:"60px 32px",textAlign:"center"}}>
        <h2 style={{fontSize:28,fontWeight:700,color:t.text,marginBottom:8}}>Join thousands of CPA reviewees</h2>
        <p style={{color:t.textMuted,marginBottom:32}}>Upload, study, collaborate, and pass the board exam together.</p>
        <button onClick={()=>{setShowRegister(true);setPage("login")}} style={{...btn(true),padding:"14px 32px",fontSize:16}}>Get Started</button>
      </div>
    </div>
  );

  // LOGIN / REGISTER PAGE
  if(page==="login") return (
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:400,background:t.card,border:`1px solid ${t.border}`,borderRadius:16,padding:"40px 36px",boxSizing:"border-box"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span style={{fontSize:36}}>🎓</span>
          <h2 style={{fontWeight:700,color:t.accent,margin:"8px 0 4px",fontSize:22}}>CPALearn PH</h2>
          <p style={{color:t.textMuted,fontSize:14,margin:0}}>{showRegister?"Create your account":"Welcome back, reviewee!"}</p>
        </div>
        {showRegister&&(
          <div style={{marginBottom:14}}>
            <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>Full Name</label>
            <input placeholder="e.g. Juls Domingo" style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>Email</label>
          <input value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} placeholder="student@cpalearnph.com" style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:showRegister?14:8}}>
          <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>Password</label>
          <input value={loginForm.pass} onChange={e=>setLoginForm({...loginForm,pass:e.target.value})} type="password" placeholder="••••••••" style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
        </div>
        {showRegister&&(
          <div style={{marginBottom:8}}>
            <label style={{fontSize:13,color:t.textMuted,display:"block",marginBottom:4}}>School (optional)</label>
            <input placeholder="e.g. UST, DLSU, UP Manila" style={{width:"100%",padding:"10px 12px",border:`1px solid ${t.border}`,borderRadius:8,fontSize:14,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
          </div>
        )}
        {loginError&&<div style={{color:"#e53935",fontSize:12,marginBottom:10,background:"#FFEBEE",padding:"8px 12px",borderRadius:6}}>{loginError}</div>}
        <button onClick={handleLogin} style={{...btn(true),width:"100%",padding:"12px",fontSize:15,marginTop:8}}>{showRegister?"Create Account":"Log In"}</button>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:t.textMuted}}>
          {showRegister?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>setShowRegister(!showRegister)} style={{color:t.accent,cursor:"pointer",fontWeight:600}}>{showRegister?"Log In":"Register"}</span>
        </div>
        <div style={{textAlign:"center",marginTop:12}}>
          <span onClick={()=>s("landing")} style={{fontSize:12,color:t.textMuted,cursor:"pointer"}}>← Back to home</span>
        </div>
        {!showRegister&&<div style={{background:t.highlight,borderRadius:8,padding:"10px 12px",marginTop:16,fontSize:12,color:t.textMuted,textAlign:"center"}}>Demo: student@cpalearnph.com / cpale2025</div>}
      </div>
    </div>
  );

  // APP SHELL
  return (
    <div style={{display:"flex",minHeight:"100vh",background:t.bg,fontFamily:"system-ui,sans-serif",color:t.text}}>
      <div style={{width:200,background:t.sidebar,borderRight:`1px solid ${t.sidebarBorder}`,display:"flex",flexDirection:"column",padding:"16px 0",position:"fixed",top:0,bottom:0,left:0,zIndex:50,overflowY:"auto"}}>
        <div style={{padding:"0 16px 16px",borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🎓</span>
            <span style={{fontWeight:700,color:t.accent,fontSize:15}}>CPALearn PH</span>
          </div>
        </div>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>s(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",background:page===n.id?t.navActive:"transparent",color:page===n.id?t.navActiveText:t.textMuted,border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:page===n.id?600:400,borderLeft:page===n.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
            <span style={{fontSize:15}}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"12px 16px",borderTop:`1px solid ${t.sidebarBorder}`}}>
          <button onClick={()=>setTheme(theme.name==="pastel"?EARTHY:PASTEL)} style={{...btn(false),width:"100%",fontSize:12,padding:"6px 0"}}>{theme.name==="pastel"?"🌿 Earthy":"🌸 Pastel"}</button>
          <button onClick={()=>{setLoggedIn(false);s("landing")}} style={{...btn(false),width:"100%",fontSize:12,padding:"6px 0",marginTop:6,color:t.textMuted}}>Sign Out</button>
        </div>
      </div>

      <div style={{marginLeft:200,flex:1,padding:24,maxWidth:"calc(100vw - 200px)",overflowX:"hidden"}}>
        {/* TOP BAR */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,position:"relative"}}>
          <div style={{flex:1,position:"relative"}}>
            <input value={searchVal} onChange={e=>{setSearchVal(e.target.value);setShowSearch(true)}} onFocus={()=>setShowSearch(true)} placeholder="🔍  Search notes, questions, flashcards, discussions..." style={{width:"100%",padding:"10px 16px",border:`1px solid ${t.border}`,borderRadius:10,fontSize:14,background:t.card,color:t.text,boxSizing:"border-box"}}/>
            {showSearch&&searchResults.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:t.card,border:`1px solid ${t.border}`,borderRadius:10,zIndex:200,marginTop:4,boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
                {searchResults.map((r,i)=>(
                  <div key={i} onClick={()=>{s(r.go);setSearchVal("");setShowSearch(false)}} style={{padding:"10px 16px",borderBottom:i<searchResults.length-1?`1px solid ${t.border}`:"none",cursor:"pointer",display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{background:t.badge,color:t.badgeText,fontSize:10,padding:"2px 6px",borderRadius:8,whiteSpace:"nowrap"}}>{r.type}</span>
                    <span style={{fontSize:13,color:t.text}}>{r.title.length>60?r.title.slice(0,60)+"...":r.title}</span>
                    <span style={{fontSize:11,color:t.textMuted,marginLeft:"auto"}}>{r.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{position:"relative"}}>
            <button onClick={()=>setNotifOpen(!notifOpen)} style={{...btn(false),padding:"9px 14px",position:"relative"}}>
              🔔 <span style={{position:"absolute",top:4,right:4,width:8,height:8,background:"#e53935",borderRadius:"50%",display:"block"}}/>
            </button>
            {notifOpen&&(
              <div style={{position:"absolute",right:0,top:"100%",width:280,background:t.card,border:`1px solid ${t.border}`,borderRadius:10,zIndex:200,marginTop:4}}>
                {[{msg:"Mark Santos answered your question",time:"2h ago",icon:"💬"},{msg:"New FAR Mock Exam available",time:"4h ago",icon:"📝"},{msg:"Your upload was approved by Admin",time:"1d ago",icon:"✅"}].map((n,i)=>(
                  <div key={i} style={{padding:"12px 16px",borderBottom:i<2?`1px solid ${t.border}`:"none",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:18}}>{n.icon}</span>
                    <div><div style={{fontSize:13,color:t.text}}>{n.msg}</div><div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{n.time}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:t.badge,borderRadius:8,padding:"6px 12px"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>JD</div>
            <span style={{fontSize:13,color:t.badgeText,fontWeight:500}}>Juls D.</span>
          </div>
        </div>

        {/* DASHBOARD */}
        {page==="dashboard"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <h1 style={{fontSize:22,fontWeight:700,margin:0,color:t.text}}>Good morning, Juls! 👋</h1>
                <p style={{color:t.textMuted,margin:"4px 0 0",fontSize:14}}>You have 3 topics due for review today.</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[["12","Day Streak 🔥"],["248","Points ⭐"],["86h","Study Hours"]].map(([v,l])=>(
                  <div key={l} style={{background:t.badge,color:t.badgeText,borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:700}}>{v}</div>
                    <div style={{fontSize:11}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:12,color:t.text}}>📊 Subject Progress</div>
                {SUBJECTS.map((s2,i)=>(
                  <div key={s2} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}>
                      <span style={{color:t.text}}>{s2}</span>
                      <span style={{color:t.accent,fontWeight:600}}>{PROGRESS[s2]}%</span>
                    </div>
                    <div style={{background:t.border,borderRadius:4,height:6}}>
                      <div style={{width:`${PROGRESS[s2]}%`,background:t.subjectColors[i]||t.progress,borderRadius:4,height:6}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>📅 Today's Study Plan</div>
                  {[{done:true,task:"Review FAR – Leases (PFRS 16)",time:"45 min"},{done:true,task:"Practice MCQs – TAX VAT",time:"30 min"},{done:false,task:"Flashcards – MAS Cost Concepts",time:"20 min"},{done:false,task:"Read AFAR – Consolidation Notes",time:"60 min"}].map((item,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:i<3?`1px solid ${t.border}`:"none"}}>
                      <span style={{fontSize:16}}>{item.done?"✅":"⬜"}</span>
                      <div style={{flex:1}}><div style={{fontSize:13,color:item.done?t.textMuted:t.text,textDecoration:item.done?"line-through":"none"}}>{item.task}</div><div style={{fontSize:11,color:t.textMuted}}>{item.time}</div></div>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>🏆 Recent Badges</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {BADGES.filter(b=>b.earned).map(b=>(
                      <div key={b.label} style={{background:t.badge,color:t.badgeText,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:500}}>{b.icon} {b.label}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={card}>
              <div style={{fontWeight:600,marginBottom:10,color:t.text}}>📈 Weekly Study Hours</div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end",height:80}}>
                {[{d:"Mon",h:3},{d:"Tue",h:5},{d:"Wed",h:2},{d:"Thu",h:6},{d:"Fri",h:4},{d:"Sat",h:7},{d:"Sun",h:1}].map((day,i)=>(
                  <div key={day.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:"100%",background:i===5?t.accent:t.accentLight,borderRadius:"4px 4px 0 0",height:`${(day.h/7)*70}px`}}/>
                    <div style={{fontSize:11,color:t.textMuted}}>{day.d}</div>
                    <div style={{fontSize:11,color:t.accent,fontWeight:600}}>{day.h}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {page==="subjects"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📚 Subject Library</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Browse all 7 CPALE subjects</p>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              {SUBJECTS.map((s2,i)=>(
                <button key={s2} onClick={()=>{setActiveSubject(s2);setActiveTab("notes");setActiveTopic(null)}} style={{background:activeSubject===s2?t.subjectColors[i]:t.badge,color:activeSubject===s2?t.subjectText[i]:t.badgeText,border:`1px solid ${t.border}`,borderRadius:20,padding:"6px 16px",cursor:"pointer",fontSize:13,fontWeight:activeSubject===s2?600:400}}>{s2}</button>
              ))}
            </div>
            <div style={{...card,marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h2 style={{fontSize:18,fontWeight:700,margin:0,color:t.accent}}>{activeSubject}</h2>
                <span style={{background:t.badge,color:t.badgeText,borderRadius:12,padding:"3px 10px",fontSize:12}}>{PROGRESS[activeSubject]}% complete</span>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                {["notes","pdfs","videos","flashcards","questions","discuss"].map(tab=>(
                  <button key={tab} onClick={()=>setActiveTab(tab)} style={{background:activeTab===tab?t.accent:"transparent",color:activeTab===tab?"#fff":t.textMuted,border:`1px solid ${activeTab===tab?t.accent:t.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:500,textTransform:"capitalize"}}>{tab}</button>
                ))}
              </div>
              {activeTab==="notes"&&(
                <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:12,color:t.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Topics</div>
                    {TOPICS[activeSubject].map(topic=>(
                      <div key={topic} onClick={()=>setActiveTopic(activeTopic===topic?null:topic)} style={{padding:"8px 12px",borderRadius:6,marginBottom:4,background:activeTopic===topic?t.accentLight:t.highlight,fontSize:13,color:activeTopic===topic?t.accentText:t.text,cursor:"pointer",border:`1px solid ${activeTopic===topic?t.accentLight:t.border}`,fontWeight:activeTopic===topic?600:400}}>{topic}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:12,color:t.textMuted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Materials {activeTopic&&`— ${activeTopic}`}</div>
                    {[{icon:"📄",name:`${activeSubject} Comprehensive Reviewer.pdf`,type:"PDF",by:"Admin",tags:["Reviewer","2024"],size:"2.4 MB"},{icon:"📝",name:`${(activeTopic||TOPICS[activeSubject][0])} Handwritten Notes`,type:"Notes",by:"Ana Reyes",tags:["Handwritten","Detailed"],size:"1.1 MB"},{icon:"📊",name:`${activeSubject} Summary Table`,type:"Excel",by:"Mark Santos",tags:["Summary","Quick Review"],size:"0.8 MB"}].map((m,i)=>(
                      <div key={i} style={{...card,display:"flex",alignItems:"center",gap:12,marginBottom:8,padding:"12px 16px"}}>
                        <span style={{fontSize:24}}>{m.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13,color:t.text}}>{m.name}</div>
                          <div style={{fontSize:12,color:t.textMuted}}>by {m.by} · {m.type} · {m.size}</div>
                          <div style={{display:"flex",gap:4,marginTop:4}}>{m.tags.map(tag=><span key={tag} style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:11}}>{tag}</span>)}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          <button style={{...btn(true),fontSize:11,padding:"4px 10px"}}>⬇ Download</button>
                          <button style={{...btn(false),fontSize:11,padding:"4px 10px"}}>👁 Preview</button>
                        </div>
                      </div>
                    ))}
                    <button style={{...btn(true),fontSize:13}}>+ Upload Material</button>
                  </div>
                </div>
              )}
              {activeTab==="videos"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
                  {[`${activeSubject} Full Lecture Series`,`${(TOPICS[activeSubject][0])} Deep Dive`,`Board Exam Tips for ${activeSubject}`,"Live Review Session Recording"].map((v,i)=>(
                    <div key={v} style={{...card,padding:"14px"}}>
                      <div style={{background:t.border,borderRadius:8,height:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,fontSize:32}}>▶️</div>
                      <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:4}}>{v}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginBottom:8}}>YouTube · 45 min · Uploaded by Admin</div>
                      <div style={{display:"flex",gap:6}}>
                        <button style={{...btn(true),fontSize:11,padding:"4px 10px",flex:1}}>Watch</button>
                        <button style={{...btn(false),fontSize:11,padding:"4px 10px"}}>📌 Save</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="pdfs"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
                  {["PFRS Standards 2024","Board Exam Tips","Past Board Questions","Study Guide","Formula Sheet"].map(pdf=>(
                    <div key={pdf} style={{...card,textAlign:"center",padding:"20px 12px",cursor:"pointer"}}>
                      <div style={{fontSize:32,marginBottom:8}}>📕</div>
                      <div style={{fontSize:12,fontWeight:600,color:t.text}}>{pdf}</div>
                      <div style={{fontSize:11,color:t.textMuted,marginTop:4,marginBottom:8}}>PDF · 2.4 MB</div>
                      <button style={{...btn(true),fontSize:11,padding:"4px 12px",width:"100%"}}>Download</button>
                    </div>
                  ))}
                </div>
              )}
              {(activeTab==="flashcards"||activeTab==="questions"||activeTab==="discuss")&&(
                <div style={{color:t.textMuted,fontSize:14,padding:"20px",textAlign:"center",background:t.highlight,borderRadius:8}}>
                  Navigate to <strong style={{color:t.accent}}>{activeTab==="flashcards"?"Flashcards":activeTab==="questions"?"Question Bank":"Discussions"}</strong> in the sidebar to study {activeSubject} content.
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUESTION BANK */}
        {page==="qbank"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>❓ Question Bank</h1>
            <p style={{color:t.textMuted,marginBottom:20,fontSize:14}}>Practice MCQs with detailed explanations</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{background:t.badge,color:t.badgeText,borderRadius:12,padding:"3px 10px",fontSize:12}}>{MOCK_QUESTIONS[qIdx].subject} · {MOCK_QUESTIONS[qIdx].topic}</div>
                    <div style={{fontSize:12,color:t.textMuted}}>Q {qIdx+1} of {MOCK_QUESTIONS.length}</div>
                  </div>
                  <div style={{display:"flex",gap:4,marginBottom:12}}>
                    {MOCK_QUESTIONS.map((_,i)=>(
                      <div key={i} onClick={()=>{setQIdx(i);setSelected(null);setShowAnswer(false)}} style={{flex:1,height:4,borderRadius:2,background:i===qIdx?t.accent:t.border,cursor:"pointer"}}/>
                    ))}
                  </div>
                  <p style={{fontWeight:600,color:t.text,fontSize:15,lineHeight:1.5,marginBottom:16}}>{MOCK_QUESTIONS[qIdx].q}</p>
                  {MOCK_QUESTIONS[qIdx].options.map((opt,i)=>(
                    <div key={i} onClick={()=>!showAnswer&&setSelected(i)} style={{padding:"10px 14px",borderRadius:8,marginBottom:8,border:`1.5px solid ${selected===i?(showAnswer?i===MOCK_QUESTIONS[qIdx].answer?"#4CAF50":"#e53935":t.accent):t.border}`,background:selected===i?(showAnswer?i===MOCK_QUESTIONS[qIdx].answer?"#E8F5E9":"#FFEBEE":t.accentLight):t.surface,cursor:showAnswer?"default":"pointer",fontSize:14,color:t.text,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:22,height:22,borderRadius:"50%",border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,background:selected===i?t.accent:"transparent",color:selected===i?"#fff":t.textMuted}}>{String.fromCharCode(65+i)}</span>{opt}
                    </div>
                  ))}
                  {!showAnswer&&(
                    <div style={{display:"flex",gap:8}}>
                      <button disabled={selected===null} onClick={()=>setShowAnswer(true)} style={{...btn(true),flex:1,opacity:selected===null?0.5:1}}>Check Answer</button>
                      <button onClick={()=>{setShowMistakeForm(true)}} style={{...btn(false),fontSize:13,padding:"8px 12px"}} title="Add to Mistake Notebook">❌</button>
                    </div>
                  )}
                  {showAnswer&&(
                    <div>
                      <div style={{background:t.highlight,border:`1px solid ${t.accentLight}`,borderRadius:8,padding:"12px 14px",marginTop:8,fontSize:13,color:t.text}}>
                        <div style={{fontWeight:600,color:t.accent,marginBottom:4}}>💡 Explanation</div>
                        <p style={{margin:0,lineHeight:1.6}}>{MOCK_QUESTIONS[qIdx].explanation}</p>
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:10}}>
                        <button onClick={()=>{setQIdx((qIdx+1)%MOCK_QUESTIONS.length);setSelected(null);setShowAnswer(false)}} style={{...btn(true),flex:1}}>Next Question →</button>
                        {selected!==MOCK_QUESTIONS[qIdx].answer&&<button onClick={()=>setMistakeNotes([...mistakeNotes,{q:MOCK_QUESTIONS[qIdx].q,correct:MOCK_QUESTIONS[qIdx].options[MOCK_QUESTIONS[qIdx].answer],note:""}])} style={{...btn(false),fontSize:13}}>Add to ❌ Notebook</button>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:12,color:t.text}}>📈 Your Stats</div>
                  {[["Questions Answered","142"],["Correct","108 (76%)"],["Needs Review","34"],["Bookmarked","12"],["In Mistake Notebook",`${mistakeNotes.length}`]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}>
                      <span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:600,color:t.accent}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>🎯 Filter by Subject</div>
                  {["All Subjects",...SUBJECTS].map((f,i)=>(
                    <button key={f} style={{...btn(i===0),width:"100%",marginBottom:6,textAlign:"left",fontSize:13}}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLASHCARDS */}
        {page==="flashcards"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>🃏 Flashcards</h1>
            <p style={{color:t.textMuted,marginBottom:20,fontSize:14}}>Spaced repetition for formulas, definitions & standards</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
              <div>
                <div onClick={()=>setFcFlipped(!fcFlipped)} style={{background:fcFlipped?t.accent:t.card,border:`2px solid ${t.accentLight}`,borderRadius:16,padding:"48px 32px",textAlign:"center",cursor:"pointer",minHeight:220,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginBottom:16}}>
                  <div style={{fontSize:11,color:fcFlipped?"rgba(255,255,255,0.7)":t.textMuted,marginBottom:12,letterSpacing:2,textTransform:"uppercase"}}>{fcFlipped?"Answer":"Question"} · {FLASHCARDS[fcIdx].subject}</div>
                  <p style={{fontSize:17,fontWeight:600,color:fcFlipped?"#fff":t.text,lineHeight:1.6,margin:0}}>{fcFlipped?FLASHCARDS[fcIdx].back:FLASHCARDS[fcIdx].front}</p>
                  {!fcFlipped&&<div style={{fontSize:12,color:t.textMuted,marginTop:16}}>tap to reveal answer</div>}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
                  <button onClick={()=>{setFcIdx((fcIdx-1+FLASHCARDS.length)%FLASHCARDS.length);setFcFlipped(false)}} style={btn(false)}>← Prev</button>
                  <button onClick={()=>{setFcIdx((fcIdx+1)%FLASHCARDS.length);setFcFlipped(false)}} style={btn(true)}>Next →</button>
                </div>
                <div style={{textAlign:"center",marginBottom:12,fontSize:13,color:t.textMuted}}>Card {fcIdx+1} of {FLASHCARDS.length}</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  {["😕 Hard","😐 Medium","😊 Easy"].map(r=>(
                    <button key={r} style={{...btn(false),fontSize:12,padding:"6px 14px"}} onClick={()=>{setFcIdx((fcIdx+1)%FLASHCARDS.length);setFcFlipped(false)}}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>📚 All Cards</div>
                  {FLASHCARDS.map((fc,i)=>(
                    <div key={i} onClick={()=>{setFcIdx(i);setFcFlipped(false)}} style={{padding:"8px 10px",borderRadius:6,marginBottom:6,background:i===fcIdx?t.accentLight:t.highlight,border:`1px solid ${i===fcIdx?t.accentLight:t.border}`,cursor:"pointer",fontSize:12,color:i===fcIdx?t.accentText:t.text}}>
                      <div style={{fontWeight:600,marginBottom:2}}>{fc.front.length>40?fc.front.slice(0,40)+"...":fc.front}</div>
                      <div style={{fontSize:11,color:t.textMuted}}>{fc.subject}</div>
                    </div>
                  ))}
                  <button style={{...btn(true),width:"100%",fontSize:13,marginTop:4}}>+ Create Flashcard</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOCK EXAM */}
        {page==="mockexam"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📝 Mock Exam</h1>
            <p style={{color:t.textMuted,marginBottom:20,fontSize:14}}>Simulate actual board exam conditions</p>
            {!examStarted&&!examDone&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:16}}>
                  {[{title:"FAR Subject Exam",q:50,time:90,icon:"📊",color:t.subjectColors[0]},{title:"TAX Subject Exam",q:50,time:90,icon:"🧾",color:t.subjectColors[4]},{title:"MAS Subject Exam",q:50,time:90,icon:"📈",color:t.subjectColors[2]},{title:"Full GEE Simulation",q:200,time:360,icon:"🎓",color:t.accentLight}].map((exam)=>(
                    <div key={exam.title} style={{...card,textAlign:"center",padding:"24px 16px",borderTop:`3px solid ${exam.color}`}}>
                      <div style={{fontSize:32,marginBottom:8}}>{exam.icon}</div>
                      <div style={{fontWeight:700,color:t.text,marginBottom:4}}>{exam.title}</div>
                      <div style={{fontSize:13,color:t.textMuted,marginBottom:12}}>{exam.q} questions · {exam.time} mins</div>
                      <button onClick={()=>{setExamStarted(true);setExamAnswers({});setExamDone(false)}} style={{...btn(true),width:"100%"}}>Start Exam</button>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>📋 Past Exam Results</div>
                  {[{exam:"FAR Subject Exam",score:"78%",date:"Jun 1, 2025",pass:true},{exam:"MAS Subject Exam",score:"82%",date:"May 28, 2025",pass:true},{exam:"TAX Subject Exam",score:"65%",date:"May 24, 2025",pass:false}].map((r,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<2?`1px solid ${t.border}`:"none"}}>
                      <span style={{fontSize:16}}>{r.pass?"✅":"❌"}</span>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{r.exam}</div><div style={{fontSize:11,color:t.textMuted}}>{r.date}</div></div>
                      <span style={{fontWeight:700,color:r.pass?"#4CAF50":"#e53935",fontSize:14}}>{r.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {examStarted&&!examDone&&(
              <div>
                <div style={{...card,background:t.accent,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px"}}>
                  <span style={{color:"#fff",fontWeight:600}}>FAR Subject Exam</span>
                  <span style={{color:"#fff",background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",fontSize:13}}>⏱ 87:32 remaining</span>
                </div>
                {MOCK_QUESTIONS.map((mq,qi)=>(
                  <div key={mq.id} style={{...card,marginBottom:12}}>
                    <div style={{fontWeight:600,color:t.text,marginBottom:10,fontSize:14}}>{qi+1}. {mq.q}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {mq.options.map((opt,oi)=>(
                        <div key={oi} onClick={()=>setExamAnswers({...examAnswers,[qi]:oi})} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${examAnswers[qi]===oi?t.accent:t.border}`,background:examAnswers[qi]===oi?t.accentLight:t.surface,cursor:"pointer",fontSize:13,color:t.text}}>
                          <span style={{fontWeight:600,marginRight:6}}>{String.fromCharCode(65+oi)}.</span>{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>{setExamStarted(false);setExamDone(true)}} style={{...btn(true),padding:"12px 32px",fontSize:15}}>Submit Exam</button>
              </div>
            )}
            {examDone&&(
              <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:16}}>🎉</div>
                <h2 style={{fontSize:24,fontWeight:700,color:t.text,marginBottom:8}}>Exam Complete!</h2>
                <div style={{...card,marginBottom:16,textAlign:"left"}}>
                  {[["Score","3 / 6 (50%)"],["Correct Answers","3"],["Wrong Answers","3"],["Time Taken","12 min 34 sec"],["Passing Mark","75%"],["Result","Below Passing ❌"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`,fontSize:14}}>
                      <span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:600,color:k==="Result"?"#e53935":t.accent}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button onClick={()=>setExamDone(false)} style={{...btn(true),padding:"12px 28px"}}>Take Another Exam</button>
                  <button onClick={()=>s("progress")} style={{...btn(false),padding:"12px 28px"}}>View Analytics</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISCUSSIONS */}
        {page==="discussions"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>💬 Discussions</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Ask questions, share insights, upvote answers</p>
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              {["All","FAR","AFAR","MAS","TAX","Auditing"].map(f=>(
                <button key={f} style={{...btn(f==="All"),fontSize:12,padding:"5px 14px"}}>{f}</button>
              ))}
              <button style={{...btn(true),marginLeft:"auto",fontSize:12,padding:"5px 14px"}}>+ Ask Question</button>
            </div>
            {DISCUSSIONS.map(d=>(
              <div key={d.id} style={{...card,marginBottom:16}}>
                <div style={{display:"flex",gap:10,marginBottom:12}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{d.avatar}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:t.text}}>{d.user} <span style={{color:t.textMuted,fontWeight:400}}>asked in</span> <span style={{color:t.accent}}>{d.subject} · {d.topic}</span></div>
                    <div style={{fontSize:12,color:t.textMuted}}>{d.time}</div>
                  </div>
                  <span style={{marginLeft:"auto",background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 10px",fontSize:11,height:"fit-content"}}>{d.answers.length} {d.answers.length===1?"answer":"answers"}</span>
                </div>
                <p style={{fontWeight:600,color:t.text,fontSize:14,lineHeight:1.5,marginBottom:16,paddingLeft:46}}>{d.q}</p>
                <div style={{paddingLeft:46}}>
                  {d.answers.map((ans,ai)=>(
                    <div key={ai} style={{background:t.highlight,borderRadius:8,padding:"12px 14px",marginBottom:8,border:`1px solid ${ans.verified?"#A5D6A7":t.border}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:t.badge,color:t.badgeText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>{ans.avatar}</div>
                        <span style={{fontWeight:600,fontSize:13,color:t.text}}>{ans.user}</span>
                        {ans.verified&&<span style={{background:"#E8F5E9",color:"#2E7D32",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:600}}>✓ Verified</span>}
                      </div>
                      <p style={{fontSize:13,color:t.text,lineHeight:1.6,margin:"0 0 8px"}}>{ans.text}</p>
                      <button onClick={()=>setUpvoted({...upvoted,[`${d.id}-${ai}`]:!upvoted[`${d.id}-${ai}`]})} style={{...btn(upvoted[`${d.id}-${ai}`]),fontSize:11,padding:"3px 10px"}}>
                        👍 {ans.upvotes+(upvoted[`${d.id}-${ai}`]?1:0)} helpful
                      </button>
                    </div>
                  ))}
                  <button style={{...btn(false),fontSize:12}}>💬 Add Answer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTES VAULT */}
        {page==="notes"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📖 Notes Vault</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Your personal notes, organized by subject and topic</p>
            {!activeNote?(
              <div>
                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                  {["All",...SUBJECTS.slice(0,4)].map(f=>(
                    <button key={f} style={{...btn(f==="All"),fontSize:12,padding:"5px 14px"}}>{f}</button>
                  ))}
                  <button style={{...btn(true),marginLeft:"auto",fontSize:12}}>+ New Note</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                  {NOTES.map(n=>(
                    <div key={n.id} onClick={()=>setActiveNote(n)} style={{...card,cursor:"pointer",borderLeft:`3px solid ${t.accent}`,padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:11}}>{n.subject}</span>
                        <span style={{fontSize:11,color:t.textMuted}}>{n.date}</span>
                      </div>
                      <div style={{fontWeight:600,color:t.text,marginBottom:4,fontSize:14}}>{n.title}</div>
                      <div style={{fontSize:12,color:t.textMuted,lineHeight:1.5}}>{n.preview}</div>
                      <div style={{display:"flex",gap:6,marginTop:10}}>
                        <button style={{...btn(true),fontSize:11,padding:"3px 10px"}}>Open</button>
                        <button style={{...btn(false),fontSize:11,padding:"3px 10px"}}>Share</button>
                        <button style={{...btn(false),fontSize:11,padding:"3px 10px"}}>🖨 Print</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <div>
                <button onClick={()=>setActiveNote(null)} style={{...btn(false),marginBottom:16,fontSize:13}}>← Back to Notes</button>
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div>
                      <span style={{background:t.badge,color:t.badgeText,borderRadius:10,padding:"2px 8px",fontSize:11,marginRight:8}}>{activeNote.subject}</span>
                      <span style={{fontSize:12,color:t.textMuted}}>{activeNote.topic} · {activeNote.date}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{...btn(false),fontSize:12,padding:"5px 12px"}}>✏️ Edit</button>
                      <button style={{...btn(false),fontSize:12,padding:"5px 12px"}}>🖨 Print</button>
                      <button style={{...btn(true),fontSize:12,padding:"5px 12px"}}>📤 Export PDF</button>
                    </div>
                  </div>
                  <h2 style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:16}}>{activeNote.title}</h2>
                  <div style={{fontSize:14,color:t.text,lineHeight:1.8,background:t.highlight,borderRadius:8,padding:"16px"}}>{activeNote.preview}<br/><br/><em style={{color:t.textMuted}}>Full note content would appear here in the actual app...</em></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MISTAKE NOTEBOOK */}
        {page==="mistakes"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>❌ Mistake Notebook</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Review your wrong answers and learn from mistakes</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>setShowMistakeForm(!showMistakeForm)} style={btn(true)}>+ Add Mistake</button>
              <button style={btn(false)}>Filter by Subject</button>
            </div>
            {showMistakeForm&&(
              <div style={{...card,marginBottom:16,borderLeft:`3px solid #e53935`}}>
                <div style={{fontWeight:600,marginBottom:10,color:t.text}}>Add Wrong Answer</div>
                <div style={{marginBottom:10}}>
                  <label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:4}}>Question / Topic</label>
                  <input value={newMistake.q} onChange={e=>setNewMistake({...newMistake,q:e.target.value})} placeholder="What was the question?" style={{width:"100%",padding:"8px 12px",border:`1px solid ${t.border}`,borderRadius:6,fontSize:13,background:t.surface,color:t.text,boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:4}}>Correct Answer / Solution</label>
                  <textarea value={newMistake.correct} onChange={e=>setNewMistake({...newMistake,correct:e.target.value})} placeholder="The correct answer is..." rows={2} style={{width:"100%",padding:"8px 12px",border:`1px solid ${t.border}`,borderRadius:6,fontSize:13,background:t.surface,color:t.text,resize:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:t.textMuted,display:"block",marginBottom:4}}>Personal Notes</label>
                  <textarea value={newMistake.note} onChange={e=>setNewMistake({...newMistake,note:e.target.value})} placeholder="Why did I get this wrong? What should I remember?" rows={2} style={{width:"100%",padding:"8px 12px",border:`1px solid ${t.border}`,borderRadius:6,fontSize:13,background:t.surface,color:t.text,resize:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{if(newMistake.q){setMistakeNotes([...mistakeNotes,{...newMistake}]);setNewMistake({q:"",correct:"",note:""});setShowMistakeForm(false)}}} style={btn(true)}>Save Mistake</button>
                  <button onClick={()=>setShowMistakeForm(false)} style={btn(false)}>Cancel</button>
                </div>
              </div>
            )}
            {mistakeNotes.length===0&&!showMistakeForm&&(
              <div style={{textAlign:"center",padding:"48px",background:t.highlight,borderRadius:12,color:t.textMuted}}>
                <div style={{fontSize:40,marginBottom:12}}>✅</div>
                <div style={{fontWeight:600,color:t.text,marginBottom:4}}>No mistakes logged yet!</div>
                <div style={{fontSize:13}}>Add wrong answers from the Question Bank or manually above.</div>
              </div>
            )}
            {mistakeNotes.map((m,i)=>(
              <div key={i} style={{...card,borderLeft:`3px solid #ef9a9a`}}>
                <div style={{fontWeight:600,color:t.text,marginBottom:8,fontSize:14}}>❌ {m.q||"Untitled mistake"}</div>
                {m.correct&&<div style={{background:"#E8F5E9",borderRadius:6,padding:"8px 12px",marginBottom:8,fontSize:13,color:"#2E7D32"}}>✅ <strong>Correct:</strong> {m.correct}</div>}
                {m.note&&<div style={{background:t.highlight,borderRadius:6,padding:"8px 12px",fontSize:13,color:t.text}}>📝 {m.note}</div>}
              </div>
            ))}
          </div>
        )}

        {/* STUDY GROUPS */}
        {page==="groups"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>👥 Study Groups</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Collaborate with fellow CPA reviewees</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button style={btn(true)}>+ Create Group</button>
              <button style={btn(false)}>Browse All</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
              {STUDY_GROUPS.map(g=>(
                <div key={g.id} style={{...card,borderTop:`3px solid ${t.accentLight}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontWeight:700,color:t.text,fontSize:15}}>{g.name}</div>
                    <span style={{background:g.type==="Public"?t.badge:"#FFF3E0",color:g.type==="Public"?t.badgeText:"#E65100",borderRadius:10,padding:"2px 8px",fontSize:11}}>{g.type}</span>
                  </div>
                  <div style={{fontSize:12,color:t.textMuted,marginBottom:6}}>Subject: <strong style={{color:t.accentText}}>{g.subject}</strong> · {g.members} members</div>
                  <div style={{fontSize:12,color:t.accent,marginBottom:12}}>🔥 {g.activity}</div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{...btn(true),flex:1,fontSize:12,padding:"6px 0"}}>Join Group</button>
                    <button style={{...btn(false),fontSize:12,padding:"6px 12px"}}>Preview</button>
                  </div>
                </div>
              ))}
              <div style={{...card,borderTop:`3px solid ${t.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 16px",textAlign:"center",cursor:"pointer",border:`2px dashed ${t.border}`}}>
                <div style={{fontSize:32,marginBottom:8}}>➕</div>
                <div style={{fontWeight:600,color:t.textMuted,marginBottom:4}}>Create New Group</div>
                <div style={{fontSize:12,color:t.textMuted}}>Study with classmates or friends</div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {page==="progress"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📊 Progress Analytics</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Track your mastery across all subjects and topics</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[["142","Questions Answered","❓"],["76%","Accuracy Rate","🎯"],["86h","Study Hours","⏱"],["3","Exams Taken","📝"]].map(([v,l,icon])=>(
                <div key={l} style={{...card,textAlign:"center",padding:"20px"}}>
                  <div style={{fontSize:24,marginBottom:4}}>{icon}</div>
                  <div style={{fontSize:28,fontWeight:700,color:t.accent}}>{v}</div>
                  <div style={{fontSize:12,color:t.textMuted,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:16,color:t.text}}>Subject Mastery</div>
                {SUBJECTS.map((s2,i)=>(
                  <div key={s2} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:t.text,fontWeight:500}}>{s2}</span><span style={{color:t.accent,fontWeight:600}}>{PROGRESS[s2]}%</span></div>
                    <div style={{background:t.border,borderRadius:6,height:8}}>
                      <div style={{width:`${PROGRESS[s2]}%`,background:t.subjectColors[i]||t.progress,borderRadius:6,height:8}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:12,color:t.text}}>⚠️ Weakest Topics</div>
                {[["FAR","Leases",45],["AFAR","Consolidation",38],["Auditing Problems","PPE Audit",42],["RFBT","Negotiable Instruments",50],["TAX","Estate Tax",48]].map(([sub,topic,pct])=>(
                  <div key={topic} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                    <span style={{fontSize:14}}>⚠️</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{topic}</div><div style={{fontSize:11,color:t.textMuted}}>{sub}</div></div>
                    <span style={{color:"#e53935",fontWeight:700,fontSize:13}}>{pct}%</span>
                    <button style={{...btn(true),fontSize:11,padding:"3px 10px"}}>Review</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLANNER */}
        {page==="planner"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>📅 Study Planner</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Plan your path to board exam success</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:12,color:t.text}}>🎯 Target Exam</div>
                  <div style={{background:t.highlight,borderRadius:8,padding:"16px",marginBottom:12,textAlign:"center"}}>
                    <div style={{fontSize:26,fontWeight:700,color:t.accent}}>May 2025</div>
                    <div style={{fontSize:13,color:t.textMuted}}>CPALE Board Exam</div>
                    <div style={{fontSize:14,color:t.accent,marginTop:4,fontWeight:600}}>142 days remaining</div>
                  </div>
                  <div style={{fontSize:13,color:t.textMuted,marginBottom:8}}>Available Study Hours/Day</div>
                  <div style={{display:"flex",gap:8}}>
                    {["2h","4h","6h","8h"].map(h=>(
                      <button key={h} style={{...btn(h==="4h"),flex:1,padding:"6px 0"}}>{h}</button>
                    ))}
                  </div>
                </div>
                <div style={card}>
                  <div style={{fontWeight:600,marginBottom:10,color:t.text}}>📊 Recommended Focus</div>
                  {[["AFAR","Consolidation",38],["Auditing Problems","PPE Audit",42],["FAR","Leases",45]].map(([sub,topic,pct])=>(
                    <div key={topic} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                      <span style={{fontSize:20}}>🔴</span>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{topic}</div><div style={{fontSize:11,color:t.textMuted}}>{sub} · only {pct}% mastered</div></div>
                      <button style={{...btn(true),fontSize:11,padding:"3px 10px"}}>Study</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:12,color:t.text}}>📋 This Week's Tasks</div>
                {[{done:true,task:"FAR – Leases (3 chapters)",day:"Mon",time:"3h"},{done:true,task:"TAX – VAT MCQs x30",day:"Tue",time:"1.5h"},{done:false,task:"MAS – Standard Costing",day:"Wed",time:"2h"},{done:false,task:"AFAR – Consolidation",day:"Thu",time:"3h"},{done:false,task:"Mock Exam – FAR",day:"Fri",time:"2h"},{done:false,task:"Review Weakest Topics",day:"Sat",time:"4h"},{done:false,task:"Rest & Light Review",day:"Sun",time:"1h"}].map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                    <span style={{fontSize:14,flexShrink:0}}>{item.done?"✅":"⬜"}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,color:item.done?t.textMuted:t.text,textDecoration:item.done?"line-through":"none"}}>{item.task}</div><div style={{fontSize:11,color:t.textMuted}}>{item.time}</div></div>
                    <span style={{fontSize:11,color:t.textMuted,background:t.badge,borderRadius:8,padding:"2px 8px"}}>{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {page==="leaderboard"&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:t.text}}>🏆 Leaderboard</h1>
            <p style={{color:t.textMuted,marginBottom:16,fontSize:14}}>Top contributors and highest scorers this month</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:16,color:t.text}}>🌟 Top Students — June 2025</div>
                {[{rank:1,name:"Ana Reyes",school:"UST",points:1240,badge:"🥇"},{rank:2,name:"Mark Santos",school:"DLSU",points:1105,badge:"🥈"},{rank:3,name:"Claire Go",school:"UP Manila",points:980,badge:"🥉"},{rank:4,name:"Bea Torres",school:"FEU",points:875,badge:"🏅"},{rank:5,name:"Juls Domingo",school:"Aussie IT / PH",points:810,badge:"⭐",isYou:true}].map(u=>(
                  <div key={u.rank} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderBottom:`1px solid ${t.border}`,background:u.isYou?t.highlight:"transparent",borderRadius:u.isYou?6:0}}>
                    <span style={{fontSize:18,width:24,textAlign:"center"}}>{u.badge}</span>
                    <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>{u.name.split(" ").map(n=>n[0]).join("")}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:t.text}}>{u.name}{u.isYou&&<span style={{fontSize:11,color:t.accent}}> (you)</span>}</div><div style={{fontSize:11,color:t.textMuted}}>{u.school}</div></div>
                    <div style={{fontWeight:700,color:t.accent,fontSize:14}}>{u.points.toLocaleString()} pts</div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <div style={{fontWeight:600,marginBottom:12,color:t.text}}>🏅 Your Badges</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                  {BADGES.map(b=>(
                    <div key={b.label} style={{textAlign:"center",padding:"14px 8px",borderRadius:10,opacity:b.earned?1:0.4,border:`1px solid ${b.earned?t.accent:t.border}`,background:b.earned?t.highlight:t.surface}}>
                      <div style={{fontSize:24}}>{b.icon}</div>
                      <div style={{fontSize:11,color:t.text,marginTop:4,fontWeight:500}}>{b.label}</div>
                      <div style={{fontSize:10,color:b.earned?"#4CAF50":t.textMuted,marginTop:2}}>{b.earned?"Earned":"Locked"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}