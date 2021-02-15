// 发布订阅者模式

// 绑定的方法，都有一个update属性
function Dep () {
  this.subs = []
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => sub.update())
}

// Watcher是一个类，通过这个方法创建的实例都拥有update方法
function Watcher (fn) {
  this.fn = fn
}

Watcher.prototype.update = function () {
  this.fn()
}

// 监听函数
let watcher = new Watcher(function () {
  console.log(1)
})

let dep = new Dep() // 对象里面包数组
dep.addSub(watcher) // 将watcher放入了数组中[watcher.update]
dep.addSub(watcher)
console.log(dep.subs)
dep.notify() // 数组关系