package com.gonggoo.gonggoo.common.util;

import static com.gonggoo.gonggoo.global.response.ErrorCode.COOPOST_ID_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.FAILED_TO_HASH;
import static com.gonggoo.gonggoo.global.response.ErrorCode.MEMBER_ID_NOT_FOUND;

import com.gonggoo.gonggoo.global.exception.NeighborsException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class RoomRefHasher {

    public static String makeRoomRefHash(UUID coopostId, Collection<Integer> memberIds) {
        validateCoopostIdAndMemberIds(coopostId, memberIds);

        String raw = canonicalRaw(coopostId, memberIds);
        String roomRefHash = sha256Hex(raw);

        return roomRefHash;
    }

    private static String canonicalRaw(UUID coopostId, Collection<Integer> memberIds) {
        List<Integer> sortedMemberIds = memberIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        String idsCsv = sortedMemberIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        return coopostId + ":" + idsCsv;
    }

    private static String sha256Hex(String raw) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] digest = messageDigest.digest(raw.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb. toString();
        } catch (Exception e) {
            throw new NeighborsException(FAILED_TO_HASH);
        }
    }

    private static void validateCoopostIdAndMemberIds(UUID coopostId, Collection<Integer> memberIds) {
        if (coopostId == null) throw new NeighborsException(COOPOST_ID_NOT_FOUND);
        if (memberIds.isEmpty() || memberIds == null) throw new NeighborsException(MEMBER_ID_NOT_FOUND);
    }
}
