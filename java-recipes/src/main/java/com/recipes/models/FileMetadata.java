package com.recipes.models;

import com.recipes.enums.FileRole;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FileMetadata {
	private Integer fileId;
	private String uuId;
	private String filename;
	private String contentType;
	private Long sizeBytes;
	private FileRole fileRole;
	private String url;
}
