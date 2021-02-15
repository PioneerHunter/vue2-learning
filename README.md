# vue2-learning
some important practice
### v-model文件实现双向绑定
- 双向绑定是MVVM模式，具体通过数据劫持和发布订阅者模式实现。
- 数据劫持由Object.defineProperty实现，通过循环遍历对象的每一个属性。
- 发布订阅者模式则需要实现一个调度中心，里面包含一个观察者，观察对象属性的变化，一个订阅器，在观察者发现变化后，发布订阅，也就是更改属性的数据
