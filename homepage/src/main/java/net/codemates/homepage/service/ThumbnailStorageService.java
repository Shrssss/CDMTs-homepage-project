package net.codemates.homepage.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.codemates.homepage.exception.BusinessException;
import net.codemates.homepage.exception.ErrorCode;

@Service
public class ThumbnailStorageService {

	private static final Map<String,String> ALLOWED=Map.of("image/jpeg","jpg","image/png","png","image/gif","gif");
	
	private final Path root;
	
	public ThumbnailStorageService(@Value("${file.upload-dir}")String uploadDir)throws IOException{
		
		this.root=Paths.get(uploadDir).toAbsolutePath().normalize().resolve("news");
		
		Files.createDirectories(root);
		
	}
	
	public String save(MultipartFile file) {
		
		if(file==null||file.isEmpty())throw new BusinessException(ErrorCode.INVALID_IMAGE_FILE);
		
		String ext=ALLOWED.get(file.getContentType());
		
		if(ext==null)throw new BusinessException(ErrorCode.INVALID_IMAGE_FILE);
		
		try(InputStream in=file.getInputStream()){
			
			if(ImageIO.read(in)==null)throw new BusinessException(ErrorCode.INVALID_IMAGE_FILE);
			
		}catch(IOException e){
			
			throw new BusinessException(ErrorCode.INVALID_IMAGE_FILE);
			
		}
		
		String filename=UUID.randomUUID()+"."+ext;
		
		try {
			
			file.transferTo(root.resolve(filename));
			
		}catch(IOException e){
			
			throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
			
		}
		
		return "/uploads/news/"+filename;
		
	}
	
}
