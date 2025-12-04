//package com.gonggoo.gonggoo.payment.service;
//
//
//import com.gonggoo.gonggoo.coopost.domain.Coopost;
//import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
//import com.gonggoo.gonggoo.global.exception.NeighborsException;
//import com.gonggoo.gonggoo.global.response.ErrorCode;
//import com.gonggoo.gonggoo.member.domain.Member;
//import com.gonggoo.gonggoo.payment.dto.PaymentRequest;
//import com.gonggoo.gonggoo.payment.repository.PaymentRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import lombok.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.ErrorResponse;
//import org.springframework.web.client.RestTemplate;
//
//import java.beans.Transient;
//
//import static com.gonggoo.gonggoo.global.response.ErrorCode.COOPOST_NOT_FOUND;
//
//@Service
//@RequiredArgsConstructor
//public class PaymentService {
//
//    private final PaymentRepository paymentRepository;
//    private final CoopostRepository coopostRepository;
//    private final RestTemplate restTemplate = new RestTemplate();
//
//
////    @Value("${payment.api.url}") //yml 파일에 저장할 secret key
//    private String tossSecretKey= "test_sk_***********************"; //임시 설정
//
//    @Transactional
//    public void confirmPayment(Member member, PaymentRequest req){
//
//        // 1. 재고 상태 검증
//        Coopost coopost = coopostRepository.findById(req.getCoopostId())
//                .orElseThrow(()-> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));
//
//    }
//
//
//
//
//}
