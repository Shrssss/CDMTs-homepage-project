package net.codemates.homepage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") 
            	.allowedOrigins(" !! placeHolder !! ") //別オリジンのURL
                .allowedMethods(" !! placeHolder !! ");	//許可するHTTPメソッド
    }
}
