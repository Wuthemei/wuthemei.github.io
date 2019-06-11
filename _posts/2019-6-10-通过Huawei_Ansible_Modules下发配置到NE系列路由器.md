---
layout: post
title: 通过Huawei_Ansible_Modules下发配置到NE系列路由器
category : 技术日志
tags : [tech, ansible, huawei]
---
>关于Ansible如何连接Huawei NE设备，目前还没有官方或非官方的详细说明文档。
>
>在Github上发现了华为官方发布的Modules Package，但是此Package是基于CE系列数据中心交换机开发的，而公司现网使用的是华为NE系列设备。
>
>考虑到每个厂商的命令体系结构基本相同，遂决定将CE Package安装到Ansible server中，尝试使用ce_command对NE设备下发配置命令。
>

## 环境
Centos7（Ansible server）

Ansible2.2

CloudEngine-Ansible-0.2.0 Package

Hwawei NE20E路由器

## 过程
### Ansible server 环境准备

#### 安装python-devel

 [root@localhost ~]#yum install python-devel

#### 安装pip&ansible&ncclient

 [root@localhost ~]#wget https://bootstrap.pypa.io/get-pip.py && python get-pip.py

 [root@localhost ~]#pip install ansible==2.2

//官方建议安装2.2版本，更高版本安装实测有问题，据说“需要加export ANSIBLE_HOST_KEY_CHECKING=false参数”，未考证。

 [root@localhost ~]#pip install ncclient

#### 下载并安装CE_Ansible模块

 [root@localhost ~]#wget https://github.com/HuaweiSwitch/CloudEngine-Ansible/archive/v0.2.0.zip

 [root@localhost ~]#unzip v0.2.0.zip

 [root@localhost ~]#cd CloudEngine-Ansible-0.2.0/

 [root@localhost ~]#sh install.sh

//至此Ansible server环境准备结束。

### 路由器ssh login配置

[XXX-aaa]

local-user apsatcom password irreversible-cipher XXXXXX

local-user apsatcom service-type telnet ssh

local-user apsatcom level 3

local-user apsatcom state block fail-times 3 interval 5

[XXX]

ssh user apsatcom

ssh user apsatcom authentication-type password

ssh user apsatcom service-type all

user-interface vty 0 4

 authentication-mode aaa

 protocol inbound all

## 测试反馈&结果
在Ansible server输入测试命令

[root@localhost ~]# ansible -m ce_command -a "commands='display vlan bri' transport='cli' host=10.248.129.131 port=22 username=XXXXX password=10ettr"! localhost --connection local

//此处注意，如果将！放到“”内的话，server会提示“-bash: !": event not found”。

### 反馈

![](   https://themeiwu.com/img/tech/20190610tech01.PNG){: width="800px"}

### 结果

达到预期效果，下一步研究Playbook。

P.S. Markdown的代码高亮功能亟待研究啊。

## 参考资料

[ansible module](https://www.cnblogs.com/v394435982/p/5600916.html)

[使用CloudEngine-Ansible批量管理华为CE交换机](https://www.jianshu.com/p/b2b3cffa972b)
