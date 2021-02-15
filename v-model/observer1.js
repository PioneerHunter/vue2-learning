// 观察者模式
// 订阅器
class Dep {
  constructor (id) {
    this.id = id
    this.subs = []
  }

  push (watch) {
    watch.bind_id = this.id
    this.subs.push(watch)
  }

  notify () {
    this.subs.forEach(watch => watch.update())
  }
}
// 观察者
class Watch {
  constructor (update) {
    this.update = update
  }
}

// 创建订阅器
let dep = new Dep('click')

// 创建观察者
let w1 = new Watch(() => console.log('click 1'))
let w2 = new Watch(() => console.log('click 2'))

// 往订阅器中添加观察者
dep.push(w1)
dep.push(w2)

// 发布订阅
dep.notify()