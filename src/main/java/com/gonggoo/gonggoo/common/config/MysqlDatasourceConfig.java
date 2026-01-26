package com.gonggoo.gonggoo.common.config;

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
                "com.gonggoo.gonggoo.coopost"
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
                "com.gonggoo.gonggoo.coopost.domain"
        );
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
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
