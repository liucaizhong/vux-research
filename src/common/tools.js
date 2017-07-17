// common tool functions
export default {
  // judge whether the two objects are same
  // compare plain object
  isSameObject (a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false
    }
    for (let k in a) {
      if (b[k] === undefined) {
        return false
      }
      if (a[k] !== b[k]) {
        return false
      }
    }
    return true
  },
  // judge whether the object is empty strictly
  isEmptyObject (obj) {
    for (let k in obj) {
      if (obj[k] && obj[k] !== '') {
        return false
      }
    }
    return true
  },
  // get the device using
  device () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      return 'ios'
    } else if (/(Android)/i.test(navigator.userAgent)) {
      return 'android'
    } else {
      return 'pc'
    }
  },
  getCookie (name) {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(name + '=')
      if (start !== -1) {
        start = start + name.length + 1
        let end = document.cookie.indexOf(';', start)
        if (end === -1) {
          end = document.cookie.length
        }
        return decodeURIComponent(document.cookie.substring(start, end))
      }
    }
    return ''
  },
  setCookie (name, value, expiredays) {
    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = name + '=' + encodeURIComponent(value) +
    ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
  }
  // date formatter:use vux's dateformat func
  // dateFormat (o, s) {
  //   let arr = []
  //   arr.push(o.getFullYear())
  //   arr.push(o.getMonth() + 1)
  //   arr.push(o.getDate())
  //   return arr.join(s)
  // }
}
