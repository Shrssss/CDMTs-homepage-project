package net.codemates.homepage.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ThumbnailStorageService {

	private static final Map<String,String> ALLOWED=Map.of("image/jpeg","jpg","image/png","png","image/gif","gif");
	
	private final Path root;
	
	public ThumbnailStorageService(@Value("${file.upload-dir}")String uploadDir)throws IOException{
		
		this.root=Paths.get(uploadDir).toAbsolutePath().normalize().resolve("news");
		
		Files.createDirectories(root);
		
	}
	
	
	
	public String save(MultipartFile file) {
		
		if()
		
	}
	
}
