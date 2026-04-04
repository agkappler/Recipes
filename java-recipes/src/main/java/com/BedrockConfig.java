package com;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrock.BedrockClient;
import software.amazon.awssdk.services.bedrockagent.BedrockAgentClient;

@Configuration
public class BedrockConfig {
    @Bean
    public BedrockClient bedrockClient() {
        return BedrockClient.builder()
                .region(Region.US_EAST_1)
                .build();
    }

    @Bean
    public BedrockAgentClient bedrockAgentClient() {
        return BedrockAgentClient.builder()
                .region(Region.US_EAST_1)
                .build();
    }
}
