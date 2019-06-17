package com.zk.springcloud.feignconsumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * 创建回调类
 * 创建HelloRemoteHystrix类继承HelloRemote实现回调的方法
 */
@RestController
public class HelloServiceHystrix implements HelloService{

	@Override
	public String hello() {
		return "hello , this messge send failed ";
	}


}

