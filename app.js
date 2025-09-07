/* 🌈 虹靈御所 - 八字人生兵法 app.js (全功能整合版) */
/* ===========================================
   這份檔案做了什麼：
   1) 表單提交 -> 計算四柱 -> 自動跳「八字排盤」
   2) 填入：四柱、十神、納音、神煞
   3) 生成：四時軍團卡 + AI故事（/api/story，失敗則fallback）
   4) 詳細分析：陰陽長條、五行雷達（含藏干）
   5) 內建 60 甲子納音對照、神煞(天乙/桃花/驛馬)查法、藏干權重
   6) 月柱：節氣分月（採精準度足以通用的近似日，覆蓋常見邊界）
   =========================================== */


/* === 常量與對照 === */
const TIAN_GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const DI_ZHI   = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const WU_XING_GAN = { "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水" };
const WU_XING_ZHI = { "子":"水","丑":"土","寅":"木","卯":"木","辰":"土","巳":"火","午":"火","未":"土","申":"金","酉":"金","戌":"土","亥":"水" };
const YIN_YANG_GAN = { "甲":"陽","乙":"陰","丙":"陽","丁":"陰","戊":"陽","己":"陰","庚":"陽","辛":"陰","壬":"陽","癸":"陰" };
const YIN_YANG_ZHI = { "子":"陽","丑":"陰","寅":"陽","卯":"陰","辰":"陽","巳":"陰","午":"陽","未":"陰","申":"陽","酉":"陰","戌":"陽","亥":"陰" };


/* 五虎遁月（年干→寅月起干），月支序：寅卯辰巳午未申酉戌亥子丑 */
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


/* 地支藏干（主氣/中氣/餘氣）與權重（主0.6 中0.3 餘0.3，午/子等單氣=1.0） */
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


/* 60 甲子納音對照（最小可用表，覆蓋所有） */
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


* 角色名（可擴充） */
const GAN_ROLE = {
  "甲":"森林將軍","乙":"花草軍師","丙":"烈日戰神","丁":"燭光法師","戊":"山岳守護",
  "己":"大地母親","庚":"鋼鐵騎士","辛":"珠寶商人","壬":"江河船長","癸":"甘露天使"
};
const ZHI_ROLE = {
  "子":"夜行刺客","丑":"忠犬守衛","寅":"森林獵人","卯":"春兔使者","辰":"龍族法師","巳":"火蛇術士",
  "午":"烈馬騎兵","未":"溫羊牧者","申":"靈猴戰士","酉":"金雞衛士","戌":"戰犬統領","亥":"海豚智者"
};


/* === 實用工具 === */
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function fmtPillars(ps){ return `${ps.year.pillar} ${ps.month.pillar} ${ps.day.pillar} ${ps.hour.pillar}`; }


/* === 節氣分月（近似足夠準確，覆蓋常見邊界） ===
   立春 2/4、驚蟄 3/5、清明 4/4、立夏 5/5、芒種 6/5、小暑 7/7、
   立秋 8/7、白露 9/7、寒露 10/8、立冬 11/7、大雪 12/7、小寒 1/6
   月支隨節氣：小寒→丑，立春→寅，驚蟄→卯 … 寒露→戌 … 大雪→子
*/
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
  // 找到最後一個 <= dt 的節氣
  let last = map[0];
  for (let i=0;i<map.length;i++){
    if (dt >= map[i].date) last = map[i];
  }
  return last.zhi;
}


/* === 四柱計算 === */
// 年柱：立春分年
function calculateYearPillar(year, month, day) {
  const lichun = new Date(year,1,4); // 2/4
  const d = new Date(year,month-1,day);
  const actualYear = d >= lichun ? year : year - 1;
  const gan = TIAN_GAN[(actualYear - 4) % 10];
  const zhi = DI_ZHI[(actualYear - 4) % 12];
  return {gan,zhi,pillar:gan+zhi};
}
// 月柱：節氣分月 + 五虎遁
function calculateMonthPillar(yearGan, year, month, day) {
  const zhiSeq = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
  const monthZhi = monthZhiBySolarTerm(year,month,day);
  const idx = zhiSeq.indexOf(monthZhi);
  const gan = MONTH_GAN_MAP[yearGan][idx];
  return {gan,zhi:monthZhi,pillar:gan+monthZhi};
}
// 日柱：1985-09-22 甲子基準
function calculateDayPillar(y,m,d) {
  const base = new Date(1985,8,22); // 甲子
  const target = new Date(y,m-1,d);
  const diff = Math.floor((target-base)/(24*60*60*1000));
  const gan = TIAN_GAN[(diff%10+10)%10];
  const zhi = DI_ZHI[(diff%12+12)%12];
  return {gan,zhi,pillar:gan+zhi};
}
// 時柱：五鼠遁 + 子時
function calculateHourPillar(hour, dayGan) {
  const zhi = HOUR_TO_ZHI_MAP[hour];
  const baseGan = WU_SHU_DUN_SHI_MAP[dayGan];
  const baseIdx = TIAN_GAN.indexOf(baseGan);
  const zhiIdx = DI_ZHI.indexOf(zhi);
  const gan = TIAN_GAN[(baseIdx+zhiIdx)%10];
  return {gan,zhi,pillar:gan+zhi};
}


/* === 十神 === */
function sheng(a,b){
  return (a==="木"&&b==="火")||(a==="火"&&b==="土")||(a==="土"&&b==="金")||(a==="金"&&b==="水")||(a==="水"&&b==="木");
}
function ke(a,b){
  return (a==="木"&&b==="土")||(a==="土"&&b==="水")||(a==="水"&&b==="火")||(a==="火"&&b==="金")||(a==="金"&&b==="木");
}
function getTenGod(dayGan, otherGan) {
  const dayEl = WU_XING_GAN[dayGan], otherEl = WU_XING_GAN[otherGan];
  const dayYY = YIN_YANG_GAN[dayGan], otherYY = YIN_YANG_GAN[otherGan];
  if (dayEl === otherEl) return dayYY === otherYY ? "比肩" : "劫財";
  if (sheng(dayEl, otherEl)) return dayYY === otherYY ? "食神" : "傷官";
  if (sheng(otherEl, dayEl)) return dayYY === otherYY ? "偏印" : "正印";
  if (ke(dayEl, otherEl)) return dayYY === otherYY ? "偏財" : "正財";
  if (ke(otherEl, dayEl)) return dayYY === otherYY ? "七殺" : "正官";
  return "未知";
}
function calculateTenGods(dayGan, otherGans) {
  return otherGans.map(g=>`${g}:${getTenGod(dayGan,g)}`);
}


/* === 神煞（核心三項：天乙貴人 / 桃花 / 驛馬） === */
function shensha_tianyiguiren(dayGan){
  return {
    "甲":["丑","未"], "戊":["丑","未"],
    "乙":["子","申"], "己":["子","申"],
    "丙":["亥","酉"], "丁":["亥","酉"],
    "庚":["寅","午"], "辛":["寅","午"],
    "壬":["卯","巳"], "癸":["卯","巳"]
  }[dayGan] || [];
}
function shensha_taohua(baseZhi){ // 以年支/日支定局，這裡以年支為主
  // 申子辰→酉，寅午戌→卯，巳酉丑→午，亥卯未→子
  const group = {
    "申":"酉","子":"酉","辰":"酉",
    "寅":"卯","午":"卯","戌":"卯",
    "巳":"午","酉":"午","丑":"午",
    "亥":"子","卯":"子","未":"子"
  };
  return group[baseZhi];
}
function shensha_yima(baseZhi){ // 申子辰→寅，寅午戌→申，巳酉丑→亥，亥卯未→巳
  const map = {
    "申":"寅","子":"寅","辰":"寅",
    "寅":"申","午":"申","戌":"申",
    "巳":"亥","酉":"亥","丑":"亥",
    "亥":"巳","卯":"巳","未":"巳"
  };
  return map[baseZhi];
}
function calculateShensha(pillars){
  const list = [];
  // 天乙貴人：以「日干」查，落在年/月/日/時支即生效
  const tmap = shensha_tianyiguiren(pillars.day.gan);
  Object.values(pillars).forEach(p=>{
    if (tmap.includes(p.zhi) && !list.includes("天乙貴人")) list.push("天乙貴人");
  });
  // 桃花：以年支為主查，其餘支若含桃花位則記
  const peachPos = shensha_taohua(pillars.year.zhi);
  Object.values(pillars).forEach(p=>{
    if (p.zhi===peachPos && !list.includes("桃花")) list.push("桃花");
  });
  // 驛馬：以年支為主查
  const yimaPos = shensha_yima(pillars.year.zhi);
  Object.values(pillars).forEach(p=>{
    if (p.zhi===yimaPos && !list.includes("驛馬")) list.push("驛馬");
  });
  return list.length ? list : ["（本盤暫無核心神煞）"];
}


/* === 五行統計（含藏干） === */
function calcFiveElementPower(pillars){
  const total = {木:0,火:0,土:0,金:0,水:0};
  // 干：每干 1.0
  Object.values(pillars).forEach(p=>{
    total[WU_XING_GAN[p.gan]] += 1.0;
  });
  // 支：本支 0.8
  Object.values(pillars).forEach(p=>{
    total[WU_XING_ZHI[p.zhi]] += 0.8;
    // 藏干加權
    const arr = CANG_GAN[p.zhi] || [];
    arr.forEach(({g,w})=>{
      total[WU_XING_GAN[g]] += w;
    });
  });
  return total;
}
function calcYinYangCount(pillars){
  let yin=0,yang=0;
  Object.values(pillars).forEach(p=>{
    if (YIN_YANG_GAN[p.gan]==="陽") yang++; else yin++;
    if (YIN_YANG_ZHI[p.zhi]==="陽") yang++; else yin++;
  });
  return {陰:yin,陽:yang};
}


/* === 主流程 === */
async function generateBazi(input){
  const {yyyy,mm,dd,hh} = input;
  const yearP = calculateYearPillar(yyyy,mm,dd);
  const monthP = calculateMonthPillar(yearP.gan,yyyy,mm,dd);
  const dayP = calculateDayPillar(yyyy,mm,dd);
  const hourP = calculateHourPillar(hh,dayP.gan);
  return {
    pillars:{year:yearP,month:monthP,day:dayP,hour:hourP},
    bazi: fmtPillars({year:yearP,month:monthP,day:dayP,hour:hourP})
  };
}


/* === DOM 渲染 === */
function setText(id, txt){ const el=document.getElementById(id); if (el) el.textContent = txt; }
function switchPageSafe(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target=document.getElementById("page-"+name);
  if (target) target.classList.add("active");
  // 導航標籤高亮
  document.querySelectorAll(".nav-tab").forEach(t=>t.classList.remove("active"));
  const map = {input:0,bazi:1,army:2,analysis:3,wiki:4};
  const idx = map[name];
  const tabs = document.querySelectorAll(".nav-tab");
  if (typeof idx==="number" && tabs[idx]) tabs[idx].classList.add("active");
}


/* === 軍團卡 === */
async function fetchStory(prompt){
  try{
    const res = await fetch("/api/story",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
    const data = await res.json();
    return (data && data.story) ? data.story : "（故事生成失敗，使用預設）主將調兵遣將，軍師謀而後動，此役穩中求進。";
  }catch(_){
    return "（故事生成失敗，使用預設）主將調兵遣將，軍師謀而後動，此役穩中求進。";
  }
}
function renderArmyCard(targetId, label, gan, zhi){
  const el = document.getElementById(targetId);
  if (!el) return;
  const commander = GAN_ROLE[gan] || gan;
  const strategist = ZHI_ROLE[zhi] || zhi;
  const roleLine = `主將：${gan}（${commander}） 軍師：${zhi}（${strategist}）`;
  el.innerHTML = `
    <div class="army-card-head">${label}軍團</div>
    <div class="army-card-body">
      <div class="army-roles">${roleLine}</div>
      <div class="army-badges">
        <span class="badge">納音：${NAYIN[gan+zhi] || "未知"}</span>
      </div>
      <div class="army-advice">一句話建議：穩中求進、先立不敗。</div>
      <div class="army-story" id="${targetId}-story">生成中…</div>
      <button class="story-toggle-btn" data-target="${targetId}-story">展開/收合</button>
    </div>
  `;
  // 展開/收合
  el.querySelector(".story-toggle-btn").addEventListener("click", (e)=>{
    const sid = e.currentTarget.getAttribute("data-target");
    const sEl = document.getElementById(sid);
    sEl.classList.toggle("expanded");
  });
}
async function fillArmyCards(pillars){
  renderArmyCard("army-year","家族", pillars.year.gan, pillars.year.zhi);
  renderArmyCard("army-month","成長", pillars.month.gan, pillars.month.zhi);
  renderArmyCard("army-day","本我", pillars.day.gan, pillars.day.zhi);
  renderArmyCard("army-hour","未來", pillars.hour.gan, pillars.hour.zhi);


  // 逐卡產生故事（串API）
  const prompts = {
    year:  `請用RPG敘事，描寫以「${GAN_ROLE[pillars.year.gan]||pillars.year.gan}」為主將、「${ZHI_ROLE[pillars.year.zhi]||pillars.year.zhi}」為軍師的家族軍團，100~150字，中文。`,
    month: `請用RPG敘事，描寫以「${GAN_ROLE[pillars.month.gan]||pillars.month.gan}」為主將、「${ZHI_ROLE[pillars.month.zhi]||pillars.month.zhi}」為軍師的成長軍團，100~150字，中文。`,
    day:   `請用RPG敘事，描寫以「${GAN_ROLE[pillars.day.gan]||pillars.day.gan}」為主將、「${ZHI_ROLE[pillars.day.zhi]||pillars.day.zhi}」為軍師的本我軍團，100~150字，中文。`,
    hour:  `請用RPG敘事，描寫以「${GAN_ROLE[pillars.hour.gan]||pillars.hour.gan}」為主將、「${ZHI_ROLE[pillars.hour.zhi]||pillars.hour.zhi}」為軍師的未來軍團，100~150字，中文。`,
  };
  const yearStory = await fetchStory(prompts.year);
  const monthStory= await fetchStory(prompts.month);
  const dayStory  = await fetchStory(prompts.day);
  const hourStory = await fetchStory(prompts.hour);
  setText("army-year-story",  yearStory);
  setText("army-month-story", monthStory);
  setText("army-day-story",   dayStory);
  setText("army-hour-story",  hourStory);
}


let yinYangChart=null, wuxingChart=null;
function renderAnalysisCharts(pillars){
  const yinYang = calcYinYangCount(pillars);
  const wuxing = calcFiveElementPower(pillars);


  // 陰陽長條
  const yyCtx = document.getElementById("yin-yang-chart").getContext("2d");
  if (yinYangChart) yinYangChart.destroy();
  yinYangChart = new Chart(yyCtx,{
    type:"bar",
    data:{ labels:["陰","陽"], datasets:[{label:"陰陽平衡", data:[yinYang.陰, yinYang.陽]}] },
    options:{ responsive:true, plugins:{legend:{display:false}} }
  });


  // 五行雷達
  const wxCtx = document.getElementById("wuxing-chart").getContext("2d");
  if (wuxingChart) wuxingChart.destroy();
  const labels=["木","火","土","金","水"];
  const data=labels.map(k=>wuxing[k]);
  wuxingChart = new Chart(wxCtx,{
    type:"radar",
    data:{ labels, datasets:[{ label:"五行力量", data }] },
    options:{ responsive:true, scales:{ r:{ beginAtZero:true } } }
  });


  // 四領域簡述（超簡單規則：土=事業穩定、金=財、木=成長/關係、火=外顯魅力、水=思考流動）
  setText("analysis-career", `事業：土 ${wuxing.土.toFixed(1)}（穩定度）`);
  setText("analysis-love",   `愛情：木 ${wuxing.木.toFixed(1)}（成長/包容） 火 ${wuxing.火.toFixed(1)}（表達）`);
  setText("analysis-money",  `財運：金 ${wuxing.金.toFixed(1)}（資源/效率）`);
  setText("analysis-mind",   `心理：水 ${wuxing.水.toFixed(1)}（思考/彈性）`);
}
// 讀取輸入：同時支援舊的 date/time 與新的下拉選單
function readBirthFromForm() {
  const dateInput = document.getElementById("birth-date");
  const timeInput = document.getElementById("birth-time");

  // 舊版：date/time 欄位（若存在就優先用）
  if (dateInput && timeInput && dateInput.value && timeInput.value) {
    const [yyyy, mm, dd] = dateInput.value.split("-").map(Number);
    const [hh, minute]  = timeInput.value.split(":").map(Number);
    return { yyyy, mm, dd, hh, minute, zMode: "none" };
  }

  // 新版：下拉選單
  const ySel = document.getElementById("year-select");
  const moSel = document.getElementById("month-select");
  const dSel = document.getElementById("day-select");
  const hSel = document.getElementById("hour-select");
  const miSel = document.getElementById("minute-select");
  const zSel = document.getElementById("zishi-mode");
  if (!ySel || !moSel || !dSel || !hSel || !miSel) {
    throw new Error("表單欄位缺失：請確認 year/month/day/hour/minute 選單存在");
  }
  const yyyy = Number(ySel.value);
  const mm   = Number(moSel.value);
  const dd   = Number(dSel.value);
  const hh   = Number(hSel.value);
  const minute = Number(miSel.value);
  const zMode  = zSel?.value || "none"; // none | late | full
  return { yyyy, mm, dd, hh, minute, zMode };
}

// 子時換日（none/late/full 三種，僅影響年/月/日柱用的日期，時柱照原 hh 判）
function adjustDateForZiMode({ y, m, d, hh }, mode) {
  let addNext = false;
  if (mode === "late") {            // 晚子：23:00 -> 次日
    if (hh === 23) addNext = true;
  } else if (mode === "full") {     // 整個子時：23:00–00:59 -> 次日
    if (hh === 23 || hh === 0) addNext = true;
  } // none：不換日

  if (!addNext) return { y, m, d, hh };
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate(), hh };
}
/* === 表單與頁面 === */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("input-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let birth;
    try {
      birth = readBirthFromForm(); // 支援舊版與新版表單
    } catch (err) {
      alert(err.message || "表單讀取失敗");
      return;
    }

    // 子時換日只調整「年/月/日柱」用到的日期
    const adj = adjustDateForZiMode(
      { y: birth.yyyy, m: birth.mm, d: birth.dd, hh: birth.hh },
      birth.zMode
    );

    // 1) 計算四柱（年/月/日用 adj；時柱仍用原 hh）
    const result = await generateBazi({
      yyyy: adj.y, mm: adj.m, dd: adj.d, hh: birth.hh, minute: birth.minute
    });

    // 2) 四柱
    setText("bazi-pillars", "四柱：" + fmtPillars(result.pillars));

    // 3) 十神（以日主為中心）
    const tenGods = calculateTenGods(result.pillars.day.gan, [
      result.pillars.year.gan, result.pillars.month.gan, result.pillars.hour.gan
    ]);
    setText("bazi-tengods", "十神：" + tenGods.join("，"));

    // 4) 納音
    const nY = NAYIN[result.pillars.year.pillar] || "未知";
    const nM = NAYIN[result.pillars.month.pillar] || "未知";
    const nD = NAYIN[result.pillars.day.pillar] || "未知";
    const nH = NAYIN[result.pillars.hour.pillar] || "未知";
    setText("bazi-nayin", `納音：年(${nY}) 月(${nM}) 日(${nD}) 時(${nH})`);

    // 5) 神煞（天乙/桃花/驛馬）
    const shenshaList = calculateShensha(result.pillars);
    setText("bazi-shensha", "神煞：" + (shenshaList?.length ? shenshaList.join("，") : "—"));

    // 6) 四時軍團卡 + 故事
    await fillArmyCards(result.pillars);

    // 7) 詳細分析圖表（陰陽、五行）
    renderAnalysisCharts(result.pillars);

    // 8) 在標題註明這次使用的「子時換日」模式，避免混淆
    const modeLabel =
      birth.zMode === "late" ? "晚子換日"
    : birth.zMode === "full" ? "整個子時換日"
    : "不換日";
    const pillarsEl = document.getElementById("bazi-pillars");
    if (pillarsEl) {
      pillarsEl.textContent = pillarsEl.textContent.replace(/^四柱：/, `四柱（${modeLabel}）：`);
    }

    // 9) 自動切到「八字排盤」頁（頁面已存在於 index.html）
    switchPageSafe("bazi");
  });
});

  // Demo：載入頁直接跑預設測試，以便你驗證
  (async ()=>{
    // 1985/10/06 19:30 → 乙丑 乙酉 戊寅 壬戌（近似節氣算法會正確落在酉→寒露前）
    const demo = await generateBazi({yyyy:1985,mm:10,dd:6,hh:19,minute:30});
    console.log("Demo:", fmtPillars(demo.pillars));
  })();
});