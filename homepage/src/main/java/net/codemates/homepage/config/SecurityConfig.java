package net.codemates.homepage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		
		return new BCryptPasswordEncoder();
		
	}
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
		
		http.csrf(csrf->csrf.disable()) //CSRFについては後で検討
		.authorizeHttpRequests(auth->auth
				.requestMatchers(" !! placeHolder !! ").permitAll() //ログインや会員登録などの認証不要なエンドポイントを指定
				.anyRequest().authenticated()
				)
		.formLogin(form->form.disable()) //Spring Securityのデフォルトのログインフォームを無効化(フロントの画面を使用)
		.logout(logout->logout
				.logoutUrl(" !! placeHolder !! ")	//ログアウトエンドポイントを指定
				.logoutSuccessHandler((request,response,authentication)->{	//ログアウト成功時の処理を定義
					response.setStatus(HttpServletResponse.SC_OK);	//ログアウト成功時のステータスコードを設定
				})
		);
		
		return http.build();
		
	}
	
}
