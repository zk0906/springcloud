package com.zk.springcloud.feignconsumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 * @author zcl
 * @Description
 * @date 2019/5/23 22:49
 */

@RestController
@RefreshScope //使用该注解的类，会在接到SpringCloud配置中心配置刷新的时候，自动将新的配置更新到该类对应的字段中。
public class HelloController {

    //使用@Value注解来获取server端参数的值
    @Value("${neo.hello}")
    private String hello;

    @RequestMapping("/hello")
    public String from(){
        return  this.hello;
    }

}


