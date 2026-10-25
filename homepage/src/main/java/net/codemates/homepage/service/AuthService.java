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
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.codemates.homepage.exception.BusinessException;
import net.codemates.homepage.exception.DbAssertions;
import net.codemates.homepage.exception.ErrorCode;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.model.dto.member.MemberCreateRequest;
import net.codemates.homepage.model.dto.member.MemberLoginRequest;
import net.codemates.homepage.model.dto.member.MemberPasswordUpdateRequest;
import net.codemates.homepage.model.dto.member.MemberResponse;
import net.codemates.homepage.model.entity.Member;
import net.codemates.homepage.security.MemberUserDetails;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

	private final MemberMapper memberMapper;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;
	
	private final CsrfTokenRepository csrfTokenRepository;

	private final SecurityContextRepository securityContextRepository=new HttpSessionSecurityContextRepository();
	
	private MemberResponse toResponse(Member member) {
		return new MemberResponse(
				member.getId(),
				member.getName(),
				member.getGrade(),
				member.getPosition());
	}
	
	private static String mask(String s) {
		if(s==null||s.length()<=3)return "***";
		return s.substring(0,3)+"***";
	}
	
	private Long currentMemberId(){
	    Authentication auth=SecurityContextHolder.getContext().getAuthentication();
	    return ((MemberUserDetails)auth.getPrincipal()).getMember().getId();
	}

	@Transactional
	public Long createMember(MemberCreateRequest memberDto) {
		
		if(memberMapper.findByStudentIdOrEmail(memberDto.getStudentId())!=null) throw new BusinessException(ErrorCode.DUPLICATE_STUDENT_ID);
		
		if(memberMapper.findByStudentIdOrEmail(memberDto.getEmail())!=null) throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
		
		Member memberEntity=memberDto.toEntity(passwordEncoder.encode(memberDto.getPassword()));
		
		int insertCount=memberMapper.insert(memberEntity);
		
		DbAssertions.requireAffected(1, insertCount);
		
		log.info("member registered: id={}",memberEntity.getId());
		
		return memberEntity.getId();
		
	}
	
	
	public Long login(MemberLoginRequest memberDto,HttpServletRequest request,HttpServletResponse response) {

		Authentication authRequest=new UsernamePasswordAuthenticationToken(memberDto.getIdentifier(),memberDto.getPassword());
		
		Authentication authResult;
		
		try {
			authResult=authenticationManager.authenticate(authRequest);
		}catch(BadCredentialsException e) {
			log.warn("login failed: identifier={}",mask(memberDto.getIdentifier()));
			throw new BusinessException(ErrorCode.LOGIN_FAILED);
		}
		
		MemberUserDetails principal=(MemberUserDetails)authResult.getPrincipal();
		
		if(!Boolean.TRUE.equals(principal.getMember().getIsApproved())) {
			log.warn("login rejected: not approved id={}",principal.getMember().getId());
			throw new BusinessException(ErrorCode.ACCOUNT_NOT_APPROVED);
		}
		
		SecurityContext context=SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authResult);
		SecurityContextHolder.setContext(context);
		
		if(request.getSession(false)!=null) request.changeSessionId();
		
		//SecurityContextをHttpSessionに保存
		securityContextRepository.saveContext(context,request,response);
		
		csrfTokenRepository.saveToken(csrfTokenRepository.generateToken(request), request, response);
		
		log.info("login success: id={}",principal.getMember().getId());
		
		return principal.getMember().getId();
		
	}
	
	@Transactional
	public Long updatePassword(Long id,MemberPasswordUpdateRequest memberDto) {
		
		MemberUserDetails principal=(MemberUserDetails)SecurityContextHolder
															.getContext()
															.getAuthentication()
															.getPrincipal();
		
		if(!principal.getMember().getId().equals(id)) {
			log.warn("password change denied: target={} actor={}",id,principal.getMember().getId());
			throw new BusinessException(ErrorCode.ACCESS_DENIED);
		}
		
		Member memberEntity=memberMapper.findByIds(List.of(id)).stream().findFirst()
								.orElseThrow(()->new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
		
		if(!passwordEncoder.matches(memberDto.getOldPassword(),memberEntity.getPasswordHash())) throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
		
		int updateCount=memberMapper.updatePassword(id,passwordEncoder.encode(memberDto.getNewPassword()));
		
		DbAssertions.requireAffected(1, updateCount);
		
		log.info("member changed password: id={}",id);
		
		return id;
		
	}
	
	@Transactional
	public Long approveMember(Long id) {
		
		Member memberEntity=memberMapper.findByIds(List.of(id)).stream().findFirst()
									.orElseThrow(()->new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
		
		int updateCount=memberMapper.updateApproval(id,true);
		
		DbAssertions.requireAffected(1,updateCount);
		
		log.info("member approved: id={} by={}",id,currentMemberId());
		
		return id;
		
	}
	
	public List<MemberResponse> getUnApprovedMember(){
		
		List<Member> memberEntities=memberMapper.findUnApprovedMember();
		
		return memberEntities.stream()
				.map(this::toResponse)
				.toList();
		
	}
	
	
	public Long getCurrentMemberId(Authentication auth) {
		
		MemberUserDetails userDetails=(MemberUserDetails)auth.getPrincipal();
		
		return userDetails.getMember().getId();
		
	}
	
	@Transactional
	public Long updateMemberRole(Long id,String role) {
		
		if(!"ADMIN".equals(role)&&!"MEMBER".equals(role)) throw new BusinessException(ErrorCode.ROLE_MISMATCH);
		
		int updateCount=memberMapper.updateMemberRole(id,role);
		
		DbAssertions.requireAffected(1,updateCount);
		
		log.info("member updated role: id={} to={} by={}",id,role,currentMemberId());
		
		return id;
		
	}
	
}
