/* axios主要由axios(config)、axios.method、拦截器三个部分组成（代码实现按该顺序）
 * axios类可以实现前两者，拦截器类实现后者，最终是导出request方法
 * axios(config)用于发送ajax请求
 * axios.method使得get、post等方法挂载到axios上，能以该形式直接调用
 * 拦截器由响应拦截、请求拦截组成
 */

// 拦截器类，管理响应和请求
class InterceptorsManage {
  constructor () {
    this.handlers = []
  }

  use (fullField, rejected) {
    this.handlers.push ({
      fullField,
      rejected
    })
  }
}
// axios类，导出request方法，所以每次得将axios上的方法、对象等遍历出来加到request上
class Axios {
  constructor () {
    this.interceptors = {
      request: new InterceptorsManage,
      response: new InterceptorsManage
    }
  }

  request (config) {
    // 拦截器和请求组装队列
    let chain = [this.sendAjax.bind(this), undefined] // 成对出现的，失败回调暂时不处理

    // 请求拦截
    this.interceptors.request.handlers.forEach(interceptor => {
      chain.unshift(interceptor.fullField, interceptor.rejected)
    })

    // 响应拦截
    this.interceptors.response.handlers.forEach(interceptor => {
      chain.push(interceptor.fullField, interceptor.rejected)
    })

    // 执行队列，每执行一对，并给promise赋最新的值
    let promise = Promise.resolve(config)
    while(chain.length > 0) {
      // shift()删除数组第一个元素并返回
      promise = promise.then(chain.shift(), chain.shift())
    }

    return promise
  }

  // 将“发送ajax请求”封装，axios(config)
  sendAjax (config) {
    return new Promise (resolve => {
      const {url = '', method = 'get', data = {}} = config
      // 发送ajax请求
      console.log(config)
      const xhr = new XMLHttpRequest()
      // open()方法建立HTTP请求（建立连接）
      // 参数：HTTp请求方法，请求的URl字符，指定是否为async异步
      xhr.open(method, url, true)
      xhr.onload = function () {
        console.log(xhr.responseText)
        resolve(xhr.responseText)
      }
      xhr.send(data)
    })
  }
}

// 定义get，post等方法挂载到Axios原型上，axios.method
const methodsArr = ['get', 'post', 'delete', 'head', 'options', 'put', 'patch']
// 遍历数组，依次添加方法到Axios上
methodsArr.forEach(met => {
  Axios.prototype[met] = function () {
    console.log('执行' + met + '方法')
    // 四种方法接收两个参数(url[, config])
    if (['get', 'delete', 'head', 'options'].includes(met)) {
      return this.request({
        method: met,
        // arguments类数组对象，非数组，存储传入的参数
        url: arguments[0],
        ...arguments[1] || {}
      })
    } else {
      // 三种方法接收三个参数(url[, data[, config]])
      return this.request({
        method: met,
        url: arguments[0],
        data: arguments[1] || {},
        ...arguments[2] || {}
      })
    }
  }
})

// 把Axios.prototype上的方法加到request，实现axios.get等效果
const utils = {
  extend(a, b, content) {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        if (typeof b[key] === 'function') {
          a[key] = b[key].bind(content)
        } else {
          a[key] = b[key]
        }
      }
    }
  }
}

// 最终导出axios的方法，即实例的request方法
function CreateAxiosFn () {
  let axios = new Axios() // 得到axios实例
  let req = axios.request.bind(axios) // 得到实例的request方法
  utils.extend(req, Axios.prototype, axios) // 把Axios.prototype上的方法加到request9(req)
  utils.extend(req, axios) // 给request加上interceptor对象
  return req
}

let axios = CreateAxiosFn()