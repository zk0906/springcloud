package com.zk.springcloud.ribbonconsumer.controller;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * 改造服务的消费方式，新增helloservice类，注入RestTemplate实例，
 * 然后ConsumrController中对ReatTemplate的使用迁移到helloService的函数中去，
 * 最后在helloservice函数上加上@HystrixConmand注解来制定回调方法
 */
@Service
public class HelloService {
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(HelloService.class);
    @Autowired
    RestTemplate restTemplate;
    @HystrixCommand(fallbackMethod = "helloFallback")
    public String helloService(){
        long start=System.currentTimeMillis();
        String result=restTemplate.getForEntity("http://HELLO-SERVICE/hello2",String.class).getBody();
        long end=System.currentTimeMillis();
        logger.info("spend time:"+(end-start));
        return result.toString();
    }

    public String helloFallback(){
        return "error";
    }

}

