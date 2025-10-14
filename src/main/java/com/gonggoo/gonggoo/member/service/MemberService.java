package com.gonggoo.gonggoo.member.service;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.dto.request.LocationUpdateRequest;
import com.gonggoo.gonggoo.member.dto.request.MemberSignupRequest;
import com.gonggoo.gonggoo.member.dto.request.MemberUpdateRequest;
import com.gonggoo.gonggoo.member.dto.response.EmailCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.LocationResponse;
import com.gonggoo.gonggoo.member.dto.response.MemberResponse;
import com.gonggoo.gonggoo.member.dto.response.NicknameCheckResponse;
import com.gonggoo.gonggoo.member.dto.response.PhoneNumberCheckResponse;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberResponse save(MemberSignupRequest request) {
        validateDuplicate(request);
        String hashedPassword = passwordEncoder.encode(request.password());
        GeoLocation geolocation = new GeoLocation(request.location().getLatitude(), request.location().getLongitude());
        Member member = Member.builder()
                .nickname(request.nickname())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .password(hashedPassword)
                .location(geolocation)
                .build();

        Member savedMember = memberRepository.save(member);
        return MemberResponse.from(savedMember);
    }

    public void validateDuplicate(MemberSignupRequest memberSignupRequest) {
        if (validateDuplicateEmail(memberSignupRequest.email()).exists()) {
            throw new IllegalStateException("이미 사용중인 이메일입니다.");
        }

        if (validateDuplicatePhoneNumber(memberSignupRequest.phoneNumber()).exists()) {
            throw new IllegalStateException("이미 등록된 전화번호입니다.");
        }
    }

    public EmailCheckResponse validateDuplicateEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return EmailCheckResponse.of(email, exists);
    }

    public PhoneNumberCheckResponse validateDuplicatePhoneNumber(String phoneNumber) {
        boolean exists = memberRepository.existsByPhoneNumber(phoneNumber);
        return PhoneNumberCheckResponse.of(phoneNumber, exists);
    }


    public NicknameCheckResponse validateDuplicateNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return NicknameCheckResponse.of(nickname, exists);
    }

    @Transactional
    public MemberResponse update(int id, MemberUpdateRequest memberUpdateRequest) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member가 없습니다"));

        applyIfChanged(memberUpdateRequest.nickname(), member::getNickname, member::changeNickname);
        applyIfChanged(memberUpdateRequest.phoneNumber(), member::getPhoneNumber, member::changePhoneNumber);
        applyIfChanged(memberUpdateRequest.email(), member::getEmail, member::changeEmail);
        applyIfChanged(memberUpdateRequest.profileImage(), member::getProfileImage, member::changeProfileImage);

        return MemberResponse.from(member);
    }

    public void delete(int id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member가 없습니다"));

        memberRepository.deleteById(id);
    }

    private <T> void applyIfChanged(T newValue,
                                Supplier<T> currentGetter,
                                Consumer<T> applier) {
        if (newValue != null && !Objects.equals(newValue, currentGetter.get())) {
            applier.accept(newValue);
        }
    }

    public LocationResponse getLocation(int id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member가 없습니다"));

        return LocationResponse.of(member.getLocation(), member.getModifiedAt());
    }

    @Transactional
    public MemberResponse updateLocation(int id, LocationUpdateRequest locationUpdateRequest) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member가 없습니다"));

        GeoLocation requestMemberLocation = new GeoLocation(locationUpdateRequest.latitude(),
                locationUpdateRequest.longitude());

        applyIfChanged(requestMemberLocation, member::getLocation, member::changeLocation);
        return MemberResponse.from(member);
    }
}
