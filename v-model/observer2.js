// 发布订阅模式
// 调度中心
class Common {
  constructor (id) {
    this.id = id
    this.subs = {}
  }

  // 订阅器
  Dep (key) {
    this.subs[key] = []
  }

  // 观察者
  Watch (update) {
    return {
      bind_id: null,
      update
    }
  }

  push (key, watch) {
    watch.bind_id = key
    this.subs[key].push(watch)
  }

  notify (key) {
    this.subs[key].forEach(watch => watch.update())
  }
}

// 创建订阅中心
let common = new Common('my common')

// 创建订阅器
common.Dep('click')

// 创建观察者
let w1 = common.Watch(() => console.log(1))
let w2 = common.Watch(() => console.log(2))

// 往订阅器中添加观察者
common.push('click', w1)
common.push('click', w2)

// 发布订阅
common.notify('click')