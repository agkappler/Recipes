package com.fargopolis.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fargopolis.dto.ImageUrl;
import com.fargopolis.enums.FileRole;
import com.fargopolis.models.FileMetadata;
import com.fargopolis.services.FileService;

@RestController
//@RequestMapping("/files")
public class FileController extends BaseApiController {

	@Autowired
	private FileService fileService;

    @PostMapping("/uploadFile")
    public ResponseEntity<FileMetadata> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("fileRole") FileRole fileRole) throws Exception {
        permissions.canWrite();
    	FileMetadata fileMetadata = fileService.uploadFile(file, fileRole);
        return ResponseEntity.ok(fileMetadata);
    }

    @GetMapping("/fileUrl")
    public ResponseEntity<ImageUrl> getFileUrl(@RequestParam FileMetadata fileMetadata) {
        permissions.canRead();
    	String url = fileService.getAndSetUrlForFile(fileMetadata);
        return ResponseEntity.ok(new ImageUrl(url));
    }
    
    @GetMapping("/fileUrl/{fileId}")
    public ResponseEntity<FileMetadata> getFileUrlById(@PathVariable("fileId") Integer fileId) throws Exception {
        permissions.canRead();
        
    	FileMetadata fileMetadata = fileService.getFileMetadataById(fileId);
    	fileService.getAndSetUrlForFile(fileMetadata);
        return ResponseEntity.ok(fileMetadata);
    }
    
    @GetMapping("/getLatestResumeUrl")
    public ResponseEntity<ImageUrl> getLatestResumeUrl() throws Exception {
        permissions.canRead();
    	String url = fileService.getLatestResumeUrl();
        return ResponseEntity.ok(new ImageUrl(url));
    }
}
