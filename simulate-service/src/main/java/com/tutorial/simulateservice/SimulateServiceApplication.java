package com.tutorial.simulateservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class SimulateServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimulateServiceApplication.class, args);
	}

}
