---
layout: post
title: 关于python的class中函数init()和参数self的理解
category : 技术日志
tags : [tech, python]
---


## 引出

另一个关于python的入门问题，边看边理解ing。

## 理解

### init（）

python的class中，约定俗成第一个函数是

<pre class="brush: cpp">
__init__()
</pre>

这个函数在class定义后约定俗成必须有，可以在其中预设一些参数，用来初始化被调用的class。

引用一个机器人工厂的例子：

如果要造一个机器人，可以定义一个class（工厂）

一个机器人一定会有胳膊有脑袋，所以可以在init函数中将这些一定会有的参数封装：

<pre class="brush: cpp">
class BuildRobot():
    def __init__(self,armcount,headcount):
        self.armcount = armcount
        self.headcount = headcount
</pre>

于是，告诉class（工厂）要造一个有几个头几个胳膊的机器人：

<pre class="brush: cpp">
normal_robot = BuildRobot(2,1)
</pre>

之后，一个造好的机器人instance（normal_robot），出厂。

可以看一下这个机器人有几个胳膊：

<pre class="brush: cpp">
normal_robot.armcount
</pre>

### method和function

上面的工厂加一个上色车间：

<pre class="brush: cpp">
class BuildRobot():
    def __init__(self,armcount,headcount):
        self.armcount = armcount
        self.headcount = headcount
    def paintarm(self,color):
        print("paint arm:",color)
</pre>

这个上色车间（paintarm）就是一个method。

上面产生的instance可以call这个method：

<pre class="brush: cpp">
colorful_robot = BuildRobot(2,1)
colorful_robot.paintarm('red')
</pre>

需要注意的是：

如果没有先造一个机器人，这个车间就没有办法给胳膊上色，因此要上色，就必须先造一个机器人出来。所以，method是依赖于instance的。

这个车间只能给这个工厂产出的robot的胳膊上色，你从别的工厂拿一个车过来让他上色，他是不干的。因此，method是依赖于class的。只有这个class创建的instance，才能call这个method。

function的功能类似于新建一个工厂或者外包，不依赖特定instance：

<pre class="brush: cpp">
def outsourcing_paint(robot,color):
    print("paint",robot,"arm:",color)

outsourcing_paint(colorful_robot,'red')
</pre>

### self

self只存在于class内的method中，用于指代call这个method的instance，如果要想使instance.method()这个格式可以正常工作，在class里面编写method的时候，就必须把变量的第一个位子留出来，用来指代未来call这个method的instance。

## 参考资料

[python里面的self，是谁啊？](https://zhuanlan.zhihu.com/p/95788606)
