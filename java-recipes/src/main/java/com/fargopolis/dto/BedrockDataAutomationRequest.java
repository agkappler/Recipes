package com.fargopolis.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BedrockDataAutomationRequest {
	private String projectArn;
	private String inputS3Uri;
	private String outputS3Uri;
}


