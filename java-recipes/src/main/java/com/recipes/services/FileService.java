package com.recipes.services;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.recipes.enums.FileRole;
import com.recipes.facades.S3Facade;
import com.recipes.models.FileMetadata;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class FileService extends BaseService {
	private static final String INSERT_FILE_METADATA_SQL = "INSERT INTO files (uu_id, filename, content_type, size_bytes, file_role) VALUES (?,?,?,?,?) RETURNING file_id";
	private static final String GET_ALL_FILE_METADATA_SQL = "SELECT * FROM files";
	private static final String GET_FILE_METADATA_BY_ID_SQL = "SELECT * FROM files WHERE file_id = ?";
	
	@Autowired
	private S3Facade s3Facade;

	public FileService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}

	public FileMetadata uploadFile(MultipartFile file, FileRole fileRole) throws IOException, SQLException {
		String uuId = UUID.randomUUID().toString();
		String filename = file.getOriginalFilename();
		String key = this.getS3Key(uuId, filename);
		this.s3Facade.uploadFileToS3(file, key);
		
		FileMetadata fileMetadata = new FileMetadata();
		fileMetadata.setUuId(uuId);
		fileMetadata.setFilename(filename);
		fileMetadata.setContentType(file.getContentType());
		fileMetadata.setSizeBytes(file.getSize());
		fileMetadata.setFileRole(fileRole);
		
		this.insertFileMetadata(fileMetadata);
		fileMetadata.setUrl(this.getAndSetUrlForFile(fileMetadata));
		
		return fileMetadata;
	}
	
	public FileMetadata insertFileMetadata(FileMetadata fileMetadata) throws SQLException {
		Integer fileId = this.data.InsertWithKey(
			INSERT_FILE_METADATA_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, fileMetadata.getUuId());
				ps.setString(2, fileMetadata.getFilename());
				ps.setString(3, fileMetadata.getContentType());
				ps.setLong(4, fileMetadata.getSizeBytes());
				ps.setInt(5, fileMetadata.getFileRole().getValue());
			});
		fileMetadata.setFileId(fileId);
		return fileMetadata;
	}
	
	public List<FileMetadata> getAllFileMetadata(String key) throws SQLException {
		return data.Query(
			GET_ALL_FILE_METADATA_SQL,
			null,
			(ResultSet rs) -> this.mapFile(rs)
		);
	}
	
	public FileMetadata getFileMetadataById(Integer fileId) throws SQLException, ObjectNotFoundException {
		List<FileMetadata> results = data.Query(
			GET_FILE_METADATA_BY_ID_SQL,
			(PreparedStatement ps) -> ps.setInt(1, fileId),
			(ResultSet rs) -> this.mapFile(rs)
		);
		
		if (results.size() == 0) {
			throw new ObjectNotFoundException("Failed to load File Metadata with id: " + fileId);
		}
		
		return results.get(0);
	}
	
	public String getAndSetUrlForFile(FileMetadata file) {
		String url = this.s3Facade.generatePresignedUrl(this.getS3Key(file.getUuId(), file.getFilename()));
		file.setUrl(url);
		return url;
	}
	
	public String getUrlForFileById(Integer fileId) throws Exception {
		return this.getAndSetUrlForFile(this.getFileMetadataById(fileId));
	}
	
	private String getS3Key(String uuId, String fileName) {
		return uuId + "_" + fileName;
	}
	
	private FileMetadata mapFile(ResultSet rs) throws SQLException {
		FileMetadata fileMetadata = new FileMetadata();
		fileMetadata.setFileId(rs.getInt("file_id"));
		fileMetadata.setUuId(rs.getString("uu_id"));
		fileMetadata.setFilename(rs.getString("filename"));
		fileMetadata.setContentType(rs.getString("content_type"));
		fileMetadata.setSizeBytes(rs.getLong("size_bytes"));
		fileMetadata.setFileRole(FileRole.getByValue(rs.getInt("file_role")));
		return fileMetadata;
	}
}
