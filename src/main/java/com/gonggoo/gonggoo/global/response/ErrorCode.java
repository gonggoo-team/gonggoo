package com.gonggoo.gonggoo.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 사용자가 존재하지 않습니다.", "Member 엔티티가 db 안에 존재하지 않습니다"),
    INVALID_JWT(HttpStatus.BAD_REQUEST, "토큰이 유효하지 않습니다", "토큰의 Claim이 일치하지 않습니다"),
    DUPLICATE_MEMBER_EMAIL(HttpStatus.BAD_REQUEST, "이미 등록된 이메일입니다", "같은 이메일이 존재합니다"),
    DUPLICATE_MEMBER_PHONE_NUMBER(HttpStatus.BAD_REQUEST, "이미 등록된 전화번호입니다", "같은 전화번호가 존재합니다"),
    UNAUTHORIZED_TOKEN(HttpStatus.UNAUTHORIZED, "권한 정보가 없는 토큰입니다", ""),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다", ""),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "만료된 액세스 토큰입니다.", "만료된 액세스 토큰입니다."),
    NO_AUTHORITY(HttpStatus.FORBIDDEN, "권한 정보가 없는 토큰입니다.", "권한 정보가 없는 토큰입니다."),
    INVALID_AUTH_HEADER(HttpStatus.BAD_REQUEST, "Authorization 헤더가 유효하지 않습니다.", "Authorization 헤더가 유효하지 않습니다."),
    BLACKLISTED_TOKEN(HttpStatus.UNAUTHORIZED, "BLACKLISTED_TOKEN", "블랙리스트에 포함된 토큰입니다."),
    COOPOST_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 공구글이 존재하지 않습니다.", "Coopost 엔티티가 db 안에 존재하지 않습니다"),
    COOPOST_ID_NOT_FOUND(HttpStatus.NO_CONTENT, "해당 공구글이 존재하지 않습니다", "coopostId가 존재하지 않습니다."),
    MEMBER_ID_NOT_FOUND(HttpStatus.NO_CONTENT, "참여자가 존재하지 않습니다.", "채팅 참여자 아이디가 존재하지 않습니다"),
    FAILED_TO_HASH(HttpStatus.INTERNAL_SERVER_ERROR, "채팅방 생성에 실패했습니다", "roomRef 해시 값을 생성할 수 없습니다."),
    SENDER_ID_NOT_FOUND(HttpStatus.NO_CONTENT, "보내는 사람의 아이디가 존재하지 않습니다.", "senderId를 찾을 수 없습니다."),
    ROOM_CATEGORY_NOT_FOUND(HttpStatus.NO_CONTENT, "채팅방을 찾을 수 없습니다.", "roomCategory를 찾을 수 없습니다."),
    CHATROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다", ""),
    CHATROOM_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "채팅방에 유저가 없습니다.", ""),
    INVALID_CURSOR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다.", "Cursor가 유효하지 않습니다."),
    KAKAO_USER_INFO_NOT_FOUND(HttpStatus.NOT_FOUND, "카카오 유저 정보를 찾을 수 없습니다.", "카카오 API 오류"),
    NAVER_USER_INFO_NOT_FOUND(HttpStatus.NOT_FOUND, "네이버 유저 정보를 찾을 수 없습니다.", "네이버 API 오류"),
    GOOGLE_USER_INFO_NOT_FOUND(HttpStatus.NOT_FOUND, "구글 유저 정보를 찾을 수 없습니다.", "구글 API 오류"),
    FCM_SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "알림 전송을 실패했습니다.", "Fcm Service 에러"),
    ALREADY_CANCELED(HttpStatus.NOT_FOUND, "이미 참여가 취소된 공구글입니다", "ApplyStatus.CANCEL된 공구글"),
    ALREADY_APPLIED(HttpStatus.BAD_REQUEST, "이미 신청된 공구글입니다", "이미 APPLY된 공구글"),
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "찾을 수 없는 공구글입니다", "공구글을 찾을 수 없습니다"),
    CANNOT_APPLY_OWN_POST(HttpStatus.BAD_REQUEST, "내 공구글에는 참여 신청을 할 수 없습니다.", "공구글 게시자가 참여자로 참여할 수 없습니다."),
    COOPOST_CLOSED(HttpStatus.NOT_FOUND, "끝난 공구글입니다.", "공구글 상태가 CLOSED된 공구글입니다."),
    COOPOST_FULL(HttpStatus.NO_CONTENT, "공구글 정원을 초과했습니다.", "maxParticipants를 초과했습니다.");

    private final HttpStatus httpStatus;
    private final String message;
    private final String reason;

}
