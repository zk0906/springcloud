package com.zk.springcloud.feignconsumer.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * 使用注解指定服务名来绑定服务
 * 再使用SpringSVC注解来绑定具体该服务提供得REST接口
 */
@FeignClient("hello-service")
public interface HelloService {

	@RequestMapping("/hello")
	String hello();

	@RequestMapping(value = "/hello1",method = RequestMethod.GET)
	 String hello1(@RequestParam("name") String name);

	@RequestMapping(value = "/hello2",method = RequestMethod.GET)
	 User hello2(@RequestHeader("name") String name, @RequestHeader("age") Integer age);

	@RequestMapping(value = "/hello3",method = RequestMethod.POST)
	 String hello3(@RequestBody User user);

}





