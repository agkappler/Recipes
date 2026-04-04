package com.fargopolis.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BedrockDataAutomationResponse {
	private String invocationArn;
	private String status;
}


