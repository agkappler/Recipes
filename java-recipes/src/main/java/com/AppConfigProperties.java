package com;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
@Primary
public class AppConfigProperties {
    private boolean useAwsSecrets;

    public boolean isUseAwsSecrets() {
        return useAwsSecrets;
    }

    public void setUseAwsSecrets(boolean useAwsSecrets) {
        this.useAwsSecrets = useAwsSecrets;
    }
}
