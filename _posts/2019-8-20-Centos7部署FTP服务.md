---
layout: post
title: CeotOS7部署FTP服务
category : 技术日志
tags : [tech, centos, ftp]
---

>Centos部署ftp server，记录过程。

## 环境

Centos 7

vsftpd(vsftpd.x86_64 : Very Secure Ftp Daemon)

## 过程

### 搜安装源&安装

<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]# yum search vsftpd
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
* base: centos.01link.hk
* extras: ftp.cuhk.edu.hk
* updates: ftp.cuhk.edu.hk
============================================================================================= N/S matched: vsftpd ==============================================================================================
vsftpd-sysvinit.x86_64 : SysV initscript for vsftpd daemon
vsftpd.x86_64 : Very Secure Ftp Daemon

Name and summary matches only, use "search all" for everything.

[root@ApsatcomLookingGlass ~]# yum install vsftpd.x86_64
</pre>
### 服务器环境配置

主要是防火墙配置。

<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#firewall-cmd --zone=public --add-port=21/tcp --permanent
</pre>
命令含义：

--zone #作用域

--add-port=80/tcp  #添加端口，格式为：端口/通讯协议

--permanent   #永久生效，没有此参数重启后失效

成功设置显示success，重启防火墙
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#firewall-cmd --reload
</pre>

### 修改配置文件

<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#vi /etc/vsftpd/vsftpd.conf
</pre>

禁用匿名用户 YES 改为NO
anonymous_enable=NO

禁止切换根目录 删除#
chroot_local_user=YES

### 创建用户

-新建用户名&密码
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#useradd -d /root/Network_Backup/ -g ftp -s /sbin/nologin XXXXXXX
[root@ApsatcomLookingGlass ~]#passwd XXXXXXX
</pre>

-限制特定用户只能通过FTP访问服务器
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#usermod -s /sbin/nologin XXXXXXX
</pre>

-创建用户目录
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#mkdir -p /data/ftp/pub
[root@ApsatcomLookingGlass ~]#chmod a-w /data/ftp && chmod 777 -R /data/ftp/pub
[root@ApsatcomLookingGlass ~]#usermod -d /data/ftp XXXXX
</pre>

### 其他操作

-关闭SELinux服务
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#setenforce 0
</pre>

-关闭防火墙
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#iptables -F
</pre>

### 重启vsftpd服务
<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]#service vsftpd start
</pre>
至此安装结束。

## 修修补补

根据过往经验，安装完成后一般是不能正常使用的，这次也一样。

安装完成后，client端连接会报错误：530 Permission denied，解决方法：

1.vi /etc/vsftpd/vsftpd.conf 将userlist_enable=YES改为NO

2.检查/etc/pam.d/vsftpd，确认auth required pam_listfile.so item=user sense=deny file=/etc/vsftpd/ftpusers onerr=succeed，确认vsftpd将禁止名单指向了/etc/vsftpd/ftpusers

3.vi /etc/vsftpd/ftpusers，删除相关用户

4.tail -f /var/log/secure查看错误信息，根据相应信息修改

5.如果没有信息，则修改/etc/pam.d/vsftpd文件，注释掉auth required pam_shells.so

6.以上完成后，重启服务。

## PLUS

### 后来的后来

发现Windows下filezilla client连接有问题，账号密码认证通过，但是不能读取目录，具体提示：
<pre class="brush: cpp">
命令:    LIST
错误:    连接超时
错误:    读取目录列表失败
</pre>

该错误是由iptables的配置引起的，临时的解决方法是执行如下命令：

<pre class="brush: cpp">
[root@ApsatcomLookingGlass ~]# modprobe ip_nat_ftp
</pre>

### 后来的后来的后来

同样套路安装装了iperf，异常顺利。

## 参考资料

[解决vsftpd 读取目录列表失败的问题](https://blog.csdn.net/zhuchuanwan/article/details/52910719)

[Centos 7 安装 iperf](https://blog.csdn.net/weixin_42768526/article/details/81162518)
