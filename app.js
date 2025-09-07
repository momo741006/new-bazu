/* 🌈 虹靈御所 - 八字人生兵法 app.js (完整前端可用版) */


/* === 常量與對照 === */
const TIAN_GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const DI_ZHI   = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const WU_XING_GAN = { "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水" };
const WU_XING_ZHI = { "子":"水","丑":"土","寅":"木","卯":"木","辰":"土","巳":"火","午":"火","未":"土","申":"金","酉":"金","戌":"土","亥":"水" };
const YIN_YANG_GAN = { "甲":"陽","乙":"陰","丙":"陽","丁":"陰","戊":"陽","己":"陰","庚":"陽","辛":"陰","壬":"陽","癸":"陰" };
const YIN_YANG_ZHI = { "子":"陽","丑":"陰","寅":"陽","卯":"陰","辰":"陽","巳":"陰","午":"陽","未":"陰","申":"陽","酉":"陰","戌":"陽","亥":"陰" };


/* 五虎遁月（年干→寅月起干），月支序 */
const MONTH_GAN_MAP = {
  '甲': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '乙': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '丙': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '丁': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  '戊': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
  '己': ['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
  '庚': ['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
  '辛': ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
  '壬': ['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  '癸': ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙']
};


/* 五鼠遁時 */
const HOUR_TO_ZHI_MAP = {
  23:"子",0:"子",1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",9:"巳",10:"巳",
  11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"
};
const WU_SHU_DUN_SHI_MAP = { "甲":"甲","己":"甲","乙":"丙","庚":"丙","丙":"戊","辛":"戊","丁":"庚","壬":"庚","戊":"壬","癸":"壬" };


/* 藏干與權重（簡化可用） */
const CANG_GAN = {
  "子":[{g:"癸",w:1.0}],
  "丑":[{g:"己",w:0.6},{g:"癸",w:0.3},{g:"辛",w:0.3}],
  "寅":[{g:"甲",w:0.6},{g:"丙",w:0.3},{g:"戊",w:0.3}],
  "卯":[{g:"乙",w:1.0}],
  "辰":[{g:"戊",w:0.6},{g:"乙",w:0.3},{g:"癸",w:0.3}],
  "巳":[{g:"丙",w:0.6},{g:"戊",w:0.3},{g:"庚",w:0.3}],
  "午":[{g:"丁",w:0.6},{g:"己",w:0.4}],
  "未":[{g:"己",w:0.6},{g:"丁",w:0.3},{g:"乙",w:0.3}],
  "申":[{g:"庚",w:0.6},{g:"壬",w:0.3},{g:"戊",w:0.3}],
  "酉":[{g:"辛",w:1.0}],
  "戌":[{g:"戊",w:0.6},{g:"辛",w:0.3},{g:"丁",w:0.3}],
  "亥":[{g:"壬",w:0.6},{g:"甲",w:0.4}]
};


/* 60 甲子納音（最小表） */
const NAYIN = {
"甲子":"海中金","乙丑":"海中金","丙寅":"爐中火","丁卯":"爐中火","戊辰":"大林木","己巳":"大林木",
"庚午":"路旁土","辛未":"路旁土","壬申":"劍鋒金","癸酉":"劍鋒金","甲戌":"山頭火","乙亥":"山頭火",
"丙子":"澗下水","丁丑":"澗下水","戊寅":"城頭土","己卯":"城頭土","庚辰":"白蠟金","辛巳":"白蠟金",
"壬午":"楊柳木","癸未":"楊柳木","甲申":"泉中水","乙酉":"泉中水","丙戌":"屋上土","丁亥":"屋上土",
"戊子":"霹靂火","己丑":"霹靂火","庚寅":"松柏木","辛卯":"松柏木","壬辰":"長流水","癸巳":"長流水",
"甲午":"沙中金","乙未":"沙中金","丙申":"山下火","丁酉":"山下火","戊戌":"平地木","己亥":"平地木",
"庚子":"壁上土","辛丑":"壁上土","壬寅":"金箔金","癸卯":"金箔金","甲辰":"覆燈火","乙巳":"覆燈火",
"丙午":"天河水","丁未":"天河水","戊申":"大驛土","己酉":"大驛土","庚戌":"釵釧金","辛亥":"釵釧金",
"壬子":"桑柘木","癸丑":"桑柘木","甲寅":"大溪水","乙卯":"大溪水","丙辰":"沙中土","丁巳":"沙中土",
"戊午":"天上火","己未":"天上火","庚申":"石榴木","辛酉":"石榴木","壬戌":"大海水","癸亥":"大海水"
};


/* 角色名（可擴充） */
const GAN_ROLE = {
  "甲":"森林將軍","乙":"花草軍師","丙":"烈日戰神","丁":"燭光法師","戊":"山岳守護",
  "己":"大地母親","庚":"鋼鐵騎士","辛":"珠寶商人","壬":"江河船長","癸":"甘露天使"
};
const ZHI_ROLE = {
  "子":"夜行刺客","丑":"忠犬守衛","寅":"森林獵人","卯":"春兔使者","辰":"龍族法師","巳":"火蛇術士",
  "午":"烈馬騎兵","未":"溫羊牧者","申":"靈猴戰士","酉":"金雞衛士","戌":"戰犬統領","亥":"海豚智者"
};


/* === 工具 === */
function setText(id, txt){ const el=document.getElementById(id); if (el) el.textContent = txt; }
function fmtPillars(ps){ return `${ps.year.pillar} ${ps.month.pillar} ${ps.day.pillar} ${ps.hour.pillar}`; }


/* 節氣分月（近似足夠準確） */
function monthZhiBySolarTerm(y,m,d){
  const dt = new Date(y, m-1, d);
  const stamp = (mm,dd)=> new Date(y,mm-1,dd);
  const map = [
    {term:"小寒",date:stamp(1,6), zhi:"丑"},
    {term:"立春",date:stamp(2,4), zhi:"寅"},
    {term:"驚蟄",date:stamp(3,5), zhi:"卯"},
    {term:"清明",date:stamp(4,4), zhi:"辰"},
    {term:"立夏",date:stamp(5,5), zhi:"巳"},
    {term:"芒種",date:stamp(6,5), zhi:"午"},
    {term:"小暑",date:stamp(7,7), zhi:"未"},
    {term:"立秋",date:stamp(8,7), zhi:"申"},
    {term:"白露",date:stamp(9,7), zhi:"酉"},
    {term:"寒露",date:stamp(10,8),zhi:"戌"},
    {term:"立冬",date:stamp(11,7),zhi:"亥"},
    {term:"大雪",date:stamp(12,7),zhi:"子"},
  ];
  let last = map[0];
  for (let i=0;i<map.length;i++){ if (dt >= map[i].date) last = map[i]; }
  return last.zhi;
}


/* === 四柱計算 === */
function calculateYearPillar(year, month, day) {
  const lichun = new Date(year,1,4); // 2/4（近似）
  const d = new Date(year,month-1,day);
  const actualYear = d >= lichun ? year : year - 1;
  const gan = TIAN_GAN[(actualYear - 4) % 10];
  const zhi = DI_ZHI[(actualYear - 4) % 12];
  return {gan,zhi,pillar:gan+zhi};
}
function calculateMonthPillar(yearGan, year, month, day) {
  const zhiSeq = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
  const monthZhi = monthZhiBySolarTerm(year,month,day);
  const idx = zhiSeq.indexOf(monthZhi);
  const gan = MONTH_GAN_MAP[yearGan][idx];
  return {gan,zhi:monthZhi,pillar:gan+monthZhi};
}
function calculateDayPillar(y,m,d) {
  const base = new Date(1985,8,22); // 甲子
  const target = new Date(y,m-1,d);
  const diff = Math.floor((target-base)/(24*60*60*1000));
  const gan = TIAN_GAN[(diff%10+10)%10];
  const zhi = DI_ZHI[(diff%12+12)%12];
  return {gan,zhi,pillar:gan+zhi};
}
function calculateHourPillar(hour, dayGan) {
  const zhi = HOUR_TO_ZHI_MAP[hour];
  const baseGan = WU_SHU_DUN_SHI_MAP[dayGan];
  const baseIdx = TIAN_GAN.indexOf(baseGan);
  const zhiIdx = DI_ZHI.indexOf(zhi);
  const gan = TIAN_GAN[(baseIdx+zhiIdx)%10];
  return {gan,zhi,pillar:gan+zhi};
}/* === 十神 === */
function sheng(a,b){ return (a==="木"&&b==="火")||(a==="火"&&b==="土")||(a==="土"&&b==="金")||(a==="金"&&b==="水")||(a==="水"&&b==="木"); }
function ke(a,b){ return (a==="木"&&b==="土")||(a==="土"&&b==="水")||(a==="水"&&b==="火")||(a==="火"&&b==="金")||(a==="金"&&b==="木"); }
function getTenGod(dayGan, otherGan) {
  const de = WU_XING_GAN[dayGan], oe = WU_XING_GAN[otherGan];
  const dy = YIN_YANG_GAN[dayGan], oy = YIN_YANG_GAN[otherGan];
  if (de === oe) return dy === oy ? "比肩" : "劫財";
  if (sheng(de, oe)) return dy === oy ? "食神" : "傷官";
  if (sheng(oe, de)) return dy === oy ? "偏印" : "正印";
  if (ke(de, oe)) return dy === oy ? "偏財" : "正財";
  if (ke(oe, de)) return dy === oy ? "七殺" : "正官";
  return "未知";
}
function calculateTenGods(dayGan, otherGans){ return otherGans.map(g=>`${g}:${getTenGod(dayGan,g)}`); }


/* === 神煞（天乙/桃花/驛馬） === */
function shensha_tianyiguiren(dayGan){
  return { "甲":["丑","未"], "戊":["丑","未"], "乙":["子","申"], "己":["子","申"],
           "丙":["亥","酉"], "丁":["亥","酉"], "庚":["寅","午"], "辛":["寅","午"],
           "壬":["卯","巳"], "癸":["卯","巳"] }[dayGan] || [];
}
function shensha_taohua(baseZhi){
  const map = {"申":"酉","子":"酉","辰":"酉","寅":"卯","午":"卯","戌":"卯","巳":"午","酉":"午","丑":"午","亥":"子","卯":"子","未":"子"};
  return map[baseZhi];
}
function shensha_yima(baseZhi){
  const map = {"申":"寅","子":"寅","辰":"寅","寅":"申","午":"申","戌":"申","巳":"亥","酉":"亥","丑":"亥","亥":"巳","卯":"巳","未":"巳"};
  return map[baseZhi];
}
function calculateShensha(p){
  const list = [];
  const tmap = shensha_tianyiguiren(p.day.gan);
  Object.values(p).forEach(x=>{ if (tmap.includes(x.zhi) && !list.includes("天乙貴人")) list.push("天乙貴人"); });
  const peach = shensha_taohua(p.year.zhi);
  Object.values(p).forEach(x=>{ if (x.zhi===peach && !list.includes("桃花")) list.push("桃花"); });
  const yima = shensha_yima(p.year.zhi);
  Object.values(p).forEach(x=>{ if (x.zhi===yima && !list.includes("驛馬")) list.push("驛馬"); });
  return list.length ? list : ["（本盤暫無核心神煞）"];
}


/* === 五行統計 === */
function calcFiveElementPower(p){
  const t = {木:0,火:0,土:0,金:0,水:0};
  Object.values(p).forEach(x=>{ t[WU_XING_GAN[x.gan]] += 1.0; });
  Object.values(p).forEach(x=>{
    t[WU_XING_ZHI[x.zhi]] += 0.8;
    (CANG_GAN[x.zhi]||[]).forEach(({g,w})=>{ t[WU_XING_GAN[g]] += w; });
  });
  return t;
}
function calcYinYangCount(p){
  let yin=0,yang=0;
  Object.values(p).forEach(x=>{
    if (YIN_YANG_GAN[x.gan]==="陽") yang++; else yin++;
    if (YIN_YANG_ZHI[x.zhi]==="陽") yang++; else yin++;
  });
  return {陰:yin,陽:yang};
}


/* === 主流程 === */
async function generateBazi({yyyy,mm,dd,hh}){
  const yearP = calculateYearPillar(yyyy,mm,dd);
  const monthP = calculateMonthPillar(yearP.gan,yyyy,mm,dd);
  const dayP = calculateDayPillar(yyyy,mm,dd);
  const hourP = calculateHourPillar(hh,dayP.gan);
  return { pillars:{year:yearP,month:monthP,day:dayP,hour:hourP}, bazi: fmtPillars({year:yearP,month:monthP,day:dayP,hour:hourP}) };
}
/* === 軍團卡 + 故事 === */
async function fetchStory(prompt){
  // 2 秒超時 + fallback，API 不存在也不會卡
  const controller = new AbortController();
  const to = setTimeout(()=>controller.abort(), 2000);
  try{
    const r = await fetch("/api/story",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt}),signal:controller.signal});
    clearTimeout(to);
    const data = await r.json();
    return data?.story?.trim() || "主將調兵遣將，軍師審局而謀，穩紮穩打，先立不敗。";
  }catch(_){
    clearTimeout(to);
    const bank = [
      "營火搖曳，隊伍在密語與旗語中前進，穩中求進，靜待破口。",
      "刀鋒入鞘，聲息全無，軍團以穩為先，見好就收，不與命運硬碰。",
      "鼓聲低鳴，主將按兵不動，軍師布子成網，一擊即中。"
    ];
    return bank[Math.floor(Math.random()*bank.length)];
  }
}
function renderArmyCard(targetId, label, gan, zhi){
  const el = document.getElementById(targetId); if (!el) return;
  const commander = GAN_ROLE[gan] || gan; const strategist = ZHI_ROLE[zhi] || zhi;
  el.innerHTML = `
    <div class="army-card-head">${label}軍團</div>
    <div class="army-card-body">
      <div class="army-roles">主將：${gan}（${commander}） 軍師：${zhi}（${strategist}）</div>
      <div class="army-badges"><span class="badge">納音：${NAYIN[gan+zhi] || "未知"}</span></div>
      <div class="army-advice">一句話建議：穩中求進、先立不敗。</div>
      <div class="army-story" id="${targetId}-story">生成中…</div>
      <button class="story-toggle-btn" data-target="${targetId}-story">展開/收合</button>
    </div>`;
  el.querySelector(".story-toggle-btn").addEventListener("click", (e)=>{
    const sid = e.currentTarget.getAttribute("data-target");
    const sEl = document.getElementById(sid);
    sEl.classList.toggle("expanded");
  });
}
async function fillArmyCards(p){
  renderArmyCard("army-year","家族", p.year.gan, p.year.zhi);
  renderArmyCard("army-month","成長", p.month.gan, p.month.zhi);
  renderArmyCard("army-day","本我", p.day.gan, p.day.zhi);
  renderArmyCard("army-hour","未來", p.hour.gan, p.hour.zhi);


  const prompts = {
    year:`請用RPG敘事，描寫以「${GAN_ROLE[p.year.gan]||p.year.gan}」為主將、「${ZHI_ROLE[p.year.zhi]||p.year.zhi}」為軍師的家族軍團，100~150字，中文。`,
    month:`請用RPG敘事，描寫以「${GAN_ROLE[p.month.gan]||p.month.gan}」為主將、「${ZHI_ROLE[p.month.zhi]||p.month.zhi}」為軍師的成長軍團，100~150字，中文。`,
    day:`請用RPG敘事，描寫以「${GAN_ROLE[p.day.gan]||p.day.gan}」為主將、「${ZHI_ROLE[p.day.zhi]||p.day.zhi}」為軍師的本我軍團，100~150字，中文。`,
    hour:`請用RPG敘事，描寫以「${GAN_ROLE[p.hour.gan]||p.hour.gan}」為主將、「${ZHI_ROLE[p.hour.zhi]||p.hour.zhi}」為軍師的未來軍團，100~150字，中文。`,
  };
  const [sY,sM,sD,sH] = await Promise.all([
    fetchStory(prompts.year), fetchStory(prompts.month),
    fetchStory(prompts.day),  fetchStory(prompts.hour)
  ]);
  setText("army-year-story", sY); setText("army-month-story", sM);
  setText("army-day-story", sD);  setText("army-hour-story", sH);
}


/* === 圖表 === */
let yinYangChart=null, wuxingChart=null;
function renderAnalysisCharts(p){
  const yinYang = calcYinYangCount(p);
  const wuxing = calcFiveElementPower(p);


  const yyCtx = document.getElementById("yin-yang-chart").getContext("2d");
  if (yinYangChart) yinYangChart.destroy();
  yinYangChart = new Chart(yyCtx,{ type:"bar",
    data:{ labels:["陰","陽"], datasets:[{label:"陰陽平衡", data:[yinYang.陰, yinYang.陽]}] },
    options:{ responsive:true, plugins:{legend:{display:false}} }
  });


  const wxCtx = document.getElementById("wuxing-chart").getContext("2d");
  if (wuxingChart) wuxingChart.destroy();
  const labels=["木","火","土","金","水"]; const data=labels.map(k=>wuxing[k]);
  wuxingChart = new Chart(wxCtx,{ type:"radar",
    data:{ labels, datasets:[{ label:"五行力量", data }] },
    options:{ responsive:true, scales:{ r:{ beginAtZero:true } } }
  });


  setText("analysis-career", `事業：土 ${wuxing.土.toFixed(1)}（穩定度）`);
  setText("analysis-love",   `愛情：木 ${wuxing.木.toFixed(1)}（成長/包容） 火 ${wuxing.火.toFixed(1)}（表達）`);
  setText("analysis-money",  `財運：金 ${wuxing.金.toFixed(1)}（資源/效率）`);
  setText("analysis-mind",   `心理：水 ${wuxing.水.toFixed(1)}（思考/彈性）`);
}


/* === 表單處理 === */
function getDaysInMonth(y,m){ return new Date(y, m, 0).getDate(); }
function fillRange(sel, start, end, pad=false){
  sel.innerHTML = ""; for(let v=start; v<=end; v++){ const o=document.createElement("option");
    o.value=String(v); o.textContent=pad?String(v).padStart(2,"0"):String(v); sel.appendChild(o); }
}
function readBirthFromForm(){
  const ySel = document.getElementById("year-select");
  const moSel= document.getElementById("month-select");
  const dSel = document.getElementById("day-select");
  const hSel = document.getElementById("hour-select");
  const miSel= document.getElementById("minute-select");
  const zSel = document.getElementById("zishi-mode");
  if (!ySel||!moSel||!dSel||!hSel||!miSel) throw new Error("表單欄位缺失");
  const yyyy=Number(ySel.value), mm=Number(moSel.value), dd=Number(dSel.value);
  const hh=Number(hSel.value), minute=Number(miSel.value);
  const zMode = zSel?.value || "late";
  return { yyyy, mm, dd, hh, minute, zMode };
}
function adjustDateForZiMode({y,m,d,hh}, mode){
  let addNext=false;
  if (mode==="late"){ if (hh===23) addNext=true; }       // 晚子：23:00→次日
  else if (mode==="full"){ if (hh===23||hh===0) addNext=true; } // 整個子時：23:00–00:59→次日
  if (!addNext) return { y,m,d,hh };
  const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+1);
  return { y:dt.getFullYear(), m:dt.getMonth()+1, d:dt.getDate(), hh };
}/* === 啟動 === */
document.addEventListener("DOMContentLoaded", ()=>{
  // 1) 初始化下拉
  const ySel = document.getElementById("year-select");
  const moSel= document.getElementById("month-select");
  const dSel = document.getElementById("day-select");
  const hSel = document.getElementById("hour-select");
  const miSel= document.getElementById("minute-select");
  const zSel = document.getElementById("zishi-mode");


  // 年 1900-2100
  fillRange(ySel, 1900, 2100, false);
  // 月 1-12
  fillRange(moSel, 1, 12, true);
  // 時 0-23
  fillRange(hSel, 0, 23, true);
  // 分 0-59
  fillRange(miSel, 0, 59, true);


  // 預設：今天（或你要的測試值）
  const now=new Date();
  ySel.value = now.getFullYear();
  moSel.value = String(now.getMonth()+1);
  const resetDays = ()=>{ fillRange(dSel, 1, getDaysInMonth(Number(ySel.value), Number(moSel.value)), true); };
  ySel.addEventListener("change", resetDays);
  moSel.addEventListener("change", resetDays);
  resetDays();
  dSel.value = String(now.getDate()).padStart(2,"0");
  hSel.value = String(now.getHours()).padStart(2,"0");
  miSel.value= String(now.getMinutes()).padStart(2,"0");


  // 預設「晚子」，並記住選擇
  const saved = localStorage.getItem("zishi-mode");
  zSel.value = (saved==="none"||saved==="late"||saved==="full") ? saved : "late";
  zSel.addEventListener("change", ()=>localStorage.setItem("zishi-mode", zSel.value));


  // 2) Submit
  const form = document.getElementById("input-form");
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    try{
      const birth = readBirthFromForm();
      const adj = adjustDateForZiMode({y:birth.yyyy,m:birth.mm,d:birth.dd,hh:birth.hh}, birth.zMode);


      // 計算
      const result = await generateBazi({ yyyy:adj.y, mm:adj.m, dd:adj.d, hh:birth.hh, minute:birth.minute });


      // 四柱
      setText("bazi-pillars", "四柱：" + fmtPillars(result.pillars));
      // 十神
      const tenGods = calculateTenGods(result.pillars.day.gan, [result.pillars.year.gan,result.pillars.month.gan,result.pillars.hour.gan]);
      setText("bazi-tengods","十神："+tenGods.join("，"));
      // 納音
      const nY=NAYIN[result.pillars.year.pillar]||"未知";
      const nM=NAYIN[result.pillars.month.pillar]||"未知";
      const nD=NAYIN[result.pillars.day.pillar]||"未知";
      const nH=NAYIN[result.pillars.hour.pillar]||"未知";
      setText("bazi-nayin",`納音：年(${nY}) 月(${nM}) 日(${nD}) 時(${nH})`);
      // 神煞
      const sh = calculateShensha(result.pillars);
      setText("bazi-shensha","神煞："+(sh?.length?sh.join("，"):"—"));


      // 軍團 + 故事
      await fillArmyCards(result.pillars);


      // 圖表
      renderAnalysisCharts(result.pillars);


      // 標注本次子時模式
      const modeLabel = birth.zMode==="late"?"晚子換日":birth.zMode==="full"?"整個子時換日":"不換日";
      const pe = document.getElementById("bazi-pillars");
      if (pe) pe.textContent = pe.textContent.replace(/^四柱：/, `四柱（${modeLabel}）：`);


      // 切頁
      if (typeof switchPageSafe==="function") switchPageSafe("bazi");
      window.scrollTo({top:0,behavior:"smooth"});


    }catch(err){
      console.error(err);
      alert("計算失敗："+(err.message||err));
    }
  });

});
/* ====== 粒子背景（#particles-bg） ====== */
(function initParticles(){
  const host = document.getElementById('particles-bg');
  if (!host) return;
  const cvs = document.createElement('canvas'); host.appendChild(cvs);
  const ctx = cvs.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  let W,H,pts;

  function resize(){ W = cvs.width = innerWidth*DPR; H = cvs.height = innerHeight*DPR; cvs.style.width = innerWidth+'px'; cvs.style.height = innerHeight+'px';
    // 依螢幕大小動態生成點數
    const count = Math.round((innerWidth*innerHeight)/16000);
    pts = new Array(count).fill(0).map(()=>({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-.5)*0.25*DPR, vy:(Math.random()-.5)*0.25*DPR,
      r: Math.random()*1.2*DPR + .3*DPR, a: Math.random()*0.6 + 0.2
    }));
  }
  window.addEventListener('resize', resize); resize();

  function tick(){
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation = 'lighter';
    for(const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>W) p.vx*=-1; if (p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      const c1 = 'rgba(0,230,255,'+p.a+')', c2='rgba(124,92,255,'+p.a+')';
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6); g.addColorStop(0,c1); g.addColorStop(1,c2);
      ctx.fillStyle = g; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ====== 打字機效果 ====== */
function typewriterEffect(el, fullText, speed=18){
  if(!el) return; el.textContent = '';
  const arr = Array.from(fullText); let i=0;
  function step(){ if(i<=arr.length){ el.textContent = arr.slice(0,i++).join(''); requestAnimationFrame(step) } }
  step();
}

/* ====== 將故事改為打字呈現 + 卡片進場 ====== */
const _fillArmyCards = fillArmyCards; // 保留原函式參考
fillArmyCards = async function(pillars){
  // 1) 容器加上 reveal-stagger 讓卡片進場有延遲
  const wrap = document.querySelector('.army-container');
  if (wrap) wrap.classList.add('reveal-stagger');

  // 2) 呼叫原有流程（會先建立四張卡）
  await _fillArmyCards(pillars);

  // 3) 對每張卡的故事走打字機
  ['year','month','day','hour'].forEach((k, idx)=>{
    const el = document.getElementById(`army-${k}-story`);
    if(el){ setTimeout(()=> typewriterEffect(el, el.textContent, 20), 180 + idx*140); }
  });
};
