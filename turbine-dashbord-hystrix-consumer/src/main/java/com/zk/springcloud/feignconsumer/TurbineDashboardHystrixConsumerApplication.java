package com.zk.springcloud.feignconsumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.cloud.netflix.turbine.EnableTurbine;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableHystrixDashboard
@SpringBootApplication
@EnableTurbine
public class TurbineDashboardHystrixConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TurbineDashboardHystrixConsumerApplication.class, args);
	}

}

