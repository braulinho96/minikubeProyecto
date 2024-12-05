package com.tutorial.followupservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class FollowupServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FollowupServiceApplication.class, args);
	}

}
