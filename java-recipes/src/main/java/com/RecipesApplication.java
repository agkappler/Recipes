package com;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;

@SpringBootApplication
@EntityScan(basePackages = "com.recipes")
@EnableJpaRepositories
@EnableTransactionManagement
public class RecipesApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecipesApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {

            System.out.println("Let's inspect the beans provided by Spring Boot:");

//            String[] beanNames = ctx.getBeanDefinitionNames();
//            Arrays.sort(beanNames);
//            for (String beanName : beanNames) {
//                System.out.println(beanName);
//            }

        };
    }

    @Autowired
    Environment env;

    // @Bean
    // public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
    // HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    // vendorAdapter.setGenerateDdl(true);
    //
    // LocalContainerEntityManagerFactoryBean factory = new
    // LocalContainerEntityManagerFactoryBean();
    // factory.setJpaVendorAdapter(vendorAdapter);
    // factory.setPackagesToScan("com");
    //// factory.setDataSource(dataSource());
    // factory.setJpaDialect(vendorAdapter.getJpaDialect());
    //
    // return factory;
    // }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(entityManagerFactory);
        return txManager;
    }
}
