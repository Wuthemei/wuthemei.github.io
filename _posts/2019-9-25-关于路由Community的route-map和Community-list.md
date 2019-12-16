---
layout: post
title: 关于路由Community的route-map和Community-list
category : 技术日志
tags : [tech, route-map, community]
---

>route-map打community，community-list匹配做过滤实验，记录过程

## 环境

EVE-Cisco L3 ios

## 过程

### 拓扑

![](   https://themeiwu.com/img/tech/0901.PNG){: width="800px"}

### 配置说明

两个AS，AS100内底层OSPF，上层IBGP，AS200内底层RIP，R6与R4、R5基于RIP建立EBGP。

R6做route-map，为两条路由前缀100/200.1.1.0/24打community，对R4应用策略。

对应的，在R4做策略，deny掉在R6为两条路由打的community。

### route-map与community-list

R6的route-map：
<pre class="brush: cpp">
access-list 1 permit 100.1.1.0 0.0.0.255
access-list 2 permit 200.1.1.0 0.0.0.255

route-map fil permit 10
 match ip address 1
 set community 6553601
route-map fil permit 20
 match ip address 2
 set community 13107201
</pre>

R4的community-list和route-map：
<pre class="brush: cpp">
ip community-list 1 permit 6553601
ip community-list 2 permit 13107201

route-map s400 deny 10
 match community 1
route-map s400 deny 20
 match community 2
route-map s400 permit 30
</pre>

### 配置

R1:

![](   https://themeiwu.com/img/tech/0901R1.PNG){: width="800px"}

R2

![](   https://themeiwu.com/img/tech/0901R2.PNG){: width="800px"}

R3

![](   https://themeiwu.com/img/tech/0901R3.PNG){: width="800px"}

R4

![](   https://themeiwu.com/img/tech/0901R4.PNG){: width="800px"}

R5

![](   https://themeiwu.com/img/tech/0901R5.PNG){: width="800px"}

R6

![](   https://themeiwu.com/img/tech/0901R6.PNG){: width="800px"}

## 结论

AS100中所有router的路由表中关于prefix100/200.1.1.0/24的下一跳是R5

![](   https://themeiwu.com/img/tech/0901RR4.PNG){: width="800px"}
