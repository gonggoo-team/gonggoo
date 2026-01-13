//package com.gonggoo.gonggoo.coopost.service;
//
//import com.gonggoo.gonggoo.coopost.domain.*;
//import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
//import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
//import com.gonggoo.gonggoo.coopost.repository.CoopostMemberRepository;
//import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
//import com.gonggoo.gonggoo.global.exception.NeighborsException;
//import com.gonggoo.gonggoo.global.response.ErrorCode;
//import com.gonggoo.gonggoo.member.domain.Member;
//import com.gonggoo.gonggoo.member.repository.MemberRepository;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Nested;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.test.util.ReflectionTestUtils;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.assertj.core.api.Assertions.assertThatThrownBy;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.BDDMockito.given;
//import static org.mockito.Mockito.verify;
//
//@ExtendWith(MockitoExtension.class)
//class CoopostServiceTest {
//
//    @InjectMocks
//    private CoopostServiceImpl coopostService;
//
//    @Mock
//    private CoopostRepository coopostRepository;
//    @Mock
//    private MemberRepository memberRepository;
//    @Mock
//    private CoopostMemberRepository applyRepository;
//
//    // Helper: Create Member
//    private Member createMember(int id) {
//        Member m = Member.builder().nickname("tester").build();
//        ReflectionTestUtils.setField(m, "id", id);
//        return m;
//    }
//
//    @Nested
//    @DisplayName("공구글 생성 (Create)")
//    class CreateTest {
//        @Test
//        @DisplayName("성공: 요청 데이터로 Entity가 생성되어 저장된다")
//        void create_success() {
//            // given
//            int memberId = 1;
//            CoopostCreateRequest req = new CoopostCreateRequest();
//            req.setTitle("새 공구");
//            req.setContent("내용");
//            req.setPricePerUnit(BigDecimal.valueOf(1000));
//            req.setMinParticipants(1);
//            req.setMaxParticipants(5);
//            req.setLocation("서울");
//            req.setDeadlineAt(LocalDateTime.now().plusDays(1));
//
//            Member member = createMember(memberId);
//
//            given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
//            // 저장된 객체 반환 Mocking
//            given(coopostRepository.save(any(Coopost.class))).willAnswer(inv -> {
//                Coopost c = inv.getArgument(0);
//                ReflectionTestUtils.setField(c, "coopostId", UUID.randomUUID()); // ID 생성 시늉
//                return c;
//            });
//
//            // when
//            CoopostResponse response = coopostService.create(req, memberId);
//
//            // then
//            assertThat(response.getTitle()).isEqualTo("새 공구");
//            assertThat(response.getStatus()).isEqualTo(CoopostStatus.OPEN); // 기본값 확인
//            verify(coopostRepository).save(any(Coopost.class));
//        }
//    }
//
//    @Nested
//    @DisplayName("공구글 삭제 (Delete)")
//    class DeleteTest {
//        @Test
//        @DisplayName("성공: softDelete가 호출되어 deletedAt이 찍힌다")
//        void delete_success() {
//            // given
//            UUID coopostId = UUID.randomUUID();
//            Coopost coopost = Coopost.builder()
//                    .member(createMember(1))
//                    .title("삭제할 글")
//                    .status(CoopostStatus.OPEN)
//                    .build();
//            ReflectionTestUtils.setField(coopost, "coopostId", coopostId);
//
//            given(coopostRepository.findById(coopostId)).willReturn(Optional.of(coopost));
//
//            // when
//            coopostService.delete(coopostId);
//
//            // then
//            assertThat(coopost.getDeletedAt()).isNotNull(); // 삭제 시간 기록 확인
//        }
//
//        @Test
//        @DisplayName("실패: 없는 글을 삭제하려 하면 예외 발생")
//        void delete_fail_not_found() {
//            // given
//            UUID coopostId = UUID.randomUUID();
//            given(coopostRepository.findById(coopostId)).willReturn(Optional.empty());
//
//            // when & then
//            assertThatThrownBy(() -> coopostService.delete(coopostId))
//                    .isInstanceOf(NeighborsException.class)
//                    .hasMessage(ErrorCode.COOPOST_NOT_FOUND.getMessage());
//        }
//    }
//
//    @Nested
//    @DisplayName("공구글 상태 변경 (ChangeStatus)")
//    class ChangeStatusTest {
//        @Test
//        @DisplayName("성공: 상태가 변경된다")
//        void change_status_success() {
//            // given
//            UUID coopostId = UUID.randomUUID();
//            Coopost coopost = Coopost.builder()
//                    .member(createMember(1))
//                    .status(CoopostStatus.OPEN)
//                    .build();
//
//            given(coopostRepository.findById(coopostId)).willReturn(Optional.of(coopost));
//
//            // when
//            CoopostResponse res = coopostService.changeStatus(coopostId, CoopostStatus.COMPLETED);
//
//            // then
//            assertThat(res.getStatus()).isEqualTo(CoopostStatus.COMPLETED);
//            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.COMPLETED);
//        }
//    }
//}