package com.zk.springcloud.feignconsumer.controller;

import com.zk.springcloud.feignconsumer.service.HelloService;
import com.zk.springcloud.feignconsumer.service.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * 创建controller来实现对feign客户端的调用
 * 注入helloservice实列，并在该controller函数中绑定helloservice服务的客户端，来向该服务的/hello接口调用
 */
@RestController
public class ConsumerController {
	@Autowired
	HelloService helloService;


	@RequestMapping(value = "/feign-consumer",method = RequestMethod.GET)
	public  String helloConsumer(){
		return helloService.hello();
	}

	@RequestMapping(value = "/feign-consumer1",method = RequestMethod.GET)
	public  String helloConsumer1(){
		return helloService.hello1("zhangsan1");
	}

	@RequestMapping(value = "/feign-consumer2",method = RequestMethod.GET)
	public  String helloConsumer2(){
		return helloService.hello2("zhangsan2",29).toString();
	}

	@RequestMapping(value = "/feign-consumer3",method = RequestMethod.POST)
	public  String helloConsumer3(){
		return helloService.hello3(new User("zhangsan3",30));
	}
}

