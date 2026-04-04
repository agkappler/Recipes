package com.fargopolis.services;

import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.http.ContentStreamProvider;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.SdkHttpFullRequest;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.http.SdkHttpResponse;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrock.BedrockClient;
import software.amazon.awssdk.services.bedrockdataautomation.BedrockDataAutomationClient;
import software.amazon.awssdk.utils.IoUtils;

@Service
public class BedrockDataAutomationService {
    private static final Logger logger = LoggerFactory.getLogger(BedrockDataAutomationService.class);

    private final Region region;
    private final DefaultCredentialsProvider credentialsProvider;
    private final SdkHttpClient httpClient;

    @Autowired
    public BedrockDataAutomationService() {
        this.region = Region.US_EAST_1;
        this.credentialsProvider = DefaultCredentialsProvider.create();
        this.httpClient = ApacheHttpClient.builder().build();
    }

    /**
     * Directly invokes Amazon Bedrock Data Automation synchronously
     * 
     * @param projectArn  The ARN of the data automation project
     * @param inputS3Uri  The S3 URI for the input data
     * @param outputS3Uri The S3 URI for the output data
     * @return The invocation ARN from the response
     * @throws Exception if the request fails
     */
    public String invokeDataAutomation(String projectArn, String inputS3Uri, String outputS3Uri) throws Exception {
        logger.info("Directly invoking Bedrock Data Automation for project: {}", projectArn);

        try {
            // Build the request payload
            JSONObject requestBody = new JSONObject();

            JSONObject dataAutomationConfig = new JSONObject();
            dataAutomationConfig.put("dataAutomationProjectArn", projectArn);
            requestBody.put("dataAutomationConfiguration", dataAutomationConfig);

            JSONObject inputConfig = new JSONObject();
            inputConfig.put("s3Uri", inputS3Uri);
            requestBody.put("inputConfiguration", inputConfig);

            JSONObject outputConfig = new JSONObject();
            outputConfig.put("s3Uri", outputS3Uri);
            requestBody.put("outputConfiguration", outputConfig);

            String requestJson = requestBody.toString();
            byte[] requestBytes = requestJson.getBytes(StandardCharsets.UTF_8);
            logger.debug("Request payload: {}", requestJson);

            // Build the HTTP request
            URI endpoint = URI.create("https://bedrock." + region.id() + ".amazonaws.com");
            ContentStreamProvider contentProvider = () -> new java.io.ByteArrayInputStream(requestBytes);

            SdkHttpFullRequest request = SdkHttpFullRequest.builder()
                    .method(SdkHttpMethod.POST)
                    .uri(endpoint.resolve("/data-automation/invoke"))
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Accept", "application/json")
                    .contentStreamProvider(contentProvider)
                    .build();

            // Execute the request
            // NOTE: This implementation requires AWS Signature Version 4 (SigV4) signing
            // for authentication.
            // You will need to add request signing using AWS SDK's signing capabilities or
            // a signing library.
            // Consider using AWS SDK's request interceptors or a library like
            // aws-request-signing-apache-interceptor
            software.amazon.awssdk.http.HttpExecuteRequest httpRequest = software.amazon.awssdk.http.HttpExecuteRequest
                    .builder()
                    .request(request)
                    .contentStreamProvider(contentProvider)
                    .build();

            software.amazon.awssdk.http.HttpExecuteResponse httpResponse = httpClient.prepareRequest(httpRequest)
                    .call();

            SdkHttpResponse response = httpResponse.httpResponse();

            // Read response
            InputStream responseStream = httpResponse.responseBody().orElse(null);
            if (responseStream == null) {
                throw new RuntimeException("No response body received");
            }
            String responseBody = IoUtils.toUtf8String(responseStream);
            logger.debug("Response: {}", responseBody);

            if (response.statusCode() != 200) {
                throw new RuntimeException("Bedrock Data Automation API returned status " +
                        response.statusCode() + ": " + responseBody);
            }

            // Parse response
            JSONObject responseJson = new JSONObject(responseBody);
            String invocationArn = responseJson.optString("invocationArn", null);

            if (invocationArn == null) {
                throw new RuntimeException("Response did not contain invocationArn: " + responseBody);
            }

            logger.info("Data automation invoked successfully. Invocation ARN: {}", invocationArn);
            return invocationArn;

        } catch (Exception e) {
            logger.error("Error invoking Bedrock Data Automation: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Gets the status of a Bedrock Data Automation invocation
     * 
     * @param invocationArn The ARN of the invocation
     * @return The status of the invocation
     * @throws Exception if the request fails
     */
    public String getDataAutomationStatus(String invocationArn) throws Exception {
        logger.info("Getting status for invocation: {}", invocationArn);

        try {
            // Build the HTTP request
            URI endpoint = URI.create("https://bedrock." + region.id() + ".amazonaws.com");
            URI fullUri = endpoint.resolve("/data-automation/status?invocationArn=" +
                    java.net.URLEncoder.encode(invocationArn, StandardCharsets.UTF_8));

            SdkHttpFullRequest request = SdkHttpFullRequest.builder()
                    .method(SdkHttpMethod.GET)
                    .uri(fullUri)
                    .putHeader("Accept", "application/json")
                    .build();

            // Execute the request
            software.amazon.awssdk.http.HttpExecuteRequest httpRequest = software.amazon.awssdk.http.HttpExecuteRequest
                    .builder()
                    .request(request)
                    .build();

            software.amazon.awssdk.http.HttpExecuteResponse httpResponse = httpClient.prepareRequest(httpRequest)
                    .call();

            SdkHttpResponse response = httpResponse.httpResponse();

            // Read response
            InputStream responseStream = httpResponse.responseBody().orElse(null);
            if (responseStream == null) {
                throw new RuntimeException("No response body received");
            }
            String responseBody = IoUtils.toUtf8String(responseStream);
            logger.debug("Response: {}", responseBody);

            if (response.statusCode() != 200) {
                throw new RuntimeException("Bedrock Data Automation API returned status " +
                        response.statusCode() + ": " + responseBody);
            }

            // Parse response
            JSONObject responseJson = new JSONObject(responseBody);
            String status = responseJson.optString("status", "UNKNOWN");

            logger.info("Status for invocation {}: {}", invocationArn, status);
            return status;

        } catch (Exception e) {
            logger.error("Error getting Bedrock Data Automation status: {}", e.getMessage(), e);
            throw e;
        }
    }
}
