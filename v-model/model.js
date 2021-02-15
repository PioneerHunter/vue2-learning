/* 双向绑定是MVVM模式，具体通过数据劫持和发布订阅者模式实现。
 * 数据劫持由Object.defineProperty实现，通过循环遍历对象的
 * 每一个属性。发布订阅者模式则需要实现一个调度中心，里面包
 * 含一个观察者，观察对象属性的变化，一个订阅器，在观察者发
 * 现变化后，发布订阅，也就是更改属性的数据
 */
function Vue (options = {}) {
  // 所有属性挂载到$options上
  this.$options = options
  var data = this._data = this.$options.data
  observe (data)
  // 实现this代替了this._data
  for (let key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get () {
        // this.a = xxx
        return this._data[key]
      },
      set (newVal) {
        this._data[key] = newVal
      }
    })
  }
  new Compile(options.el, this)
}

// 实现编译
function Compile (el, vm) {
  // el代表替换的范围
  vm.$el = document.querySelector(el)
  let fragment = document.createDocumentFragment()
  // 将app中内容移入到内存中，有利于性能提升
  while (child = vm.$el.firstChild) {
    fragment.appendChild(child)
  }
  replace (fragment)

  // 将{{}}结构替换成对应的值
  function replace (fragment) {
    Array.from(fragment.childNodes).forEach(function (node) { // from将字符串转数组
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/

      // 寻找内容中的{{}}结构
      if (node.nodeType === 3 && reg.test(text)) { // test检测字符串是否符合{{}}模式
        console.log(RegExp.$1) // a.a b
        let arr = RegExp.$1.split('.') // 转成数组[a,a] [b]
        let val = vm
        arr.forEach(function (k) { // 取this.a.a/this.b
          val = val[k]
        })
        new Watcher (vm, RegExp.$1, function (newVal) { // 接受新值
          node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)
        })
        // 替换的逻辑
        node.textContent = text.replace(/\{\{(.*)\}\}/, val)
      }

      // 寻找元素节点中的{{}}结构（属性）
      if (node.nodeType === 1) {
        // 元素节点
        let nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(function (attr) {
          // console.log(attr.name)
          let name = attr.name // v-model
          let exp = attr.value // "b"
          if (name.indexOf('v-') == 0) {
            node.value = vm[exp]
          }
          new Watcher (vm, exp, function (newVal) {
            node.value = newVal // 当watcher触发时会自动将内容放到输入框内
          })
          node.addEventListener('input', function (e) {
            let newVal = e.target.value
            vm[exp] = newVal
          })
        })
      }
      if (node.childNodes) {
        replace (node)
      }
    })
  }

  vm.$el.appendChild(fragment)
}

// 观察对象，给对象增加属性
function Observe (data) {
  let dep = new Dep
  for (let key in data) {
    let val = data[key]
    observe (val) // （类似）循环观察，使得data里的所有值都拿出来
    Object.defineProperty (data, key, {
      enumerable: true,
      get () {
        Dep.target && dep.addSub(Dep.target) // [watcher]
        return val
      },
      // 更改data里的值的时候
      set (newVal) {
        // 如果值相同，则无变化
        if (newVal === val) {
          return
        }
        val = newVal
        observe (newVal)
        dep.notify() // 让所有的watcher的update方法执行即可
      },
    })
  }
}

function observe (data) {
  // 如果传入参数还是对象，则继续拿出参数里的值
  if (typeof data !== 'object') return
  return new Observe (data)
}

// vue特点： 不能新增不存在的属性，不存在的属性没有get和set
// 深度响应，因为每次赋予一个新对象时会给这个新对象增加数据劫持

// 发布订阅
function Dep () {
  this.subs = []
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => sub.update())
}

// watcher
function Watcher (vm, exp, fn) {
  this.vm = vm
  this.exp = exp
  this.fn = fn
  Dep.target = this
  let val = vm
  let arr = exp.split('.')
  arr.forEach(function (k) { // this.a.a
    val = val[k]
  })
  Dep.target = null
}

Watcher.prototype.update = function () {
  let val = this.vm
  let arr = this.exp.split('.')
  arr.forEach(function (k) { // this.a.a
    val = val[k]
  })
  this.fn(val)
}



