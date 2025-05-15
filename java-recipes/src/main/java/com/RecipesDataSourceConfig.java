package com;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.utils.data.Data;

@Configuration
public class RecipesDataSourceConfig {

	@Bean
	public DataSource dataSource() {
		final DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.sqlite.JDBC");
		dataSource.setUrl("jdbc:sqlite:/Users/akappler/Documents/DevProjects/RecipesDB/recipes.db");
		
		return dataSource;
	}
	
	@Bean
	public Data data(DataSource dataSource) {
		return new Data(dataSource);
	}
}
