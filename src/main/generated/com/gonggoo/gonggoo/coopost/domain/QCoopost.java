package com.gonggoo.gonggoo.coopost.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCoopost is a Querydsl query type for Coopost
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCoopost extends EntityPathBase<Coopost> {

    private static final long serialVersionUID = -1543073695L;

    public static final QCoopost coopost = new QCoopost("coopost");

    public final com.gonggoo.gonggoo.global.entity.QBaseEntity _super = new com.gonggoo.gonggoo.global.entity.QBaseEntity(this);

    public final ComparablePath<java.util.UUID> authorId = createComparable("authorId", java.util.UUID.class);

    public final EnumPath<CoopostCategory> category = createEnum("category", CoopostCategory.class);

    public final StringPath content = createString("content");

    public final ComparablePath<java.util.UUID> coopostId = createComparable("coopostId", java.util.UUID.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Integer> currentParticipants = createNumber("currentParticipants", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> deadlineAt = createDateTime("deadlineAt", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> deletedAt = _super.deletedAt;

    public final StringPath location = createString("location");

    public final NumberPath<Integer> maxParticipants = createNumber("maxParticipants", Integer.class);

    public final NumberPath<Integer> minParticipants = createNumber("minParticipants", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final NumberPath<java.math.BigDecimal> pricePerUnit = createNumber("pricePerUnit", java.math.BigDecimal.class);

    public final EnumPath<CoopostStatus> status = createEnum("status", CoopostStatus.class);

    public final StringPath title = createString("title");

    public final NumberPath<Long> viewCount = createNumber("viewCount", Long.class);

    public QCoopost(String variable) {
        super(Coopost.class, forVariable(variable));
    }

    public QCoopost(Path<? extends Coopost> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCoopost(PathMetadata metadata) {
        super(Coopost.class, metadata);
    }

}

