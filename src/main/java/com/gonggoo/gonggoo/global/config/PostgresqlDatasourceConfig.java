package com.gonggoo.gonggoo.global.config;

import javax.sql.DataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

@EnableJpaRepositories(
        basePackages = "com.gonggoo.gonggoo.chat",
        entityManagerFactoryRef = "postgresqlDatabaseEntityFactory",
        transactionManagerRef = "postgresqlDatabaseTransactionManager"
)
@Configuration
public class PostgresqlDatasourceConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean postgresqlDatabaseEntityFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(postgresqlDatabaseDataSource());
        em.setPackagesToScan("com.gonggoo.gonggoo.chat.domain");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        return em;
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.postgresql-datasource")
    public DataSource postgresqlDatabaseDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public PlatformTransactionManager postgresqlDatabaseTransactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(postgresqlDatabaseEntityFactory().getObject());
        return transactionManager;
    }
}
