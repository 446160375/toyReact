# toyReact总结

### 记录下助教的讲解 方便以后的复习

    3天的训练营，总结来说呢，有大概三点比较重要的，是需要我们这三天去了解的。第一点，webpack的简单配置，这就是个工具的使用，不难。第二点，jsx语法的解析和生命周期。第三点，虚拟DOM的核心思想和简单实践。

    相信很多人都看过React的源码，估计有人和我一样刚开始的时候打开之后一脸蒙，不知所云，看下去的难度很大。相信通过这次的学习，可以更清晰的去认识React运行机制背后的事情，让我们不仅仅停留在表面的应用上，后续针对React的学习有一个好的促进。

    下面一起再回顾一下三天课程的内容。

### webpack是什么？怎么配置webpack？

    webpack 是一个现代 JavaScript 应用程序的静态模块打包器。现在一些框架对于webpack都进行了集成。但是我们还是要了解一些webpack的基本配置。

    entry: entry point指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的；

    output: 告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。你可以通过在配置中指定一个 output 字段，来配置这些处理过程；

    mode：告知 webpack 使用相应模式的内置优化(development 或者 production);

    loaders：加载器(用于对模块的源代码进行转换), 描述webpack如何处理非JavaScript模块(webpack自身是只理解JavaScript); 

    plugins: 插件的范围包括，从打包优化和压缩；

    更多配置可以根据自己的需求参考官网：[https://www.webpackjs.com/concepts/](https://www.webpackjs.com/concepts/)

### 第二点 JSX语法是怎么解析的？
    首先来了解下什么是JSX和它的解析规则：JSX就是JavaScript和XML结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。当遇到"<"，JSX就当HTML解析，遇到 “{” 就当JavaScript解析。

    我们要知道JSX语法的本质并不是直接把JSX渲染到页面，而是在内部先转换成了createElement 形式，然后再去渲染的，同时JSX在进行编译成JavaScript代码的时候进行了一定的优化，所以执行效率也更高。

    首先要在React环境里，先要预装上babel 和我们要用到的插件：
    npm i @babel/core @babel/preset-env @babel/plugin-transform-React-jsx --save-dev

    这时候就可以通过配置babel来进行语法解析：
    plugins: [["@babel/plugin-transform-React-jsx{pragma:"ToyReact.createElement" },]

    接下来看一下@babel/plugin-transform-React-jsx 做了什么？
```
jsx代码：
<div>123</div>

解析之后代码: 
ToyReact.createElement.createElement("div", "123");

在看一个例子：
JSX代码：

<div>     
    <div></div>    
    <div></div>     
    <div></div> 
</div> 

解析之后代码: 
React.createElement(     
   "div",   
   {},     
   React.createElement("div", {}, ...chidren),     
   React.createElement("div", {}, ...chidren),     
   React.createElement("div", {}, ...chidren) 
)

```
    可参考 toyreact.jpg 图片

    那么我们可以把它大概总结一下，它都做了哪些工作

    截止这里，是我们第一天小课的内容大家要了解到jsx语法解析的一些简单规则和配置信息

### 3、ToyReact生命周期和在生命周期内都发生了什么？
    先了解下React的生命周期函数

    组件将要挂载时触发的函数：componentWillMount
    组件挂载完成时触发的函数：componentDidMount
    是否要更新数据时触发的函数：shouldComponentUpdate
    将要更新数据时触发的函数：componentWillUpdate
    数据更新完成时触发的函数：componentDidUpdate
    组件将要销毁时触发的函数：componentWillUnmount
    父组件中改变了props传值时触发的函数：componentWillReceiveProps

    这里重点说一下在组件挂载之前的操作和在更新的时候的操作；componentWillMount和componentWillUpdate在每一个组件render之前都会去调用componentWillMount()，可以在服务端调用也可以在浏览器端调用，如果有异步请求，是不推荐在这个时候去请求数据的，具体原因是在render之前是不会返回数据的，这个坑大家了解一下；在组件将要更新数据的时候都会触发一次componentWillUpdate()，执行更新操作。

    回归到我们的课程上面 ，在我们的class里面有mountTo() 和 update()这样两个函数，不妨来猜测下它们的作用。和React本身的生命周期对应起来就是在挂载之前需要的操作和更新的时候需要的操作。那么在挂载之前做了什么：通过setAttribute添加自定义的属性，addEventListener添加事件；然后就会执行一次render；如果有更新操作，就会在update()内会通过对比对更新的元素进行替换；再次render。

### 4、Range对象的简单了解和使用
    在进行虚拟DOM的操作的时候我们用到了Range对象，那么Range对象是什么？可以用来做什么？

    Range对象，表示文档的连续范围区域，简单的说就是高亮选区。一个Range的开始点和结束点可以是任意的，开始点和结束点也可以时候一样的(一个空的Range)；

    Range的应用场景常见的是在做一些富文本编辑器相关的操作的时候；在我们的课程中也用到了一些简单的API。
    首先会创建一个range对象(createRange)，将指定节点的终点位置指定为Range对象所代表区域的起点位置(setStartAfter)；紧接着将指定的节点插入到某个Range对象所代表的区域中，插入位置为Range对象所代表区域的起点位置，如果该节点已经存在于页面中，该节点将被移动到Range对象代表的区域的起点处(insertNode)。

    Range对象API官网：https://developer.mozilla.org/en-US/docs/Web/API/Range；
    也给大家推荐一个详细介绍Range的博客：https://laixiazheteng.com/article/page/id/uMXiMenCofsB，有兴趣的可以自行前往

### 5、虚拟DOM的一般作用于什么场景？ToyReact里面是如何实践的？
    React将DOM抽象为虚拟DOM，用JavaScript模拟一颗DOM树，放在浏览器内存中。当变更时，虚拟DOM使用DIFF算法进行新旧虚拟DOM的比较，将变更放到变更队列中，最终只把变化的部分重新渲染，从而提高渲染效率。

    虚拟DOM什么时候该用？在我们频繁的微改动DOM的时候，会引起页面的多次渲染，导致影响性能；使用虚拟DOM的时候只需要对比差异，然后修改JS对象(生成的虚拟DOM)，最后把生成的DOM结构插入到页面中，减少渲染的次数，提升整个页面的渲染效率。

    在我们的课程中，在update()，也就是在更新元素的阶段，会先生成一个改变之后的DOM结构，然后对DOM树的type，props，chirdren等地方进行了对比，从而实现对整个DOM树的局部更新。

    好的，希望的我分享能带你再一次回顾我们三天的课程。也希望大家能够有收获。