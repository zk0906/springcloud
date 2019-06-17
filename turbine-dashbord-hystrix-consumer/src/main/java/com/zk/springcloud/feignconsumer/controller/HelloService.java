package com.zk.springcloud.feignconsumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * 在HelloService类添加指定fallback类，在服务熔断的时候返回fallback类中的内容。
 */
@FeignClient(name = "hello-service",fallback = HelloServiceHystrix.class)
public interface HelloService {

    @RequestMapping("/hello")
    public String hello();

}

