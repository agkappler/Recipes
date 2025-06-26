package com.fargopolis.facades;
import java.io.IOException;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.AppConfigProperties;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
public class S3Facade {

	@Autowired
	private S3Client s3Client;
	
	@Autowired
	private S3Presigner s3Presigner;
	
	@Autowired
	private AppConfigProperties appConfig;

	public void uploadFileToS3(MultipartFile file, String key) throws IOException {
	    String bucketName = this.appConfig.getS3BucketName();
		PutObjectRequest putReq = PutObjectRequest.builder()
	        .bucket(bucketName)
	        .key(key)
	        .contentType(file.getContentType())
	        .build();

	    s3Client.putObject(putReq, RequestBody.fromBytes(file.getBytes()));
	}
	
	public String generatePresignedUrl(String key) {
		String bucketName = this.appConfig.getS3BucketName();
	    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
	        .bucket(bucketName)
	        .key(key)
	        .build();

	    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
	        .signatureDuration(Duration.ofMinutes(15))
	        .getObjectRequest(getObjectRequest)
	        .build();

	    return s3Presigner.presignGetObject(presignRequest).url().toString();
	}
}
