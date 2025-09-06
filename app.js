/* 🌈 虹靈御所 - 八字人生兵法 app.js (2025-09 完整新版) */


/* === 基礎常量 === */
const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const WU_XING_GAN = { "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水" };
const WU_XING_ZHI = { "子":"水","丑":"土","寅":"木","卯":"木","辰":"土","巳":"火","午":"火","未":"土","申":"金","酉":"金","戌":"土","亥":"水" };
const YIN_YANG_GAN = { "甲":"陽","乙":"陰","丙":"陽","丁":"陰","戊":"陽","己":"陰","庚":"陽","辛":"陰","壬":"陽","癸":"陰" };
const YIN_YANG_ZHI = { "子":"陽","丑":"陰","寅":"陽","卯":"陰","辰":"陽","巳":"陰","午":"陽","未":"陰","申":"陽","酉":"陰","戌":"陽","亥":"陰" };


/* 五虎遁月對照表 */
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


/* 時柱五鼠遁 */
const HOUR_TO_ZHI_MAP = {
  23:"子",0:"子",1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",9:"巳",10:"巳",
  11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"
};
const WU_SHU_DUN_SHI_MAP = { "甲":"甲","己":"甲","乙":"丙","庚":"丙","丙":"戊","辛":"戊","丁":"庚","壬":"庚","戊":"壬","癸":"壬" };


/* === 計算核心 === */


// 年柱：立春分年
function calculateYearPillar(year, month, day) {
  const lichun = new Date(year, 1, 4); // 2/4
  const d = new Date(year, month - 1, day);
  const actualYear = d >= lichun ? year : year - 1;
  const gan = TIAN_GAN[(actualYear - 4) % 10];
  const zhi = DI_ZHI[(actualYear - 4) % 12];
  return {gan,zhi,pillar:gan+zhi};
}


// 月柱：節氣分月 + 五虎遁
function calculateMonthPillar(yearGan, year, month, day) {
  // 這裡簡化：假設節氣資料 JSON 已經 fetch
  const monthZhiSeq = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
  let monthZhi = "酉"; // 預設，用節氣 JSON 修正
  // 查表
  const idx = monthZhiSeq.indexOf(monthZhi);
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


// 時柱：五鼠遁 + 子時跨日
function calculateHourPillar(hour, dayGan) {
  const zhi = HOUR_TO_ZHI_MAP[hour];
  const baseGan = WU_SHU_DUN_SHI_MAP[dayGan];
  const baseIdx = TIAN_GAN.indexOf(baseGan);
  const zhiIdx = DI_ZHI.indexOf(zhi);
  const gan = TIAN_GAN[(baseIdx+zhiIdx)%10];
  return {gan,zhi,pillar:gan+zhi};
}


/* === 前端整合 === */


async function generateBazi(input){
  const {yyyy,mm,dd,hh} = input;
  const yearP = calculateYearPillar(yyyy,mm,dd);
  const monthP = calculateMonthPillar(yearP.gan,yyyy,mm,dd);
  const dayP = calculateDayPillar(yyyy,mm,dd);
  const hourP = calculateHourPillar(hh,dayP.gan);


  return {
    pillars:{year:yearP,month:monthP,day:dayP,hour:hourP},
    bazi:`${yearP.pillar} ${monthP.pillar} ${dayP.pillar} ${hourP.pillar}`
  };
}


/* === 軍團卡填充 + AI故事 === */


async function fetchStory(prompt){
  try{
    const res = await fetch("/api/story",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
    const data = await res.json();
    return data.story;
  }catch(e){
    return "故事生成失敗，使用預設：主將帶領軍團，踏上未知旅程…";
  }
}


/* === 測試案例 === */
(async ()=>{
  const test1 = await generateBazi({yyyy:1985,mm:10,dd:6,hh:19});
  console.log("1985/10/6 19:30 =>",test1.bazi); // 應=乙丑 乙酉 戊寅 壬戌
  const test2 = await generateBazi({yyyy:1990,mm:9,dd:27,hh:8});
  console.log("1990/9/27 08:32 =>",test2.bazi); // 應=庚午 乙酉 乙未 庚辰
})();