package net.codemates.homepage.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		
		return new BCryptPasswordEncoder();
		
	}
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
		
		return configuration.getAuthenticationManager();
		
	}
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		
		CorsConfiguration configuration=new CorsConfiguration();
		//別オリジンのURL
		configuration.setAllowedOrigins(List.of(" !! placeHolder !! "));
		//許可するHTTPメソッド
		configuration.setAllowedMethods(List.of(" !! placeHolder !! "));
		//許可するHTTPヘッダ
		configuration.setAllowedHeaders(List.of("*"));
		//Cookie(JSESSIONID)付きリクエストを許可
		configuration.setAllowCredentials(true);
		
		//CORSを適用するURLを設定
		UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**",configuration);
		
		return source;
		
	}
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
		
		//CSRFについては後で検討
		http.csrf(csrf->csrf.disable())
		.cors(cors->cors.configurationSource(corsConfigurationSource()))
		//ログイン時に必要になったらセッションを作成する
		.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
		.authorizeHttpRequests(auth->auth
				 //ログインや会員登録などの認証不要なエンドポイントを指定
				.requestMatchers(HttpMethod.POST,"/api/auth","/api/auth/login").permitAll()
				.anyRequest().authenticated()
				)
		//Spring Securityのデフォルトのログインフォームを無効化(フロントの画面を使用)
		.formLogin(form->form.disable()) 
		.logout(logout->logout
				//ログアウトエンドポイントを指定
				.logoutUrl("/api/auth/logout")
				//HttpSessionを破棄
				.invalidateHttpSession(true)
				//SecurityContextHolderの認証情報をクリア
				.clearAuthentication(true)
				//ログアウト成功時の処理を定義
				.logoutSuccessHandler((request,response,authentication)->{
					//ログアウト成功時のステータスコードを設定
					response.setStatus(HttpServletResponse.SC_OK);
				})
		);
		
		return http.build();
		
	}
	
}
