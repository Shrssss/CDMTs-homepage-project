package net.codemates.homepage.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.model.dto.member.MemberCreateRequest;
import net.codemates.homepage.model.dto.member.MemberLoginRequest;
import net.codemates.homepage.model.entity.Member;
import net.codemates.homepage.security.MemberUserDetails;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final MemberMapper memberMapper;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;

	private final SecurityContextRepository securityContextRepository=new HttpSessionSecurityContextRepository();

	@Transactional
	public Long createMember(MemberCreateRequest memberDto) {
		
		if(memberMapper.findByStudentIdOrEmail(memberDto.getStudentId())!=null) throw new IllegalArgumentException("Creation Failed");
		
		if(memberMapper.findByStudentIdOrEmail(memberDto.getEmail())!=null) throw new IllegalArgumentException("Creation Failed");
		
		Member memberEntity=memberDto.toEntity(passwordEncoder.encode(memberDto.getPassword()));
		
		memberMapper.insert(memberEntity);
		
		return memberEntity.getId();
		
	}
	
	
	public Long login(MemberLoginRequest memberDto,HttpServletRequest request,HttpServletResponse response) {

		Authentication authRequest=new UsernamePasswordAuthenticationToken(memberDto.getIdentifier(),memberDto.getPassword());
		
		Authentication authResult;
		
		try {
			authResult=authenticationManager.authenticate(authRequest);
		}catch(BadCredentialsException e) {
			throw new IllegalArgumentException("Login Failed");
		}
		
		SecurityContext context=SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authResult);
		SecurityContextHolder.setContext(context);
		
		//SecurityContextをHttpSessionに保存
		securityContextRepository.saveContext(context,request,response);
		
		MemberUserDetails principal=(MemberUserDetails)authResult.getPrincipal();
		
		return principal.getMember().getId();
		
	}
	
	@Transactional
	public Long updatePassword(Long id,String oldPassword,String newPassword) {
		
		MemberUserDetails principal=(MemberUserDetails)SecurityContextHolder
															.getContext()
															.getAuthentication()
															.getPrincipal();
		
		if(!principal.getMember().getId().equals(id)) throw new IllegalArgumentException("Update Failed");
		
		Member memberEntity=memberMapper.findByIds(List.of(id)).stream().findFirst()
								.orElseThrow(()->new IllegalArgumentException("Update Failed"));
		
		if(!passwordEncoder.matches(oldPassword,memberEntity.getPasswordHash())) throw new IllegalArgumentException("Update Failed");
		
		int updateCount=memberMapper.updatePassword(id,passwordEncoder.encode(newPassword));
		
		if(updateCount!=1) throw new IllegalArgumentException("Update Failed");
		
		return id;
		
	}
	
}
