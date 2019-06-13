---
layout: post
title: 通过Ansible-Playbook下发配置命令到华为NE设备
category : 技术日志
tags : [tech, ansible, Huawei]
---
>接上篇，周一配置完基础环境后，周二偷了一天懒，周三又开了一天会，所以直到今天（周四）才开始推进工作。
>
>本篇主要说明如何以Ansible-Playbook（剧本）的方式推配置到华为设备。
>
>P.S.不得不说，一直偷懒一直爽啊。
## 万年不变的环境

Centos7（Ansible server）

Ansible2.2

CloudEngine-Ansible-0.2.0 Package

Hwawei NE20E路由器

## 常用常新的过程
### 修改Ansible Inventory
Ansible Inventory即Ansible的hosts文件，所有需要使用Ansible管理的Clients都需要被记录在Inventory中，在保证所有信息记录准确的情况下，记录的格式可以有多种方式，在编写Playbook时，需要在细节上配合Inentory记录的格式。For example，我是这样写的：
<pre class="brush: cpp">[all:vars]
ansible_connection='local'
username='apsatcom'
password='P@55w0rd!'
ansible_ssh_port=22
[hkbas]
10.248.129.131
[szbas]
10.248.128.151
[ldbas]
10.248.134.131</pre>


#### 安装python-devel

yum install python-devel

#### 安装pip&ansible&ncclient

wget https://bootstrap.pypa.io/get-pip.py && python get-pip.py

pip install ansible==2.2

//官方建议安装2.2版本，更高版本安装实测有问题，据说“需要加export ANSIBLE_HOST_KEY_CHECKING=false参数”，未考证。

pip install ncclient

#### 下载并安装CE_Ansible模块

wget https://github.com/HuaweiSwitch/CloudEngine-Ansible/archive/v0.2.0.zip

unzip v0.2.0.zip

cd CloudEngine-Ansible-0.2.0/

sh install.sh

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

[root@localhost ~]# ansible -m ce_command -a "commands='display ip int bri' transport='cli' host=10.248.129.131 port=22 username=apsatcom password=P@55w0rd"! localhost --connection local

### 反馈

![](   https://themeiwu.com/img/tech/20190610tech01.PNG){: width="200px"}

### 结果

达到预期效果，下一步研究Playbook。

P.S. Markdown的代码高亮功能亟待研究啊。

## 参考资料

[ansible module](https://www.cnblogs.com/v394435982/p/5600916.html)

[使用CloudEngine-Ansible批量管理华为CE交换机](https://www.jianshu.com/p/b2b3cffa972b)
