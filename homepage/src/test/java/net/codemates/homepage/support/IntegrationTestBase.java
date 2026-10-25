package net.codemates.homepage.support;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfig.class)
@TestPropertySource(properties= {
									"DB_PASSWORD=test",
									"spring.sql.init.mode=always",
									"spring.sql.init.schema-locations=classpath:db/schema.sql" 
								}
					)
public abstract class IntegrationTestBase {

	static final Path UPLOAD_DIR;
	
	static {	try {UPLOAD_DIR=Files.createTempDirectory("uploads=test");}
				catch (IOException e) {throw new UncheckedIOException(e);}
			}
	
	@DynamicPropertySource
	static void props(DynamicPropertyRegistry r) {
		
		r.add("file.upload-dir",UPLOAD_DIR::toString);
		
	}
	
	@Autowired protected MockMvc mockMvc;
	@Autowired protected JdbcTemplate jdbc;
	@Autowired protected PasswordEncoder passwordEncoder;
	
	@BeforeEach
	void cleanDb() {
		
		jdbc.execute("TRUNCATE members, items, item_rental_histories, news, technologies, member_technologies RESTART IDENTITY CASCADE");
		
	}
	
}
