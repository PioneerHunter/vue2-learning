# vue2-learning
some important practice
***
### todoList.htm
- 一个基于vue的任务待办列表
### v-model文件实现双向绑定
- 双向绑定是MVVM模式，具体通过数据劫持和发布订阅者模式实现。
- 数据劫持由Object.defineProperty实现，通过循环遍历对象的每一个属性。
- 发布订阅者模式则需要实现一个调度中心，里面包含一个观察者，观察对象属性的变化，一个订阅器，在观察者发现变化后，发布订阅，也就是更改属性的数据
### 手写axios主要部分
- axios主要由axios(config)、axios.method、拦截器三个部分组成（代码实现按该顺序）
- axios类可以实现前两者，拦截器类实现后者，最终是导出request方法
- axios(config)用于发送ajax请求
- axios.method使得get、post等方法挂载到axios上，能以该形式直接调用
- 拦截器由响应拦截、请求拦截组成
