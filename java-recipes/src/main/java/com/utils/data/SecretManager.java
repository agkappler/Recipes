package com.utils.data;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

public class SecretManager {
	public static String getSecret(String secretName, String regionName) {
	    Region region = Region.of(regionName);

	    // Create a Secrets Manager client
	    SecretsManagerClient client = SecretsManagerClient.builder()
	            .region(region)
	            .build();

	    GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
	            .secretId(secretName)
	            .build();

	    GetSecretValueResponse getSecretValueResponse;

	    try {
	        getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
	    } catch (Exception e) {
	        // For a list of exceptions thrown, see
	        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
	        throw e;
	    }

	    String secret = getSecretValueResponse.secretString();
	    System.out.println(secret);
	    return secret;
	    // Your code goes here.
	}
}
