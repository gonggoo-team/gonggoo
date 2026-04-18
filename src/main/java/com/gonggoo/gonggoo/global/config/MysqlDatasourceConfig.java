package com.gonggoo.gonggoo.global.config;

import java.util.HashMap;
import javax.sql.DataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

@EnableJpaRepositories(
        basePackages = {
                "com.gonggoo.gonggoo.member",
                "com.gonggoo.gonggoo.coopost",
                "com.gonggoo.gonggoo.fcm",
                "com.gonggoo.gonggoo.scrap"
        },
        entityManagerFactoryRef = "mysqlDatabaseEntityFactory",
        transactionManagerRef = "mysqlDatabaseTransactionManager"
)
@Configuration
public class MysqlDatasourceConfig {

    @Primary
    @Bean
    public LocalContainerEntityManagerFactoryBean mysqlDatabaseEntityFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(mysqlDatabaseDataSource());
        em.setPackagesToScan(
                "com.gonggoo.gonggoo.member.domain",
                "com.gonggoo.gonggoo.coopost.domain",
                "com.gonggoo.gonggoo.fcm.domain",
                "com.gonggoo.gonggoo.scrap.domain"
        );
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        // 하이버네이트 상세 설정 추가
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update"); // 핵심!
        properties.put("hibernate.show_sql", "true");
        properties.put("hibernate.format_sql", "true");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        em.setJpaPropertyMap(properties);
        return em;
    }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.mysql-datasource")
    public DataSource mysqlDatabaseDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean
    public PlatformTransactionManager mysqlDatabaseTransactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(mysqlDatabaseEntityFactory().getObject());
        return transactionManager;
    }
}
