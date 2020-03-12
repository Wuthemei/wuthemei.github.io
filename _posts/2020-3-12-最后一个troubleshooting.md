---
layout: post
title: 最后一个TS
category : 技术日志
tags : [tech]
---

>记录第二段工作最后一个Case的TS过程。


## 背景

这是去年一个项目留下的尾巴。落实到网络层的工作是需要在深圳和上海之间建立VPN隧道，最终需实现上海的测试人员能够访问到深圳星通实验室卫星Modem下的业务网络资源。

整个工作分为两个阶段：

第一阶段完成了IPsec VPN的配置和测试。

第二阶段优化了第一阶段的配置，调整内网路由，最终实现端到端通信。

## 拓扑

![](   https://themeiwu.com/img/tech/tech2020031201.PNG){: width="800px"}

## 难点

过程中遇到两个主要问题：

基于vrf的IPsec VPN的配置：之前没有遇到过类似问题，也没有配置思路，咨询H3C技术支持后得知需要在配置VPN的同时绑定相应的vrf。

内网不同vrf之间的路由泄漏：在卫星Modem下查看trace路径定位为内网路由优选问题，后加一条静态路由泄漏命令解决。

## 过程

### 上海到深圳的IPsec VPN配置

H3C防火墙的IPsec第一阶段配置（ike）：

<pre class="brush: cpp">
ike profile 10
 keychain 10
 dpd interval 5 on-demand
 exchange-mode aggressive
 local-identity user-fqdn h3c
 match remote identity user-fqdn sangfor
 proposal 10
 inside-vpn vpn-instance VPN123_Service_SHZH_HQ   //绑定vrf
</pre>

H3C防火墙的IPsec第一阶段配置（isakmp）：

<pre class="brush: cpp">
ipsec policy ZYHY_SH 10 isakmp
 transform-set ZYHY_SH
 security acl 3002
 local-address 119.147.218.13
 remote-address 180.167.215.226
 sa duration time-based 28800
</pre>

H3C防火墙的IPsec第二阶段配置：

<pre class="brush: cpp">
ipsec transform-set ZYHY_SH
 esp encryption-algorithm aes-cbc-128 aes-cbc-192 aes-cbc-256
 esp authentication-algorithm sha1
</pre>

IPsec VPN 兴趣流：

<pre class="brush: cpp">
acl advanced 3002
 rule 1 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.64.14.0 0.0.0.255 destination 10.18.35.0 0.0.0.255
 rule 2 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.64.14.0 0.0.0.255 destination 10.18.2.0 0.0.0.255
 rule 3 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.64.14.0 0.0.0.255 destination 10.18.9.0 0.0.0.255
 rule 4 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.64.14.0 0.0.0.255 destination 10.18.1.0 0.0.0.255
 rule 9 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.200.201.0 0.0.0.255 destination 10.18.2.0 0.0.0.255
 rule 10 permit ip vpn-instance VPN123_Service_SHZH_HQ source 10.18.2.0 0.0.0.255 destination 10.200.201.0 0.0.0.255
</pre>

### 内网路由配置：

这个问题很隐蔽，且整个调试过程卡在这个问题的时间最长，因为一直没有条件从卫星站接入终端进行trace来查看路径。

用户业务流量在香港落地进入地面网，vrf为 VPN123_Service_SHZH：

![](   https://themeiwu.com/img/tech/tech2020031202.PNG){: width="800px"}

流量通过港深专线到达深圳后community id被导入到两个vrf中，分别为：

![](   https://themeiwu.com/img/tech/tech2020031203.PNG){: width="800px"}

![](   https://themeiwu.com/img/tech/tech2020031204.PNG){: width="800px"}

而vrf VPN110_Internet_GIS_Charge对用户流量通过策略下发了默认路由：

![](   https://themeiwu.com/img/tech/tech2020031205.PNG){: width="800px"}

![](   https://themeiwu.com/img/tech/tech2020031206.PNG){: width="800px"}

于是本应该流向VPN123_Service_SHZH_HQ的流量流到了VPN110_Internet_GIS_Charge中，导致两端无法通信。

所以需要泄漏路由，添加静态明细路由使其成为优选路径：

![](   https://themeiwu.com/img/tech/tech2020031207.PNG){: width="800px"}

至此，所有设备路由正常，通信正常。

## 结果

终端IP为兴趣流内地址，ping对端成功，测试成功。

![](   https://themeiwu.com/img/tech/tech2020031209.jpg){: width="800px"}

## 参考

Case study of H3C TC mail.

## P.S.

Hew，终于解决了这个问题，前后持续将近一个月。

不管它是不是在自己在星通的最后一个TS，总是对自己有个交代。

在这里工作将近一年半，也遇到很多问题，技术或非技术的，顺利和不顺的，得意和失意的。

无论如何，也算光明磊落，无愧于心。

只是后来兜兜转转一直在跟各色人等打交道，那些所谓共识和分歧，终于都不及解决一个技术问题来得开心。

就像最初来时的样子。
