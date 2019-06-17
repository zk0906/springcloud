package com.zk.springcloud.feignconsumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.cloud.openfeign.EnableFeignClients;

//todo 面板有问题 springboot2.0下hystrix dashboard Unable to connect to Command Metric Stream解决办法
//https://blog.csdn.net/ddxd0406/article/details/79643059
@EnableDiscoveryClient
@EnableFeignClients//开启feign功能
@SpringBootApplication
@EnableHystrixDashboard
@EnableCircuitBreaker
public class DashboardHystrixConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(DashboardHystrixConsumerApplication.class, args);
	}

}

