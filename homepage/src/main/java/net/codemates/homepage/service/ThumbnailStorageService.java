package net.codemates.homepage.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ThumbnailStorageService {

	private static final Map<String,String> ALLOWED=Map.of("image/jpeg","jpg","image/png","png","image/gif","gif");
	
	private final Path root;
	
	public ThumbnailStorageService(@Value("${file.upload-dir}")String uploadDir)throws IOException{
		
	}
	
}
