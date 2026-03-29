import { ElMessage } from 'element-plus'

export const getPlatform = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (/android/i.test(ua)) {
    return 'android'
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    return 'ios'
  }
  return 'web'
}

export const getStoreCoordinates = (shopList, selectedStoreId, selectedStoreAddress) => {
  const selectedStore = shopList?.find(store => store.id === selectedStoreId)
  return {
    lat: selectedStore?.latitude || 0,
    lng: selectedStore?.longitude || 0,
    address: selectedStore?.address || selectedStoreAddress
  }
}

export const getGoogleMapsUrl = (platform, coords) => {
  if (platform === 'android') {
    return `intent://maps.google.com/maps?daddr=${coords.lat},${coords.lng}&dirflg=d#Intent;scheme=google.navigation;package=com.google.android.apps.maps;end`
  } else if (platform === 'ios') {
    return `comgooglemaps://?daddr=${coords.lat},${coords.lng}&directionsmode=driving`
  }
  return ''
}

export const getGaodeMapsUrl = (platform, coords) => {
  if (platform === 'android') {
    return `androidamap://route/plan/?slat=&slon=&sname=我的位置&dlat=${coords.lat}&dlon=${coords.lng}&dname=${encodeURIComponent(coords.address)}&dev=0&t=0`
  } else if (platform === 'ios') {
    return `iosamap://path?sourceApplication=PrivateOrder&dlat=${coords.lat}&dlon=${coords.lng}&dname=${encodeURIComponent(coords.address)}&dev=0&t=0`
  }
  return ''
}

export const getBaiduMapsUrl = (platform, coords) => {
  if (platform === 'android') {
    return `baidumap://map/direction?destination=name:${encodeURIComponent(coords.address)}|latlng:${coords.lat},${coords.lng}&mode=driving&coord_type=gcj02`
  } else if (platform === 'ios') {
    return `baidumap://map/direction?destination=name:${encodeURIComponent(coords.address)}|latlng:${coords.lat},${coords.lng}&mode=driving&coord_type=gcj02`
  }
  return ''
}

export const getTencentMapsUrl = (platform, coords) => {
  if (platform === 'android') {
    return `qqmap://map/routeplan?type=drive&to=${encodeURIComponent(coords.address)}&tocoord=${coords.lat},${coords.lng}&referer=PrivateOrder`
  } else if (platform === 'ios') {
    return `qqmap://map/routeplan?type=drive&to=${encodeURIComponent(coords.address)}&tocoord=${coords.lat},${coords.lng}&referer=PrivateOrder`
  }
  return ''
}

export const launchMapApp = (url, fallbackUrl) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)
    
    const checkTimeout = setTimeout(() => {
      document.body.removeChild(iframe)
      const elapsed = Date.now() - startTime
      
      if (elapsed < 1000) {
        window.location.href = fallbackUrl
      }
      resolve()
    }, 500)
    
    window.addEventListener('blur', function onblur() {
      clearTimeout(checkTimeout)
      window.removeEventListener('blur', onblur)
      document.body.removeChild(iframe)
      resolve()
    })
  })
}

export const openMapApp = async (mapApp, shopList, selectedStoreId, selectedStoreAddress) => {
  const platform = getPlatform()
  const coords = getStoreCoordinates(shopList, selectedStoreId, selectedStoreAddress)
  
  let url = ''
  let fallbackUrl = ''
  
  switch (mapApp.id) {
    case 'google':
      url = getGoogleMapsUrl(platform, coords)
      fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords.address)}`
      break
    case 'gaode':
      url = getGaodeMapsUrl(platform, coords)
      fallbackUrl = `https://uri.amap.com/marker?position=${coords.lng},${coords.lat}&name=${encodeURIComponent(coords.address)}`
      break
    case 'baidu':
      url = getBaiduMapsUrl(platform, coords)
      fallbackUrl = `https://map.baidu.com/marker?location=${coords.lat},${coords.lng}&title=${encodeURIComponent(coords.address)}&content=${encodeURIComponent(coords.address)}&output=html`
      break
    case 'tencent':
      url = getTencentMapsUrl(platform, coords)
      fallbackUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${coords.lat},${coords.lng};title:${encodeURIComponent(coords.address)}&referer=PrivateOrder`
      break
  }
  
  try {
    if (platform === 'web') {
      window.open(fallbackUrl, '_blank')
    } else {
      await launchMapApp(url, fallbackUrl)
    }
    return true
  } catch (error) {
    console.error('打开地图应用失败:', error)
    ElMessage.error('打开地图应用失败，请重试')
    return false
  }
}