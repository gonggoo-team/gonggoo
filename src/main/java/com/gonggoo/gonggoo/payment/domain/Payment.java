//package com.gonggoo.gonggoo.payment.domain;
//
//
//import com.gonggoo.gonggoo.coopost.domain.Coopost;
//import com.gonggoo.gonggoo.member.domain.Member;
//import jakarta.persistence.*;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Getter
//@NoArgsConstructor
//public class Payment {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String paymentKey;
//    private String orderId;
//    private Long amount;
//
//    private boolean isCancelled;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_id")
//    private Member member;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "coopost_id")
//    private Coopost coopost;
//
//
//    @Builder
//    public Payment(String paymentKey, String orderId, Long amount, Member member, Coopost coopost) {
//        this.paymentKey = paymentKey;
//        this.orderId = orderId;
//        this.amount = amount;
//        this.member = member;
//        this.coopost = coopost;
//        this.isCancelled = false;
//    }
//
//    public void cancel() {
//        this.isCancelled = true;
//    }
//
//
//}
