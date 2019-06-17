package com.zk.springcloud.feignconsumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 暴露端口
 */
@RestController
public class HystrixTest {

	@Autowired
	private  HelloService helloService;

	@RequestMapping("/hystrix-consumer")
	public String index(){
		return helloService.hello();
	}

}

