package com;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "app")
@Component
@Primary
@Getter
@Setter
public class AppConfigProperties {
    private boolean useAwsSecrets;
    private boolean canRead;
    private boolean canWrite;
    private String dbSecretName;
    private String jwtSecretName;
    private String awsSecretRegion;
    private String localJwtKey;
}
