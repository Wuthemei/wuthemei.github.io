---
layout: post
title: 通过Ansible-Playbook下发配置命令到华为NE路由器
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

## 过程

### 修改Ansible Inventory

Ansible Inventory即Ansible的hosts文件，所有需要使用Ansible管理的Clients都需要被记录在Inventory中，在保证所有信息记录准确的情况下，记录的格式可以有多种方式，在编写Playbook时，需要在细节上配合Inentory的记录格式。引用Ansible官网的说法：
The inventory file can be in one of many formats, depending on the inventory plugins you have. For this example, the format for /etc/ansible/hosts is an INI-like (one of Ansible’s defaults) and looks like this:
<pre class="brush: cpp">
mail.example.com

[webservers]
foo.example.com
bar.example.com

[dbservers]
one.example.com
two.example.com
three.example.com
</pre>
具体到本次测试，hosts文件是这样写的：
<pre class="brush: cpp">
[all:vars]        //定义全局变量
ansible_connection='local'
username='XXXXX'
password='XXXXX'
ansible_ssh_port=22
[hkbas]    //定义主机组
10.248.129.131
[szbas]
10.248.128.151
[ldbas]
10.248.134.131
</pre>
这里的三个主机组分别是位于深圳、香港和伦敦的Bras设备，型号是华为NE20E，测试的最终目的是通过Playbook向深圳的Bras下发用户计费配置的命令。

#### 编写剧本

剧本（Playbook）是Ansible与被控设备交互的一种方式，除此之外，还可以用Ad-hoc的方式下发配置命令。使用剧本的好处是可以完成系统的、复杂的配置任务，而Ad-hoc只能通过ansible --XX的方式对Client下发单条命令。

剧本语言必须用yaml格式编辑，yaml对空格敏感，相同缩进的行被视为同一模块，不能使用Tab（制表符）进行缩进。

每个Playbook包含一个或多个Plays,Play的作用是将一组主机映射到具体的行为。

具体见本次测试使用的Playbook：
<pre class="brush: cpp">
[root@localhost ~]# cat bas_add_ip_segments.yml
- name: Add IP Segements To SZ Bas
  hosts: szbas   //play，将主机组与行为对应
  connection: local
  gather_facts: no //用来采集目标系统信息的，具体是用setup模块来采集得，置no可显著加快剧本执行速度。
  vars:
    a_ip: //可通过传递参数获得
    z_ip:
    cli:
      host: "{{ inventory_hostname }}"
      port: "{{ ansible_ssh_port }}"
      username: "{{ username }}"
      password: "{{ password }}"
      transport: cli

  tasks:
  - name: "Add IP Segments To SZ Bas"
    ce_config:
      lines: layer3-subscriber {{a_ip}} {{z_ip}} vpn-instance VPN110_Internet_GIS_Charge domain-name sz_web_pre
      provider: "{{ cli }}"
</pre>
这个剧本要实现的功能很简单，即在深圳Bras设备上配置一条命令：   
<pre class="brush: cpp; highlight: [1]">
layer3-subscriber start_ip end_ip vpn-instance VPN110_Internet_GIS_Charge domain-name sz_web_pre
</pre>
其中start_ip和end_ip是这条命令中唯二的变量，在执行剧本时将始末IP地址参数传入变量，最终实现命令的完整下发。


## 测试反馈&结果
### 测试

执行剧本：
<pre class="brush: cpp; highlight: [1]">
ansible-playbook -e "a_ip=1.1.1.1 z_ip=1.1.1.2" bas_add_ip_segments.yml
</pre>
在执行剧本任务时，使用 -e 可后缀需要传递到剧本内的参数。
### 反馈

![](   https://themeiwu.com/img/tech/20190613tech01.PNG){: width="800px"}

### 结论

测试达到预期效果，但操作过程还是相对繁琐，下一步借助其他工具进一步简化操作，躲不过了，还是用shell写脚本吧。。。

P.S. 代码高亮功能研究成功！！

P.P.S. 正在考虑去掉博客的全局BGM，越来越觉得现在这样体验不好，有时间搞搞。

就这样，Dear you，goodnight！

## 参考资料

[Ansible: hosts文件拆分为inventory和定义inventory全局变量](https://www.cnblogs.com/William-Guozi/p/ansible_hosts.html)

[使用CloudEngine-Ansible批量管理华为CE交换机](https://www.jianshu.com/p/b2b3cffa972b)
