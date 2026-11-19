package net.codemates.homepage.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class Fixtures {

	@Autowired JdbcTemplate jdbc;
	@Autowired PasswordEncoder encoder;
	public static final String PW = "password1234";
	
	public long member(String name,String studentId,String email,int grade,String position,boolean approved,String role) {
		
		return jdbc.queryForObject("""
				INSERT INTO members(name,student_id,email,grade,position,.password_hash,is_approved,role)
				VALUES (?,?,?,?,?,?,?,?) RETURNING id
				""",
				Long.class,name,studentId,email,grade,position,encoder.encode(PW),approved,role);
		
	}
	
	public long admin(){ return member("Admin","10A0001","admin@example.jp",4,"代表",true,"ADMIN"); }
	public long memberA() { return member("Tanaka","11A0001","a@example.jp",1,"会計",true,"MEMBER"); }
	public long memberB() { return member("Suzuki","12A0002","b@example.jp",2,null,true,"MEMBER"); }
	public long pending() { return member("Sato","13A0003","p@examplex.jp",3,null,false,"MEMBER"); }

	public long item(String name, int qty, boolean rentable) { 

		return jdbc.queryForObject("""
				INSERT INTO items(name,qty,rentable)
				VALUES(?,?,?) RETURNING id
				""",
				Long.class,name,qty,rentable);
	
	}
	
	public long news(String title, String category, boolean published) { 

		return jdbc.queryForObject("""
				INSERT INTO news(title,category,published)
				VALUES(?,?,?) RETURNING id
				""",
				Long.class,title,category,published);
	
	}
	
	public long technology(String name) { 

		return jdbc.queryForObject("""
				INSERT INTO technology(name)
				VALUES(?) RETURNING id
				""",
				Long.class,name);
		
	}
	
	public long link(long memberId, long techId) { 

		return jdbc.queryForObject("""
				INSERT INTO member_technologies(memberId,techId)
				VALUES(?) RETURNING id 
				""",
				Long.class,memberId,techId);
		
	}
	
}
