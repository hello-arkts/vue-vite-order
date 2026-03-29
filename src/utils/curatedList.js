const categories = [
  { id: 1, name: '网红餐厅', icon: new URL('../assets/icons/1.svg', import.meta.url).href },
  { id: 2, name: '酒店住宿', icon: new URL('../assets/icons/2.svg', import.meta.url).href },
  { id: 3, name: '租车接机', icon: new URL('../assets/icons/3.svg', import.meta.url).href },
  { id: 4, name: '景点门票', icon: new URL('../assets/icons/4.svg', import.meta.url).href },
  { id: 5, name: '热门泰货', icon: new URL('../assets/icons/5.svg', import.meta.url).href },
  { id: 6, name: '休闲娱乐', icon: new URL('../assets/icons/6.svg', import.meta.url).href },
]
const quickCards = [
  {  title: '入境卡申请', desc: '温馨提示：入境必须',icon: new URL('../assets/icons/file-text.svg', import.meta.url).href, color: '#FF3957' },
  {  title: '海关VIP通道', desc: '无需等待',icon: new URL('../assets/icons/external.svg', import.meta.url).href },
  {  title: '泰国电信卡', desc: 'eSim & 实体卡',icon: new URL('../assets/icons/wifi.svg', import.meta.url).href },
  {  title: 'VIP接机', desc: '专属服务',icon: new URL('../assets/icons/car.svg', import.meta.url).href }
]

const countryCodes = [
  { code: '+86', name: '中国', icon: new URL('../assets/icons/ch.svg', import.meta.url).href },
  { code: '+1', name: '美国', icon: new URL('../assets/icons/us.svg', import.meta.url).href },
  { code: '+66', name: '泰国', icon: new URL('../assets/icons/th.svg', import.meta.url).href },
]

const mapApps = [
  { id: 'google', name: 'Google Maps', description: 'Google 地图', icon: new URL('../assets/icons/gg.svg', import.meta.url).href },
  { id: 'gaode', name: '高德地图', description: 'Gaode Maps', icon: new URL('../assets/icons/gd.svg', import.meta.url).href },
  { id: 'baidu', name: '百度地图', description: 'Baidu Maps', icon: new URL('../assets/icons/bd.svg', import.meta.url).href },
  { id: 'tencent', name: '腾讯地图', description: 'Tencent Maps', icon: new URL('../assets/icons/tx.svg', import.meta.url).href },
]

export {categories, quickCards, countryCodes, mapApps}
